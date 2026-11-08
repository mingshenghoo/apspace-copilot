import test from 'node:test';
import assert from 'node:assert/strict';
import { documents, exampleQuestions } from '../src/data/academic-documents';
import { MockAcademicAdapter } from '../src/services/ai/mock-adapter';
import { readConversation } from '../src/lib/conversation';
import { POST } from '../src/app/api/assistant/route';

const adapter = new MockAcademicAdapter();
const supported = [
  ['What is database normalization?', 'notes/normalization', 'First normal form'],
  ['When is the Database Systems assignment due?', 'assessment/database-brief', '9 November 2026 at 23:59 MYT'],
  ['What are the library hours?', 'faq/library-hours', '08:00–20:00'],
  ['What classes do I have today?', 'timetable/friday-classes', '6 November 2026'],
  ['When is the Software Engineering assignment due?', 'assessment/software-brief', '12 November 2026'],
  ['Explain database normalisation', 'notes/normalization', 'Normalization'],
];
for (const [question, id, expected] of supported) {
  test(`grounded retrieval: ${question}`, async () => {
    const answer = await adapter.answer(question);
    assert.equal(answer.sources[0]?.id, id);
    assert.ok(answer.text.includes(expected));
    for (const [index, source] of answer.sources.entries()) {
      const doc = documents.find(document => document.id === source.documentId);
      assert.equal(source.title, doc?.title);
      const passage = doc?.passages.find(p => `${doc.id}/${p.id}` === source.id);
      assert.equal(source.excerpt, passage?.excerpt);
      assert.equal(source.section, passage?.section);
      assert.ok(answer.text.includes(`${source.excerpt} [${index + 1}]`));
    }
  });
}
test('all suggestions have source-backed answers', async () => {
  for (const question of exampleQuestions) assert.ok((await adapter.answer(question)).sources.length);
});
test('unavailable facts and misleading topic overlap produce no citation', async () => {
  for (const question of ['What is my tuition fee balance?', 'What is the library late fee?', 'Is the library open on Sunday?', 'What classes do I have tomorrow?', 'What is the Database Systems exam date?', 'What classes are on 7 November 2026?', 'Who won the football match?', '   ']) {
    const answer = await adapter.answer(question);
    assert.deepEqual(answer.sources, [], question);
    assert.match(answer.text, /couldn’t find/, question);
  }
});
test('session history round-trips with citations and ignores damaged data', async () => {
  const result = await adapter.answer(exampleQuestions[0]);
  const history = [{ role: 'user', text: exampleQuestions[0] }, { role: 'assistant', text: result.text, sources: result.sources }];
  assert.deepEqual(readConversation(JSON.stringify(history)), history);
  for (const raw of [null, '', 'invalid JSON', '{}', '[null,42,{"role":"other"}]', '[{"role":"assistant","text":"broken","sources":[{}]}]']) assert.deepEqual(readConversation(raw), []);
});
test('API rejects invalid requests and returns source-backed answers', async () => {
  const request = (body: string) => new Request('http://localhost/api/assistant', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
  for (const body of ['{', 'null', '{}', '{"question":42}', '{"question":" "}', JSON.stringify({ question: 'a'.repeat(1001) })]) assert.equal((await POST(request(body))).status, 400);
  const response = await POST(request(JSON.stringify({ question: exampleQuestions[0] })));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).sources[0].id, 'notes/normalization');
});
