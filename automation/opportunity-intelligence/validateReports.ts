import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  validateOpportunityReport,
  validateOpportunityReportFile,
} from '../../src/features/opportunity-intelligence/reportSchema';
import type { OpportunityReport } from '../../src/features/opportunity-intelligence/types';
import { classifyEvidenceSource } from './evidence';
import type { QueryKind } from './queryPacks';

const reportKinds = ['daily', 'weekly'] as const satisfies readonly QueryKind[];

export interface ReportValidationSummary {
  validatedReports: number;
  generatedReports: number;
  bootstrapReports: number;
}

export async function validateGeneratedReports(outputDir: string): Promise<ReportValidationSummary> {
  let generatedReports = 0;
  let bootstrapReports = 0;

  for (const kind of reportKinds) {
    const path = resolve(outputDir, `opportunity-${kind}.json`);
    let candidate: unknown;
    try {
      candidate = JSON.parse(await readFile(path, 'utf8'));
    } catch (error) {
      throw new Error(`${kind} report is not readable JSON: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (typeof candidate === 'object'
      && candidate !== null
      && 'runStatus' in candidate
      && candidate.runStatus === 'awaiting-first-run') {
      const validation = validateOpportunityReportFile(candidate);
      if (!validation.ok) {
        throw new Error(`${kind} bootstrap report is invalid: ${validation.errors.join('; ')}`);
      }
      bootstrapReports += 1;
      continue;
    }

    const report = candidate as OpportunityReport;
    const sources = Array.isArray(report.items)
      ? report.items.flatMap((item) => Array.isArray(item.sources) ? item.sources : [])
      : [];
    const allowedUrls = new Set(sources.map((source) => source.url));
    const directlyVerifiableUrls = new Set(
      sources
        .filter((source) => classifyEvidenceSource(source.url).directlyVerifiable)
        .map((source) => source.url),
    );
    const validation = validateOpportunityReport(candidate, allowedUrls, directlyVerifiableUrls);
    if (!validation.ok) {
      throw new Error(`${kind} generated report is invalid: ${validation.errors.join('; ')}`);
    }
    generatedReports += 1;
  }

  return {
    validatedReports: reportKinds.length,
    generatedReports,
    bootstrapReports,
  };
}

const invokedPath = process.argv[1];
if (invokedPath && pathToFileURL(resolve(invokedPath)).href === import.meta.url) {
  const outputDir = fileURLToPath(new URL('../../src/data/', import.meta.url));
  validateGeneratedReports(outputDir)
    .then((summary) => {
      console.log(JSON.stringify({ status: 'valid', ...summary }));
    })
    .catch((error: unknown) => {
      console.error(JSON.stringify({
        status: 'invalid',
        error: error instanceof Error ? error.message : String(error),
      }));
      process.exitCode = 1;
    });
}
