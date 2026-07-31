import { synthesizeWithGemini, resolveGeminiModel } from './gemini';
import { resolveXaiModel, synthesizeWithGrok } from './grok';
import type { OpportunitySynthesizer } from './pipeline';

export interface SynthesisProvider {
  name: 'gemini' | 'xai';
  model: string;
  synthesize: OpportunitySynthesizer;
}

export function resolveSynthesisProvider(
  env: Record<string, string | undefined>,
): SynthesisProvider {
  const configured = env.LLM_PROVIDER?.trim().toLowerCase() || 'gemini';
  if (configured === 'gemini') {
    if (!env.GEMINI_API_KEY) throw new Error('Missing required environment variable: GEMINI_API_KEY');
    return {
      name: 'gemini',
      model: resolveGeminiModel(env),
      synthesize: synthesizeWithGemini,
    };
  }
  if (configured === 'xai') {
    if (!env.XAI_API_KEY) throw new Error('Missing required environment variable: XAI_API_KEY');
    return {
      name: 'xai',
      model: resolveXaiModel(env),
      synthesize: synthesizeWithGrok,
    };
  }
  throw new Error('LLM_PROVIDER must be gemini or xai');
}
