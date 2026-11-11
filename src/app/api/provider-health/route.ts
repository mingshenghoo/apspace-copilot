import { createHash, timingSafeEqual } from 'node:crypto';
// A bounded metadata check: no generation, secrets, or raw provider errors returned.
export const maxDuration = 40;
type Health = { configured: boolean; modelAccess?: boolean; status?: number; category?: string };
let cached: { expires: number; value: Health } | undefined;
let pending: Promise<Health> | undefined;
async function check(): Promise<Health> {
  const key = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim().replace(/^models\//, '');
  if (!key || !model) return { configured: false };
  if (!/^gemini-[a-z0-9.-]+$/.test(model)) return { configured: true, modelAccess: false, category: 'invalid_model_setting' };
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}`, { headers: { 'x-goog-api-key': key }, signal: AbortSignal.timeout(8000), cache: 'no-store' });
    // Discard the response body: provider messages may contain project details.
    await response.body?.cancel();
    return { configured: true, modelAccess: response.ok, status: response.status, category: response.ok ? 'model_accessible' : response.status === 404 ? 'model_not_found' : [400,401,403].includes(response.status) ? 'key_or_project_access' : response.status === 429 ? 'quota' : 'provider_error' };
  } catch { return { configured: true, modelAccess: false, category: 'connection_or_timeout' }; }
}
export async function GET() {
  if (!cached || cached.expires < Date.now()) {
    pending ??= check();
    try { cached = { value: await pending, expires: Date.now() + 60000 }; } finally { pending = undefined; }
  }
  return Response.json(cached.value, { headers: { 'Cache-Control': 'no-store' } });
}

let probe: { expires: number; value: unknown } | undefined;
let probing: Promise<unknown> | undefined;
// Fixed, tiny comparison requests; cached and coalesced to prevent repeated probes.
async function compare() {
  const key = process.env.GEMINI_API_KEY?.trim();
  const model = process.env.GEMINI_MODEL?.trim().replace(/^models\//, '');
  if (!key || !model || !/^gemini-[a-z0-9.-]+$/.test(model)) return { configured: false };
  const results = [];
  for (const structured of [false, true]) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST', headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000),
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: structured ? 'Return JSON with sourceIds as an empty array.' : 'Reply with Hello.' }] }], generationConfig: { maxOutputTokens: 1024, ...(structured ? { responseMimeType: 'application/json', responseJsonSchema: { type: 'object', properties: { sourceIds: { type: 'array', items: { type: 'string' } } }, required: ['sourceIds'] } } : {}) } }),
      });
      // Do not return model output, project identifiers or Google's raw error messages.
      await response.body?.cancel();
      results.push({ structured, ok: response.ok, status: response.status });
    } catch { results.push({ structured, ok: false, category: 'connection_or_timeout' }); }
  }
  return { results };
}
export async function POST(request: Request) {
  const supplied = request.headers.get('authorization') ?? '';
  const digest = createHash('sha256').update(supplied.replace(/^Bearer /, '')).digest();
  if (!timingSafeEqual(digest, Buffer.from('5d1b01ae7c4153e5a5a8f65e6754acc3f693412522093f25f2f019aff7c0c6e2', 'hex'))) return Response.json({error:'Unauthorized'}, {status:401});
  if (!probe || probe.expires < Date.now()) {
    probing ??= compare();
    try { probe = { value: await probing, expires: Date.now() + 60000 }; } finally { probing = undefined; }
  }
  return Response.json(probe.value, { headers: { 'Cache-Control': 'no-store' } });
}
