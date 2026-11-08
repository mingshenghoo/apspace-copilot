import { MockAcademicAdapter } from './mock-adapter';
import type { AcademicAssistantAdapter } from './types';
// Integration boundary: replace with a server-side Gemini Enterprise adapter later.
// Keep credentials server-side and preserve the answer + source contract.
export const academicAssistant: AcademicAssistantAdapter = new MockAcademicAdapter();
