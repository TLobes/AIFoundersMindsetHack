/**
 * Rule-based signal detection over trainee messages. Shared by the guided
 * customer simulator and the feedback scorer so both stay consistent.
 * Trainee text is treated as data only: it is matched, never interpreted.
 */

export type Signal =
  | 'empathy'
  | 'blame'
  | 'askPending'
  | 'askSensitive'
  | 'explainAuth'
  | 'promiseRefund'
  | 'escalate'
  | 'reference'
  | 'inventTimeline'
  | 'summarize'
  | 'confirm';

const PATTERNS: Record<Signal, RegExp[]> = {
  empathy: [
    /\b(sorry|apologi[sz]e|understand|frustrating|i see why|that must be|thank you for (letting|telling|reaching)|i hear you|i can imagine|appreciate you)\b/i,
    /(申し訳|ごめんなさい|お詫び|ご不安|ご心配|ご迷惑|お気持ち|大変でした|お困り|ご連絡いただき|お知らせいただき|わかります|分かります|ありがとうございます)/,
  ],
  blame: [
    /\b(your (fault|mistake)|you (must have|probably) (tapped|paid|pressed)|you did something wrong|not our problem|that'?s on you)\b/i,
    /(お客様の(ミス|せい)|あなたが(間違|二回|2回))/,
  ],
  askPending: [
    /\b(pending|posted|completed|settled|authori[sz]ation|processing|finali[sz]ed|cleared)\b/i,
    /(保留|処理中|確定|未確定|仮売上|オーソリ|承認待ち|反映)/,
  ],
  askSensitive: [
    /\b(full card number|card number|16[- ]?digit|pin\b|password|cvv|security code|expir(y|ation) date)/i,
    /(カード番号|暗証番号|パスワード|セキュリティコード|有効期限)/,
  ],
  explainAuth: [
    /\b(authori[sz]ation|temporary hold|pre-?authori[sz]ed|may (drop|fall) off|not (proof|necessarily) (of )?a (second|double) charge|usually disappears|often clears|hold)\b/i,
    /(仮売上|オーソリ|一時的な(保留|与信)|二重請求とは限|自動的に(消え|取り消))/,
  ],
  promiseRefund: [
    /\b(i('ll| will) refund|we('ll| will) refund|refund (you|it|that) (right away|now|immediately|today)|you('ll| will) get (a|your) refund|i (can|will) (issue|process|give) (you )?(a|the) refund|guarantee(d)? (a )?refund|full refund)\b/i,
    /((すぐに|今すぐ|必ず|確実に)(返金|払い戻し)|返金(します|いたします|させていただきます)|返金を(お約束|保証))/,
  ],
  escalate: [
    /\b(escalate|review team|payments team|billing team|support (team|channel)|refer(red)? (this|it)|look into (this|it)|investigate|open a (case|ticket)|raise (a|this))\b/i,
    /(エスカレーション|担当(部署|チーム)|確認いたします|調査|決済(担当|チーム)|正規の(窓口|サポート)|サポート窓口|ケースを|チケット)/,
  ],
  reference: [
    /\b(receipt|order (number|reference|id)|reference number|transaction (id|reference)|confirmation number)\b/i,
    /(レシート|注文番号|参照番号|取引番号|受付番号|領収書)/,
  ],
  inventTimeline: [
    /\b(within (\d+|a few|two|three|five|seven|ten|24|48) (hours?|business days?|days?|weeks?)|by (tomorrow|tonight|end of (the )?(day|week))|in (\d+|a few|two|three|five) (hours?|days?|business days?))\b/i,
    /((\d+|数|二|三|五|七)(営業日|日|時間)以内|明日までに|今日中に|今週中に)/,
  ],
  summarize: [
    /\b(to (summari[sz]e|recap)|so (the )?next step|here('s| is) what (happens|i('ll| will) do) next|next steps?|what happens next|to confirm|in summary|so,? (i('ll| will)|we('ll| will)))\b/i,
    /(まとめ|次のステップ|次の(手順|流れ)|以下の(流れ|手順)|整理(します|すると)|確認させていただきますと|ということで|今後の流れ)/,
  ],
  confirm: [
    /\b(does that (work|sound|make sense)|is that (okay|ok|alright|clear)|any (other )?questions|do you have any questions|make sense\?|sound (good|okay|ok)\?|let me know if)\b/i,
    /(よろしいでしょうか|いかがでしょうか|問題ないでしょうか|ご不明な点|ご質問|大丈夫でしょうか|ご確認ください)/,
  ],
};

export function hasSignal(text: string, signal: Signal): boolean {
  return PATTERNS[signal].some((re) => re.test(text));
}

/** Returns the sentence of `text` that first matches `signal`, exactly as written, or null. */
export function findEvidence(text: string, signal: Signal): string | null {
  const sentences = text
    .split(/(?<=[.!?。！？])\s*|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const sentence of sentences) {
    if (hasSignal(sentence, signal)) return sentence;
  }
  return hasSignal(text, signal) ? text.trim() : null;
}

/** First matching sentence across a list of trainee messages, in order. */
export function findEvidenceIn(messages: string[], signal: Signal): string | null {
  for (const m of messages) {
    const e = findEvidence(m, signal);
    if (e) return e;
  }
  return null;
}
