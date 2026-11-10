import { documents } from '../../data/academic-documents';
import rooms from '../../data/classrooms.json';
import { DEMO_DATE } from '../../data/academic';
import { isAvailable } from '../../lib/rooms';
import type { AcademicAnswer, Source } from './types';
import { quickPrompts } from '../../data/quick-prompts';
/** Deliberately bounded intents: other questions use conservative passage retrieval. */
export function answerDemoAction(question: string, podReserved = false): AcademicAnswer | undefined {
  const normalized = question.toLowerCase().replace(/[?.!]+$/g, '').trim();
  const intent = quickPrompts.findIndex(prompt => prompt.toLowerCase().replace(/[?.!]+$/g, '') === normalized);
  if (intent < 0) return undefined;
  let sources: Source[];
  let intro: string;
  if (intent === 2) {
    const available = rooms.filter(room => isAvailable(room, DEMO_DATE, '13:00', '14:00') && !(podReserved && room.id === 'B-03'));
    sources = available.map(room => ({ id: `rooms/${room.id}`, documentId: 'rooms', title: 'Fictional classroom schedule JSON', section: room.id, excerpt: `${room.id} — ${room.name}. Scheduled occupied intervals on ${DEMO_DATE}: ${room.schedule.filter(slot => slot.date === DEMO_DATE).map(slot => `${slot.start}–${slot.end}`).join(', ') || 'none'}.` }));
    intro = `Demo today is 6 November 2026. ${available.length} rooms are available 13:00–14:00 MYT, calculated from the mock schedule.${podReserved ? ' Pod B-03 is excluded because it is reserved in your demo session.' : ''}`;
  } else {
    const document = documents.find(document => document.id === (intent === 0 ? 'assessment' : 'notes'))!;
    const ids = intent === 0 ? ['database-brief', 'software-brief'] : ['normalization'];
    sources = document.passages.filter(passage => ids.includes(passage.id)).map(passage => ({ id: `${document.id}/${passage.id}`, documentId: document.id, title: document.title, section: passage.section, excerpt: passage.excerpt }));
    intro = intent === 0 ? 'Using the fixed demo date, 6 November 2026, next week means 9–15 November 2026. These fictional assignments are due in that interval:' : 'The fictional database notes explain normalization as follows:';
  }
  return { provider: 'mock', text: intro + '\n\n' + sources.map((source, index) => `${source.excerpt} [${index + 1}]`).join('\n\n'), sources };
}
