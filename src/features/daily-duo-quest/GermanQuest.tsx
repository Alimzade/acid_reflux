import { useEffect, useRef, useState } from 'react';
import {
  beginPendingWrite,
  finishPendingWrite,
  hydrateAvailableDrafts,
  type PendingWriteTracker,
} from './pendingWriteTracker';
import { shouldRevealAnswers } from './questState';
import type { GermanChallenge, PlayerId, PlayerQuestState } from './types';
import type { QuestCopy } from './translations';

const players: PlayerId[] = ['alizade', 'sakar'];
const playerNames: Record<PlayerId, string> = {
  alizade: 'Alizade',
  sakar: 'Sakar',
};
const debounceMilliseconds = 450;

interface GermanQuestProps {
  challenge: GermanChallenge;
  states: Record<PlayerId, PlayerQuestState>;
  confirmedStates: Record<PlayerId, PlayerQuestState>;
  copy: QuestCopy;
  disabled?: boolean;
  sentencesLocked?: boolean;
  onSentence: (player: PlayerId, sentence: string) => Promise<boolean>;
  onSubmitAnswer: (player: PlayerId, answerIndex: number) => Promise<boolean>;
}

type SentenceDrafts = Record<PlayerId, string>;
type SelectedAnswers = Record<PlayerId, number | null>;

function sentencesFromStates(
  states: Record<PlayerId, PlayerQuestState>,
): SentenceDrafts {
  return {
    alizade: states.alizade.germanSentence,
    sakar: states.sakar.germanSentence,
  };
}

