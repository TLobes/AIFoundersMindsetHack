import { expect, it } from 'vitest';
import { speechText } from './speechText';
it('puts spoken currency after amounts without changing other text', () => {
  expect(speechText('Paid ¥1,800 and $20.50, US$3, USD 4 or 5 USD.')).toBe('Paid 1800 yen and 20.50 US dollars, 3 US dollars, 4 US dollars or 5 US dollars.');
  expect(speechText('$20 USD')).toBe('20 US dollars');
});
it('uses Japanese currency readings in Japanese speech', () => {
  expect(speechText('料金は￥1,800、追加は$2です。')).toBe('料金は1800円、追加は2米ドルです。');
  expect(speechText('¥1,800', 'ja')).toBe('1800円');
});

it('reads grouped yen as one value in symbol and Japanese suffix forms', () => {
  expect(speechText('¥1,800 and ¥12,345,678')).toBe('1800 yen and 12345678 yen');
  expect(speechText('1,800円を支払いました。')).toBe('1800円を支払いました。');
});
