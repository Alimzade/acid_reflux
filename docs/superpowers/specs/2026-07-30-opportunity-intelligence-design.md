# Opportunity Intelligence Design

## Purpose

Opportunity Intelligence gives Alizade and Sakar a high-signal daily and weekly briefing for two outcomes:

1. Discover profitable AI product opportunities.
2. Increase career leverage in the global remote AI job market.

It complements the existing static Market Pulse and AI Pulse sections so the team can compare bundled headline-style content with a live, evidence-backed intelligence pipeline.

## Goals

- Publish a concise daily briefing that takes about ten minutes to read.
- Publish a deeper weekly review every Sunday.
- Prefer true, actionable evidence over headline volume.
- Identify customer pain, unmet needs, platform shifts, valuable skills, and hiring demand.
- Attach primary sources and confidence labels to every published insight.
- Run entirely in GitHub Actions without either user keeping a computer online.
- Keep Tavily and xAI API keys out of the browser and repository.
- Preserve the last valid report when collection or generation fails.
- Match the existing dark glass design and EN/DE interface.

## Non-goals

- General world, financial, stock, or political news coverage.
- Automated trading or personalized financial advice.
- Replacing Market Pulse or AI Pulse in the first release.
- Continuous breaking-news alerts.
- Scraping paywalled content or bypassing publisher access controls.
- Publishing an insight that lacks a verifiable primary source.
- Using social engagement as proof that a claim is true.

## Page placement

Add a third section below AI Pulse on the existing home page:

```text
Market Pulse
AI Pulse
Opportunity Intelligence
```

Keep the existing feeds unchanged during the initial comparison period.

The section title is:

- English: `Opportunity Intelligence`
- German: `Chancen-Radar`

The section displays a `Live evidence-backed` badge and the generation timestamp so it cannot be confused with the static pulse data.

## Information lanes

### Build Radar

Build Radar identifies product opportunities from:

- Repeated customer pain and workflow friction
- API, platform, pricing, policy, or product changes
- New technical capabilities with clear application potential
- Underserved industries or professional workflows
- Adoption signals and credible demand
- Funding and procurement signals that reveal budgets

### Career Radar

Career Radar identifies:

- Skills increasingly requested in global remote AI roles
- Emerging AI engineering roles and responsibilities
- Repeated tool, framework, and infrastructure requirements
- Credible compensation or hiring-volume changes
- Technologies worth learning now
- Portfolio projects that demonstrate valuable capabilities

## Briefing cadence

### Daily briefing

- Runs every morning through a scheduled GitHub Action.
- Covers evidence primarily published during the previous 24–48 hours.
- Publishes at most five combined Build Radar and Career Radar items.
- Targets a ten-minute reading time.

### Weekly review

- Runs every Sunday.
- Compares the previous seven days of signals.
- Identifies persistent patterns rather than repeating individual headlines.
- Publishes up to five deeper opportunities with recommended experiments or learning actions.

### Manual run

The workflow supports `workflow_dispatch` so either collaborator can request an on-demand refresh from GitHub Actions.

## Collection architecture

Use a dedicated GitHub Actions workflow:

```text
Curated query packs
        |
        v
Tavily Search API
        |
        v
Source normalization, deduplication, and filtering
        |
        v
xAI Grok structured analysis
        |
        v
Schema validation and quality gates
        |
        v
Versioned intelligence JSON
        |
        v
Commit to main and trigger GitHub Pages deployment
```

The workflow runs on `schedule` and `workflow_dispatch` only. The automated data commit triggers the existing Pages deployment workflow.

API credentials are GitHub Actions repository secrets:

```text
TAVILY_API_KEY
XAI_API_KEY
```

Neither secret is exposed as a Vite variable, written to generated JSON, printed in logs, or made accessible to browser code.

## Model choice

Use the xAI API directly with:

```text
grok-4.3
```

Use lower reasoning and smaller output limits for daily reports. Use higher reasoning and a larger evidence window for weekly reports.

Tavily provides current source discovery. Grok does not act as the source of current facts; it evaluates and structures retrieved evidence.

