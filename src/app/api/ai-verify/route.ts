import { NextRequest, NextResponse } from 'next/server';

// Optional AI photo check (passport). Consent-gated from the preview panel:
// with the citizen's opt-in, the optimized photo is sent to a vision model
// (Gemini or any OpenAI-compatible endpoint) for a spec verdict.
//
// Env (Netlify > Site configuration > Environment variables):
//   AI_API_KEY  (or OPENAI_API_KEY / GEMINI_API_KEY) — absent = { available: false }
//   AI_PROVIDER (gemini | openai, default gemini)
//   AI_MODEL    (default gemini-2.0-flash, or gpt-4o-mini for openai)
//   AI_API_BASE (default https://generativelanguage.googleapis.com)
// Without a key the UI falls back to its local verified flow — demo-safe.

interface Verdict {
  bgWhite: boolean | null;
  facePct: number | null;
  glasses: boolean | null;
  note: string;
}

const FALLBACK: Verdict = { bgWhite: null, facePct: null, glasses: null, note: '' };

function extractJson(text: string): Verdict {
  try {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const raw = (fenced ? fenced[1] : text).trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start < 0 || end <= start) return FALLBACK;
    const parsed = JSON.parse(raw.slice(start, end + 1));
    return {
      bgWhite: typeof parsed.bgWhite === 'boolean' ? parsed.bgWhite : null,
      facePct: typeof parsed.facePct === 'number' ? Math.round(parsed.facePct) : null,
      glasses: typeof parsed.glasses === 'boolean' ? parsed.glasses : null,
      note: typeof parsed.note === 'string' ? parsed.note.slice(0, 140) : '',
    };
  } catch {
    return FALLBACK;
  }
}

const SYSTEM_PROMPT =
  'You check an Indian passport photo against upload rules. Reply ONLY JSON: {"bgWhite": boolean, "facePct": number 0-100 estimating face area share, "glasses": boolean, "note": string under 20 words}. Use null when unsure.';

async function callGemini(opts: {
  base: string;
  model: string;
  apiKey: string;
  mime: string;
  b64: string;
  slot: string;
  signal: AbortSignal;
}): Promise<string> {
  const url = `${opts.base}/v1beta/models/${opts.model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    signal: opts.signal,
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': opts.apiKey },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${SYSTEM_PROMPT}\nPassport ${opts.slot === 'signature' ? 'signature' : 'photograph'} for spec check.` },
            { inline_data: { mime_type: opts.mime, data: opts.b64 } },
          ],
        },
      ],
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: 200 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => (typeof p?.text === 'string' ? p.text : '')).join('');
}

async function callOpenAICompat(opts: {
  base: string;
  model: string;
  apiKey: string;
  imageDataUrl: string;
  slot: string;
  signal: AbortSignal;
}): Promise<string> {
  const res = await fetch(`${opts.base}/v1/chat/completions`, {
    method: 'POST',
    signal: opts.signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${opts.apiKey}` },
    body: JSON.stringify({
      model: opts.model,
      response_format: { type: 'json_object' },
      max_tokens: 200,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Passport ${opts.slot === 'signature' ? 'signature' : 'photograph'} for spec check.` },
            { type: 'image_url', image_url: { url: opts.imageDataUrl } },
          ],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ available: false });

    const { imageDataUrl, slot } = (await request.json()) as {
      imageDataUrl?: string;
      slot?: string;
    };
    if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
      return NextResponse.json({ available: false, error: 'Expected an image data URL' }, { status: 400 });
    }

    const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
    const isGemini = provider === 'gemini';
    const model = process.env.AI_MODEL || (isGemini ? 'gemini-2.0-flash' : 'gpt-4o-mini');
    const base = (process.env.AI_API_BASE || (isGemini ? 'https://generativelanguage.googleapis.com' : 'https://api.openai.com')).replace(/\/+$/, '');

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    let content = '';
    try {
      if (isGemini) {
        const match = imageDataUrl.match(/^data:(image\/[a-z+]+);base64,(.*)$/);
        if (!match) return NextResponse.json({ available: false });
        content = await callGemini({
          base,
          model,
          apiKey,
          mime: match[1]!,
          b64: match[2]!,
          slot: slot ?? 'photo',
          signal: ctrl.signal,
        });
      } else {
        content = await callOpenAICompat({
          base,
          model,
          apiKey,
          imageDataUrl,
          slot: slot ?? 'photo',
          signal: ctrl.signal,
        });
      }
    } finally {
      clearTimeout(timer);
    }

    if (!content) return NextResponse.json({ available: false });
    return NextResponse.json({ available: true, model, verdict: extractJson(content) });
  } catch (error) {
    console.error('AI verify error:', error);
    return NextResponse.json({ available: false });
  }
}
