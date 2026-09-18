import { expect, it } from 'vitest';
import { guidedReply } from './guided';
import type { ChatMessage } from './types';
it.each(['en', 'ja'] as const)('advances unrecognized replies without repeating in %s', language => {
  const messages: ChatMessage[] = [];
  const replies = new Set<string>();
  for (let i = 0; i < 5; i++) {
    messages.push({ role: 'trainee', content: language === 'en' ? 'hello there' : 'こんにちは' });
    const result = guidedReply(language, messages);
    expect(replies.has(result.reply)).toBe(false);
    replies.add(result.reply);
    messages.push({ role: 'customer', content: result.reply });
  }
});
