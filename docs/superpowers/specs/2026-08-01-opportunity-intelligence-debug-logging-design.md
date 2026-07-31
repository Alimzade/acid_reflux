# Opportunity Intelligence Optional Debug Logging

## Goal

Make it possible to inspect what Tavily returns and how the Gemini request behaves without exposing API keys, authorization headers, full prompts, or full model responses in public GitHub Actions logs.

## Operator Experience

The `Refresh Opportunity Intelligence` manual workflow gains a boolean `debug_evidence` input that defaults to `false`. Scheduled runs always leave debug logging disabled. When an operator enables it, the generation command emits a compact diagnostic block after Tavily collection and before Gemini synthesis.

For each normalized, deduplicated evidence record, the debug block includes:

- Evidence ID
- Headline
- Direct URL and domain
- Publication timestamp
- Build or Career radar lane
- Query topic
- Source tier and primary-source status
- A whitespace-normalized factual excerpt limited to 200 characters

The block also reports aggregate counts for query families, successful and failed searches, raw results, normalized evidence, qualifying primary evidence, and records passed to synthesis. Gemini diagnostics include the provider name, model, HTTP attempt number, retryable status code, and final outcome.

## Safety Boundaries

Debug output is opt-in and intended to be temporary. It must never contain:

- Tavily, Gemini, or xAI API keys
- Authorization or API-key headers
- Complete Tavily response bodies
- Full Gemini prompts or responses
- Stack traces containing request configuration

All diagnostic values pass through the existing secret-redaction and whitespace-compaction boundary. Excerpts are capped at 200 characters. Debug logging does not change evidence validation, ranking, report validation, or publishing decisions.

## Architecture

The CLI accepts a `--debug-evidence` flag. The GitHub Actions input maps to that flag only for manual workflow runs. The pipeline receives an optional debug logger callback so evidence diagnostics remain testable and do not depend directly on `console.log`.

The pipeline logs normalized evidence only after canonicalization, date filtering, and deduplication. This makes console output match the records actually supplied to Gemini instead of showing discarded raw search noise.

Gemini retry diagnostics belong in the provider adapter. The adapter will report retryable transport statuses without logging response bodies beyond the existing sanitized error summary. Automatic retry behavior is outside this feature unless separately approved; this feature only exposes attempts made by the current adapter.

## Failure Behavior

Debug logging is observational. A logging failure must not alter provider behavior or report publication. Invalid CLI combinations fail before any provider call. With debug disabled, output remains the current single sanitized JSON summary or error.

## Testing

Automated tests will verify:

- The CLI parses and forwards `--debug-evidence`.
- The workflow defaults debug mode to off and forwards it only when selected manually.
- Enabled debug output contains normalized evidence metadata and capped excerpts.
- Disabled debug mode emits no evidence diagnostics.
- Secrets and full content never appear in debug or error output.
- Existing pipeline, report validation, and provider tests remain green.

## Scope

This change adds temporary, opt-in GitHub Actions console diagnostics only. It does not add a homepage research feed, persist raw Tavily results, change provider selection, or change scheduled publishing behavior.
