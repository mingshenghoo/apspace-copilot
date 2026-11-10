/** Return only fixed messages. Never disclose raw SDK errors, requests or credentials. */
export function providerFailureNotice(error: unknown): string {
  const status = error && typeof error === 'object' && 'status' in error ? error.status : undefined;
  const reason = status === 400 ? 'Gemini rejected the request or API key.'
    : status === 401 || status === 403 ? 'Gemini access was denied. Check the API key and project permissions.'
    : status === 404 ? 'The configured Gemini model was not found or is not available to this project.'
    : status === 429 ? 'Gemini quota or rate limit was reached. Check the project’s available quota.'
    : typeof status === 'number' && status >= 500 ? 'Google’s Gemini service is temporarily unavailable.'
    : 'Gemini timed out, could not be reached, or returned invalid source references.';
  return `${reason} This answer uses mock document search.`;
}
