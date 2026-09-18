# Solo strategy: OtterFix

Updated September 18, 2026. User priorities: demonstrate Devin first, make an engaging working demo for the judges second. Enterprise domain experience is limited. No implementation has begun and no Devin session has been run by this planning work.

## Public professional research

The user supplied the judging roster. The accessible [event page](https://luma.com/bhje4xmz) confirms the enterprise-agent theme and Cognition partnership. Judge interests below are our inferences from public professional work, not statements about their scoring preferences.

| Judge | Evidence | Implication for the demo (inference) |
| --- | --- | --- |
| Jetha Chan | His own biography describes Google AI Developer Experience work with Cloud/DeepMind, Gemma, open source, and a games/software engineering background | A playful interface can work if the developer workflow is real and easy to reproduce |
| Shashank Bijwe | Japan Cloud lists him as CTO. His public profile describes prior MetLife AI leadership, fraud systems, and automated QA | Show reduced handoff work and measurable verification rather than hypothetical ROI |
| Kaoru Yoshihira | His public professional post emphasizes AI/cloud partner ecosystems. Kaori's recent event announcement identifies him as former BytePlus Head of Partner Development and ex-Google | Explain who adopts the tool and how it fits an existing engineering workflow |
| Arshal Ameen | His profile lists Rakuten Card Chief AI Officer and prior application-development/architecture leadership, emphasizing safe and scalable AI | A synthetic checkout defect with a reviewed patch and test evidence is a relevant example |

Sources:

- Jetha's [own biography](https://jethachan.net/about) and [Google developer article on AI for games](https://developers.googleblog.com/google-ai-for-game-developers/).
- Shashank's [company listing](https://japancloud.jp/en/team/) and [professional profile](https://jp.linkedin.com/in/shashankbijwe). His profile summary still describes MetLife work; the experience chronology and company listing identify the newer Japan Cloud role.
- Kaoru's [own BytePlus partner-event post](https://jp.linkedin.com/posts/kaoruyoshihira_byteplus-activity-7302548835065569281-Fepu) and [organizer announcement](https://www.linkedin.com/posts/kaori-rei-_enterpriseai-aiadoption-generativeai-activity-7504733209876951040-a5A-). The [related roundtable page](https://luma.com/07geba2n) uses a spelling variant in its body; use the user's spelling, Yoshihira.
- Arshal's [professional profile](https://jp.linkedin.com/in/arshal). Rakuten's [February 19, 2026 announcement](https://global.rakuten.com/corp/news/press/2026/0219_02.html) confirms an English/Japanese AI agent for card-statement queries. This supports the domain connection; it does not establish his personal judging preferences.

## Revised shortlist

1. **OtterFix — customer complaint to verified fix.** Strongest fit for making Devin's engineering work the central event. Scope: one toy application, one seeded bug, one real repair.
2. **OtterProof — prove a vibe-coded app works.** Devin exercises one customer journey and returns a reproducible failure, regression test, and patch. Good fit for developer experience and automated QA, but generic arbitrary-app testing is too broad for tonight.
3. **OtterBridge — repair Japan localization bugs.** A Japanese-language report exposes a date, text, or currency-formatting bug; Devin reproduces and fixes it. Strong local context; narrower and less immediately visual unless the example is chosen carefully.

Recommendation: use OtterFix with a small synthetic otter merchandise shop. This is a memorable demonstration environment for a software-maintenance product. The enterprise user is a support or engineering team, not an otter-toy retailer specifically.

## The one bug

A cart quantity is changed from one to two. The displayed total updates, but the submitted order still contains quantity one. Prices, inventory, and orders are entirely synthetic; no payment provider or real financial transaction is involved.

Customer complaint: "I selected two otters, but the confirmation only shows one."

The quantity mismatch is visible to any judge and needs no specialist domain explanation. It represents a familiar support-to-engineering problem: reproducing what the customer saw and proving the repair.

## Demo workflow

1. Show the toy shop and reproduce the discrepancy live.
2. Enter the complaint in a simple repair desk with the repository, reproduction steps, and expected behavior.
3. Give the task to Devin through Desktop/CLI or Cloud. API orchestration is optional and must be proven before it becomes a dependency.
4. Devin creates a regression test that fails on the faulty version, fixes the implementation, and reruns the test.
5. Show the genuine diff/test output, or a real PR if Cloud/GitHub access is ready.
6. Run the same cart interaction against the repaired version; quantity and total agree.

Show observed states only. Do not animate a fake running agent or declare tests passing from a timer. A thin task exporter plus visible Devin session is an honest minimum; describe it as a prototype workflow, not a fully integrated autonomous service.

## What makes it more than asking Devin to fix a bug?

The proposed product captures a reproducible complaint, expected behavior, the regression test, and before/after evidence in one repair record. Devin provides the engineering work. If only the manual handoff is finished tonight, state that clearly; automatic dispatch and retrieval are future work.

Success evidence: the same test fails before and passes after; the customer journey works; the changed code is inspectable. Measure elapsed repair time and human interventions without claiming broader productivity gains from one example.

## Solo execution budget (85 minutes)

- 0–10: confirm Devin access, make one bounded task succeed, choose local or Cloud path. Do not spend more than five minutes on API setup.
- 10–25: build the toy shop and reproduce the seeded defect; record the baseline. Freeze the defect while Devin investigates it.
- 25–50: Devin performs the real reproduction/test/fix task on a separate branch or copy. Use the time for the small repair-desk view and demo script without editing Devin's files.
- 50–65: inspect the patch, verify the same regression before/after, and connect actual evidence to the repair record.
- 65–75: add a short ElevenLabs resolution message only if the repair already works; optionally show real Datadog telemetry if it is already connected.
- 75–85: record backup, rehearse, submit. Keep using 19:55 as the deadline until the schedule discrepancy is resolved.

Devin's runtime is not guaranteed. Start the actual repair well before judging. During the two-minute pitch, show the completed session and verified results; any recording must be labeled. A live new repair is a bonus, not the critical path.

## Two-minute pitch

"Meet our newest engineer. He is small, furry, and holding a laptop."

Use an otter toy as a prop if available. Then move immediately to the problem:

"A customer says the order is wrong. Someone has to reproduce it, write a test, and prove the fix. OtterFix packages that work for Devin."

- 0–25 seconds: reproduce the quantity mismatch.
- 25–45: show the complaint and the actual Devin session/task.
- 45–85: show the failing regression, code change, and passing result.
- 85–110: repeat the customer journey successfully.
- 110–120: explain what is implemented and the next integration: automatic task dispatch and evidence retrieval.

Use a short playful introduction, then spend most of the time on evidence. Do not imply Cognition endorsement or claim the prototype can safely repair arbitrary production systems.

## Useful question for the Cognition representative beside the builder

"For an 85-minute solo demo, I want Devin to take a reproducible customer bug through a failing test to a verified patch. Should I use Desktop/CLI or Cloud with this event account, and does its credit include API access?"

This has not been sent to anyone. It is a suggested in-person question for the user.
