import { OtterMascot } from './OtterMascot';
import { useCallback, useEffect, useRef, useState } from 'react';
import { OPENING_MESSAGE, POLICIES, SCENARIO } from '../shared/content';
import {
  MAX_MESSAGE_CHARS,
  MAX_TRAINEE_TURNS,
  MIN_TRAINEE_TURNS,
  type ChatMessage,
  type ChatResponse,
  type ConfigResponse,
  type Feedback,
  type Language,
} from '../shared/types';
import { t } from './i18n';
import { canRecognize, canSpeak, speak, speakElevenLabs, startRecognition, stopSpeaking, type RecognitionHandle } from './speech';

type Phase = 'idle' | 'active' | 'review';

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [config, setConfig] = useState<ConfigResponse | null | 'offline'>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showBuild, setShowBuild] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [voiceOn, setVoiceOn] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [mood, setMood] = useState(0.2);
  const [listening, setListening] = useState(false);
  const [micNote, setMicNote] = useState<string | null>(null);
  const [visualTalking, setVisualTalking] = useState(false);
  const talkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [langNote, setLangNote] = useState(false);
  const recRef = useRef<RecognitionHandle | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => (r.ok ? (r.json() as Promise<ConfigResponse>) : Promise.reject(new Error('config'))))
      .then(setConfig)
      .catch(() => setConfig('offline'));
  }, []);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, phase]);

  const elevenVoice = !!config && config !== 'offline' && config.speech;
  const voiceAvailable = elevenVoice || canSpeak;

  const say = useCallback(
    (text: string) => {
      if (talkTimer.current) clearTimeout(talkTimer.current);
      setVisualTalking(true);
      talkTimer.current = setTimeout(() => setVisualTalking(false), Math.min(7000, Math.max(1800, text.length * 32)));
      if (!voiceOn || !voiceAvailable) return;
      if (elevenVoice) {
        void speakElevenLabs(text, () => setSpeaking(true), () => setSpeaking(false), () => {
          setError(lang === 'ja' ? '音声を再生できませんでした。テキストで続けられます。' : 'Voice playback failed. You can continue with text.');
        });
        return;
      }
      setSpeaking(true);
      speak(text, lang, () => setSpeaking(false));
    },
    [voiceOn, lang, elevenVoice, voiceAvailable],
  );

  useEffect(() => () => {
    if (talkTimer.current) clearTimeout(talkTimer.current);
    stopSpeaking();
    recRef.current?.stop();
  }, []);

  const traineeTurns = messages.filter((m) => m.role === 'trainee').length;
  const canFinish = traineeTurns >= MIN_TRAINEE_TURNS;
  const reachedMax = traineeTurns >= MAX_TRAINEE_TURNS;

  function start() {
    const opening: ChatMessage = { role: 'customer', content: OPENING_MESSAGE[lang] };
    setMessages([opening]);
    setFeedback(null);
    setError(null);
    setMood(0.2);
    setPhase('active');
    say(opening.content);
  }

  function reset() {
    stopSpeaking();
    if (talkTimer.current) clearTimeout(talkTimer.current);
    setVisualTalking(false);
    recRef.current?.stop();
    setSpeaking(false);
    setListening(false);
    setPhase('idle');
    setMessages([]);
    setFeedback(null);
    setDraft('');
    setError(null);
    setMood(0.2);
    setLangNote(false);
  }

  function switchLang(next: Language) {
    if (phase !== 'idle') {
      setLangNote(true);
      return;
    }
    setLang(next);
  }

  async function send() {
    const content = draft.trim();
    if (!content || busy || reachedMax) return;
    const next = [...messages, { role: 'trainee', content } as ChatMessage];
    setMessages(next);
    setDraft('');
    setMicNote(null);
    setBusy(true);
    setError(null);
    try {
      const res = await postJson<ChatResponse>('/api/chat', { language: lang, messages: next });
      setMessages([...next, { role: 'customer', content: res.reply }]);
      setMood(res.mood);
      say(res.reply);
    } catch (e) {
      setError((e as Error).message);
      setMessages(messages);
      setDraft(content);
    } finally {
      setBusy(false);
    }
  }

  async function finish() {
    if (!canFinish || busy) return;
    if (talkTimer.current) clearTimeout(talkTimer.current);
    setVisualTalking(false);
    setSpeaking(false);
    stopSpeaking();
    setBusy(true);
    setError(null);
    try {
      const fb = await postJson<Feedback>('/api/feedback', { language: lang, messages });
      setFeedback(fb);
      setPhase('review');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function toggleMic() {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    if (!canRecognize) {
      setMicNote(t(lang, 'micUnavailable'));
      return;
    }
    setMicNote(null);
    const handle = startRecognition(lang, {
      onDraft: (text) => {
        setDraft(text);
        setMicNote(t(lang, 'micDraft'));
      },
      onError: (kind) => setMicNote(t(lang, kind === 'denied' ? 'micDenied' : 'micUnavailable')),
      onEnd: () => setListening(false),
    });
    if (handle) {
      recRef.current = handle;
      setListening(true);
    }
  }

  const isOffline = config === 'offline';
  const liveConfig: ConfigResponse | null = config !== null && config !== 'offline' ? config : null;
  const modeLabel = isOffline
    ? t(lang, 'modeOffline')
    : liveConfig === null
      ? t(lang, 'modeChecking')
      : liveConfig.mode === 'gemini'
        ? `${t(lang, 'modeGemini')} · ${liveConfig.model}`
        : t(lang, 'modeGuided');
  const modeClass = isOffline ? 'status status-off' : liveConfig?.mode === 'gemini' ? 'status status-ai' : 'status';
  const scenario = SCENARIO[lang];
  const otterMood = mood >= 0.65 ? 'calm' : mood >= 0.4 ? 'neutral' : 'upset';

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <h1>otter coach</h1>
          <p className="tagline">{t(lang, 'tagline')}</p>
        </div>
        <div className="header-right">
          <button className="build-link" type="button" onClick={() => setShowBuild(!showBuild)} aria-expanded={showBuild} aria-controls="devin-story">{lang === 'ja' ? 'Devinが作ったもの ↗' : 'Built with Devin ↗'}</button>
          <span className={modeClass} data-testid="provider-status">{modeLabel}</span>
          <div className="lang-switch" role="group" aria-label="Language">
            <button type="button" className={lang === 'en' ? 'on' : ''} aria-pressed={lang === 'en'} onClick={() => switchLang('en')} disabled={phase !== 'idle' && lang !== 'en'}>
              EN
            </button>
            <button type="button" className={lang === 'ja' ? 'on' : ''} aria-pressed={lang === 'ja'} onClick={() => switchLang('ja')} disabled={phase !== 'idle' && lang !== 'ja'}>
              日本語
            </button>
          </div>
        </div>
      </header>
      {showBuild && <section id="devin-story" className="card build-story">
        <div className="build-title"><h2>{lang === 'ja' ? 'Devinが実際に担当したこと' : 'What Devin actually built'}</h2><button className="chip" onClick={() => setShowBuild(false)}>{lang === 'ja' ? '閉じる' : 'Close'}</button></div>
        <p>{lang === 'ja' ? 'Devinは自身の開発環境で、このリポジトリを読み、実装し、コミットしてPRを作成しました。' : 'Devin worked in its own development environment: read our brief, implemented the app, pushed commits, and opened a pull request.'}</p>
        <ol>
          <li>{lang === 'ja' ? 'Reactの英日UI、Express API、ガイド付き会話とポリシー採点を実装。' : 'Built the bilingual React interface, Express API, guided conversations, and policy-based coaching.'}</li>
          <li>{lang === 'ja' ? '音声の基本機能、オプションのGemini連携、30件のテストを作成。' : 'Added browser speech foundations, an optional Gemini adapter, and 30 automated tests.'}</li>
          <li>{lang === 'ja' ? 'レビューで見つかった振り返り処理、否定表現、TypeScript、起動パスの問題を修正。' : 'Fixed review failures we found: transcript validation, negation handling, TypeScript compilation, and production startup paths.'}</li>
        </ol>
        <p className="muted">{lang === 'ja' ? 'TimとCodex：企画、仕様、マスコット、独立検証、黒いテーマ、アニメーション、ElevenLabs再生連携。会話と採点は現在ルールベースです。Devinは実行中の会話モデルではありません。' : 'Tim + Codex: product direction, brief, mascot, independent verification, dark theme, animation, and live ElevenLabs playback. Conversation and scoring are currently rule-based; Devin is our development agent, not the runtime chatbot.'}</p>
        <div className="build-evidence"><a href="https://app.devin.ai/sessions/ab77dc21b829467bbb93ea520a873fae" target="_blank" rel="noreferrer">Devin session ↗</a><a href="https://github.com/TLobes/AIFoundersMindsetHack/pull/1" target="_blank" rel="noreferrer">Implementation PR ↗</a><a href="https://github.com/TLobes/AIFoundersMindsetHack/blob/devin/otter-coach/docs/BUILD-PROVENANCE.md" target="_blank" rel="noreferrer">Full build record ↗</a></div>
      </section>}
      {langNote && phase !== 'idle' && <p className="note">{t(lang, 'langLocked')}</p>}

      <main className="layout">
        <section className="stage" aria-label="Otter stage">
          <div className={`otter-frame mood-${otterMood} ${speaking ? 'speaking' : ''}`}>
            <OtterMascot
              speaking={speaking || visualTalking}
              reaction={`${messages.length}-${phase}-${lang}-${showPolicy}-${voiceOn}-${listening}`}
              label={t(lang, 'imgAlt')}
            />
          </div>
          <div className="stage-controls">
            <button
              type="button"
              className={`chip ${voiceOn ? 'chip-on' : ''}`}
              onClick={() => {
                if (voiceOn) stopSpeaking();
                setVoiceOn(!voiceOn);
                setSpeaking(false);
              }}
              disabled={!voiceAvailable}
              title={voiceAvailable ? undefined : t(lang, 'speakerUnavailable')}
              aria-pressed={voiceOn}
            >
              {voiceOn ? t(lang, 'speakerOn') : t(lang, 'speakerOff')} {elevenVoice ? '· ElevenLabs' : ''}
            </button>
            <button type="button" className="chip" onClick={() => setShowPolicy(!showPolicy)} aria-expanded={showPolicy}>
              {showPolicy ? t(lang, 'hidePolicy') : t(lang, 'policySheet')}
            </button>
          </div>
          {!voiceAvailable && <p className="hint">{t(lang, 'speakerUnavailable')}</p>}

          {showPolicy && (
            <div className="policy card" data-testid="policy-sheet">
              <h3>{t(lang, 'policySheet')}</h3>
              <p className="muted">{t(lang, 'policyIntro')}</p>
              <ol>
                {POLICIES.map((p) => (
                  <li key={p.id}>
                    <strong>
                      {p.id} · {p.title[lang]}
                    </strong>
                    <span>{p.text[lang]}</span>
                  </li>
                ))}
              </ol>
              <p className="disclaimer">{scenario.disclaimer}</p>
            </div>
          )}
        </section>

        <section className="practice">
          <div className="card scenario">
            <div className="card-head">
              <span className="eyebrow">{t(lang, 'scenario')}</span>
              <h2>{scenario.title}</h2>
            </div>
            <p>{scenario.body}</p>
            <p className="disclaimer">{scenario.disclaimer}</p>
            {phase === 'idle' && (
              <button type="button" className="primary" onClick={start} data-testid="start">
                {t(lang, 'start')}
              </button>
            )}
          </div>

          {phase !== 'idle' && (
            <div className="card chat">
              <div className="transcript" ref={transcriptRef} aria-label={t(lang, 'ariaTranscript')} aria-live="polite">
                {messages.map((m, i) => (
                  <div key={i} className={`bubble ${m.role}`}>
                    <span className="who">{m.role === 'customer' ? scenario.customer : t(lang, 'you')}</span>
                    <p>{m.content}</p>
                  </div>
                ))}
                {busy && phase === 'active' && <p className="typing">{t(lang, 'sending')}</p>}
              </div>

              {phase === 'active' && (
                <form
                  className="composer"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void send();
                  }}
                >
                  <div className="composer-row">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value.slice(0, MAX_MESSAGE_CHARS))}
                      placeholder={t(lang, 'placeholder')}
                      aria-label={t(lang, 'placeholder')}
                      rows={2}
                      maxLength={MAX_MESSAGE_CHARS}
                      disabled={busy || reachedMax}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                          e.preventDefault();
                          void send();
                        }
                      }}
                      data-testid="draft"
                    />
                    <div className="composer-actions">
                      <button type="button" className={`icon ${listening ? 'listening' : ''}`} onClick={toggleMic} disabled={busy || reachedMax} aria-pressed={listening} title={canRecognize ? t(lang, 'mic') : t(lang, 'micUnavailable')}>
                        {listening ? t(lang, 'micListening') : t(lang, 'mic')}
                      </button>
                      <button type="submit" className="primary" disabled={busy || reachedMax || !draft.trim()} data-testid="send">
                        {t(lang, 'send')}
                      </button>
                    </div>
                  </div>
                  <div className="composer-meta">
                    <span className="muted">
                      {t(lang, 'turns')} {traineeTurns}/{MAX_TRAINEE_TURNS} · {draft.length}/{MAX_MESSAGE_CHARS}
                    </span>
                    <button type="button" className="secondary" onClick={finish} disabled={!canFinish || busy} data-testid="finish" title={canFinish ? undefined : t(lang, 'finishHint')}>
                      {t(lang, 'finish')}
                    </button>
                  </div>
                  {!canFinish && <p className="hint">{t(lang, 'finishHint')}</p>}
                  {micNote && <p className="hint">{micNote}</p>}
                </form>
              )}
              {error && (
                <p className="error" role="alert">
                  {t(lang, 'error')}: {error}
                </p>
              )}
            </div>
          )}

          {phase === 'review' && feedback && (
            <div className="card review" data-testid="review">
              <div className="card-head">
                <span className="eyebrow">{t(lang, 'reviewTitle')}</span>
                <h2>
                  {feedback.total} <small>/ {feedback.possible}</small>
                </h2>
              </div>
              <p>{feedback.summary}</p>
              <p className="muted source">{feedback.mode === 'gemini' ? t(lang, 'feedbackSourceGemini') : t(lang, 'feedbackSourceGuided')}</p>
              <ul className="criteria">
                {feedback.criteria.map((c) => (
                  <li key={c.id} className={c.earned === c.possible ? 'full' : c.earned > 0 ? 'partial' : 'none'}>
                    <div className="crit-head">
                      <strong>
                        {c.id} · {c.title}
                      </strong>
                      <span className="score">
                        {c.earned}/{c.possible}
                      </span>
                    </div>
                    <p className="ev">
                      <span className="label">{t(lang, 'evidence')}:</span> {c.evidence ? <q>{c.evidence}</q> : <em>{t(lang, 'noEvidence')}</em>}
                    </p>
                    <p>
                      <span className="label">{t(lang, 'improve')}:</span> {c.improvement}
                    </p>
                  </li>
                ))}
              </ul>
              <button type="button" className="primary" onClick={reset} data-testid="retry">
                {t(lang, 'retry')}
              </button>
            </div>
          )}
        </section>
      </main>
      <footer className="footer">{t(lang, 'footer')}</footer>
    </div>
  );
}
