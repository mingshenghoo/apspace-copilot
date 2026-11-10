import { DEMO_DATE } from '../data/academic';
import rooms from '../data/classrooms.json';
import { calendarInvitation } from './rooms';
export const POD_ID = 'B-03';
export const POD_SESSION_KEY = 'apspace-copilot:pod-reserved:v1';
export function podInvitation() {
  const pod = rooms.find(room => room.id === POD_ID);
  if (!pod) throw new Error('Demo pod is missing.');
  return calendarInvitation(pod, DEMO_DATE, '13:00', '14:00')
    .replace(/\r\n /g, '')
    .replace(/^DESCRIPTION:.*$/m, 'DESCRIPTION:Booked via APSpace Copilot. Group members: Alex Tan\\, Teammates. Demo session reservation only. No real booking or calendar sync.')
    .replace('SUMMARY:[DEMO] Study session - B-03', 'SUMMARY:[DEMO] Study Session - APU Discussion Pod B-03')
    .split('\r\n').map(line => line.replace(/(.{73})(?=.)/g, '$1\r\n ')).join('\r\n');
}
