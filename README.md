# AIFoundersMindsetHack

Planning workspace for the AI Founders Mindset / Datadog AI Agents Hackathon, September 18, 2026, Tokyo.

**Status: Otter Coach implementation in progress.**

Current product: **Otter Coach**, a bilingual customer-service practice app. See the [current build brief](docs/BUILD-BRIEF.md), which supersedes earlier concept proposals.

## Run Otter Coach

```bash
npm install
npm run dev        # client http://localhost:5173 (proxies /api), server http://localhost:3001
npm test           # vitest: rule engine, scorer, API validation
npm run build && npm start   # production: Express serves dist/client on :3001
```

Without `GEMINI_API_KEY` the app runs in **Guided demo** mode: the customer (Alex) and the feedback are deterministic rules, clearly labelled as not AI. Setting `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) on the server enables the optional Gemini adapter; `ELEVENLABS_API_KEY` enables optional server speech. Browser `speechSynthesis` / `SpeechRecognition` need no keys. See `.env.example`. The scenario and policies are fictional training material.

Updated recommendation: **OtterFix**, a customer-complaint-to-verified-code-fix demo, prioritizing a visible Devin contribution for a solo builder. This remains a proposal, pending the builder's choice. Handoff is retained as an alternative.

- [Updated solo strategy and judge research](docs/SOLO-STRATEGY.md)

- [Devin assessment](docs/DEVIN-ASSESSMENT.md)
- [Ideas, scope, build plan, and demo](docs/HACKATHON-PLAN.md)
- [Copy-ready Devin prompts](docs/DEVIN-PROMPTS.md)

The supplied builder playbook lists **19:55 JST submission**, earlier than the event listing's 20:45. Plan around 19:55 until organizers confirm. The playbook permits meaningful use of Devin during development; runtime API integration is not a stated award requirement.

Research checked September 18, 2026 against official product documentation. Account entitlements, actual Devin performance, and service integrations have not been tested. The original playbook, credentials, and redemption codes are not included in this repository.
