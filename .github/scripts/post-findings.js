#!/usr/bin/env node

/**
 * post-findings.js
 *
 * Usage:
 *   node .github/scripts/post-findings.js semgrep.json
 *
 * Expects env:
 *  - AI_SERVICE_URL
 *  - AI_SERVICE_KEY
 *  - GITHUB_TOKEN
 *  - GITHUB_REPOSITORY (owner/repo) — provided by Actions
 */

const fs = require("fs");
const { execSync } = require("child_process");
const fetch = require("node-fetch"); // node 18+ has fetch, but include for safety
const { Octokit } = require("@octokit/rest");

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("Usage: node post-findings.js semgrep.json");
  process.exit(2);
}
const SEMGREP_FILE = args[0];

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;
const AI_SERVICE_KEY = process.env.AI_SERVICE_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY; // owner/repo

if (!AI_SERVICE_URL || !AI_SERVICE_KEY || !GITHUB_TOKEN || !GITHUB_REPOSITORY) {
  console.error(
    "Missing env vars. Ensure AI_SERVICE_URL, AI_SERVICE_KEY, GITHUB_TOKEN, and GITHUB_REPOSITORY are set."
  );
  process.exit(2);
}

const [owner, repo] = GITHUB_REPOSITORY.split("/");
const octokit = new Octokit({ auth: GITHUB_TOKEN });

function readSemgrep(file) {
  try {
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read semgrep file:", e);
    process.exit(2);
  }
}

function makePromptPayload(finding) {
  // Build a minimal prompt payload based on the finding
  // Grab file path, start/end lines, message and code excerpt
  const { check_id, path, start, end, extra } = finding;
  // semgrep format sometimes nested -> normalize
  const checkId =
    check_id || (finding.extra && finding.extra.check_id) || "unknown";
  const message =
    (finding.extra && finding.extra.message) || finding.message || "";
  const filePath =
    path ||
    (finding.extra && finding.extra.lines && finding.extra.lines.path) ||
    (finding.extra && finding.extra.path) ||
    "UNKNOWN";

  // Extract snippet if available
  const beforeSnippet =
    (finding.extra && finding.extra.lines && finding.extra.lines.code) ||
    finding.extra?.lines?.text ||
    (finding?.metadata && finding.metadata?.snippet) ||
    "";

  // safe small context
  const context = beforeSnippet
    ? beforeSnippet.split("\n").slice(0, 200).join("\n")
    : "";

  const payload = {
    instruction:
      "You are a security-aware code assistant. Given a vulnerable JavaScript/TypeScript snippet and repo context, return JSON with fields: explanation (string), diff (unified diff string or empty), test_plan (string).",
    vuln_type: checkId,
    detector: "semgrep",
    file_path: filePath,
    repo: `${owner}/${repo}`,
    before_snippet: beforeSnippet,
    context: context,
    constraints: [
      "Return ONLY valid JSON with fields explanation, diff, test_plan.",
      "Prefer minimal behavioral change. Keep patch small and limited to necessary lines.",
      "If no safe automated patch possible, return diff as empty string and explain why.",
    ],
  };

  return payload;
}

async function callAiService(payload) {
  const res = await fetch(AI_SERVICE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${AI_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    timeout: 120000,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI service error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json;
}

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { stdio: "pipe", encoding: "utf8", ...opts }).trim();
  } catch (e) {
    console.error(
      "Command failed:",
      cmd,
      e.stdout ? e.stdout.toString() : e.message
    );
    throw e;
  }
}

async function processFindings() {
  const semgrep = readSemgrep(SEMGREP_FILE);
  const results = semgrep.results || semgrep; // depends on semgrep output shape
  if (!Array.isArray(results) || results.length === 0) {
    console.log("No findings to process.");
    return;
  }

  // Prioritize high severity: semgrep uses severity metadata sometimes (adjust as needed)
  for (const f of results) {
    try {
      // Basic filter: only handle javascript/typescript files (you can expand)
      const filePath = f.path || f.extra?.lines?.path || f?.extra?.path;
      if (
        !filePath ||
        (!filePath.endsWith(".js") &&
          !filePath.endsWith(".ts") &&
          !filePath.endsWith(".jsx") &&
          !filePath.endsWith(".tsx"))
      ) {
        console.log("Skipping non-js file:", filePath);
        continue;
      }

      console.log(
        "Processing finding:",
        f.check_id || f.extra?.check_id || f.message || "unknown"
      );

      const payload = makePromptPayload(f);
      const aiResp = await callAiService(payload);

      // Expect JSON with explanation, diff, test_plan
      const explanation = aiResp.explanation || aiResp.explain || "";
      const diff = aiResp.diff || aiResp.patch || "";
      const testPlan = aiResp.test_plan || aiResp.tests || "";

      if (!diff || diff.trim().length === 0) {
        console.log(
          "AI did not provide an automated diff; skipping automated PR creation. Explanation:",
          explanation
        );
        continue;
      }

      // create branch
      const branchName = `ai-fix/${(f.check_id || "fix").replace(
        /[^a-zA-Z0-9-_]/g,
        "-"
      )}-${Date.now()}`;
      console.log("Creating branch", branchName);

      run(`git checkout -b ${branchName}`);

      // Write diff to temporary file
      const patchFile = `.github/tmp/patch-${Date.now()}.patch`;
      fs.mkdirSync(".github/tmp", { recursive: true });
      fs.writeFileSync(patchFile, diff, "utf8");

      // Try applying patch
      try {
        run(`git apply --index ${patchFile}`);
      } catch (applyErr) {
        console.error("git apply failed. Patch contents saved at", patchFile);
        // Add explanation to issue or logs; skip this finding
        run(`git checkout -`); // back to previous branch
        continue;
      }

      // Commit & push
      try {
        run(`git add -A`);
        run(
          `git commit -m "AI-suggested fix: ${
            f.check_id || "security-fix"
          } [ci skip]"`
        );
      } catch (commitErr) {
        console.error(
          "Commit failed (maybe no changes staged). Skipping PR creation."
        );
        run(`git checkout -`);
        continue;
      }

      // Push branch
      run(`git push origin HEAD:${branchName}`);

      // Create PR (draft) with explanation and test plan
      const title = `[AI-suggested] Fix: ${f.check_id || "security-fix"}`;
      const bodyLines = [
        `**Automated suggestion generated by AI security assistant**`,
        ``,
        `**Finding:** ${
          f.extra?.message || f.message || f.check_id || "semgrep finding"
        }`,
        ``,
        `**Explanation (AI):**`,
        explanation || "No explanation provided.",
        ``,
        `**Test Plan (AI):**`,
        testPlan || "No test plan provided.",
        ``,
        `**Notes:** Please review carefully. This is a suggested change and must be approved by a human.`,
      ];
      const prBody = bodyLines.join("\n");

      const createResp = await octokit.pulls.create({
        owner,
        repo,
        title,
        head: branchName,
        base: "main", // you might want to set dynamically
        body: prBody,
        draft: true,
      });

      console.log("Created PR:", createResp.data.html_url);

      // checkout back
      run(`git checkout -`);
    } catch (err) {
      console.error("Error processing finding:", err);
      // continue to next finding
    }
  }
}

processFindings().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
