import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync(
  new URL('../../.github/workflows/opportunity-intelligence.yml', import.meta.url),
  'utf8',
);

describe('opportunity publishing workflow hardening', () => {
  it('offers opt-in Tavily diagnostics for manual runs and forwards the CLI flag', () => {
    expect(workflow).toContain('debug_evidence:');
    expect(workflow).toContain('inputs.debug_evidence');
    expect(workflow).toContain('debug_flag=--debug-evidence');
    expect(workflow).toContain('steps.options.outputs.debug_flag');
  });

  it('uses Gemini by default while retaining explicit xAI fallback configuration', () => {
    expect(workflow).toContain("LLM_PROVIDER: ${{ vars.LLM_PROVIDER || 'gemini' }}");
    expect(workflow).toContain('GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}');
    expect(workflow).toContain("GEMINI_MODEL: ${{ vars.GEMINI_MODEL || 'gemini-3.5-flash' }}");
    expect(workflow).toContain('XAI_API_KEY: ${{ secrets.XAI_API_KEY }}');
  });

  it('validates generated reports, tests, and builds after every rebase and before each push', () => {
    const firstPushSafetySequence = [
      'git pull --rebase origin main',
      'npm ci',
      'npm run intelligence:validate',
      'npm test',
      'npm run build',
      'if ! git push origin HEAD:main; then',
    ];
    const retryPushSafetySequence = [
      'git pull --rebase origin main',
      'npm ci',
      'npm run intelligence:validate',
      'npm test',
      'npm run build',
      'if ! git push origin HEAD:main; then',
    ];

    let cursor = 0;
    for (const command of firstPushSafetySequence) {
      cursor = workflow.indexOf(command, cursor);
      expect(cursor).toBeGreaterThanOrEqual(0);
      cursor += command.length;
    }
    for (const command of retryPushSafetySequence) {
      cursor = workflow.indexOf(command, cursor);
      expect(cursor).toBeGreaterThanOrEqual(0);
      cursor += command.length;
    }
    expect(workflow.match(/git push origin HEAD:main/g)).toHaveLength(2);
  });
});
