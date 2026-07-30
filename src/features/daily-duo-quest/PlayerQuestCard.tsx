import { useEffect, useRef, useState } from 'react';
import {
  beginPendingWrite,
  finishPendingWrite,
  hydrateAvailableDrafts,
  type PendingWriteTracker,
} from './pendingWriteTracker';
import type { MoveKey, PlayerId, PlayerQuestState } from './types';
import type { QuestCopy } from './translations';

const moveKeys: MoveKey[] = ['money', 'health', 'learning'];
const debounceMilliseconds = 450;

interface PlayerQuestCardProps {
  player: PlayerId;
  name: string;
  state: PlayerQuestState;
  confirmedState: PlayerQuestState;
  score: number;
  copy: QuestCopy;
  disabled?: boolean;
  onMoveText: (move: MoveKey, text: string) => Promise<boolean>;
  onMoveToggle: (move: MoveKey, completed: boolean) => Promise<boolean>;
}

type MoveDrafts = Record<MoveKey, string>;

function draftsFromState(state: PlayerQuestState): MoveDrafts {
  return {
    money: state.moves.money.text,
    health: state.moves.health.text,
    learning: state.moves.learning.text,
  };
}

export function PlayerQuestCard({
  player,
  name,
  state,
  confirmedState,
  score,
  copy,
  disabled = false,
  onMoveText,
  onMoveToggle,
}: PlayerQuestCardProps) {
  const [drafts, setDrafts] = useState<MoveDrafts>(() => draftsFromState(state));
  const draftsRef = useRef(drafts);
  const confirmedStateRef = useRef(confirmedState);
  const timers = useRef<Partial<Record<MoveKey, number>>>({});
  const writeTrackers = useRef<Partial<Record<MoveKey, PendingWriteTracker>>>({});

  useEffect(() => {
    draftsRef.current = drafts;
  }, [drafts]);

  useEffect(() => {
    confirmedStateRef.current = confirmedState;
  }, [confirmedState]);

  useEffect(() => {
    const blocked: Partial<Record<MoveKey, boolean>> = {};
    moveKeys.forEach((move) => {
      blocked[move] = Boolean(
        timers.current[move] || writeTrackers.current[move]?.pendingCount,
      );
    });
    setDrafts((current) => hydrateAvailableDrafts(
      current,
      draftsFromState(state),
      blocked,
    ));
  }, [state]);

  useEffect(() => () => {
    Object.values(timers.current).forEach((timer) => window.clearTimeout(timer));
  }, []);

  const persistDraft = async (move: MoveKey) => {
    const timer = timers.current[move];
    if (timer) {
      window.clearTimeout(timer);
      delete timers.current[move];
    }

    const value = draftsRef.current[move];
    if (value === state.moves[move].text) return;
    if (value.length === 0) {
      setDrafts((current) => ({
        ...current,
        [move]: confirmedStateRef.current.moves[move].text,
      }));
      return;
    }

    const tracker = writeTrackers.current[move] ?? { version: 0, pendingCount: 0 };
    writeTrackers.current[move] = tracker;
    const operationVersion = beginPendingWrite(tracker);
    const saved = await onMoveText(move, value);
    const finished = finishPendingWrite(tracker, operationVersion);

    if (!saved && finished.isLatest) {
      setDrafts((current) => ({
        ...current,
        [move]: confirmedStateRef.current.moves[move].text,
      }));
    }
  };

  const updateDraft = (move: MoveKey, value: string) => {
    setDrafts((current) => ({ ...current, [move]: value }));
    const existingTimer = timers.current[move];
    if (existingTimer) window.clearTimeout(existingTimer);
    timers.current[move] = window.setTimeout(() => {
      void persistDraft(move);
    }, debounceMilliseconds);
  };

  return (
    <article className={`duo-player-card glass-card duo-player-card--${player}`} aria-labelledby={`${player}-quest-title`}>
      <header className="duo-player-header">
        <div>
          <span className="duo-player-kicker">{copy.playerLabel}</span>
          <h2 id={`${player}-quest-title`}>{name}</h2>
        </div>
        <div className="duo-player-score" aria-label={`${name}: ${score} ${copy.playerXp}`}>
          <strong>{score}</strong>
          <span>/6 XP</span>
        </div>
      </header>
      <p className="duo-player-instructions">{copy.moveInstructions}</p>

      <div className="duo-move-list">
        {moveKeys.map((move) => {
          const inputId = `${player}-${move}-move`;
          const checkboxId = `${player}-${move}-completed`;
          const completed = state.moves[move].completed;

          return (
            <div className={`duo-move ${completed ? 'duo-move--completed' : ''}`} key={move}>
              <div className="duo-move-heading">
                <label htmlFor={inputId}>{copy.moves[move]}</label>
                {completed && <span className="duo-completed-label">{copy.completed}</span>}
              </div>
              <div className="duo-move-controls">
                <input
                  id={inputId}
                  type="text"
                  value={drafts[move]}
                  minLength={1}
                  maxLength={140}
                  disabled={disabled}
                  onChange={(event) => updateDraft(move, event.target.value)}
                  onBlur={() => void persistDraft(move)}
                />
                <label className="duo-checkbox" htmlFor={checkboxId}>
                  <input
                    id={checkboxId}
                    type="checkbox"
                    checked={completed}
                    disabled={disabled}
                    onChange={(event) => void onMoveToggle(move, event.target.checked)}
                  />
                  <span aria-hidden="true">✓</span>
                  <span className="duo-checkbox-action">
                    {completed ? copy.completed : copy.completeMove}
                  </span>
                </label>
              </div>
              <span className="duo-character-count" aria-live="off">
                {140 - drafts[move].length} {copy.charactersRemaining}
              </span>
            </div>
          );
        })}
      </div>
    </article>
  );
}
