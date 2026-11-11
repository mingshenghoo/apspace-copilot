// A bounded metadata check: no generation, secrets, or raw provider errors returned.
export const maxDuration = 15;
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
