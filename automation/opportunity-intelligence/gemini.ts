import type { SynthesisInput } from './pipeline';
import {
  synthesisResponseSchemaFor,
  synthesisSystemInstruction,
  type ProviderTokenUsage,
  type SynthesisProviderResult,
} from './grok';

type RuntimeProcess = { process?: { env?: Record<string, string | undefined> } };
type RuntimeEnvironment = Record<string, string | undefined>;
type ThinkingLevel = 'low' | 'medium' | 'high';

const timeoutMilliseconds = 45_000;

function runtimeEnvironment(): RuntimeEnvironment {
  return (globalThis as typeof globalThis & RuntimeProcess).process?.env ?? {};
}

function runtimeApiKey(): string {
  const key = runtimeEnvironment().GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is required at runtime');
  return key;
}

export function resolveGeminiModel(env: RuntimeEnvironment = runtimeEnvironment()): string {
  return env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash';
}

function boundedInteger(
  value: string | undefined,
  name: string,
  fallback: number,
): number {
  if (value === undefined || value.trim() === '') return fallback;
  if (!/^\d+$/.test(value.trim())) throw new Error(`${name} must be an integer`);
  return Math.min(8_000, Math.max(256, Number.parseInt(value, 10)));
}

export function resolveGeminiRequestConfig(
  kind: SynthesisInput['kind'],
  env: RuntimeEnvironment = runtimeEnvironment(),
): { maxOutputTokens: number; thinkingLevel: ThinkingLevel } {
  const tokenVariable = kind === 'daily'
    ? 'GEMINI_MAX_OUTPUT_TOKENS_DAILY'
    : 'GEMINI_MAX_OUTPUT_TOKENS_WEEKLY';
  const thinkingVariable = kind === 'daily'
    ? 'GEMINI_THINKING_LEVEL_DAILY'
    : 'GEMINI_THINKING_LEVEL_WEEKLY';
  const configuredThinking = env[thinkingVariable]?.trim();
  if (configuredThinking && !['low', 'medium', 'high'].includes(configuredThinking)) {
    throw new Error(`${thinkingVariable} must be low, medium, or high`);
  }
  return {
    maxOutputTokens: boundedInteger(
      env[tokenVariable],
      tokenVariable,
      kind === 'daily' ? 2_200 : 4_000,
    ),
    thinkingLevel: (configuredThinking || (kind === 'daily' ? 'low' : 'medium')) as ThinkingLevel,
  };
}

function tokenCount(value: unknown): number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;
}

function redact(value: string, apiKey: string): string {
  return value
    .split(apiKey).join('[REDACTED]')
    .replace(/("?(?:api[_-]?key|authorization)"?\s*[:=]\s*"?)([^",\s}]+)/gi, '$1[REDACTED]')
    .replace(/\s+/g, ' ')
    .slice(0, 500);
}

export async function synthesizeWithGemini(input: SynthesisInput): Promise<SynthesisProviderResult> {
  const apiKey = runtimeApiKey();
  const model = resolveGeminiModel(input.model ? { GEMINI_MODEL: input.model } : runtimeEnvironment());
  const config = resolveGeminiRequestConfig(input.kind);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMilliseconds);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: synthesisSystemInstruction }] },
          contents: [{
            role: 'user',
            parts: [{
              text: JSON.stringify({
                task: `Create a ${input.kind} opportunity report draft. Cite every insight using sourceIds only.`,
                report: {
                  generatedAt: input.generatedAt,
                  windowStart: input.windowStart,
                  windowEnd: input.windowEnd,
                },
                repairErrors: input.repairErrors,
                evidence: input.evidence,
              }),
            }],
          }],
          generationConfig: {
            maxOutputTokens: config.maxOutputTokens,
            thinkingConfig: { thinkingLevel: config.thinkingLevel },
            responseFormat: {
              text: {
                mimeType: 'APPLICATION_JSON',
                schema: synthesisResponseSchemaFor(input.kind),
              },
            },
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const summary = redact(await response.text(), apiKey);
      throw new Error(`Gemini synthesis failed with status ${response.status}: ${summary || '[no response body]'}`);
    }

    const payload = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: unknown }> } }>;
      usageMetadata?: {
        promptTokenCount?: unknown;
        candidatesTokenCount?: unknown;
        totalTokenCount?: unknown;
      };
    };
    const content = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter((part): part is string => typeof part === 'string')
      .join('');
    if (!content) throw new Error('Gemini synthesis response did not contain JSON content');
    const usage: ProviderTokenUsage = {
      promptTokens: tokenCount(payload.usageMetadata?.promptTokenCount),
      completionTokens: tokenCount(payload.usageMetadata?.candidatesTokenCount),
      totalTokens: tokenCount(payload.usageMetadata?.totalTokenCount),
    };
    return { value: content, usage };
  } catch (error) {
    throw new Error(redact(error instanceof Error ? error.message : String(error), apiKey));
  } finally {
    clearTimeout(timeout);
  }
}
