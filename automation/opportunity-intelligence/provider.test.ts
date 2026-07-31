import { describe, expect, it } from 'vitest';
import { resolveSynthesisProvider } from './provider';

describe('synthesis provider selection', () => {
  it('defaults to Gemini and requires only its provider key', () => {
    const provider = resolveSynthesisProvider({
      TAVILY_API_KEY: 'tavily',
      GEMINI_API_KEY: 'gemini',
    });
    expect(provider.name).toBe('gemini');
    expect(provider.model).toBe('gemini-3.5-flash');
  });

  it('keeps xAI available when explicitly selected', () => {
    const provider = resolveSynthesisProvider({
      LLM_PROVIDER: 'xai',
      XAI_API_KEY: 'xai',
      XAI_MODEL: 'grok-custom',
    });
    expect(provider.name).toBe('xai');
    expect(provider.model).toBe('grok-custom');
  });

  it('rejects missing and unknown provider configuration', () => {
    expect(() => resolveSynthesisProvider({})).toThrow('GEMINI_API_KEY');
    expect(() => resolveSynthesisProvider({ LLM_PROVIDER: 'other' })).toThrow('LLM_PROVIDER');
  });
});
