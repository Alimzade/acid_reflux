import type { Language } from '../../types';
import type { DayStatus, MoveKey } from './types';

export interface QuestCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  selectedDate: string;
  previousDay: string;
  nextDay: string;
  teamXp: string;
  streak: string;
  streakDay: string;
  streakDays: string;
  dayStatus: string;
  statuses: Record<DayStatus, string>;
  playerLabel: string;
  playerXp: string;
  moves: Record<MoveKey, string>;
  moveInstructions: string;
  completeMove: string;
  completed: string;
  charactersRemaining: string;
  germanTitle: string;
  germanSubtitle: string;
  phrase: string;
  meaning: string;
  hint: string;
  exampleSentence: string;
  examplePlaceholder: string;
  translationChallenge: string;
  answerFor: string;
  submitAnswer: string;
  answerLocked: string;
  awaitingPartner: string;
  correctAnswer: string;
  correctFeedback: string;
  incorrectFeedback: string;
  explanation: string;
  saving: string;
  saved: string;
  offline: string;
  retryStatus: string;
  retry: string;
  setupTitle: string;
  setupMessage: string;
  setupInstructions: string;
  readError: string;
  writeError: string;
  publicWarning: string;
}

const copy: Record<Language, QuestCopy> = {
  en: {
    eyebrow: 'Shared daily challenge',
    title: 'Daily Duo Quest',
    subtitle: 'Small moves, shared momentum, and a little German every day.',
    selectedDate: 'Selected date',
    previousDay: 'Previous day',
    nextDay: 'Next day',
    teamXp: 'Team XP',
    streak: 'Shared streak',
    streakDay: 'day',
    streakDays: 'days',
    dayStatus: 'Day status',
    statuses: {
      'in-progress': 'In Progress',
      victory: 'Victory',
      perfect: 'Perfect Day',
    },
    playerLabel: 'Duo player',
    playerXp: 'Daily XP',
    moves: {
      money: 'Money Move',
      health: 'Health Move',
      learning: 'Learning Move',
    },
    moveInstructions: 'Shape today’s moves, then check them off when they are done.',
    completeMove: 'Mark complete',
    completed: 'Completed',
    charactersRemaining: 'characters remaining',
    germanTitle: 'Deutsch Quest',
    germanSubtitle: 'Write your own example, then answer together.',
    phrase: 'Phrase',
    meaning: 'Meaning',
    hint: 'Hint',
    exampleSentence: 'Original German example sentence',
    examplePlaceholder: 'Write one sentence in German…',
    translationChallenge: 'Translation challenge',
    answerFor: 'Answer for',
    submitAnswer: 'Submit and lock answer',
    answerLocked: 'Answer locked',
    awaitingPartner: 'Answer saved. Waiting for your partner before the reveal.',
    correctAnswer: 'Correct answer',
    correctFeedback: 'Correct — 2 XP earned.',
    incorrectFeedback: 'Not this time — the correct answer is shown below.',
    explanation: 'Why this answer works',
    saving: 'Saving',
    saved: 'Saved',
    offline: 'Offline',
    retryStatus: 'Retry needed',
    retry: 'Try again',
    setupTitle: 'Connect Firebase to enable the shared board',
    setupMessage: 'The quest is ready to preview, but live editing is unavailable until Firebase is configured.',
    setupInstructions: 'Copy .env.example to .env.local, add all VITE_FIREBASE_* values, and restart the development server.',
    readError: 'Live updates could not be loaded. The last available quest is still shown.',
    writeError: 'That change could not be saved and was restored.',
    publicWarning: 'Public board: anyone with access to this site can view and edit valid quest data.',
  },
  de: {
    eyebrow: 'Gemeinsame Tagesaufgabe',
    title: 'Tägliche Duo-Quest',
    subtitle: 'Kleine Schritte, gemeinsamer Schwung und jeden Tag ein bisschen Deutsch.',
    selectedDate: 'Ausgewähltes Datum',
    previousDay: 'Vorheriger Tag',
    nextDay: 'Nächster Tag',
    teamXp: 'Team-XP',
    streak: 'Gemeinsame Serie',
    streakDay: 'Tag',
    streakDays: 'Tage',
    dayStatus: 'Tagesstatus',
    statuses: {
      'in-progress': 'In Arbeit',
      victory: 'Sieg',
      perfect: 'Perfekter Tag',
    },
    playerLabel: 'Duo-Spieler',
    playerXp: 'Tages-XP',
    moves: {
      money: 'Geld-Schritt',
      health: 'Gesundheits-Schritt',
      learning: 'Lern-Schritt',
    },
    moveInstructions: 'Formuliert eure heutigen Schritte und hakt sie ab, sobald sie erledigt sind.',
    completeMove: 'Als erledigt markieren',
    completed: 'Erledigt',
    charactersRemaining: 'Zeichen übrig',
    germanTitle: 'Deutsch-Quest',
    germanSubtitle: 'Schreibt je ein Beispiel und beantwortet die Frage gemeinsam.',
    phrase: 'Ausdruck',
    meaning: 'Bedeutung',
    hint: 'Hinweis',
    exampleSentence: 'Eigener deutscher Beispielsatz',
    examplePlaceholder: 'Schreibe einen Satz auf Deutsch…',
    translationChallenge: 'Übersetzungsaufgabe',
    answerFor: 'Antwort von',
    submitAnswer: 'Antwort abgeben und sperren',
    answerLocked: 'Antwort gesperrt',
    awaitingPartner: 'Antwort gespeichert. Die Lösung erscheint, sobald ihr beide geantwortet habt.',
    correctAnswer: 'Richtige Antwort',
    correctFeedback: 'Richtig — 2 XP verdient.',
    incorrectFeedback: 'Diesmal nicht — die richtige Antwort steht unten.',
    explanation: 'Warum diese Antwort stimmt',
    saving: 'Wird gespeichert',
    saved: 'Gespeichert',
    offline: 'Offline',
    retryStatus: 'Erneuter Versuch nötig',
    retry: 'Erneut versuchen',
    setupTitle: 'Firebase verbinden, um das gemeinsame Board zu aktivieren',
    setupMessage: 'Die Quest kann angesehen werden, aber Live-Bearbeitung ist erst nach der Firebase-Konfiguration verfügbar.',
    setupInstructions: 'Kopiere .env.example nach .env.local, ergänze alle VITE_FIREBASE_*-Werte und starte den Entwicklungsserver neu.',
    readError: 'Live-Updates konnten nicht geladen werden. Die zuletzt verfügbare Quest bleibt sichtbar.',
    writeError: 'Diese Änderung konnte nicht gespeichert werden und wurde zurückgesetzt.',
    publicWarning: 'Öffentliches Board: Alle mit Zugriff auf diese Website können gültige Quest-Daten ansehen und bearbeiten.',
  },
};

export function questCopy(language: Language): QuestCopy {
  return copy[language];
}
