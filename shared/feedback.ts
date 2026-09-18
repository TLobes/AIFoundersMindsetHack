import { POLICIES } from './content.js';
import { findEvidenceIn, hasSignal } from './detect.js';
import type { ChatMessage, Criterion, Feedback, Language } from './types.js';

const POSSIBLE_PER_CRITERION = 20;

type T = Record<Language, string>;

const IMPROVE: Record<string, T> = {
  P1_full: { en: 'Good: you acknowledged the concern without blaming Alex.', ja: '良い点: アレックスさんを責めずに不安を受け止めました。' },
  P1_blame: { en: 'Avoid implying the customer caused the double entry; lead with acknowledgement.', ja: '二重表示の原因がお客様にあると示唆しないでください。まず受け止めから始めましょう。' },
  P1_none: { en: 'Open by acknowledging the worry, e.g. "I understand seeing two charges is frustrating."', ja: '「2件表示されていてご不安ですよね」のように、まず不安を受け止めましょう。' },
  P2_full: { en: 'Good: you checked whether the entries were pending or posted.', ja: '良い点: 保留中か確定済みかを確認しました。' },
  P2_sensitive: { en: 'Never request full card numbers, PINs or passwords. Ask only about the entry status.', ja: 'カード番号全体・暗証番号・パスワードは決して求めないでください。項目の状態だけを尋ねましょう。' },
  P2_none: { en: 'Ask whether both entries are completed or one still shows as pending.', ja: '2件とも確定しているか、1件が保留中かを尋ねましょう。' },
  P3_full: { en: 'Good: you explained the pending entry as a possible authorization and did not promise a refund early.', ja: '良い点: 保留中の項目を仮売上の可能性として説明し、早まった返金の約束をしませんでした。' },
  P3_promise: { en: 'Do not promise a refund before anything is checked; explain that a pending entry may be an authorization.', ja: '確認前に返金を約束しないでください。保留中の項目は仮売上の可能性があると説明しましょう。' },
  P3_none: { en: 'Explain that a pending entry may be a temporary authorization, not proof of a second charge.', ja: '保留中の項目は一時的な仮売上であり、二重請求の証明ではないと説明しましょう。' },
  P4_full: { en: 'Good: you offered a review through support using a receipt or order reference.', ja: '良い点: レシート/注文番号を使ってサポート窓口での確認を提案しました。' },
  P4_timeline: { en: 'Do not invent a refund timeline; offer the review path and let the team confirm timing.', ja: '返金時期を勝手に約束せず、確認の流れを提案して時期は担当チームに任せましょう。' },
  P4_partial: { en: 'Offer escalation and ask for the receipt or order reference so the team can review.', ja: 'エスカレーションを提案し、確認のためにレシートや注文番号を尋ねましょう。' },
  P4_none: { en: 'If both charges post, offer to escalate for review with a receipt/order reference.', ja: '2件とも確定した場合は、レシート/注文番号を添えて確認にまわすことを提案しましょう。' },
  P5_full: { en: 'Good: you summarized the next step and checked understanding.', ja: '良い点: 次のステップをまとめ、理解を確認しました。' },
  P5_partial: { en: 'Close by both summarizing the next step and asking whether it is clear.', ja: '最後に次のステップをまとめ、わかりやすかったか確認しましょう。' },
  P5_none: { en: 'End with a clear summary of what happens next and confirm Alex understood.', ja: '次に何が起こるかを明確にまとめ、アレックスさんの理解を確認して締めましょう。' },
};

const SUMMARY: Record<'high' | 'mid' | 'low', T> = {
  high: { en: 'Strong handling: calm, policy-aligned and clear. Alex left reassured.', ja: '落ち着いてポリシーに沿った、わかりやすい対応でした。アレックスさんは安心して終えられました。' },
  mid: { en: 'Solid foundation. Focus on the criteria below with lower scores and retry.', ja: '基礎はできています。下のスコアが低い項目を意識して、もう一度挑戦しましょう。' },
  low: { en: 'This conversation left Alex unsure. Review the fictional policy sheet and retry.', ja: 'この会話ではアレックスさんは不安なままでした。架空のポリシーを見直して再挑戦しましょう。' },
};

