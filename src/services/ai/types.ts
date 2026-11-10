export interface Source { id: string; documentId: string; title: string; section: string; excerpt: string }
export interface AcademicAnswer { text: string; sources: Source[]; provider: 'mock' | 'gemini'; notice?: string }
export interface AcademicAssistantAdapter { answer(question: string, context?: { podReserved?: boolean }): Promise<AcademicAnswer> }
