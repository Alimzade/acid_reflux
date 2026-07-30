import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Language } from '../../types';
import { challengeForDate } from './challengeBank';
import { localDateKey, shiftDateKey } from './dateKey';
import { isFirebaseConfigured } from './firebase';
import { GermanQuest } from './GermanQuest';
import { PlayerQuestCard } from './PlayerQuestCard';
import {
  submitAnswer,
  subscribeToQuest,
  subscribeToQuestHistory,
  updateMove,
  updateMoveText,
  updateSentence,
} from './questRepository';
import { calculateStreak, emptyDailyQuest, scoreQuest } from './questScoring';
import {
  applyPendingQuestLeaves,
  applyQuestLeaf,
  hydratePendingQuestSnapshot,
  nextQuestOperationVersion,
  normalizeHistoryEntries,
  normalizeQuest,
  questLeafKey,
  restoreQuestLeaf,
  settlePendingQuestLeaf,
  shouldAcceptConfirmedWrite,
  type PendingQuestLeaf,
  type QuestLeafUpdate,
} from './questState';
import { QuestSummary } from './QuestSummary';
import { questCopy } from './translations';
import type { DailyQuestDocument, MoveKey, PlayerId } from './types';
import './DailyDuoQuest.css';

type SaveStatus = 'saving' | 'saved' | 'offline' | 'retry';

interface DailyDuoQuestProps {
  language: Language;
}

