import type { Language } from '../shared/types';

const STRINGS = {
  tagline: { en: 'Practice makes kinder conversations', ja: '練習が、やさしい会話をつくる' },
  modeGuided: { en: 'Guided demo · rule-based, no AI', ja: 'ガイド付きデモ · ルールベース、AIなし' },
  modeGemini: { en: 'AI mode · Gemini', ja: 'AIモード · Gemini' },
  modeChecking: { en: 'Checking server…', ja: 'サーバー確認中…' },
  modeOffline: { en: 'Server unreachable', ja: 'サーバーに接続できません' },
  scenario: { en: 'Scenario', ja: 'シナリオ' },
  start: { en: 'Start practice', ja: '練習を始める' },
  policySheet: { en: 'Fictional policy sheet', ja: '架空のポリシーシート' },
  hidePolicy: { en: 'Hide policy', ja: 'ポリシーを閉じる' },
  policyIntro: { en: 'Training material for this exercise only. Feedback is scored against these five points.', ja: 'この練習専用の教材です。フィードバックは以下の5項目で採点されます。' },
  you: { en: 'You', ja: 'あなた' },
  placeholder: { en: 'Type your reply to Alex…', ja: 'アレックスさんへの返信を入力…' },
  send: { en: 'Send', ja: '送信' },
  sending: { en: 'Alex is replying…', ja: 'アレックスさんが返信中…' },
  finish: { en: 'Finish & review', ja: '終了して振り返る' },
  finishHint: { en: 'Send at least 3 messages to unlock review.', ja: '振り返るには3回以上メッセージを送ってください。' },
  turns: { en: 'turn', ja: 'ターン' },
  retry: { en: 'Retry scenario', ja: 'もう一度練習する' },
  reviewTitle: { en: 'Your feedback', ja: 'フィードバック' },
  feedbackSourceGuided: { en: 'Scored by fixed rules that look for policy-aligned wording in your messages. Not AI, not an employment assessment.', ja: 'メッセージ内のポリシーに沿った表現を探す固定ルールで採点しています。AIではなく、雇用評価でもありません。' },
  feedbackSourceGemini: { en: 'Scored by the configured AI provider; quotations are verified against your exact words. Training feedback only.', ja: '設定されたAIプロバイダーが採点し、引用はあなたの発言と照合済みです。研修用フィードバックのみ。' },
  evidence: { en: 'Evidence', ja: '根拠' },
  noEvidence: { en: 'No matching wording found in your messages.', ja: 'メッセージ内に該当する表現は見つかりませんでした。' },
  improve: { en: 'Improve', ja: '改善' },
  speakerOn: { en: 'Voice on', ja: '音声オン' },
  speakerOff: { en: 'Voice off', ja: '音声オフ' },
  speakerUnavailable: { en: 'Voice playback unavailable in this browser', ja: 'このブラウザでは音声再生を利用できません' },
  mic: { en: 'Dictate', ja: '音声入力' },
  micListening: { en: 'Listening… click to stop', ja: '聞き取り中… クリックで停止' },
  micUnavailable: { en: 'Dictation not supported here; typing works everywhere.', ja: 'このブラウザは音声入力に非対応です。入力はどこでも使えます。' },
  micDenied: { en: 'Microphone unavailable or denied. Keep typing instead.', ja: 'マイクが使えないか拒否されました。入力を続けてください。' },
  micDraft: { en: 'Review the transcript, then press Send.', ja: '文字起こしを確認してから送信してください。' },
  langLocked: { en: 'Language is locked during practice. Finish or retry to switch.', ja: '練習中は言語を切り替えられません。終了または再挑戦後に切り替えてください。' },
  error: { en: 'Something went wrong', ja: 'エラーが発生しました' },
  imgAlt: { en: 'Otter Coach mascot', ja: 'オッターコーチのマスコット' },
  imgFallback: { en: 'Mascot image coming soon', ja: 'マスコット画像は準備中' },
  footer: { en: 'Fictional scenario for practice. No real customers, payments or accounts are involved.', ja: '練習用の架空シナリオです。実際の顧客・決済・アカウントは一切関係ありません。' },
  ariaTranscript: { en: 'Practice conversation', ja: '練習の会話' },
} satisfies Record<string, Record<Language, string>>;

export type StringKey = keyof typeof STRINGS;

export function t(lang: Language, key: StringKey): string {
  return STRINGS[key][lang];
}
