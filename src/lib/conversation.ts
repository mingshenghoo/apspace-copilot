import type { Source } from '../services/ai/types';
export const SESSION_KEY = 'apspace-copilot:academic-chat:v2';
export interface ChatMessage { role: 'user' | 'assistant'; text: string; sources?: Source[] }
function isSource(value: unknown): value is Source {
  if (!value || typeof value !== 'object') return false;
  const source = value as Record<string, unknown>;
  return ['id', 'documentId', 'title', 'section', 'excerpt'].every(key => typeof source[key] === 'string');
}
/** Ignore malformed/old session data rather than preventing the chat from loading. */
export function readConversation(raw: string | null): ChatMessage[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    return value.filter((entry): entry is ChatMessage => entry && (entry.role === 'user' || entry.role === 'assistant') && typeof entry.text === 'string' && (entry.sources === undefined || (Array.isArray(entry.sources) && entry.sources.every(isSource))));
  } catch { return []; }
}
