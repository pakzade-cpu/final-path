import { createServerFn } from "@tanstack/react-start";

export type GrokBrief = {
  score: string;
  narrative: string;
  key: string;
  homeWin: number;
  draw: number;
  awayWin: number;
};

export const grokMatchBrief = createServerFn({ method: "POST" })
  .validator((input: { prompt: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; brief: GrokBrief } | { ok: false; error: string }> => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "Grok is not available in this environment" };

    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-4.5",
        max_tokens: 420,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are a Champions League match analyst. Reply ONLY with compact JSON: {\"score\":\"2-1\",\"narrative\":\"two sentences\",\"key\":\"one tactical key\",\"homeWin\":0.0-1.0,\"draw\":0.0-1.0,\"awayWin\":0.0-1.0}. Probabilities must sum to 1. No markdown.",
          },
          { role: "user", content: data.prompt },
        ],
      }),
    });
    if (!res.ok) return { ok: false, error: `xAI API error ${res.status}` };
    const body = (await res.json()) as { choices: { message: { content: string } }[] };
    const raw = body.choices[0]?.message.content ?? "";
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart < 0 || jsonEnd < 0) return { ok: false, error: "Could not parse Grok brief" };
    try {
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as GrokBrief;
      if (!parsed.score || !parsed.narrative) return { ok: false, error: "Incomplete brief" };
      return { ok: true, brief: parsed };
    } catch {
      return { ok: false, error: "Could not parse Grok brief" };
    }
  });
