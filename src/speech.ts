import { speechText } from '../shared/speechText';
import type { Language } from '../shared/types';

export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speak(text: string, lang: Language, onEnd?: () => void): () => void {
  if (!canSpeak) return () => {};
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(speechText(text, lang));
  u.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith(u.lang));
  if (voice) u.voice = voice;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  window.speechSynthesis.speak(u);
  return () => window.speechSynthesis.cancel();
}

let remoteAudio: HTMLAudioElement | null = null;
let remoteUrl: string | null = null;
let speechRequest: AbortController | null = null;

export function stopSpeaking(): void {
  speechRequest?.abort();
  speechRequest = null;
  remoteAudio?.pause();
  remoteAudio = null;
  if (remoteUrl) URL.revokeObjectURL(remoteUrl);
  remoteUrl = null;
  if (canSpeak) window.speechSynthesis.cancel();
}

/** Audio stays behind our server proxy; credentials never enter the browser. */
export async function speakElevenLabs(text: string, onStart: () => void, onEnd: () => void, onError: () => void): Promise<void> {
  stopSpeaking();
  const controller = new AbortController();
  speechRequest = controller;
  try {
    const response = await fetch('/api/speech', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }), signal: controller.signal,
    });
    if (!response.ok) throw new Error('Speech unavailable');
    const blob = await response.blob();
    if (controller.signal.aborted) return;
    remoteUrl = URL.createObjectURL(blob);
    const audio = new Audio(remoteUrl);
    remoteAudio = audio;
    const finish = () => { if (speechRequest === controller) { stopSpeaking(); onEnd(); } };
    audio.onended = finish;
    audio.onerror = () => { finish(); onError(); };
    await audio.play();
    if (!controller.signal.aborted) onStart();
  } catch {
    if (!controller.signal.aborted) { stopSpeaking(); onEnd(); onError(); }
  }
}

interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type RecognitionCtor = new () => RecognitionLike;

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export const canRecognize = getRecognitionCtor() !== null;

export interface RecognitionHandle {
  stop(): void;
}

/** Starts recognition only on explicit user action. Produces a draft transcript; never sends. */
export function startRecognition(
  lang: Language,
  handlers: { onDraft(text: string): void; onError(kind: 'denied' | 'other'): void; onEnd(): void },
): RecognitionHandle | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = lang === 'ja' ? 'ja-JP' : 'en-US';
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (e) => {
    let text = '';
    for (let i = 0; i < e.results.length; i++) text += e.results[i][0]?.transcript ?? '';
    handlers.onDraft(text);
  };
  rec.onerror = (e) => handlers.onError(e.error === 'not-allowed' || e.error === 'service-not-allowed' ? 'denied' : 'other');
  rec.onend = () => handlers.onEnd();
  try {
    rec.start();
  } catch {
    handlers.onError('other');
    return null;
  }
  return { stop: () => rec.stop() };
}
