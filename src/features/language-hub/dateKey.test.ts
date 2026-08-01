import { describe, expect, it } from 'vitest';
import { assertDateKey, isDateKey } from './dateKey';
import { challengeForDate } from './challengeBank';

describe('Daily Duo Quest date keys', () => {
  it.each([
    '2026-07-30',
    '2024-02-29',
    '2000-02-29',
  ])('accepts the real calendar date %s', (date) => {
    expect(isDateKey(date)).toBe(true);
    expect(assertDateKey(date)).toBe(date);
  });

  it.each([
    '',
    '2026-7-30',
    '2026-07-30-extra',
    '2026-02-29',
    '1900-02-29',
    '2026-04-31',
    '2026-13-01',
    '2026-00-10',
    'not-a-date',
  ])('rejects the invalid date key %s', (date) => {
    expect(isDateKey(date)).toBe(false);
    expect(() => assertDateKey(date)).toThrow(RangeError);
    expect(() => challengeForDate(date)).toThrow(RangeError);
  });
});
