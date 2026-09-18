# Devin: practical assessment for this hackathon

Research date: September 18, 2026. This is a documentation-based assessment, not a hands-on benchmark. Product features below are vendor-documented; feasibility judgments are our assessment. No Devin session has been run for this project yet.

## Recommendation

Use Devin Desktop or CLI as a substantial development tool immediately after account redemption. Give it one precisely scoped implementation task with observable acceptance criteria. Capture its actual changes and test results for the demo. Make runtime Devin integration a stretch goal, gated on a working authenticated smoke test and enough time to finish a real task.

This follows the event's practical constraints: the supplied playbook recommends Desktop/CLI and says meaningful use during development can qualify for the Cognition Award. It does not require every partner tool or an API integration. Award eligibility remains the organizers' decision.

## What Devin can do

| Surface | Documented capability | Implication tonight |
| --- | --- | --- |
| Cloud | Agent with shell, editor, browser; writes, executes, and tests code | Useful for a bounded task that can end in a reviewable PR |
| Desktop/CLI | Interactive work against local files and environment; CLI can hand off to cloud | Lowest setup burden if the local runtime already works |
| GitHub | Repository access, branches, PRs, review interaction | Gives concrete evidence of Devin's contribution |
| Ask Devin / DeepWiki | Repository exploration and codebase questions | Helpful on existing code; less valuable for an empty repository |
| Knowledge / Playbooks | Persistent project context and reusable task instructions | Useful beyond tonight; a concise repository brief is enough for the first build |
| API | Programmatic session creation and management | Enables alert-to-repair workflows, but adds entitlement and lifecycle work |
| MCP | Authenticated access to sessions, knowledge, playbooks, schedules, and repository documentation | Possible orchestration bridge; not needed for the core demo |

Sources: [introduction](https://docs.devin.ai/get-started/devin-intro), [CLI](https://docs.devin.ai/work-with-devin/devin-cli), [GitHub](https://docs.devin.ai/integrations/gh), [MCP](https://docs.devin.ai/work-with-devin/devin-mcp).

## Strengths and limitations

Devin is well suited to a defined engineering job: reproduce a bug, add its regression test, implement a bounded feature, or wire an unfamiliar API with clear expected behavior. Cognition emphasizes explicit success criteria, relevant context, and executable verification. It can use a browser to exercise an application and record evidence. This makes it a plausible engineering worker behind a product as well as a tool used to build one.

The main hackathon risks are setup time, unclear specifications, debugging loops, and asynchronous task duration. We have not measured its speed or success rate on this repository. Vendor statements about broad engineering ability are not a deadline guarantee. Avoid assigning an entire product as an unbounded task and waiting until judging to inspect the output. Require a visible checkpoint after the first small working slice.

Use specific prompts: desired input/output, exact scope, exclusions, a reproducible fixture, and the command or user journey that proves completion. Have the agent report what passed, what failed, and what it could not test. [Task guidance](https://docs.devin.ai/essential-guidelines/when-to-use-devin), [prompt guidance](https://docs.devin.ai/essential-guidelines/instructing-devin-effectively).

## API and MCP: current implementation details

The current API uses v3 organization-scoped routes such as `POST https://api.devin.ai/v3/organizations/{org_id}/sessions`. v1/v2 are documented as legacy and receive no new features. Prefer v3 for new integration. Authentication supports service-user credentials and personal access tokens; permissions and organization context matter.

The session creation reference exposes repository selection, playbooks, structured-output schemas, session secrets, tags, and `max_acu_limit`. Responses include session links and PR information. A session launch is not a completed repair: persist the session ID, retrieve its state, and only show completion when actual output and verification exist. Treat retries carefully so a repeated alert does not create repeated paid sessions.

Sources: [API overview](https://docs.devin.ai/api-reference/overview), [create session](https://docs.devin.ai/api-reference/v3/sessions/post-organizations-sessions), [Teams setup](https://docs.devin.ai/api-reference/getting-started/teams-quickstart).

The official MCP endpoint is `https://mcp.devin.ai/mcp`. Its documented tools include `devin_session_create`, `devin_session_interact`, and `devin_session_gather`. It requires authentication; PATs and enterprise service-user credentials need an `X-Org-Id` header. Legacy `apk_` credentials are not supported by this MCP server. DeepWiki MCP is different: public-repository documentation, without Devin platform management. [MCP reference](https://docs.devin.ai/work-with-devin/devin-mcp).

**Unverified dependency:** the event's Max redemption does not by itself prove this account can use every organization/API feature. Test actual access before designing around it. If access is unavailable after five minutes, export a repair brief and use Devin interactively.

## Datadog and ElevenLabs fit

Cognition explicitly lists Datadog among tools connectable through its MCP marketplace. That makes a code-plus-telemetry investigation plausible, but the connection and permissions still need setup. For a custom app, Datadog's webhook integration supports monitor notifications, custom JSON payloads, and custom headers. An authenticated receiver can turn a sandbox alert into a task. [Devin integrations guidance](https://docs.devin.ai/essential-guidelines/when-to-use-devin), [Datadog webhooks](https://docs.datadoghq.com/integrations/webhooks/).

ElevenLabs offers direct text-to-speech through `POST /v1/text-to-speech/{voice_id}`. Japanese and English are supported. Use a voice appropriate to each language and generate separate language clips. TTS reads supplied text; the reasoning/translation step belongs upstream. A short spoken briefing is much simpler than building a realtime conversational voice agent. [API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert), [languages](https://elevenlabs.io/docs/help-center/other/what-languages-do-you-support).

## Pricing and event access

The official pricing page currently lists Free $0, Pro $20/month, Max $200/month, Teams $80/month plus $40/month per full developer seat, and custom Enterprise pricing. Paid plans describe usage allowances and optional extra usage. Do not assume unlimited cloud execution or translate a dollar credit into a fixed number of completed tasks. [Current pricing](https://devin.ai/pricing).

Separately, the supplied event playbook describes a unique venue code, $200 in Devin credits per participant, upgrading to Max, use across Cloud/Desktop/CLI, and a seven-day redemption deadline. Those are organizer-provided offer details; the actual checkout/account governs what is available. Use the same email as the Luma registration. Ask the venue's Cognition representative about API entitlement and credit expiration; the seven days refers to redemption, not necessarily usage expiration.

## Enterprise considerations

For this prototype, use synthetic incidents and the new repository. Give any GitHub integration access to this repository only. Keep keys server-side and in ignored local environment files; review code and test evidence before merging a repair. This keeps the proposed autonomous repair feature bounded and inspectable.

Cognition's security page says paid users can opt out of training in Data Controls, with different enterprise contractual treatment. It also acknowledges hallucinations and insecure or buggy generated code. Do not assume an individual hackathon account has enterprise data terms. [Security and data controls](https://docs.devin.ai/admin/security).

## First-use evaluation: ten minutes

1. Redeem the venue code and confirm the account's available usage.
2. Open this local project in Devin Desktop/CLI, or connect the repository to Cloud.
3. Assign a small task from `DEVIN-PROMPTS.md` with a checkpoint and test command.
4. Record time to first runnable result, whether the result passes, and interventions needed.
5. Save session/commit links and genuine evidence. Report Devin's contribution accurately.

Use this observed result to decide whether to expand Devin's role. No comparative claim against other coding agents is supported by this research alone.
