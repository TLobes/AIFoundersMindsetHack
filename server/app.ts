import { speechText } from '../shared/speechText.js';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreConversation } from '../shared/feedback.js';
import { guidedReply } from '../shared/guided.js';
import { MAX_TRAINEE_TURNS, MIN_TRAINEE_TURNS, type ChatResponse, type ConfigResponse, type Feedback } from '../shared/types.js';
import { geminiConfigFromEnv, geminiCustomerReply, geminiFeedback, type GeminiConfig } from './gemini.js';
import { validateChatRequest } from './validate.js';

export interface AppOptions {
  gemini?: GeminiConfig | null;
  elevenLabsKey?: string | null;
  elevenLabsVoiceId?: string | null;
  serveClient?: boolean;
  fetchImpl?: typeof fetch;
}

export function createApp(opts: AppOptions = {}) {
  const gemini = opts.gemini === undefined ? geminiConfigFromEnv() : opts.gemini;
  const elevenLabsKey = opts.elevenLabsKey === undefined ? process.env.ELEVENLABS_API_KEY?.trim() || null : opts.elevenLabsKey;
  const voiceId = opts.elevenLabsVoiceId ?? process.env.ELEVENLABS_VOICE_ID?.trim() ?? 'cgSgspJ2msm6clMCkdW9';
  const f = opts.fetchImpl ?? fetch;

  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/config', (_req, res) => {
    const body: ConfigResponse = {
      mode: gemini ? 'gemini' : 'guided',
      model: gemini ? gemini.model : null,
      speech: Boolean(elevenLabsKey),
      languages: ['en', 'ja'],
      maxTraineeTurns: MAX_TRAINEE_TURNS,
      minTraineeTurns: MIN_TRAINEE_TURNS,
    };
    res.json(body);
  });

  app.post('/api/chat', async (req, res) => {
    const v = validateChatRequest(req.body);
    if (!v.ok) return res.status(400).json({ error: v.error });
    const { language, messages } = v.value;
    if (gemini) {
      try {
        const out: ChatResponse = await geminiCustomerReply(gemini, language, messages);
        return res.json(out);
      } catch (err) {
        return res.status(502).json({ error: `AI provider error: ${(err as Error).message}` });
      }
    }
    const out: ChatResponse = { ...guidedReply(language, messages), mode: 'guided' };
    return res.json(out);
  });

  app.post('/api/feedback', async (req, res) => {
    const v = validateChatRequest(req.body, { allowTrailingCustomer: true });
    if (!v.ok) return res.status(400).json({ error: v.error });
    const { language, messages } = v.value;
    const turns = messages.filter((m) => m.role === 'trainee').length;
    if (turns < MIN_TRAINEE_TURNS) return res.status(400).json({ error: `At least ${MIN_TRAINEE_TURNS} trainee messages are required for feedback.` });
    if (gemini) {
      try {
        const out: Feedback = await geminiFeedback(gemini, language, messages);
        return res.json(out);
      } catch (err) {
        return res.status(502).json({ error: `AI provider error: ${(err as Error).message}` });
      }
    }
    return res.json(scoreConversation(language, messages));
  });

  app.post('/api/speech', async (req, res) => {
    if (!elevenLabsKey) return res.status(404).json({ error: 'Server speech is not configured; use browser speechSynthesis.' });
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    if (!text || text.length > 600) return res.status(400).json({ error: 'text must be 1-600 characters.' });
    try {
      const r = await f(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, {
        method: 'POST',
        signal: AbortSignal.timeout(40000),
        headers: { 'xi-api-key': elevenLabsKey, 'content-type': 'application/json', accept: 'audio/mpeg' },
        body: JSON.stringify({ text: speechText(text), model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.4, similarity_boost: 0.75, style: 0.45, use_speaker_boost: true, speed: 1.05 } }),
      });
      if (!r.ok) return res.status(502).json({ error: `Speech provider error: HTTP ${r.status}` });
      res.setHeader('content-type', 'audio/mpeg');
      res.send(Buffer.from(await r.arrayBuffer()));
    } catch (err) {
      res.status(502).json({ error: `Speech provider error: ${(err as Error).message}` });
    }
  });

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found.' }));

  if (opts.serveClient) {
    const here = path.dirname(fileURLToPath(import.meta.url));
    const clientDir = path.resolve(here, '../client');
    app.use(express.static(clientDir));
    app.get('*', (_req, res) => res.sendFile(path.join(clientDir, 'index.html')));
  }

  return app;
}
