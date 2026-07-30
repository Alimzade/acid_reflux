# acid_reflux

> **Uncoordinated Collaboration Project** — *Harmonious Creative Chaos*

**acid_reflux** is an experimental open-ended framework for asynchronous, uncoordinated collaboration between developers and AI agents. It explores how human-AI teams can co-create and evolve software without central management, relying on high-frequency micro-commits, shared subagent memory, and modular feature isolation.

---

## Quick Start

```bash
npm install     # Install dependencies
npm run dev     # Start local development server
```

---

## Daily Duo Quest Firebase setup

1. Create a Firebase project, then create a **Cloud Firestore** database for it.
2. Register a web app in the Firebase project and copy `.env.example` to `.env.local`.
3. Replace all six `VITE_FIREBASE_*` placeholders in `.env.local` with the web app configuration values.
4. Deploy [firestore.rules](firestore.rules) using the Firebase console's **Rules** tab, or initialize the Firebase CLI with `firebase init firestore` and run `firebase deploy --only firestore:rules`.

The quest works without Firebase configuration, but sync is disabled until every variable is set. These rules deliberately permit unauthenticated reads and structurally valid writes for the two-person shared quest. That means anyone who discovers the project can alter valid quest data; use Firebase Authentication and identity-based rules before using this pattern for private or sensitive data.

Firestore rules tests require a local Java runtime with `java` available on `PATH`. Install Java, then run the isolated emulator suite on Windows with:

```powershell
npm.cmd run test:rules:emulator
```

The dedicated `npm.cmd run test:rules` command expects an already-running Firestore emulator and fails clearly when `FIRESTORE_EMULATOR_HOST` is absent. The normal `npm.cmd test` suite remains usable without Java and skips only the emulator-dependent rules cases.

---

## Opportunity intelligence publishing

The repository refreshes its generated opportunity reports with GitHub Actions. The job runs at **05:30 UTC Monday through Saturday** for the daily report and at **07:00 UTC Sunday** for the weekly report. It only runs on its schedule or when an operator starts it manually, so it cannot recursively start another generation job. After a successful generated-data push, it sends one `repository_dispatch` event to the existing Pages workflow. This explicit handoff is necessary because a `GITHUB_TOKEN` push does not normally trigger another workflow; the documented `repository_dispatch` exception does. It is compatible with Spark/GitHub Pages because the reports are committed static JSON under `src/data/` before the normal Vite build.

### Setup and operator controls

Configure these two repository **Actions secrets** (never `VITE_*` variables):

- `TAVILY_API_KEY` — research API key.
- `XAI_API_KEY` — synthesis API key.

Optionally configure these repository variables. Blank variables use the defaults; numeric overrides are validated and clamped to safe bounds:

- `XAI_MODEL` — trimmed model ID; default `grok-4.3`.
- `XAI_MAX_TOKENS_DAILY` / `XAI_MAX_TOKENS_WEEKLY` — defaults `2200` / `4000`, clamped to `256–8000`.
- `XAI_REASONING_EFFORT_DAILY` / `XAI_REASONING_EFFORT_WEEKLY` — defaults `low` / `medium`; accepted values are `low`, `medium`, or `high`.
- `OPPORTUNITY_MAX_QUERIES` — maximum query families per run, clamped to `2–5` daily and `2–8` weekly; every capped pack retains both Build and Career queries.
- `TAVILY_MAX_RESULTS_PER_QUERY` — maximum results per query, clamped to `1–10`.

To validate a run, open **Actions → Refresh Opportunity Intelligence → Run workflow**, select `daily` or `weekly`, leave **dry_run** enabled (the default), then inspect the logs and generated report summary. A real dry run still calls Tavily and xAI, requires both secrets, and consumes provider credits; it only prevents the generated report from being written, committed, or pushed. Automated tests use recorded fixtures and intercepted requests, so they make no provider calls. Disable **dry_run** only after the output is acceptable. Scheduled jobs use the same production path and publish only a changed, valid report.

The default budget is **5 Tavily searches × 10 results** for daily and **8 × 10** for weekly. Each run normally makes **one xAI request** and at most **two** when the first structured response needs its single validation-repair attempt. Daily xAI requests use `max_tokens: 2200` with `reasoning_effort: low`; weekly requests use `max_tokens: 4000` with `reasoning_effort: medium`. CLI summaries log only sanitized request counts and provider token-usage counts across both attempts—never prompts, source content, response content, or secrets.

Tavily requests follow the current news-search contract: `Authorization: Bearer …`, `topic: news`, advanced depth, disabled answer/raw-content fields, an exact UTC `start_date`, and an exclusive `end_date` set to the next UTC calendar day after the injected run time. The API key is never placed in the JSON body, and undated or future-dated results are discarded during normalization. xAI uses the Chat Completions-compatible `max_tokens` and `reasoning_effort` fields.

Generated files are automation-owned: `src/data/opportunity-daily.json` and `src/data/opportunity-weekly.json`. Do not hand-edit them; the last known good committed report remains live when generation, validation, or publishing fails.

### Troubleshooting

- **401:** confirm the relevant Actions secret exists, is current, and is scoped to this repository; do not copy it into a `VITE_*` variable.
- **429:** wait for the provider's rate-limit window, then run one dry run before retrying a production publish.
- **Invalid report:** review the workflow's validation error and source-quality logs. The job deliberately leaves the prior report in place.
- **No evidence:** broaden or revise the underlying query pack; no unsupported report is published. Collection requires at least half of query families to succeed, two unique qualifying primary sources, and qualifying primary evidence in both Build and Career lanes.
- **Protected-branch push failure:** allow the `github-actions[bot]` workflow token to write generated data on `main`, or use the repository's approved automation bypass. The workflow retries a rebase/push once and then fails visibly.

---

## Workflow & Deployment Pipeline

```
┌─────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  Git Push to Main       │ ──> │   Automated CI Build   │ ──> │  GitHub Pages Deploy   │
│  (origin/main)          │     │   (Vite static dist)   │     │  (alimzade.github.io)  │
└─────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

- **Deployment Pipeline:** Pushing code changes to the `main` branch automatically triggers the static site build and deploys the output to GitHub Pages.
- **Live GitHub API Integration:** The Chess Timeline queries the live GitHub REST API (`api.github.com/repos/Alimzade/acid_reflux/commits`) to dynamically render repository commits.
- **SPA Routing Pipeline:** Clean HTML5 path routing is preserved on static hosts via `public/404.html` and history state restoration in `index.html`.

---

## Core Ethos & Git Etiquette

- **Uncoordinated Harmony:** Autonomous contributors build asynchronously without rigid managerial bottlenecks.
- **Continuous AI Integration:** Subagent skills and operational rules are stored in `.agents/` for collective AI memory.
- **Git Protocol:** Commit small, push often, and run `git pull --rebase` before every push.