export function scoreConversation(language: Language, messages: ChatMessage[]): Feedback {
  const trainee = messages.filter((m) => m.role === 'trainee').map((m) => m.content);
  const any = (s: Parameters<typeof hasSignal>[1]) => trainee.some((m) => hasSignal(m, s));
  const ev = (s: Parameters<typeof hasSignal>[1]) => findEvidenceIn(trainee, s);
  const title = (id: Criterion['id']) => POLICIES.find((p) => p.id === id)!.title[language];
  const t = (k: string) => IMPROVE[k][language];

  const criteria: Criterion[] = [];

  // P1
  if (any('blame')) criteria.push({ id: 'P1', title: title('P1'), earned: 0, possible: 20, evidence: ev('blame'), improvement: t('P1_blame') });
  else if (any('empathy')) criteria.push({ id: 'P1', title: title('P1'), earned: 20, possible: 20, evidence: ev('empathy'), improvement: t('P1_full') });
  else criteria.push({ id: 'P1', title: title('P1'), earned: 0, possible: 20, evidence: null, improvement: t('P1_none') });

  // P2
  if (any('askSensitive')) criteria.push({ id: 'P2', title: title('P2'), earned: 0, possible: 20, evidence: ev('askSensitive'), improvement: t('P2_sensitive') });
  else if (any('askPending')) criteria.push({ id: 'P2', title: title('P2'), earned: 20, possible: 20, evidence: ev('askPending'), improvement: t('P2_full') });
  else criteria.push({ id: 'P2', title: title('P2'), earned: 0, possible: 20, evidence: null, improvement: t('P2_none') });

  // P3
  if (any('promiseRefund')) criteria.push({ id: 'P3', title: title('P3'), earned: 0, possible: 20, evidence: ev('promiseRefund'), improvement: t('P3_promise') });
  else if (any('explainAuth')) criteria.push({ id: 'P3', title: title('P3'), earned: 20, possible: 20, evidence: ev('explainAuth'), improvement: t('P3_full') });
  else criteria.push({ id: 'P3', title: title('P3'), earned: 5, possible: 20, evidence: null, improvement: t('P3_none') });

  // P4
  if (any('inventTimeline')) criteria.push({ id: 'P4', title: title('P4'), earned: 0, possible: 20, evidence: ev('inventTimeline'), improvement: t('P4_timeline') });
  else if (any('escalate') && any('reference')) criteria.push({ id: 'P4', title: title('P4'), earned: 20, possible: 20, evidence: ev('escalate') ?? ev('reference'), improvement: t('P4_full') });
  else if (any('escalate') || any('reference')) criteria.push({ id: 'P4', title: title('P4'), earned: 10, possible: 20, evidence: ev('escalate') ?? ev('reference'), improvement: t('P4_partial') });
  else criteria.push({ id: 'P4', title: title('P4'), earned: 0, possible: 20, evidence: null, improvement: t('P4_none') });

  // P5
  if (any('summarize') && any('confirm')) criteria.push({ id: 'P5', title: title('P5'), earned: 20, possible: 20, evidence: ev('summarize') ?? ev('confirm'), improvement: t('P5_full') });
  else if (any('summarize') || any('confirm')) criteria.push({ id: 'P5', title: title('P5'), earned: 10, possible: 20, evidence: ev('summarize') ?? ev('confirm'), improvement: t('P5_partial') });
  else criteria.push({ id: 'P5', title: title('P5'), earned: 0, possible: 20, evidence: null, improvement: t('P5_none') });

  const total = criteria.reduce((s, c) => s + c.earned, 0);
  const possible = criteria.length * POSSIBLE_PER_CRITERION;
  const ratio = total / possible;
  const summary = SUMMARY[ratio >= 0.8 ? 'high' : ratio >= 0.5 ? 'mid' : 'low'][language];

  return { total, possible, criteria, summary, mode: 'guided' };
}
