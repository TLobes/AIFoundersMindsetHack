import { MAX_MESSAGE_CHARS, MAX_MESSAGES, MAX_TRAINEE_TURNS, type ChatMessage, type Language } from '../shared/types.js';

export interface ChatRequest {
  language: Language;
  messages: ChatMessage[];
}

export type Validation = { ok: true; value: ChatRequest } | { ok: false; error: string };

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export function validateChatRequest(body: unknown, opts: { requireTrainee?: boolean } = {}): Validation {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Body must be a JSON object.' };
  const { language, messages } = body as Record<string, unknown>;

  if (language !== 'en' && language !== 'ja') return { ok: false, error: 'language must be "en" or "ja".' };
  if (!Array.isArray(messages)) return { ok: false, error: 'messages must be an array.' };
  if (messages.length === 0) return { ok: false, error: 'messages must not be empty.' };
  if (messages.length > MAX_MESSAGES) return { ok: false, error: `messages exceeds limit of ${MAX_MESSAGES}.` };

  const out: ChatMessage[] = [];
  let traineeTurns = 0;
  for (const [i, m] of messages.entries()) {
    if (!m || typeof m !== 'object') return { ok: false, error: `messages[${i}] must be an object.` };
    const { role, content } = m as Record<string, unknown>;
    if (role !== 'trainee' && role !== 'customer') return { ok: false, error: `messages[${i}].role must be "trainee" or "customer".` };
    if (typeof content !== 'string') return { ok: false, error: `messages[${i}].content must be a string.` };
    const trimmed = content.trim();
    if (trimmed.length === 0) return { ok: false, error: `messages[${i}].content must not be empty.` };
    if (trimmed.length > MAX_MESSAGE_CHARS) return { ok: false, error: `messages[${i}].content exceeds ${MAX_MESSAGE_CHARS} characters.` };
    if (CONTROL_CHARS.test(trimmed)) return { ok: false, error: `messages[${i}].content contains control characters.` };
    if (role === 'trainee') traineeTurns++;
    out.push({ role, content: trimmed });
  }
  if (traineeTurns > MAX_TRAINEE_TURNS) return { ok: false, error: `trainee turns exceed limit of ${MAX_TRAINEE_TURNS}.` };
  if (opts.requireTrainee !== false && traineeTurns === 0) return { ok: false, error: 'At least one trainee message is required.' };
  if (out[out.length - 1].role !== 'trainee') return { ok: false, error: 'The last message must be from the trainee.' };

  return { ok: true, value: { language, messages: out } };
}
