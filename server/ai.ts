import fetch from 'node-fetch';

interface Finding {
  check_id: string;
  path: string;
  start: any;
  end: any;
  extra: any;
  message?: string;
  metadata?: any;
}

interface Payload {
  vuln_type: string;
  file_path: string;
  before_snippet: string;
  context: string;
}

export function makePromptPayload(finding: Finding, owner: string, repo: string): Payload {
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

  const payload: Payload = {
    vuln_type: checkId,
    file_path: filePath,
    before_snippet: beforeSnippet,
    context: `Repository: ${owner}/${repo}\nDetector: semgrep\n\n${context}`
  };

  return payload;
}

export async function callAiService(payload: Payload): Promise<any> {
  const serviceUrl = 'http://localhost:4000/suggest-patch';

  const res = await fetch(serviceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI service error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json;
}
