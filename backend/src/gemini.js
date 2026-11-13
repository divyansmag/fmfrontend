import { config } from './config.js';
import { httpError } from './errors.js';

const FALLBACK_BLOCKED =
  "I can't help with that one, but I'd love to help with something about AI, coding or your lessons. What would you like to explore?";

/**
 * Calls Gemini's generateContent endpoint.
 * messages: [{ role: 'user' | 'model', text }] (must start with a user turn)
 */
export async function generate({ system, messages }) {
  const { apiKey, model, baseUrl } = config.gemini;
  if (!apiKey) throw httpError(503, 'The AI tutor is not configured yet (GEMINI_API_KEY is missing).');

  // Gemini wants alternating turns: merge neighbours with the same role.
  const contents = [];
  for (const m of messages) {
    const last = contents[contents.length - 1];
    if (last && last.role === m.role) last.parts[0].text += `\n${m.text}`;
    else contents.push({ role: m.role, parts: [{ text: m.text }] });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25_000);
  let res;
  try {
    res = await fetch(`${baseUrl}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        // Generous cap: on "thinking" models, reasoning tokens count against this budget too.
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 2048,
          thinkingConfig: { thinkingLevel: 'low' },
        },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    throw httpError(504, err.name === 'AbortError' ? 'Professor Owl took too long to answer. Try again.' : 'Could not reach the AI service.');
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 429) throw httpError(429, 'Professor Owl is very busy right now. Please try again in a minute.');
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error('[gemini] HTTP', res.status, detail.slice(0, 500));
    throw httpError(502, 'The AI service returned an error. Please try again.');
  }

  const json = await res.json();
  if (json.promptFeedback?.blockReason) return FALLBACK_BLOCKED;
  const parts = json.candidates?.[0]?.content?.parts || [];
  const text = parts.filter((p) => typeof p.text === 'string' && !p.thought).map((p) => p.text).join('').trim();
  if (!text) {
    console.error('[gemini] empty response', JSON.stringify(json).slice(0, 500));
    return json.candidates?.[0]?.finishReason === 'SAFETY' ? FALLBACK_BLOCKED : 'Hmm, I got stuck on that one. Could you ask it another way?';
  }
  return text;
}
