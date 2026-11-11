import { academicAssistant } from '@/services/ai';
export const maxDuration = 60;
export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const question = (body as {question?: unknown} | null)?.question;
  if (typeof question !== 'string' || !question.trim() || question.length > 1000) return Response.json({error: 'Enter a question between 1 and 1,000 characters.'}, {status:400});
  try { return Response.json(await academicAssistant.answer(question.trim())); }
  catch { return Response.json({error:'The assistant is unavailable. Please try again.'}, {status:503}); }
}