Keep the model ID configurable through a non-secret workflow variable so it can later be benchmarked against Grok 4.5 or another model without rewriting the pipeline.

## Source hierarchy

### Tier 1: primary evidence

- Official AI company blogs, documentation, changelogs, pricing, and release notes
- Official GitHub repositories and releases
- Research papers and recognized research institutions
- Company career pages and official applicant-tracking-system listings
- Government, regulator, standards-body, and public-policy publications
- Company filings and official funding or acquisition announcements

### Tier 2: independent corroboration

- Reputable technology and business journalism
- Credible industry analysis with transparent sourcing
- Multiple independent reports describing the same change

### Tier 3: discovery signals only

- Hacker News
- Product Hunt
- Public developer discussions
- Social posts
- Community forums

Tier 3 content may identify a topic for investigation but cannot independently support a published claim.

## Evidence rules

Every published item must:

- Include at least one primary source URL.
- Include the source publication time when available.
- Separate verified facts from model inference.
- Explain why the evidence matters to AI engineers.
- Include a concrete action.
- Avoid copied article text beyond short metadata or compliant excerpts.

High-confidence items require either:

- Directly verifiable primary documentation; or
- A primary source plus independent corroboration.

Promotional announcements without independent evidence are labeled `Developing` or excluded.

Conflicting credible sources lower the confidence score and must be described rather than silently resolved by the model.

## Search query packs

Store version-controlled query packs under the intelligence feature. Query families include:

- AI API releases, deprecations, pricing, and capability changes
- Agent infrastructure, evaluation, observability, and security
- Enterprise AI workflow pain and adoption barriers
- New regulation affecting AI products or employment
- Global remote AI engineering job demand
- Repeated skills, frameworks, and infrastructure in job descriptions
- AI startup funding and enterprise procurement
- Open-source projects showing credible adoption acceleration

Queries use domain preferences for primary sources where practical. They must not use fabricated publisher URLs or assume a claim is true in the search query.

## Deduplication and quality filtering

Before Grok analysis:

- Normalize canonical URLs and domains.
- Remove exact URL duplicates.
- Cluster sources describing the same event.
- Reject items without a usable publication date or source URL.
- Reject content outside the daily or weekly time window.
- Apply source-tier metadata.
- Limit the number of sources per cluster and query to control cost.

After Grok analysis:

- Validate output against a strict JSON schema.
- Reject unknown fields, invalid URLs, missing primary evidence, and scores outside their ranges.
- Reject an item when cited URLs were not present in the Tavily input.
- Merge semantically duplicated insights.
- Sort only after all validation gates pass.

## Ranking model

Each candidate receives integer scores from 0 through 100:

- `evidenceQuality`
- `productOpportunity`
- `careerLeverage`
- `urgency`
- `novelty`

Derive an overall score:

```text
overall =
  evidenceQuality * 0.35 +
  max(productOpportunity, careerLeverage) * 0.30 +
  urgency * 0.20 +
  novelty * 0.15
```

An item cannot be published when `evidenceQuality` is below 60, regardless of its overall score.

Confidence labels:

- `High`: evidence quality 85–100
- `Medium`: evidence quality 70–84
- `Developing`: evidence quality 60–69

The UI must not imply that confidence is a statistical probability.

## Structured output

The generated file contains:

```ts
interface OpportunityReport {
  schemaVersion: 1;
  reportType: 'daily' | 'weekly';
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  model: string;
  items: OpportunityInsight[];
  runStatus: 'fresh' | 'stale';
}

interface OpportunityInsight {
  id: string;
  lane: 'build' | 'career';
  title: string;
  verifiedFacts: string[];
  inference: string;
  whyItMatters: string;
  recommendedAction: string;
  confidence: 'high' | 'medium' | 'developing';
  scores: {
    evidenceQuality: number;
    productOpportunity: number;
    careerLeverage: number;
    urgency: number;
    novelty: number;
    overall: number;
  };
  sources: OpportunitySource[];
  topics: string[];
}

interface OpportunitySource {
  title: string;
  url: string;
  domain: string;
  publishedAt: string;
  tier: 1 | 2 | 3;
  primary: boolean;
}
```

