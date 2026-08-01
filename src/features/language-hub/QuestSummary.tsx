import type { Language } from '../../types';
import type { QuestScore } from './types';
import type { QuestCopy } from './translations';

interface QuestSummaryProps {
  copy: QuestCopy;
  language: Language;
  selectedDate: string;
  today: string;
  score: QuestScore;
  streak: number;
  onPrevious: () => void;
  onNext: () => void;
}

function displayDate(date: string, language: Language): string {
  return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T12:00:00`));
}

export function QuestSummary({
  copy,
  language,
  selectedDate,
  today,
  score,
  streak,
  onPrevious,
  onNext,
}: QuestSummaryProps) {
  const nextDisabled = selectedDate >= today;

  return (
    <section className="duo-summary glass-card" aria-labelledby="duo-summary-date">
      <div className="duo-date-control">
        <button
          className="duo-icon-button"
          type="button"
          onClick={onPrevious}
          aria-label={copy.previousDay}
          title={copy.previousDay}
        >
          <span aria-hidden="true">←</span>
        </button>
        <div className="duo-date-copy">
          <span>{copy.selectedDate}</span>
          <time id="duo-summary-date" dateTime={selectedDate}>
            {displayDate(selectedDate, language)}
          </time>
        </div>
        <button
          className="duo-icon-button"
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          aria-label={copy.nextDay}
          title={copy.nextDay}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <dl className="duo-summary-stats">
        <div>
          <dt>{copy.teamXp}</dt>
          <dd><strong>{score.total}</strong><span>/14 XP</span></dd>
        </div>
        <div>
          <dt>{copy.streak}</dt>
          <dd><strong>{streak}</strong><span>{streak === 1 ? copy.streakDay : copy.streakDays}</span></dd>
        </div>
        <div>
          <dt>{copy.dayStatus}</dt>
          <dd>
            <span className={`duo-day-status duo-day-status--${score.status}`}>
              {copy.statuses[score.status]}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
