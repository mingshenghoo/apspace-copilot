import test from 'node:test';
import assert from 'node:assert/strict';
import rooms from '../src/data/classrooms.json';
import { isAvailable, calendarInvitation, validSlot } from '../src/lib/rooms';
import { MockAcademicAdapter } from '../src/services/ai/mock-adapter';
test('room availability rejects overlaps but permits adjacent bookings',()=>{
 assert.equal(isAvailable(rooms[0],'2026-11-06','11:30','12:00'),false);
 assert.equal(isAvailable(rooms[0],'2026-11-06','10:00','13:00'),false);
 assert.equal(isAvailable(rooms[0],'2026-11-06','12:30','14:00'),true);
 assert.equal(validSlot('14:00','13:00'),false);
 assert.equal(validSlot('07:00','09:00'),false);
 assert.equal(validSlot('13:00','13:00'),false);
 assert.equal(validSlot('13:99','15:00'),false);
});
test('calendar export uses UTC equivalent of MYT and explicit demo status',()=>{
 const ics=calendarInvitation(rooms[0],'2026-11-06','13:00','14:00');
 assert.match(ics,/DTSTART:20261106T050000Z/);assert.match(ics,/DTEND:20261106T060000Z/);assert.match(ics,/SUMMARY:\[DEMO\]/);assert.match(ics,/STATUS:TENTATIVE/);assert.match(ics.replace(/\r\n /g,''),/No room is reserved/);
 assert.throws(()=>calendarInvitation(rooms[0],'2026-11-06','11:00','12:00'));
});
test('academic responses provide matching sources and abstain for unknown questions',async()=>{
 const adapter=new MockAcademicAdapter();const result=await adapter.answer('When is my assignment due?');
 assert.equal(result.provider,'mock');assert.equal(result.sources[0].documentId,'assessment');assert.match(result.text,/\[1\]/);
 const unknown=await adapter.answer('Who won the football match?');assert.equal(unknown.sources.length,0);assert.match(unknown.text,/couldn’t find/);
});
