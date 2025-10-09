import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { exec } from "child_process";
import fs from "fs";
import { makePromptPayload, callAiService } from "./ai";

// Load environment variables from .env file
dotenv.config();

// Type definitions for OpenAI API response
interface OpenAIMessage {
  role: string;
  content: string;
}

interface OpenAIChoice {
  index: number;
  message: OpenAIMessage;
  finish_reason: string;
}

interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const app = express();
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static('public'));

// Root route to serve the HTML dashboard
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.post("/suggest-patch", async (req, res) => {
  const { vuln_type, file_path, before_snippet, context } = req.body;

  const prompt = `
You are a security-aware assistant. 
VULN TYPE: ${vuln_type}
FILE: ${file_path}

VULNERABLE SNIPPET:
${before_snippet}

CONTEXT:
${context}

Return ONLY valid JSON (no markdown formatting) with:
- explanation: string explaining why this is vulnerable
- diff: string containing unified diff to fix the issue
- test_plan: string describing how to test the fix

Example response format:
{
  "explanation": "This code is vulnerable because...",
  "diff": "--- a/file.js\n+++ b/file.js\n@@ -1,1 +1,1 @@\n-vulnerable code\n+fixed code",
  "test_plan": "To test this fix..."
}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
      })
    });

    const json = await response.json() as OpenAIResponse;
    let suggestion = json?.choices?.[0]?.message?.content || "{}";
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = suggestion.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      suggestion = jsonMatch[1].trim();
    }
    
    try {
      res.json(JSON.parse(suggestion));
    } catch (parseError) {
      // If JSON parsing fails, return the raw response for debugging
      res.json({
        error: "Failed to parse AI response", 
        raw_response: suggestion,
        parse_error: parseError instanceof Error ? parseError.message : 'Unknown parsing error'
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/scan-directory", async (req, res) => {
  const { directory_path } = req.body;
  console.log(`Scanning directory: ${directory_path}`);

  const semgrepPath = "/Users/sumantaparida/Library/Python/3.13/bin/semgrep";
  const semgrepConfig = "p/ci";
  const outputJson = "semgrep.json";

  const command = `${semgrepPath} --config ${semgrepConfig} --json --output ${outputJson} ${directory_path}`;

  exec(
    command,
    {
      env: {
        ...process.env,
        PATH: `${process.env.PATH}:/Users/sumantaparida/Library/Python/3.13/bin`,
      },
    },
    async (error, stdout, stderr) => {
      if (error && error.code !== 1) { // semgrep exits with 1 if findings are found
        console.error(`exec error: ${error}`);
        return res.status(500).json({ error: "Failed to run semgrep" });
      }

      fs.readFile(outputJson, "utf8", async (err, data) => {
        if (err) {
          console.error(`readFile error: ${err}`);
          return res.status(500).json({ error: "Failed to read semgrep output" });
        }

        const semgrepResults = JSON.parse(data);
        const findings = semgrepResults.results;

        if (!findings || findings.length === 0) {
          return res.json({ message: "No vulnerabilities found." });
        }

        const suggestions = [];
        for (const finding of findings) {
          const payload = makePromptPayload(finding, "owner", "repo"); // Replace with actual owner and repo if available
          try {
            const suggestion = await callAiService(payload);
            suggestions.push({ finding, suggestion });
          } catch (aiError) {
            console.error(`AI service error: ${aiError}`);
            suggestions.push({ finding, error: "Failed to get AI suggestion." });
          }
        }

        res.json({ suggestions });
      });
    }
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`AI patch server running on port ${PORT}`));