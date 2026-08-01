import { describe, it, expect } from 'vitest';
import { TOP_33_LANGUAGES } from './languageData';

describe('languageData German Noun Annotations', () => {
  it('contains valid noun metadata for key German phrases', () => {
    const german = TOP_33_LANGUAGES.find(l => l.id === 'german');
    expect(german).toBeDefined();

    const phraseWithNoun = german?.essentialPhrases.find(p => p.nouns && p.nouns.length > 0);
    expect(phraseWithNoun).toBeDefined();

    const noun = phraseWithNoun?.nouns?.[0];
    expect(noun).toHaveProperty('word');
    expect(noun).toHaveProperty('article');
    expect(['der', 'die', 'das']).toContain(noun?.article);
    expect(['masculine', 'feminine', 'neuter']).toContain(noun?.gender);
  });
});
