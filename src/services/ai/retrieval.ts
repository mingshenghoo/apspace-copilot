import type { AcademicDocument, AcademicPassage } from '../../data/academic-documents';

// Conservative lexical search, not semantic reasoning. Unknown content words
// deliberately cause abstention rather than an unrelated answer for a known topic.
const stopWords = new Set('a an the what when where which who why how is are was were be been being do does did can could would should will i me my we our you your it its of for to in on at by with from about and or please tell explain describe give show know want need have has get help according demo fictional mock apu'.split(' '));
const aliases: Record<string, string> = {
  normalisation: 'normalization', classes: 'class', notes: 'note', lectures: 'lecture',
  hours: 'hour', times: 'time', deadlines: 'deadline', assignments: 'assignment',
  submissions: 'submission', requirements: 'requirement', includes: 'include',
  rooms: 'room', spaces: 'space', keys: 'key', databases: 'database', systems: 'system',
  algorithms: 'algorithm', deliverables: 'deliverable', missed: 'miss', missing: 'miss',
  opens: 'open', closes: 'close', opening: 'open', closing: 'close',
};
function tokenize(text: string): string[] {
  return [...new Set((text.toLowerCase().match(/[a-z0-9]+/g) ?? []).map(word => aliases[word] ?? word).filter(word => !stopWords.has(word)))];
}
export interface PassageMatch { document: AcademicDocument; passage: AcademicPassage; score: number }
export function retrievePassages(question: string, corpus: AcademicDocument[]): PassageMatch[] {
  const terms = tokenize(question);
  if (!terms.length) return [];
  return corpus.flatMap(document => document.passages.map(passage => {
    const searchable = new Set(tokenize(`${passage.terms} ${passage.section} ${passage.excerpt}`));
    // All meaningful query terms must occur together in a single passage.
    if (!terms.every(term => searchable.has(term))) return null;
    const excerptTerms = new Set(tokenize(passage.excerpt));
    const score = terms.reduce((sum, term) => sum + (excerptTerms.has(term) ? 2 : 1), 0);
    return { document, passage, score };
  })).filter((match): match is PassageMatch => match !== null)
    .sort((a, b) => b.score - a.score || a.passage.id.localeCompare(b.passage.id)).slice(0, 3);
}
