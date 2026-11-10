import test from 'node:test';
import assert from 'node:assert/strict';
import { GeminiAcademicAdapter, referenceShelf, validateSelection } from '../src/services/ai/gemini-adapter';
import { documents } from '../src/data/academic-documents';

test('Gemini source selection renders only verified stored excerpts', async () => {
  const adapter = new GeminiAcademicAdapter(async (question, shelf) => {
    assert.equal(question, 'Explain third normal form');
    assert.ok(shelf.some(source => source.id === 'notes/normalization'));
    return JSON.stringify({ sourceIds: ['notes/normalization'], text: 'Invented deadline: tomorrow' });
  });
  const result = await adapter.answer('Explain third normal form');
  assert.equal(result.provider, 'gemini');
  assert.equal(result.sources[0].excerpt, documents[0].passages[0].excerpt);
  assert.ok(!result.text.includes('Invented deadline'));
  assert.match(result.text, /\[1\]/);
});
test('invalid model selections cannot introduce citations', () => {
  for (const raw of ['invalid', 'null', '{}', '{"sourceIds":["made-up"]}', '{"sourceIds":[123]}', '{"sourceIds":["notes/normalization","notes/normalization"]}']) {
    assert.throws(() => validateSelection(raw, referenceShelf()));
  }
});
test('empty model selection explicitly abstains', () => {
  const result = validateSelection('{"sourceIds":[]}', referenceShelf());
  assert.equal(result.sources.length, 0);
  assert.match(result.text, /couldn’t find/);
});
test('Gemini reference shelf includes all documents and server-computed reservation state', () => {
  const free = referenceShelf();
  for (const document of documents) assert.ok(free.some(source => source.documentId === document.id));
  assert.match(free.find(source => source.id === 'rooms/B-03')!.excerpt, /Availability for 13:00–14:00: available/);
  assert.match(referenceShelf(true).find(source => source.id === 'rooms/B-03')!.excerpt, /Availability for 13:00–14:00: unavailable/);
});

import { providerFailureNotice } from '../src/services/ai/provider-error';
test('provider failures expose only fixed safe diagnostic messages', () => {
  assert.match(providerFailureNotice({status:404,message:'secret'}), /model was not found/);
  assert.match(providerFailureNotice({status:429}), /quota/);
  assert.match(providerFailureNotice({status:403}), /access was denied/);
  assert.ok(!providerFailureNotice(new Error('secret API key')).includes('secret'));
});
