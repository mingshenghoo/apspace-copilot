import rooms from '../data/classrooms.json';
export type Room = typeof rooms[number];
export function validSlot(start: string, end: string) { return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(start) && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(end) && start >= '08:00' && end <= '20:00' && start < end; }
export function isAvailable(room: Room, date: string, start: string, end: string) { return validSlot(start,end) && !room.schedule.some(slot => slot.date === date && start < slot.end && end > slot.start); }
export function calendarInvitation(room: Room, date: string, start: string, end: string) {
  if (!isAvailable(room,date,start,end)) throw new Error('Room is not available for this time.');
  const utc = (time:string) => new Date(`${date}T${time}:00+08:00`).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//APSpace Copilot//Demo//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${crypto.randomUUID()}@apspace-copilot.demo`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART:${utc(start)}`,`DTEND:${utc(end)}`,`SUMMARY:[DEMO] Study session - ${room.id}`,`LOCATION:${room.id} - ${room.building}`,'DESCRIPTION:Simulated invitation only. Fictional room data. No room is reserved and no invitation has been sent.','STATUS:TENTATIVE','END:VEVENT','END:VCALENDAR',''].map(line => line.replace(/(.{73})(?=.)/g,'$1\r\n ')).join('\r\n');
}
