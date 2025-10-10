import { execSync } from "child_process";
import fs from "fs";
import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = "Sumant-Parida/ai-security-coding";

if (!GITHUB_TOKEN) {
  throw new Error("Missing GITHUB_TOKEN env var. Please provide a valid GitHub token with repo scope.");
}

const [owner, repo] = GITHUB_REPOSITORY.split("/");
const octokit = new Octokit({ auth: GITHUB_TOKEN });

function run(cmd: string, opts = {}) {
  try {
    return execSync(cmd, { stdio: "pipe", encoding: "utf8", ...opts }).trim();
  } catch (e: any) {
    console.error(
      "Command failed:",
      cmd,
      e.stdout ? e.stdout.toString() : e.message
    );
    throw e;
  }
}

export function createBranch(branchName: string) {
  console.log("Creating branch", branchName);
  run(`git checkout -b ${branchName}`);
}

export function applyPatch(patch: string): boolean {
  const patchFile = `.github/tmp/patch-${Date.now()}.patch`;
  fs.mkdirSync(".github/tmp", { recursive: true });
  fs.writeFileSync(patchFile, patch, "utf8");

  try {
    run(`git apply --index ${patchFile}`);
    return true;
  } catch (applyErr) {
    console.error("git apply failed. Patch contents saved at", patchFile);
    run(`git checkout -`); // back to previous branch
    return false;
  }
}

export function commitChanges(commitMessage: string) {
  try {
    run(`git add -A`);
    run(`git commit -m "${commitMessage}"`);
  } catch (commitErr) {
    console.error(
      "Commit failed (maybe no changes staged). Skipping PR creation."
    );
    run(`git checkout -`);
    throw commitErr;
  }
}

export function pushChanges(branchName: string) {
  run(`git push origin HEAD:${branchName}`);
}

export async function createPullRequest(
  title: string,
  body: string,
  head: string
) {
  const defaultBranch = run(
    "git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'"
  );
  const createResp = await octokit.pulls.create({
    owner,
    repo,
    title,
    head,
    base: defaultBranch,
    body,
    draft: true,
  });

  console.log("Created PR:", createResp.data.html_url);
  return createResp.data;
}

export function checkoutMaster() {
  const defaultBranch = run(
    "git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'"
  );
  run(`git checkout ${defaultBranch}`);
}
