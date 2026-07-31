import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveGeminiModel, resolveGeminiRequestConfig, synthesizeWithGemini } from './gemini';
import type { SynthesisInput } from './pipeline';

const originalFetch = globalThis.fetch;
const originalKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  process.env.GEMINI_API_KEY = originalKey;
  delete process.env.GEMINI_MODEL;
});

function input(kind: 'daily' | 'weekly' = 'daily'): SynthesisInput {
  return {
    kind,
    generatedAt: '2026-07-31T12:00:00.000Z',
    windowStart: '2026-07-30T12:00:00.000Z',
    windowEnd: '2026-07-31T12:00:00.000Z',
    repairErrors: [],
    evidence: [{
      id: 'evidence-001',
      radar: 'build',
      topic: 'product',
      title: 'Official release',
      url: 'https://example.com/release',
      publishedAt: '2026-07-31T08:00:00.000Z',
      tier: 1,
      primary: true,
      factualStatement: 'The vendor released the capability.',
    }],
  };
}

describe('Gemini synthesis adapter', () => {
  it('sends a structured, evidence-bound request and maps token usage', async () => {
    process.env.GEMINI_API_KEY = 'gemini-test-secret';
    process.env.GEMINI_MODEL = 'gemini-test-model';
    let request: Request | undefined;
    globalThis.fetch = vi.fn(async (requestInput, init) => {
      request = new Request(requestInput, init);
      return new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: '{"items":[]}' }] } }],
        usageMetadata: {
          promptTokenCount: 120,
          candidatesTokenCount: 30,
          totalTokenCount: 165,
        },
      }));
    });

    await expect(synthesizeWithGemini(input())).resolves.toEqual({
      value: '{"items":[]}',
      usage: { promptTokens: 120, completionTokens: 30, totalTokens: 165 },
    });

    expect(request?.url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-test-model:generateContent',
    );
    expect(request?.headers.get('x-goog-api-key')).toBe('gemini-test-secret');
    expect(request?.url).not.toContain('gemini-test-secret');
    const body = await request?.json() as {
      system_instruction: { parts: Array<{ text: string }> };
      contents: Array<{ parts: Array<{ text: string }> }>;
      generationConfig: {
        maxOutputTokens: number;
        thinkingConfig: { thinkingLevel: string };
        responseFormat: { text: { mimeType: string; schema: Record<string, unknown> } };
      };
    };
    expect(body.system_instruction.parts[0].text).toContain('untrusted data');
    expect(body.contents[0].parts[0].text).toContain('evidence-001');
    expect(body.generationConfig.maxOutputTokens).toBe(2200);
    expect(body.generationConfig.thinkingConfig.thinkingLevel).toBe('low');
    expect(body.generationConfig.responseFormat.text.mimeType).toBe('application/json');
    expect(body.generationConfig.responseFormat.text.schema).not.toHaveProperty(
      'properties.thesis',
    );
  });

  it('uses safe model and daily/weekly cost-control defaults', () => {
    expect(resolveGeminiModel({ GEMINI_MODEL: '  gemini-custom  ' })).toBe('gemini-custom');
    expect(resolveGeminiModel({ GEMINI_MODEL: '  ' })).toBe('gemini-3.5-flash');
    expect(resolveGeminiRequestConfig('daily', {})).toEqual({
      maxOutputTokens: 2200,
      thinkingLevel: 'low',
    });
    expect(resolveGeminiRequestConfig('weekly', {})).toEqual({
      maxOutputTokens: 4000,
      thinkingLevel: 'medium',
    });
  });

  it('redacts the API key from provider errors', async () => {
    process.env.GEMINI_API_KEY = 'gemini-error-secret';
    globalThis.fetch = vi.fn(async () => new Response(
      'API key gemini-error-secret rejected',
      { status: 403 },
    ));

    await expect(synthesizeWithGemini(input())).rejects.toSatisfy((error: unknown) => {
      expect(String(error)).toContain('status 403');
      expect(String(error)).not.toContain('gemini-error-secret');
      return true;
    });
  });
});
