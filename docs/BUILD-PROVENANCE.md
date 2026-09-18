# Build provenance

## Devin

- [Actual build session](https://app.devin.ai/sessions/ab77dc21b829467bbb93ea520a873fae)
- Repository: TLobes/AIFoundersMindsetHack
- Assigned scope: core React/Express application, bilingual guided conversation, policy feedback, optional model adapter, browser speech, and tests.
- Branch requested: devin/otter-coach
- API session cap: 3 ACU. This is not a verified dollar conversion.
- Requested delivery: pushed commits and draft PR, no automatic merge/deploy.

Delivered [PR #1](https://github.com/TLobes/AIFoundersMindsetHack/pull/1) with the React/Express implementation and tests. Initial delivery had a TypeScript error, a feedback endpoint that rejected the UI transcript, and a production output-path mismatch. Codex reported these concrete failures; Devin implemented corrections in its own environment.

Independent local verification at corrective commit `299a9b2`:
- TypeScript check, 30 tests, and production compilation passed.
- English and Japanese three-turn conversations reached feedback with exact trainee quotations; retry returned to the start screen.
- Japanese sample scored 100/100; English sample scored 90/100, illustrating the limitations of phrase-based detection.
- Mobile 390px and desktop 1440px layouts checked for horizontal overflow; none observed. Browser error log was empty.
- Production startup still required an output-path fix at this checkpoint; final verification is recorded below.

Runtime limitations: no live Gemini or ElevenLabs requests were tested. Speech recognition and audible playback were not independently verified. Typed input is the verified demo path. The optional ElevenLabs backend endpoint is not wired into the browser voice toggle; that toggle uses browser speech synthesis.

## Codex

Product research, judge relevance research, specification, reference-photo inspection, illustration direction, integration, review, and independent verification. Changes made after Devin's delivery must be distinguished from Devin's original implementation.

## Mascot

Built-in image-generation tool. References: user-provided otter plush and sticker photographs, converted locally from HEIC to PNG for viewing. Originals unchanged.

Final generation prompt: Create one production-ready mascot illustration for Otter Coach, using the plush for caramel/cream colors and the sticker for bold cocoa outlines. Friendly rounded otter holding a small silver laptop, gentle encouraging expression, rounded ears, dark eyes and nose, simple whiskers, full character centered with margins, subtle soft shading and transparent background. No corporate logo, text, watermark, scenery, or UI.

Final asset: `public/otter-coach.png`, generated with the built-in tool and copied into this workspace. Transparent background, caramel/cream palette, laptop pose; visually inspected before integration.


## Final local verification

Devin commit `09590b5` corrects TypeScript output to `dist`, making `npm start` resolve the server and static client correctly. Codex independently rebuilt, started the production server, and opened the served UI with its guided-mode API status successfully.

Codex's subsequent changes are the user-requested black projector theme, larger sans-serif text, laptop-first side-by-side layout, and documentation corrections. These are separate from Devin's implementation. The 1280px laptop layout measured two non-overlapping columns and no horizontal overflow. TypeScript and production build passed after the theme change.

Local production demo: `http://localhost:3002` (started with `PORT=3002 npm start`). Development preview remains `http://localhost:5173`. Both need the local server process running. No public deployment was performed.
