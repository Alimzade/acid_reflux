# Opportunity Intelligence Debug Logging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add opt-in, secret-safe Tavily evidence diagnostics to manual Opportunity Intelligence workflow runs.

**Architecture:** A `--debug-evidence` CLI flag enables a pipeline debug callback. The pipeline emits JSON-lines only after Tavily results have been normalized and deduplicated, and the workflow exposes the flag through a manual boolean input that defaults off.

**Tech Stack:** TypeScript, Node.js, Vitest, GitHub Actions YAML.

## Global Constraints

- Debug logging is disabled by default and for scheduled runs.
- Never log API keys, authorization headers, complete provider bodies, full prompts, or full model responses.
- Evidence excerpts are whitespace-normalized and capped at 200 characters.
- Debug logging must not change evidence validation, synthesis, or publishing behavior.
- Repository agents must not run `git add`, `git commit`, or `git push`; the user performs integration commands.

---

### Task 1: CLI Debug Flag

**Files:**
- Modify: `automation/opportunity-intelligence/pipeline.test.ts`
- Modify: `automation/opportunity-intelligence/run.ts`

**Interfaces:**
- Produces: `CliArguments.debugEvidence: boolean`
- Produces: `CliDependencies.debugLog?: (message: string) => void`
- Consumes: `runOpportunityPipeline({ debugLog })`

- [x] **Step 1: Write the failing CLI tests**

Extend the flag parser expectations to require:

```ts
expect(parseCliArgs(['--kind', 'daily'])).toEqual({
  kind: 'daily',
  dryRun: false,
  debugEvidence: false,
});
expect(parseCliArgs(['--kind=daily', '--debug-evidence'])).toEqual({
  kind: 'daily',
  dryRun: false,
  debugEvidence: true,
});
expect(() => parseCliArgs([
  '--kind=daily',
  '--debug-evidence',
  '--debug-evidence',
])).toThrow('Duplicate flag: --debug-evidence');
```

- [x] **Step 2: Verify RED**

Run: `npm.cmd test -- automation/opportunity-intelligence/pipeline.test.ts`

Expected: FAIL because `debugEvidence` is absent and `--debug-evidence` is unknown.

- [x] **Step 3: Implement the parser and forwarding**

Add `debugEvidence` to `CliArguments`, parse the unique boolean flag, and pass a debug callback only when enabled:

```ts
debugLog: parsed.debugEvidence
  ? (message) => log(message)
  : undefined,
```

- [x] **Step 4: Verify GREEN**

Run: `npm.cmd test -- automation/opportunity-intelligence/pipeline.test.ts`

Expected: all pipeline and CLI tests pass.

---

### Task 2: Safe Tavily Evidence Diagnostics

**Files:**
- Modify: `automation/opportunity-intelligence/pipeline.test.ts`
- Modify: `automation/opportunity-intelligence/pipeline.ts`

**Interfaces:**
- Consumes: `RunOpportunityPipelineOptions.debugLog?: (message: string) => void`
- Produces: JSON-lines with `type: "opportunity-debug-summary"` or `type: "opportunity-debug-evidence"`

- [x] **Step 1: Write failing enabled/disabled diagnostics tests**

Run the pipeline with a collecting `debugLog` and assert one summary plus normalized evidence lines. Require evidence output shaped as:

```ts
{
  type: 'opportunity-debug-evidence',
  id: 'evidence-001',
  lane: 'build',
  topic: expect.any(String),
  title: expect.any(String),
  url: expect.stringMatching(/^https:\/\//),
  domain: expect.any(String),
  publishedAt: expect.any(String),
  tier: expect.any(Number),
  primary: expect.any(Boolean),
  excerpt: expect.stringMatching(/^.{1,200}$/s),
}
```

Also run without `debugLog` and assert no diagnostic callback is invoked. Include a source statement longer than 200 characters and containing repeated whitespace to verify normalization and truncation.

- [x] **Step 2: Verify RED**

Run: `npm.cmd test -- automation/opportunity-intelligence/pipeline.test.ts`

Expected: FAIL because the pipeline option and messages do not exist.

- [x] **Step 3: Implement diagnostic serialization**

After `buildSynthesisEvidence`, invoke the callback inside a non-throwing helper. Emit a summary containing query, success, failure, evidence, and qualifying-primary counts, followed by one JSON line per evidence record. Derive `domain` with `new URL(record.url).hostname`, normalize whitespace, and truncate excerpts with `.slice(0, 200)`.

- [x] **Step 4: Verify GREEN and secret safety**

Run: `npm.cmd test -- automation/opportunity-intelligence/pipeline.test.ts`

Expected: all tests pass; assertions confirm no configured Tavily/Gemini/xAI secret occurs in any debug line.

---

### Task 3: Manual Workflow Control and Full Verification

**Files:**
- Modify: `automation/opportunity-intelligence/workflow.test.ts`
- Modify: `.github/workflows/opportunity-intelligence.yml`
- Modify: `README.md`

**Interfaces:**
- Produces: `workflow_dispatch.inputs.debug_evidence` boolean, default `false`
- Consumes: CLI `--debug-evidence`

- [x] **Step 1: Write the failing workflow test**

Assert the workflow contains the input and conditional flag forwarding:

```ts
expect(workflow).toContain('debug_evidence:');
expect(workflow).toContain('default: false');
expect(workflow).toContain('inputs.debug_evidence');
expect(workflow).toContain('--debug-evidence');
```

- [x] **Step 2: Verify RED**

Run: `npm.cmd test -- automation/opportunity-intelligence/workflow.test.ts`

Expected: FAIL because the input and CLI forwarding are absent.

- [x] **Step 3: Implement workflow forwarding and documentation**

Add the manual boolean input. Resolve a shell `debug_flag` only for `workflow_dispatch` when the input is true, expose it as an output, and append it to both dry-run and production CLI invocations. Document that debug logs are public, opt-in, normalized, truncated, and secret-redacted.

- [x] **Step 4: Run complete verification**

Run:

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run intelligence:validate
git diff --check
```

Expected: 135 or more tests pass, only Firestore emulator tests are skipped, build succeeds, both report files validate, and `git diff --check` reports no errors.

- [x] **Step 5: Hand off integration**

Report changed files and verification results. Do not stage, commit, or push. Provide commit commands only after the user explicitly requests them.
