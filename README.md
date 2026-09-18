# AIFoundersMindsetHack

<p align="center"><img src="public/otter-coach.png" alt="Otter Coach holding a laptop" width="320"></p>

**[Open the live Otter Coach demo](https://otter-coach-gray.vercel.app)**

Planning workspace for the AI Founders Mindset / Datadog AI Agents Hackathon, September 18, 2026, Tokyo.

**Status: working guided demo, independently verified in English and Japanese.**

Current product: **Otter Coach**, a bilingual customer-service practice app. See the [current build brief](docs/BUILD-BRIEF.md), which supersedes earlier concept proposals.

## Run Otter Coach

```bash
npm install
npm run dev        # client http://localhost:5173 (proxies /api), server http://localhost:3001
npm test           # vitest: rule engine, scorer, API validation
npm run build && npm start   # production: Express serves dist/client on :3001
```

Without `GEMINI_API_KEY` the app runs in **Guided demo** mode: the customer (Alex) and the feedback are deterministic rules, clearly labelled as not AI. Setting `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) on the server enables the optional Gemini adapter; `ELEVENLABS_API_KEY` enables ElevenLabs playback through the UI voice toggle. Browser `speechSynthesis` / `SpeechRecognition` need no keys. See `.env.example` for names; the server loads an ignored local `.env` file on startup (Node 22+ required). The scenario and policies are fictional training material.

## Demo and engineering evidence

- [Demo script with English and Japanese sample responses](docs/DEMO-SCRIPT.md)
- [Build provenance and actual Devin session](docs/BUILD-PROVENANCE.md)
- [Devin implementation PR](https://github.com/TLobes/AIFoundersMindsetHack/pull/1)
- [Devin assessment](docs/DEVIN-ASSESSMENT.md)

Earlier concept exploration is retained in `docs/HACKATHON-PLAN.md`, `docs/SOLO-STRATEGY.md`, and `docs/DEVIN-PROMPTS.md`; the current build brief supersedes those proposals.

The supplied builder playbook lists **19:55 JST submission**, earlier than the event listing's 20:45. Plan around 19:55 until organizers confirm. The playbook permits meaningful use of Devin during development; runtime API integration is not a stated award requirement.

Research checked September 18, 2026 against official product documentation. Devin has created the implementation PR. Live Gemini and ElevenLabs integrations have not been tested; guided mode requires neither service. The original playbook, credentials, and redemption codes are not included in this repository.

## Hosting

Deployed on Vercel with a Vite frontend and an Express serverless API. Set `ELEVENLABS_API_KEY` as a production secret in Vercel, then redeploy. Never use a `VITE_` prefix for provider keys. Local `.env` and `.env.devin` are excluded from Git and deployment uploads.
