/** Entirely fictional teaching material for the hackathon. Not official APU data. */
export interface AcademicPassage { id: string; section: string; terms: string; excerpt: string }
export interface AcademicDocument {
  id: string; title: string;
  category: 'Lecture notes' | 'Assignment briefs' | 'Campus FAQ' | 'Timetables';
  updated: string; passages: AcademicPassage[];
}
export const documents: AcademicDocument[] = [
  { id: 'notes', title: 'CS204 — Database Systems Lecture Notes', category: 'Lecture notes', updated: '2 Nov 2026', passages: [
    { id: 'normalization', section: 'Week 5 · Normalization', terms: 'database databases system systems cs204 normalization normalisation 1nf 2nf 3nf first second third normal form forms', excerpt: 'Normalization organizes database tables to reduce duplicated data and update anomalies. First normal form (1NF) requires atomic values. Second normal form (2NF) requires 1NF and no partial dependency on a composite key. Third normal form (3NF) requires 2NF and no transitive dependency of non-key attributes on the primary key.' },
    { id: 'keys', section: 'Week 4 · Relational keys', terms: 'database databases system systems cs204 primary foreign key keys difference', excerpt: 'A primary key uniquely identifies each row in a table and cannot be null. A foreign key references a key in another table to maintain referential integrity. In the fictional course example, Enrolment.student_id references Student.student_id.' },
  ] },
  { id: 'assessment', title: 'CS Year 2 — Assignment Briefs', category: 'Assignment briefs', updated: '2 Nov 2026', passages: [
    { id: 'database-brief', section: 'CS204 · Database design report', terms: 'database databases system systems cs204 design report assignment coursework deadline due deliverable requirement include brief', excerpt: 'The fictional Database Systems design report is due on 9 November 2026 at 23:59 MYT. Submit an entity relationship diagram, a relational schema normalized to 3NF, and a short explanation of your design decisions in one PDF through the demo module submission portal.' },
    { id: 'software-brief', section: 'CS210 · Sprint 2 prototype', terms: 'software engineering cs210 sprint 2 prototype assignment coursework deadline due deliverable requirement include brief', excerpt: 'The fictional Software Engineering Sprint 2 prototype is due on 12 November 2026 at 23:59 MYT. Submit a repository link, a demonstration video, and a sprint retrospective through the demo module submission portal.' },
    { id: 'ai-brief', section: 'CS218 · Search algorithms notebook', terms: 'artificial intelligence ai cs218 search algorithm notebook assignment coursework deadline due deliverable requirement include brief', excerpt: 'The fictional Artificial Intelligence search algorithms notebook is due on 16 November 2026 at 23:59 MYT. Submit a notebook comparing breadth-first search and depth-first search, including test cases and a short discussion of time and space complexity.' },
    { id: 'extensions', section: 'Coursework · Extension requests', terms: 'assignment coursework deadline extension extend late submission submit', excerpt: 'For an extension in this fictional demo, contact the module lecturer before the deadline with a short explanation. No late-submission penalty or automatic extension entitlement is specified in these sample briefs.' },
  ] },
  { id: 'faq', title: 'Campus FAQ — Fictional Student Guide', category: 'Campus FAQ', updated: '3 Nov 2026', passages: [
    { id: 'library-hours', section: 'Library · Opening hours', terms: 'library opening open close closed hour time weekday monday tuesday wednesday thursday friday saturday', excerpt: 'The fictional demo library is open Monday–Friday, 08:00–20:00, and Saturday, 09:00–17:00 MYT. These are invented opening hours for the prototype, not official APU library hours.' },
    { id: 'study-spaces', section: 'Campus · Study spaces', terms: 'library study group quiet space room find classroom', excerpt: 'The fictional campus has quiet study zones and group discussion areas. Use the Smart Classroom Finder to explore mock room availability. A downloaded demo calendar event does not reserve a room.' },
    { id: 'attendance', section: 'Academic support · Missed classes', terms: 'attendance absent absence miss sick illness class lecture', excerpt: 'If you miss a class in this fictional demo, notify your lecturer and ask for the learning materials. For illness, contact the fictional student support desk to discuss documentation. No official APU attendance threshold is represented in this guide.' },
  ] },
  { id: 'timetable', title: 'CS Year 2 — Demo Timetable', category: 'Timetables', updated: '5 Nov 2026', passages: [
    { id: 'friday-classes', section: 'Friday · 6 November 2026 · MYT (UTC+08:00)', terms: 'class timetable schedule lecture today friday 6 november 2026 room database system software engineering artificial intelligence cs204 cs210 cs218', excerpt: 'Demo day is Friday, 6 November 2026. Database Systems runs 09:00–10:30 in B-04-03; Software Engineering runs 11:00–12:30 in A-06-02; Artificial Intelligence runs 14:00–16:00 in Tech Lab 3. All times are Malaysia time (UTC+08:00). No other dates are included in this fictional timetable.' },
  ] },
];
export const exampleQuestions = ['What is database normalization?', 'When is the Database Systems assignment due?', 'What are the library hours?', 'What classes do I have today?'];
