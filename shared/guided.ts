import { hasSignal } from './detect.js';
import type { ChatMessage, Language } from './types.js';

/**
 * Deterministic customer simulator ("Guided demo" mode).
 * Alex is frustrated but not abusive and calms down when handled well.
 * No AI, no real lookups, no refunds: replies are chosen by rules.
 */

type Line = Record<Language, string>;

const L = {
  pendingReveal: {
    en: "Let me check... okay, one says \u201cpending\u201d and the other one is completed. So what does that mean? I'm not paying twice.",
    ja: 'えっと、確認します…あ、1件は「保留中」で、もう1件は確定になっています。これってどういうことですか?2回払うつもりはありません。',
  },
  pendingRevealCalm: {
    en: 'Thanks. Let me look... one entry says \u201cpending\u201d, the other is completed. Is that normal?',
    ja: 'ありがとうございます。見てみますね…1件は「保留中」、もう1件は確定です。これって普通なんですか?',
  },
  sensitiveRefusal: {
    en: "Wait, why would you need my card number or PIN? I'm not comfortable sharing that. Can you help without it?",
    ja: 'えっ、なぜカード番号や暗証番号が必要なんですか?それは教えたくありません。それなしで対応できませんか?',
  },
  blameReaction: {
    en: "Excuse me? I tapped once. I'm not the one who charged me twice. Please just help me sort this out.",
    ja: 'ちょっと待ってください。私は1回しかタッチしていません。2回請求したのは私じゃないです。ちゃんと対応してください。',
  },
  promiseReaction: {
    en: 'A refund? Okay... but you haven\'t even checked anything yet. When exactly will I see it?',
    ja: '返金ですか?でも、まだ何も確認していませんよね。具体的にいつ戻ってくるんですか?',
  },
  timelineReaction: {
    en: "You're sure about that timing? I've heard that before from other places and it didn't happen.",
    ja: 'その期限、本当に確実ですか?他のお店でも同じことを言われて、結局戻ってきませんでしたよ。',
  },
  authUnderstood: {
    en: 'Oh, so the pending one might just drop off on its own? That would be a relief. What should I do if it doesn\'t?',
    ja: 'なるほど、保留中の方は自然に消えるかもしれないんですね。それなら安心です。消えなかったらどうすればいいですか?',
  },
  escalateAccept: {
    en: "Okay, I still have the receipt, the order number is OC-2291. If someone can actually look into it, that's fine with me.",
    ja: 'わかりました。レシートはまだ持っていて、注文番号はOC-2291です。誰かがちゃんと確認してくれるなら、それでいいです。',
  },
  empathyOnly: {
    en: "Thanks, I appreciate that. It's just annoying to see ¥3,600 gone when lunch was ¥1,800. What do you need from me?",
    ja: 'ありがとうございます。ランチは1,800円なのに3,600円引かれているのを見るとイライラするんです。私は何をすればいいですか?',
  },
  neutralPush: {
    en: "So... what are you going to do about it? I just want to know I'm not being charged twice.",
    ja: 'それで…どうしてくれるんですか?二重に払わされていないか知りたいだけなんです。',
  },
  closeCalm: {
    en: "Got it, that's clear. Thank you for explaining everything so patiently. I'll keep an eye on my app.",
    ja: 'わかりました、はっきりしました。丁寧に説明してくださってありがとうございます。アプリを見ておきます。',
  },
  closeNeutral: {
    en: "Alright. I'll wait and see, but please make sure someone follows up.",
    ja: 'わかりました。様子を見ますが、ちゃんと誰かフォローしてくださいね。',
  },
  closeUpset: {
    en: "I'm still not really sure what happens next, honestly. I'll check my statement again tomorrow.",
    ja: '正直、次に何が起きるのかまだよくわかりません。明日もう一度明細を確認します。',
  },
} satisfies Record<string, Line>;

export interface GuidedResult {
  reply: string;
  mood: number;
}

function clamp(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Customer mood in [0,1] derived from the whole trainee history. */
export function computeMood(traineeMessages: string[]): number {
  let mood = 0.2;
  for (const m of traineeMessages) {
    if (hasSignal(m, 'empathy')) mood += 0.2;
    if (hasSignal(m, 'explainAuth')) mood += 0.2;
    if (hasSignal(m, 'escalate') || hasSignal(m, 'reference')) mood += 0.15;
    if (hasSignal(m, 'summarize') || hasSignal(m, 'confirm')) mood += 0.1;
    if (hasSignal(m, 'blame')) mood -= 0.3;
    if (hasSignal(m, 'askSensitive')) mood -= 0.25;
    if (hasSignal(m, 'promiseRefund')) mood -= 0.1;
  }
  return clamp(mood);
}

export function guidedReply(language: Language, messages: ChatMessage[]): GuidedResult {
  const trainee = messages.filter((m) => m.role === 'trainee').map((m) => m.content);
  const last = trainee[trainee.length - 1] ?? '';
  const previous = trainee.slice(0, -1);
  const mood = computeMood(trainee);
  const pendingAlreadyRevealed = previous.some((m) => hasSignal(m, 'askPending'));
  const isFinalTurn = trainee.length >= 5;

  const pick = (line: Line): GuidedResult => ({ reply: line[language], mood });

  if (hasSignal(last, 'blame')) return pick(L.blameReaction);
  if (hasSignal(last, 'askSensitive')) return pick(L.sensitiveRefusal);
  if (hasSignal(last, 'inventTimeline')) return pick(L.timelineReaction);
  if (hasSignal(last, 'promiseRefund') && !hasSignal(last, 'escalate')) return pick(L.promiseReaction);

  if (isFinalTurn) {
    if (mood >= 0.7) return pick(L.closeCalm);
    if (mood >= 0.4) return pick(L.closeNeutral);
    return pick(L.closeUpset);
  }

  if (hasSignal(last, 'askPending') && !pendingAlreadyRevealed) {
    return pick(hasSignal(last, 'empathy') || mood >= 0.5 ? L.pendingRevealCalm : L.pendingReveal);
  }
  if (hasSignal(last, 'escalate') || hasSignal(last, 'reference')) return pick(L.escalateAccept);
  if (hasSignal(last, 'explainAuth')) return pick(L.authUnderstood);
  if (hasSignal(last, 'summarize') || hasSignal(last, 'confirm')) {
    return pick(mood >= 0.6 ? L.closeCalm : L.closeNeutral);
  }
  if (hasSignal(last, 'empathy')) return pick(L.empathyOnly);
  return pick(L.neutralPush);
}
