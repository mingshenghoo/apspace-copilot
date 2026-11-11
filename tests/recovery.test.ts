import test from 'node:test';
import assert from 'node:assert/strict';
import { backupModel, withModelRecovery } from '../src/services/ai/resilient-provider';
const noWait = async () => {};
test('transient failures recover using a catalog-listed stable Flash model', async () => {
  const calls: string[] = [];
  const result = await withModelRecovery('gemini-3.8-flash', async model => { calls.push(model); if (model === 'gemini-3.8-flash') throw { status:503 }; return 'valid'; }, async () => ['models/gemini-3.7-flash'], noWait);
  assert.deepEqual(calls, ['gemini-3.8-flash', 'gemini-3.8-flash', 'gemini-3.7-flash']);
  assert.equal(result.value, 'valid');
});
test('authentication and quota errors stop immediately without model discovery', async () => {
  for (const status of [400,401,403,404,429]) {
    let calls=0;
    await assert.rejects(withModelRecovery('primary', async () => { calls++; throw {status}; }, async () => { assert.fail('must not discover'); }, noWait));
    assert.equal(calls,1);
  }
});
test('no compatible backup preserves the failure; media and preview models are excluded', async () => {
  assert.equal(backupModel(['models/gemini-3.8-flash','gemini-3.7-flash-tts','gemini-3.7-pro','gemini-3.7-flash-preview'], 'gemini-3.8-flash'), undefined);
  await assert.rejects(withModelRecovery('primary', async () => {throw {status:503};}, async () => [], noWait));
});
