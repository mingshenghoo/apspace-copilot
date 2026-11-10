import { academicAssistant } from '@/services/ai';
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  if (!body || typeof body !== 'object') return Response.json({ error: 'Expected a question.' }, { status: 400 });
  const { question, podReserved } = body as { question?: unknown; podReserved?: unknown };
  if (typeof question !== 'string' || !question.trim() || question.length > 1000 || (podReserved !== undefined && typeof podReserved !== 'boolean')) return Response.json({ error: 'Enter a question between 1 and 1,000 characters.' }, { status: 400 });
  try { return Response.json(await academicAssistant.answer(question.trim(), { podReserved: podReserved === true })); }
  catch { return Response.json({ error: 'The assistant is unavailable. Please retry.' }, { status: 503 }); }
}
