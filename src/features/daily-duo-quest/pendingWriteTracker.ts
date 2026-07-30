export interface PendingWriteTracker {
  version: number;
  pendingCount: number;
}

export interface FinishedWrite {
  isLatest: boolean;
  hasPending: boolean;
}

export function beginPendingWrite(tracker: PendingWriteTracker): number {
  tracker.version += 1;
  tracker.pendingCount += 1;
  return tracker.version;
}

export function finishPendingWrite(
  tracker: PendingWriteTracker,
  version: number,
): FinishedWrite {
  tracker.pendingCount = Math.max(0, tracker.pendingCount - 1);
  return {
    isLatest: tracker.version === version,
    hasPending: tracker.pendingCount > 0,
  };
}

export function hydrateAvailableDrafts<Key extends string>(
  current: Record<Key, string>,
  source: Record<Key, string>,
  blocked: Partial<Record<Key, boolean>>,
): Record<Key, string> {
  const next = { ...current };
  (Object.keys(source) as Key[]).forEach((key) => {
    if (!blocked[key]) next[key] = source[key];
  });
  return next;
}
