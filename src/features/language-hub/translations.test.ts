import { describe, expect, it } from 'vitest';
import { questCopy } from './translations';

describe('Daily Duo Quest translations', () => {
  it('provides distinct English and German interface labels', () => {
    expect(questCopy('en').title).toBe('Daily Duo Quest');
    expect(questCopy('de').title).toBe('Tägliche Duo-Quest');
    expect(questCopy('en').statuses.perfect).toBe('Perfect Day');
    expect(questCopy('de').statuses.perfect).toBe('Perfekter Tag');
  });

  it('provides all move and synchronization labels in both languages', () => {
    (['en', 'de'] as const).forEach((language) => {
      const labels = questCopy(language);
      expect(Object.values(labels.moves)).toHaveLength(3);
      expect(labels.saving).toBeTruthy();
      expect(labels.saved).toBeTruthy();
      expect(labels.offline).toBeTruthy();
      expect(labels.retryStatus).toBeTruthy();
      expect(labels.publicWarning).toBeTruthy();
    });
  });
});
