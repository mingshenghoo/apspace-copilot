export function transientFailure(error: unknown): boolean {
  const status = error && typeof error === 'object' && 'status' in error ? error.status : undefined;
  return typeof status === 'number' && [408, 500, 502, 503, 504].includes(status);
}
export function backupModel(names: string[], primary: string): string | undefined {
  return names.map(name => name.replace(/^models\//, ''))
    .filter(name => name !== primary.replace(/^models\//, '') && /^gemini-\d+(?:\.\d+)?-flash(?:-lite)?$/.test(name))
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))[0];
}
/** Two primary attempts and at most one catalog-listed alternate; no retries for quota/auth errors. */
export async function withModelRecovery<T>(primary: string, run: (model: string) => Promise<T>, discover: () => Promise<string[]>, wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))): Promise<{ value: T; model: string }> {
  try { return { value: await run(primary), model: primary }; }
  catch (error) { if (!transientFailure(error)) throw error; }
  await wait(800);
  try { return { value: await run(primary), model: primary }; }
  catch (error) {
    if (!transientFailure(error)) throw error;
    let alternative: string | undefined;
    try { alternative = backupModel(await discover(), primary); } catch { throw error; }
    if (!alternative) throw error;
    return { value: await run(alternative), model: alternative };
  }
}
