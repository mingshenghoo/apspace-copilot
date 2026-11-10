import { MockAcademicAdapter } from './mock-adapter';
import { createGeminiAdapter } from './gemini-adapter';
import type { AcademicAssistantAdapter } from './types';
// Server route imports only. Never expose these variables via NEXT_PUBLIC_.
const mock = new MockAcademicAdapter();
export function providerConfigured() { return !!process.env.GEMINI_API_KEY?.trim() && !!process.env.GEMINI_MODEL?.trim(); }
export const academicAssistant: AcademicAssistantAdapter = {
  async answer(question, context) {
    if (!providerConfigured()) return mock.answer(question, context);
    try {
      return await createGeminiAdapter(process.env.GEMINI_API_KEY!.trim(), process.env.GEMINI_MODEL!.trim()).answer(question, context);
    } catch {
      return { ...await mock.answer(question, context), notice: 'Gemini is unavailable or returned invalid source references. This answer uses mock document search.' };
    }
  },
};
