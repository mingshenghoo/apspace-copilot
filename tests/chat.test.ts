import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../src/app/api/chat/route';
import { quickPrompts } from '../src/data/quick-prompts';
import { podInvitation } from '../src/lib/pod';
async function ask(question: string, podReserved = false) {
  const response = await POST(new Request('http://localhost/api/chat', { method: 'POST', body: JSON.stringify({ question, podReserved }) }));
  assert.equal(response.status, 200);
  return response.json();
}
test('quick prompts return bounded dates, exact notes and schedule-derived room references', async () => {
  const deadlines = await ask(quickPrompts[0]);
  assert.deepEqual(deadlines.sources.map((source: {id:string}) => source.id), ['assessment/database-brief', 'assessment/software-brief']);
  assert.match(deadlines.text, /9–15 November/);
  assert.equal((await ask(quickPrompts[1])).sources[0].id, 'notes/normalization');
  assert.equal((await ask(quickPrompts[2])).sources.length, 5);
  const reserved = await ask(quickPrompts[2], true);
  assert.equal(reserved.sources.length, 4);
  assert.ok(reserved.sources.every((source: {id:string}) => source.id !== 'rooms/B-03'));
  assert.equal((await ask('Who won the football match?')).sources.length, 0);
});
test('chat rejects malformed requests', async () => {
  for (const body of ['invalid', 'null', JSON.stringify({question:''}), JSON.stringify({question:'hello',podReserved:'yes'}), JSON.stringify({question:'x'.repeat(1001)})]) {
    assert.equal((await POST(new Request('http://localhost/api/chat', {method:'POST',body}))).status, 400);
  }
});
test('pod export contains the fixed demo date, UTC times, escaped guests and simulation disclosure', () => {
  const event = podInvitation().replace(/\r\n /g, '');
  assert.match(event, /DTSTART:20261106T050000Z/);
  assert.match(event, /DTEND:20261106T060000Z/);
  assert.match(event, /SUMMARY:\[DEMO\] Study Session - APU Discussion Pod B-03/);
  assert.ok(event.includes('Alex Tan\\, Teammates'));
  assert.match(event, /No real booking or calendar sync/);
});
