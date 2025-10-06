import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
  "diff": "--- a/file.js\\n+++ b/file.js\\n@@ -1,1 +1,1 @@\\n-vulnerable code\\n+fixed code",
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
}