import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { synthesizeWithGrok } from './grok';
import {
  runOpportunityPipeline,
  type OpportunitySearch,
  type OpportunitySynthesizer,
} from './pipeline';
import type { QueryKind } from './queryPacks';
import { searchTavily } from './tavily';

export interface CliArguments {
  kind: QueryKind;
  dryRun: boolean;
}

export interface CliDependencies {
  env: Record<string, string | undefined>;
  now: () => Date;
  search: OpportunitySearch;
  synthesize: OpportunitySynthesizer;
  outputDir: string;
  log: (message: string) => void;
}

export function parseCliArgs(args: readonly string[]): CliArguments {
  let kind: QueryKind | undefined;
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--dry-run') {
      if (dryRun) throw new Error('Duplicate flag: --dry-run');
      dryRun = true;
      continue;
    }

    if (argument === '--kind' || argument.startsWith('--kind=')) {
      if (kind) throw new Error('Duplicate flag: --kind');
      const value = argument === '--kind' ? args[++index] : argument.slice('--kind='.length);
      if (value !== 'daily' && value !== 'weekly') {
        throw new Error('--kind must be daily or weekly');
      }
      kind = value;
      continue;
    }

    throw new Error(`Unknown flag: ${argument}`);
  }

  if (!kind) throw new Error('--kind is required');
  return { kind, dryRun };
}

function safeMessage(error: unknown, env: Record<string, string | undefined>): string {
  let message = error instanceof Error ? error.message : String(error);
  for (const secret of [env.TAVILY_API_KEY, env.XAI_API_KEY]) {
    if (secret) message = message.split(secret).join('[REDACTED]');
  }
  return message
    .replace(/bearer\s+[^\s",}]+/gi, 'Bearer [REDACTED]')
    .replace(/\s+/g, ' ')
    .slice(0, 1_000);
}

export async function runCli(
  args: readonly string[],
  overrides: Partial<CliDependencies> = {},
): Promise<number> {
  const env = overrides.env ?? process.env;
  const log = overrides.log ?? console.log;

  try {
    const parsed = parseCliArgs(args);
    const missingKeys = ['TAVILY_API_KEY', 'XAI_API_KEY'].filter((name) => !env[name]);
    if (missingKeys.length > 0) {
      throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
    }

    const result = await runOpportunityPipeline({
      kind: parsed.kind,
      dryRun: parsed.dryRun,
      now: (overrides.now ?? (() => new Date()))(),
      search: overrides.search ?? searchTavily,
      synthesize: overrides.synthesize ?? synthesizeWithGrok,
      outputDir: overrides.outputDir ?? fileURLToPath(new URL('../../src/data/', import.meta.url)),
      env,
    });
    log(JSON.stringify(result));
    return 0;
  } catch (error) {
    log(JSON.stringify({ status: 'failed', error: safeMessage(error, env) }));
    return 1;
  }
}

const invokedPath = process.argv[1];
if (invokedPath && pathToFileURL(resolve(invokedPath)).href === import.meta.url) {
  runCli(process.argv.slice(2)).then((exitCode) => {
    process.exitCode = exitCode;
  });
}
