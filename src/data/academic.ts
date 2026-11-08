export const DEMO_DATE = '2026-11-06';
export const student = { name: 'Alex', fullName: 'Alex Tan', course: 'BSc (Hons) Computer Science', intake: 'DEMO • Year 2, Semester 1' };
export const timetable = [
  { time: '09:00', end: '10:30', title: 'Database Systems', code: 'CS204', kind: 'Lecture', room: 'B-04-03', lecturer: 'Dr. Maya Chen', status: 'Completed' },
  { time: '11:00', end: '12:30', title: 'Software Engineering', code: 'CS210', kind: 'Tutorial', room: 'A-06-02', lecturer: 'Mr. Daniel Lim', status: 'Up next' },
  { time: '14:00', end: '16:00', title: 'Artificial Intelligence', code: 'CS218', kind: 'Lab', room: 'Tech Lab 3', lecturer: 'Dr. Sara Noor', status: 'Later today' },
];
export const assignments = [
  { title: 'Database design report', module: 'Database Systems', due: '9 Nov', days: '3 days left', progress: 65, color: 'orange' },
  { title: 'Sprint 2 prototype', module: 'Software Engineering', due: '12 Nov', days: '6 days left', progress: 40, color: 'purple' },
  { title: 'Search algorithms notebook', module: 'Artificial Intelligence', due: '16 Nov', days: '10 days left', progress: 20, color: 'blue' },
];
export const notifications = [
  { title: 'Your next tutorial is in A-06-02', detail: 'Software Engineering · Fictional room update', time: '10 min ago' },
  { title: 'A little help for your next big idea', detail: 'Demo hackathon briefing · Monday, 16:00', time: '1 hour ago' },
];
export { documents } from './academic-documents';
