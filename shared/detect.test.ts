import { describe, expect, it } from 'vitest';
import { findEvidence, hasSignal } from './detect.js';

describe('askSensitive', () => {
  it('flags actual requests for card numbers or PINs', () => {
    expect(hasSignal('Please give me your full card number and PIN.', 'askSensitive')).toBe(true);
    expect(hasSignal('カード番号と暗証番号を教えてください。', 'askSensitive')).toBe(true);
  });
  it('does not penalize safe negations', () => {
    for (const s of [
      'Never share your PIN or password with anyone, including me.',
      "I won't ask for your card number; I only need to know whether one entry is pending.",
      'No need to share your card number or security code.',
      'Your PIN is not needed for this.',
      '暗証番号やカード番号はお聞きしません。',
      'カード番号は不要です。保留中かどうかだけ教えてください。',
    ]) {
      expect(hasSignal(s, 'askSensitive'), s).toBe(false);
    }
  });
  it('still flags a request even when another sentence is a negation', () => {
    const text = 'Never share your PIN with strangers. Now, what is your card number?';
    expect(hasSignal(text, 'askSensitive')).toBe(true);
    expect(findEvidence(text, 'askSensitive')).toBe('Now, what is your card number?');
  });
});

describe('promiseRefund', () => {
  it('flags premature refund promises', () => {
    expect(hasSignal("I'll refund you right away.", 'promiseRefund')).toBe(true);
    expect(hasSignal('必ず返金します。', 'promiseRefund')).toBe(true);
    expect(hasSignal('返金をお約束します。', 'promiseRefund')).toBe(true);
  });
  it('does not flag statements that decline to promise a refund', () => {
    for (const s of [
      '返金をお約束することはできません。',
      '確認前に返金をお約束はできませんが、必ず調査いたします。',
      '現時点では返金はできかねます。',
      "I can't promise a refund before the team checks the charges.",
      'I cannot guarantee a refund yet.',
    ]) {
      expect(hasSignal(s, 'promiseRefund'), s).toBe(false);
    }
  });
});

describe('explainAuth', () => {
  it('recognizes 仮承認 as an authorization explanation', () => {
    expect(hasSignal('保留中の項目は仮承認の可能性があります。', 'explainAuth')).toBe(true);
    expect(hasSignal('一時的な承認で、数日で消えることが多いです。', 'explainAuth')).toBe(true);
    expect(hasSignal('A pending entry is usually a temporary authorization.', 'explainAuth')).toBe(true);
  });
});
