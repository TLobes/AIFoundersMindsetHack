/** Normalize spoken currency while preserving the original on-screen text. */
export function speechText(text: string, language?: string): string {
  const japanese = language === 'ja' || (!language && /[\u3040-\u30ff\u3400-\u9fff]/u.test(text));
  const amount = '(\\d+(?:,\\d{3})*(?:\\.\\d+)?)';
  return text
    .replace(new RegExp('[¥￥]\\s*' + amount, 'g'), (_, n: string) => japanese ? `${n}円` : `${n} yen`)
    .replace(new RegExp('(?:US\\$|\\$)\\s*' + amount + '(?:\\s*USD\\b)?', 'gi'), (_, n: string) => japanese ? `${n}米ドル` : `${n} US dollars`)
    .replace(new RegExp('\\bUSD\\s*' + amount, 'gi'), (_, n: string) => japanese ? `${n}米ドル` : `${n} US dollars`)
    .replace(new RegExp(amount + '\\s*USD\\b', 'gi'), (_, n: string) => japanese ? `${n}米ドル` : `${n} US dollars`);
}
