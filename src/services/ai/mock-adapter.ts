import { documents } from '../../data/academic-documents';
import type { AcademicAssistantAdapter, AcademicAnswer } from './types';
import { retrievePassages } from './retrieval';
/** Extractive search only: answers and citations are copied from stored passages. */
export class MockAcademicAdapter implements AcademicAssistantAdapter {
  async answer(question: string): Promise<AcademicAnswer> {
    const matches = retrievePassages(question, documents);
    return {
      provider: 'mock',
      text: matches.length
        ? 'Matching excerpts from fictional documents (not an LLM-generated answer):\n\n' + matches.map(({ passage }, index) => `${passage.excerpt} [${index + 1}]`).join('\n\n')
        : 'I couldn’t find that information in the fictional academic documents. Try a specific question about database normalization, the assignment briefs, library hours, or the demo timetable for 6 November 2026. No answer or citation has been generated.',
      sources: matches.map(({ document, passage }) => ({ id: `${document.id}/${passage.id}`, documentId: document.id, title: document.title, section: passage.section, excerpt: passage.excerpt })),
    };
  }
}