export function DailyDuoQuest({ language }: DailyDuoQuestProps) {
  const [today, setToday] = useState(() => localDateKey());
  const copy = questCopy(language);
  const [selectedDate, setSelectedDate] = useState(today);
  const initialQuest = useRef(emptyDailyQuest(today));
  const [confirmedQuest, setConfirmedQuest] = useState<DailyQuestDocument>(
    initialQuest.current,
  );
  const [hydratedQuest, setHydratedQuest] = useState<DailyQuestDocument>(
    initialQuest.current,
  );
  const [pendingLeaves, setPendingLeaves] = useState<Record<string, PendingQuestLeaf>>({});
  const quest = useMemo(
    () => applyPendingQuestLeaves(hydratedQuest, pendingLeaves, selectedDate),
    [hydratedQuest, pendingLeaves, selectedDate],
  );
  const [history, setHistory] = useState<Array<{ date: string; quest: DailyQuestDocument }>>([]);
  const [retryVersion, setRetryVersion] = useState(0);
  const [selectedReadError, setSelectedReadError] = useState<Error | null>(null);
  const [historyReadError, setHistoryReadError] = useState<Error | null>(null);
  const [writeError, setWriteError] = useState<Error | null>(null);
  const [pendingWrites, setPendingWrites] = useState(0);
  const [selectedFromCache, setSelectedFromCache] = useState(false);
  const [historyFromCache, setHistoryFromCache] = useState(false);
  const [online, setOnline] = useState(() => navigator.onLine);
  const confirmedQuestRef = useRef(confirmedQuest);
  const hydratedQuestRef = useRef(hydratedQuest);
  const confirmedByDateRef = useRef<Record<string, DailyQuestDocument>>({
    [today]: initialQuest.current,
  });
  const hydratedByDateRef = useRef<Record<string, DailyQuestDocument>>({
    [today]: initialQuest.current,
  });
  const activeDateRef = useRef(selectedDate);
  const operationVersions = useRef<Record<string, number>>({});
  const confirmedVersions = useRef<Record<string, number>>({});

  const replaceConfirmedQuest = useCallback((
    date: string,
    next: DailyQuestDocument,
  ) => {
    confirmedByDateRef.current[date] = next;
    if (activeDateRef.current === date) {
      confirmedQuestRef.current = next;
      setConfirmedQuest(next);
    }
  }, []);

  const replaceHydratedQuest = useCallback((
    date: string,
    next: DailyQuestDocument,
  ) => {
    hydratedByDateRef.current[date] = next;
    if (activeDateRef.current === date) {
      hydratedQuestRef.current = next;
      setHydratedQuest(next);
    }
  }, []);

  const updatePendingLeaves = useCallback((
    updater: (
      current: Record<string, PendingQuestLeaf>,
    ) => Record<string, PendingQuestLeaf>,
  ) => {
    setPendingLeaves((current) => {
      const next = updater(current);
      return next;
    });
  }, []);

  useEffect(() => {
    const refreshToday = () => {
      const nextToday = localDateKey();
      setToday(nextToday);
      setSelectedDate((current) => current > nextToday ? nextToday : current);
    };
    let midnightTimer = 0;
    const scheduleMidnightRefresh = () => {
      window.clearTimeout(midnightTimer);
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
      );
      midnightTimer = window.setTimeout(() => {
        refreshToday();
        scheduleMidnightRefresh();
      }, nextMidnight.getTime() - now.getTime() + 100);
    };
    const refreshOnVisible = () => {
      if (document.visibilityState === 'visible') {
        refreshToday();
        scheduleMidnightRefresh();
      }
    };

    window.addEventListener('focus', refreshToday);
    document.addEventListener('visibilitychange', refreshOnVisible);
    scheduleMidnightRefresh();
    return () => {
      window.clearTimeout(midnightTimer);
      window.removeEventListener('focus', refreshToday);
      document.removeEventListener('visibilitychange', refreshOnVisible);
    };
  }, []);

  useEffect(() => {
    const markOnline = () => setOnline(true);
    const markOffline = () => setOnline(false);
    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);
    return () => {
      window.removeEventListener('online', markOnline);
      window.removeEventListener('offline', markOffline);
    };
  }, []);

  useEffect(() => {
    activeDateRef.current = selectedDate;
    const nextConfirmed = confirmedByDateRef.current[selectedDate]
      ?? emptyDailyQuest(selectedDate);
    const nextHydrated = hydratedByDateRef.current[selectedDate]
      ?? nextConfirmed;
    replaceConfirmedQuest(selectedDate, nextConfirmed);
    replaceHydratedQuest(selectedDate, nextHydrated);
    setSelectedReadError(null);
    setWriteError(null);
    setSelectedFromCache(false);
  }, [replaceConfirmedQuest, replaceHydratedQuest, selectedDate]);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;

    return subscribeToQuest(
      selectedDate,
      (nextQuest, isFromCache, hasPendingWrites) => {
        if (activeDateRef.current !== selectedDate) return;
        const normalized = normalizeQuest(nextQuest, selectedDate);
        if (hasPendingWrites) {
          const currentConfirmed = confirmedByDateRef.current[selectedDate]
            ?? emptyDailyQuest(selectedDate);
          replaceHydratedQuest(
            selectedDate,
            hydratePendingQuestSnapshot(normalized, currentConfirmed),
          );
        } else {
          replaceConfirmedQuest(selectedDate, normalized);
          replaceHydratedQuest(selectedDate, normalized);
        }
        setSelectedReadError(null);
        setSelectedFromCache(isFromCache);
      },
      (error) => {
        if (activeDateRef.current !== selectedDate) return;
        setSelectedReadError(error);
      },
    );
  }, [replaceConfirmedQuest, replaceHydratedQuest, retryVersion, selectedDate]);

  useEffect(() => {
    if (!isFirebaseConfigured) return undefined;

    return subscribeToQuestHistory(
      today,
      (entries, isFromCache) => {
        setHistory(normalizeHistoryEntries(entries));
        setHistoryReadError(null);
        setHistoryFromCache(isFromCache);
      },
      setHistoryReadError,
    );
  }, [retryVersion, today]);

  const challenge = challengeForDate(selectedDate);
  const score = scoreQuest(quest, challenge);
  const streak = calculateStreak(
    history.map((entry) => ({
      date: entry.date,
      victorious: scoreQuest(entry.quest, challengeForDate(entry.date)).status !== 'in-progress',
    })),
    today,
  );
  const readError = selectedReadError ?? historyReadError;

  const saveStatus: SaveStatus = !isFirebaseConfigured
    || !online
    || selectedFromCache
    || historyFromCache
    ? 'offline'
    : readError || writeError
      ? 'retry'
      : pendingWrites > 0
        ? 'saving'
        : 'saved';

  const saveLabel = {
    saving: copy.saving,
    saved: copy.saved,
    offline: copy.offline,
    retry: copy.retryStatus,
  }[saveStatus];

  const optimisticWrite = useCallback(async (
    operationDate: string,
    key: string,
    update: QuestLeafUpdate,
    write: () => Promise<void>,
    optimistic = true,
  ): Promise<boolean> => {
    if (!isFirebaseConfigured) return false;

    const version = nextQuestOperationVersion(operationVersions.current, key);
    if (optimistic) {
      updatePendingLeaves((current) => ({
        ...current,
        [key]: { date: operationDate, version, update },
      }));
    }
    setWriteError(null);
    setPendingWrites((count) => count + 1);

    try {
      await write();
      if (
        shouldAcceptConfirmedWrite(confirmedVersions.current[key] ?? 0, version)
      ) {
        confirmedVersions.current[key] = version;
        const currentConfirmed = confirmedByDateRef.current[operationDate]
          ?? emptyDailyQuest(operationDate);
        const currentHydrated = hydratedByDateRef.current[operationDate]
          ?? currentConfirmed;
        replaceConfirmedQuest(
          operationDate,
          applyQuestLeaf(currentConfirmed, update),
        );
        replaceHydratedQuest(
          operationDate,
          applyQuestLeaf(currentHydrated, update),
        );
      }
      return true;
    } catch (error) {
      if (operationVersions.current[key] === version) {
        const currentConfirmed = confirmedByDateRef.current[operationDate]
          ?? emptyDailyQuest(operationDate);
        const currentHydrated = hydratedByDateRef.current[operationDate]
          ?? currentConfirmed;
        replaceHydratedQuest(
          operationDate,
          restoreQuestLeaf(currentHydrated, currentConfirmed, update),
        );
        if (activeDateRef.current === operationDate) {
          setWriteError(error instanceof Error ? error : new Error('Quest write failed.'));
        }
      }
      return false;
    } finally {
      if (optimistic) {
        updatePendingLeaves(
          (current) => settlePendingQuestLeaf(current, key, version),
        );
      }
      setPendingWrites((count) => Math.max(0, count - 1));
    }
  }, [replaceConfirmedQuest, replaceHydratedQuest, updatePendingLeaves]);

  const persistMoveText = useCallback((
    player: PlayerId,
    move: MoveKey,
    text: string,
  ) => {
    const operationDate = selectedDate;
    const update = { type: 'moveText' as const, player, move, value: text };
    return optimisticWrite(
      operationDate,
      questLeafKey(operationDate, update),
      update,
      () => updateMoveText(operationDate, player, move, text),
    );
  }, [optimisticWrite, selectedDate]);

  const persistMoveCompletion = useCallback((
    player: PlayerId,
    move: MoveKey,
    completed: boolean,
  ) => {
    const operationDate = selectedDate;
    const update = {
      type: 'moveCompleted' as const,
      player,
      move,
      value: completed,
    };
    return optimisticWrite(
      operationDate,
      questLeafKey(operationDate, update),
      update,
      () => updateMove(operationDate, player, move, completed),
    );
  }, [optimisticWrite, selectedDate]);

  const persistSentence = useCallback((player: PlayerId, sentence: string) => {
    const operationDate = selectedDate;
    const update = { type: 'germanSentence' as const, player, value: sentence };
    return optimisticWrite(
      operationDate,
      questLeafKey(operationDate, update),
      update,
      () => updateSentence(operationDate, player, sentence),
    );
  }, [optimisticWrite, selectedDate]);

  const persistAnswer = useCallback((player: PlayerId, answerIndex: number) => {
    const operationDate = selectedDate;
    if (confirmedQuestRef.current.players[player].answerIndex !== null) {
      return Promise.resolve(false);
    }
    const update = { type: 'answerIndex' as const, player, value: answerIndex };
    return optimisticWrite(
      operationDate,
      questLeafKey(operationDate, update),
      update,
      () => submitAnswer(operationDate, player, answerIndex),
      false,
    );
  }, [optimisticWrite, selectedDate]);

  const retry = () => {
    setSelectedReadError(null);
    setHistoryReadError(null);
    setWriteError(null);
    setRetryVersion((version) => version + 1);
  };

  return (
    <div className="daily-duo-quest">
      <header className="duo-page-header">
        <div>
          <span className="duo-section-kicker">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
        <div className={`duo-save-status duo-save-status--${saveStatus}`} role="status" aria-live="polite">
          <span aria-hidden="true" />
          {saveLabel}
        </div>
      </header>

      {!isFirebaseConfigured && (
        <aside className="duo-notice duo-notice--setup" role="note">
          <strong>{copy.setupTitle}</strong>
          <p>{copy.setupMessage}</p>
          <p>{copy.setupInstructions}</p>
        </aside>
      )}

      {(readError || writeError) && (
        <aside className="duo-notice duo-notice--error" role="alert">
          <p>{readError ? copy.readError : copy.writeError}</p>
          <button type="button" onClick={retry}>{copy.retry}</button>
        </aside>
      )}

      <QuestSummary
        copy={copy}
        language={language}
        selectedDate={selectedDate}
        today={today}
        score={score}
        streak={streak}
        onPrevious={() => setSelectedDate((date) => shiftDateKey(date, -1))}
        onNext={() => setSelectedDate((date) => date < today ? shiftDateKey(date, 1) : date)}
      />

      <section className="duo-player-grid" aria-label={copy.title}>
        {(['alizade', 'sakar'] as PlayerId[]).map((player) => (
          <PlayerQuestCard
            key={`${selectedDate}-${player}`}
            player={player}
            name={player === 'alizade' ? 'Alizade' : 'Sakar'}
            state={quest.players[player]}
            confirmedState={confirmedQuest.players[player]}
            score={score.players[player]}
            copy={copy}
            disabled={!isFirebaseConfigured}
            onMoveText={(move, text) => persistMoveText(player, move, text)}
            onMoveToggle={(move, completed) => persistMoveCompletion(player, move, completed)}
          />
        ))}
      </section>

      <GermanQuest
        key={selectedDate}
        challenge={challenge}
        states={quest.players}
        confirmedStates={confirmedQuest.players}
        copy={copy}
        disabled={!isFirebaseConfigured}
        sentencesLocked={score.status !== 'in-progress'}
        onSentence={persistSentence}
        onSubmitAnswer={persistAnswer}
      />

      <p className="duo-public-warning">
        <span aria-hidden="true">◉</span>
        {copy.publicWarning}
      </p>
    </div>
  );
}