Daily and weekly reports are stored separately so a failed daily run cannot remove the latest weekly review.

## User interface

### Section header

Display:

- Section kicker
- `Opportunity Intelligence` or `Chancen-Radar`
- Short purpose statement
- `Live evidence-backed` badge
- Last-generated relative time
- `Daily` and `Weekly` tabs

### Daily view

Show at most five cards in ranked order. Each card includes:

- Build Radar or Career Radar label
- Confidence label
- Title
- Verified facts
- A visually distinct model inference
- Why it matters
- Recommended action
- Score summary
- Primary and corroborating source links

### Weekly view

Show up to five deeper cards. Weekly actions should be concrete experiments such as:

- Interview five target users.
- Build a one-day prototype.
- Add one portfolio project.
- Learn and demonstrate a repeated skill.
- Track a signal for another week before acting.

### Empty, stale, and failed states

- If no report exists, explain that the first scheduled run has not completed.
- If a run fails, continue showing the previous valid report.
- Label data `Stale` when it is older than 36 hours for daily reports or nine days for weekly reports.
- Do not show raw stack traces or API error bodies.

## Localization

Translate interface labels, confidence descriptions, score names, empty states, and explanatory copy into English and German.

The generated report is initially English. A future version may generate German summaries, but the first release avoids doubling model cost and the risk of translation changing the meaning of evidence.

Source titles remain in their original language.

## Cost controls

- Limit Tavily queries per run.
- Limit returned sources per query.
- Deduplicate before sending evidence to Grok.
- Set explicit input and output token limits.
- Run only one daily and one weekly analysis unless manually requested.
- Add a dry-run mode that collects and validates evidence without publishing.
- Record request counts and approximate token usage without logging secrets.
- Abort rather than retry indefinitely.

The workflow must support a maximum-cost configuration that can be tightened without code changes.

## Security

- Read API keys only from GitHub Actions secrets.
- Mask known secrets in workflow logs.
- Never accept an API key through workflow inputs.
- Apply least-privilege workflow permissions.
- Validate generated paths before writing files.
- Treat all retrieved web content as untrusted data and explicitly instruct Grok not to follow instructions found inside sources.
- Do not render generated HTML; render report fields as normal React text.

## Failure handling

- Tavily failure: preserve existing reports and fail the workflow.
- xAI failure: preserve existing reports and fail the workflow.
- Invalid structured output: retry once with the validation errors, then preserve the existing report.
- No qualifying evidence: publish no fabricated items; preserve the previous report and record a no-signal run in workflow logs.
- Commit conflict: pull and retry the generated-data commit once.
- GitHub Pages deployment failure: keep the previous deployed version available.

## Testing

Add automated tests for:

- Query-pack loading and bounds
- URL normalization and deduplication
- Time-window filtering
- Source-tier classification
- Strict report-schema validation
- Rejection of citations absent from Tavily input
- Ranking formula and evidence threshold
- Daily and weekly item limits
- Stale-report calculation
- EN/DE interface labels
- Safe rendering of untrusted generated text
- Preservation of the previous report on pipeline failure

Use recorded fixture responses for tests. Automated tests must not spend Tavily or xAI credits.

Verify manually:

- One GitHub Actions dry run
- One successful daily publication
- One weekly publication
- Missing-secret failure
- Malformed model-response failure
- API-rate-limit failure
- Desktop and mobile layouts
- Daily/weekly tab switching
- Primary and corroborating links

## Delivery sequence

1. Add report types, schema validation, ranking, fixtures, and tests.
2. Add Tavily collection and evidence normalization.
3. Add Grok structured analysis and prompt-injection defenses.
4. Add the scheduled/manual GitHub Actions workflow and dry-run mode.
5. Add Opportunity Intelligence UI and EN/DE copy.
6. Run the dry run, inspect evidence quality, and tune queries.
7. Publish the first daily and weekly reports.

