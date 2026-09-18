import type { Language } from './types.js';

export type PolicyId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

export interface Policy {
  id: PolicyId;
  title: Record<Language, string>;
  text: Record<Language, string>;
}

/** Fictional Otter Cafe training policies. Not real financial or legal advice. */
export const POLICIES: Policy[] = [
  {
    id: 'P1',
    title: { en: 'Acknowledge with empathy', ja: '共感して受け止める' },
    text: {
      en: 'Acknowledge the concern and show empathy without blaming the customer.',
      ja: 'お客様を責めず、不安を受け止めて共感を示す。',
    },
  },
  {
    id: 'P2',
    title: { en: 'Check posted vs pending', ja: '確定か保留かを確認' },
    text: {
      en: 'Ask whether both entries are completed/posted, or one is pending. Never ask for full card numbers, PINs or passwords.',
      ja: '2件とも確定済みか、1件が保留中かを尋ねる。カード番号全体・暗証番号・パスワードは絶対に聞かない。',
    },
  },
  {
    id: 'P3',
    title: { en: 'Explain authorizations, no early promises', ja: '仮売上を説明し、早まった約束をしない' },
    text: {
      en: 'A pending entry may be an authorization; it is not proof of a second settled charge. Do not promise a refund before checking.',
      ja: '保留中の項目は仮売上(オーソリ)の可能性があり、二重請求の証明ではない。確認前に返金を約束しない。',
    },
  },
  {
    id: 'P4',
    title: { en: 'Escalate with a reference', ja: '参照番号を使ってエスカレーション' },
    text: {
      en: 'If both charges are posted, offer to escalate for review using a receipt/order reference through the approved support channel. Do not invent a refund timeline.',
      ja: '2件とも確定している場合は、レシート/注文番号を使って正規のサポート窓口で確認にまわす。返金時期を勝手に約束しない。',
    },
  },
  {
    id: 'P5',
    title: { en: 'Summarize and confirm', ja: '次の一歩をまとめて確認' },
    text: {
      en: 'Summarize the next step clearly and confirm understanding.',
      ja: '次のステップを明確にまとめ、お客様の理解を確認する。',
    },
  },
];

export const SCENARIO: Record<Language, { title: string; body: string; customer: string; disclaimer: string }> = {
  en: {
    title: 'One lunch. Two charges?',
    body: 'Alex sees two ¥1,800 charges. Help them out in 3-5 replies, then get your feedback.',
    customer: 'Alex',
    disclaimer: 'Fictional training material. Otter Cafe, Alex and all policies are invented for practice and are not financial advice.',
  },
  ja: {
    title: 'ランチは1回。請求は2回？',
    body: '1,800円の請求が2件。アレックスさんに3〜5回返信して、対応を振り返りましょう。',
    customer: 'アレックス',
    disclaimer: 'これは架空の研修教材です。オッターカフェ、アレックス、すべてのポリシーは練習用の創作であり、金融に関する助言ではありません。',
  },
};

export const OPENING_MESSAGE: Record<Language, string> = {
  en: 'Hi. I had lunch at Otter Cafe yesterday and paid ¥1,800, but my banking app shows TWO charges from you. I want this fixed.',
  ja: 'すみません。昨日オッターカフェでランチに1,800円払ったんですが、銀行アプリに請求が2件も出ています。どうにかしてください。',
};