export function GermanQuest({
  challenge,
  states,
  confirmedStates,
  copy,
  disabled = false,
  sentencesLocked = false,
  onSentence,
  onSubmitAnswer,
}: GermanQuestProps) {
  const [sentences, setSentences] = useState<SentenceDrafts>(() => ({
    alizade: states.alizade.germanSentence,
    sakar: states.sakar.germanSentence,
  }));
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>(() => ({
    alizade: states.alizade.answerIndex,
    sakar: states.sakar.answerIndex,
  }));
  const [submittingAnswers, setSubmittingAnswers] = useState<Record<PlayerId, boolean>>({
    alizade: false,
    sakar: false,
  });
  const sentenceRef = useRef(sentences);
  const confirmedStatesRef = useRef(confirmedStates);
  const timers = useRef<Partial<Record<PlayerId, number>>>({});
  const sentenceTrackers = useRef<Partial<Record<PlayerId, PendingWriteTracker>>>({});
  const bothAnswered = shouldRevealAnswers(confirmedStates);

  useEffect(() => {
    sentenceRef.current = sentences;
  }, [sentences]);

  useEffect(() => {
    confirmedStatesRef.current = confirmedStates;
    setSelectedAnswers((current) => ({
      alizade: confirmedStates.alizade.answerIndex ?? current.alizade,
      sakar: confirmedStates.sakar.answerIndex ?? current.sakar,
    }));
  }, [confirmedStates]);

  useEffect(() => {
    const blocked: Partial<Record<PlayerId, boolean>> = {};
    players.forEach((player) => {
      blocked[player] = Boolean(
        timers.current[player] || sentenceTrackers.current[player]?.pendingCount,
      );
    });
    setSentences((current) => hydrateAvailableDrafts(
      current,
      sentencesFromStates(states),
      blocked,
    ));
  }, [states]);

  useEffect(() => () => {
    Object.values(timers.current).forEach((timer) => window.clearTimeout(timer));
  }, []);

  const persistSentence = async (player: PlayerId) => {
    const timer = timers.current[player];
    if (timer) {
      window.clearTimeout(timer);
      delete timers.current[player];
    }

    const value = sentenceRef.current[player];
    if (value === states[player].germanSentence) return;

    const tracker = sentenceTrackers.current[player] ?? { version: 0, pendingCount: 0 };
    sentenceTrackers.current[player] = tracker;
    const operationVersion = beginPendingWrite(tracker);
    const saved = await onSentence(player, value);
    const finished = finishPendingWrite(tracker, operationVersion);

    if (!saved && finished.isLatest) {
      setSentences((current) => ({
        ...current,
        [player]: confirmedStatesRef.current[player].germanSentence,
      }));
    }
  };

  const updateSentenceDraft = (player: PlayerId, value: string) => {
    setSentences((current) => ({ ...current, [player]: value }));
    const existingTimer = timers.current[player];
    if (existingTimer) window.clearTimeout(existingTimer);
    timers.current[player] = window.setTimeout(() => {
      void persistSentence(player);
    }, debounceMilliseconds);
  };

  const submitAnswerFor = async (player: PlayerId) => {
    const answer = selectedAnswers[player];
    if (
      answer === null
      || confirmedStates[player].answerIndex !== null
      || submittingAnswers[player]
    ) return;
    setSubmittingAnswers((current) => ({ ...current, [player]: true }));
    try {
      await onSubmitAnswer(player, answer);
    } finally {
      setSubmittingAnswers((current) => ({ ...current, [player]: false }));
    }
  };

  return (
    <section className="duo-german glass-card" aria-labelledby="duo-german-title">
      <header className="duo-section-header">
        <div>
          <span className="duo-section-kicker">Deutsch</span>
          <h2 id="duo-german-title">{copy.germanTitle}</h2>
          <p>{copy.germanSubtitle}</p>
        </div>
        <span className="duo-language-chip">A2–B1</span>
      </header>

      <div className="duo-phrase-grid">
        <div className="duo-phrase">
          <span>{copy.phrase}</span>
          <strong lang="de">{challenge.phrase}</strong>
        </div>
        <div>
          <span>{copy.meaning}</span>
          <p>{challenge.meaning}</p>
        </div>
        <div>
          <span>{copy.hint}</span>
          <p>{challenge.hint}</p>
        </div>
      </div>

      <div className="duo-sentence-grid">
        {players.map((player) => {
          const sentenceId = `${player}-german-sentence`;
          return (
            <div className="duo-sentence-field" key={player}>
              <label htmlFor={sentenceId}>
                <strong>{playerNames[player]}</strong>
                <span>{copy.exampleSentence}</span>
              </label>
              <textarea
                id={sentenceId}
                lang={sentences[player].length > 0 ? 'de' : undefined}
                rows={3}
                maxLength={200}
                value={sentences[player]}
                placeholder={copy.examplePlaceholder}
                disabled={disabled || sentencesLocked}
                onChange={(event) => updateSentenceDraft(player, event.target.value)}
                onBlur={() => void persistSentence(player)}
              />
              <span className="duo-character-count">
                {200 - sentences[player].length} {copy.charactersRemaining}
              </span>
            </div>
          );
        })}
      </div>

      <div className="duo-question">
        <span className="duo-section-kicker">{copy.translationChallenge}</span>
        <h3>{challenge.question}</h3>

        <div className="duo-answer-grid">
          {players.map((player) => {
            const lockedAnswer = confirmedStates[player].answerIndex;
            const isLocked = lockedAnswer !== null;
            const isSubmitting = submittingAnswers[player];
            const selected = isLocked ? lockedAnswer : selectedAnswers[player];

            return (
              <fieldset
                className="duo-answer-card"
                key={player}
                disabled={disabled || isLocked || isSubmitting}
              >
                <legend>{copy.answerFor} {playerNames[player]}</legend>
                <div className="duo-options">
                  {challenge.options.map((option, index) => (
                    <label
                      className={`duo-option ${selected === index ? 'duo-option--selected' : ''}`}
                      key={option}
                    >
                      <input
                        type="radio"
                        name={`${player}-${challenge.id}`}
                        value={index}
                        checked={selected === index}
                        onChange={() => setSelectedAnswers((current) => ({ ...current, [player]: index }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                <button
                  className="duo-primary-button"
                  type="button"
                  disabled={disabled || isLocked || isSubmitting || selected === null}
                  onClick={() => void submitAnswerFor(player)}
                >
                  {isLocked ? copy.answerLocked : isSubmitting ? copy.saving : copy.submitAnswer}
                </button>
                {isLocked && !bothAnswered && <p className="duo-awaiting">{copy.awaitingPartner}</p>}
              </fieldset>
            );
          })}
        </div>
      </div>

      <div className="duo-answer-results" aria-live="polite" aria-atomic="true">
        {bothAnswered && (
          <>
          <div className="duo-player-feedback-grid">
            {players.map((player) => {
              const answer = confirmedStates[player].answerIndex;
              const isCorrect = answer === challenge.correctOption;
              return (
                <p className={`duo-answer-feedback ${isCorrect ? 'is-correct' : 'is-incorrect'}`} key={player}>
                  <strong>{playerNames[player]}:</strong>{' '}
                  {isCorrect ? copy.correctFeedback : copy.incorrectFeedback}
                </p>
              );
            })}
          </div>
          <div className="duo-reveal">
            <div>
              <span>{copy.correctAnswer}</span>
              <strong>{challenge.options[challenge.correctOption]}</strong>
            </div>
            <div>
              <span>{copy.explanation}</span>
              <p>{challenge.explanation}</p>
            </div>
          </div>
          </>
        )}
      </div>
    </section>
  );
}
