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

  const prompt = `
You are an expert security engineer. You have been asked to provide a patch for a vulnerability found by semgrep.

**Vulnerability Details:**
- **Vulnerability Type:** ${checkId}
- **File Path:** ${filePath}
- **Message:** ${message}

**Vulnerable Code Snippet:**
```
${beforeSnippet}
```

**Task:**

1.  **Analyze the vulnerability:** Based on the provided information, analyze the vulnerability and understand the security risk.
2.  **Generate a patch:** Create a patch in the **unified diff format** to fix the vulnerability. The patch should be clean, concise, and easy to apply.
3.  **Provide an explanation:** Write a clear and concise explanation of the vulnerability and the proposed fix.
4.  **Create a test plan:** Write a test plan to verify that the fix is working correctly and does not introduce any new issues.

**Output Format:**

Return ONLY valid JSON (no markdown formatting) with the following structure:

```json
{
  "explanation": "A clear and concise explanation of the vulnerability and the proposed fix.",
  "diff": "The patch in the unified diff format. Example:\n--- a/file.js\n+++ b/file.js\n@@ -1,1 +1,1 @@\n-vulnerable code\n+fixed code",
  "test_plan": "A plan to test the fix."
}
```
`;

  const payload: Payload = {
    vuln_type: checkId,
    file_path: filePath,
    before_snippet: beforeSnippet,
    context: prompt,
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
  console.log("AI Response:", JSON.stringify(json, null, 2));
  return json;
}