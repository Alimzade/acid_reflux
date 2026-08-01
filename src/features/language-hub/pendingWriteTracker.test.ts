import { describe, expect, it } from 'vitest';
import {
  beginPendingWrite,
  finishPendingWrite,
  hydrateAvailableDrafts,
  type PendingWriteTracker,
} from './pendingWriteTracker';

describe('pending write tracker', () => {
  it('keeps a field pending when an older overlapping write finishes first', () => {
    const tracker: PendingWriteTracker = { version: 0, pendingCount: 0 };
    const first = beginPendingWrite(tracker);
    const second = beginPendingWrite(tracker);

    expect(finishPendingWrite(tracker, first)).toEqual({
      isLatest: false,
      hasPending: true,
    });
    expect(finishPendingWrite(tracker, second)).toEqual({
      isLatest: true,
      hasPending: false,
    });
  });

  it('identifies an older failed operation so it cannot restore a newer draft', () => {
    const tracker: PendingWriteTracker = { version: 0, pendingCount: 0 };
    const older = beginPendingWrite(tracker);
    const newer = beginPendingWrite(tracker);

    expect(finishPendingWrite(tracker, older).isLatest).toBe(false);
    expect(tracker.version).toBe(newer);
  });

  it('rehydrates move drafts from a returned date overlay', () => {
    expect(hydrateAvailableDrafts(
      {
        money: 'Date B draft',
        health: 'Date B health',
        learning: 'Date B learning',
      },
      {
        money: 'Pending date A text',
        health: 'Date A health',
        learning: 'Date A learning',
      },
      {},
    )).toEqual({
      money: 'Pending date A text',
      health: 'Date A health',
      learning: 'Date A learning',
    });
  });

  it('rehydrates sentence drafts while preserving fields with active local work', () => {
    expect(hydrateAvailableDrafts(
      {
        alizade: 'Locally typed sentence',
        sakar: 'Date B sentence',
      },
      {
        alizade: 'Older snapshot sentence',
        sakar: 'Pending date A sentence',
      },
      { alizade: true },
    )).toEqual({
      alizade: 'Locally typed sentence',
      sakar: 'Pending date A sentence',
    });
  });
});
