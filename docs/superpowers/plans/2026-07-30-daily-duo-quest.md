# Daily Duo Quest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual, publicly shared Daily Duo Quest where Alizade and Sakar complete daily money, health, learning, and German-language challenges.

**Architecture:** Keep challenge selection and scoring as pure TypeScript modules under one feature directory. A Firestore repository owns persistence and real-time synchronization, while the page and focused child components render the existing application’s dark glass UI. App-level navigation and language state remain authoritative.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Firebase Web SDK, Vitest, Cloud Firestore

## Global Constraints

- The page route is `/quest`, with GitHub Pages base-path compatibility.
- The only players are `Alizade` and `Sakar`.
- The three personal categories are Money Move, Health Move, and Learning Move.
- Move text is limited to 140 characters; German example sentences are limited to 200 characters.
- The initial challenge bank contains at least 14 deterministic A2-B1 challenges.
- The interface supports English and German through the existing `Language` state.
- The Firestore board is intentionally public and has no authentication.
- Do not commit a populated `.env` file.

---

### Task 1: Pure quest domain and tests

**Files:**
- Create: `src/features/daily-duo-quest/types.ts`
- Create: `src/features/daily-duo-quest/challengeBank.ts`
- Create: `src/features/daily-duo-quest/questScoring.ts`
- Create: `src/features/daily-duo-quest/questScoring.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `PlayerId`, `DailyQuestDocument`, `GermanChallenge`, `emptyDailyQuest(date)`, `challengeForDate(date)`, `scorePlayer(state, challenge)`, `scoreQuest(document, challenge)`, and `calculateStreak(days, today)`.
- Consumes: no feature-local interfaces.

- [ ] **Step 1: Add the test runner**

Add `"test": "vitest run"` to `scripts` and `"vitest": "^2.1.9"` to `devDependencies` in `package.json`, then run:

```powershell
npm install
```

Expected: dependencies install and `package-lock.json` records Firebase-independent test tooling.

- [ ] **Step 2: Define the domain types**

Create `types.ts` with exact player IDs, move keys, state shapes, and derived result types:

```ts
export type PlayerId = 'alizade' | 'sakar';
export type MoveKey = 'money' | 'health' | 'learning';

export interface DailyMove { text: string; completed: boolean }
export interface PlayerQuestState {
  moves: Record<MoveKey, DailyMove>;
  germanSentence: string;
  answerIndex: number | null;
}
export interface DailyQuestDocument {
  challengeId: string;
  players: Record<PlayerId, PlayerQuestState>;
  updatedAt?: unknown;
}
export interface GermanChallenge {
  id: string;
  phrase: string;
  meaning: string;
  hint: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}
export type DayStatus = 'in-progress' | 'victory' | 'perfect';
export interface QuestScore {
  players: Record<PlayerId, number>;
  combo: number;
  total: number;
  status: DayStatus;
}
```

- [ ] **Step 3: Write failing domain tests**

Create tests that assert the same ISO date always selects the same challenge, all 14 dates select valid challenges, a fully correct player scores 6, both submitted players earn the 2-point combo, two completed moves produce Victory, all moves produce Perfect, and an in-progress today retains yesterday’s streak.

```ts
import { describe, expect, it } from 'vitest';
import { challengeForDate, challenges } from './challengeBank';
import { calculateStreak, emptyDailyQuest, scorePlayer, scoreQuest } from './questScoring';

describe('Daily Duo Quest domain', () => {
  it('selects challenges deterministically', () => {
    expect(challengeForDate('2026-07-30')).toEqual(challengeForDate('2026-07-30'));
    expect(challenges.length).toBeGreaterThanOrEqual(14);
  });

  it('scores a complete correct player with six XP', () => {
    const challenge = challengeForDate('2026-07-30');
    const state = emptyDailyQuest('2026-07-30').players.alizade;
    Object.values(state.moves).forEach((move) => { move.completed = true; });
    state.germanSentence = 'Wir lernen jeden Tag zusammen.';
    state.answerIndex = challenge.correctOption;
    expect(scorePlayer(state, challenge)).toBe(6);
  });

  it('awards a combo and perfect day', () => {
    const challenge = challengeForDate('2026-07-30');
    const quest = emptyDailyQuest('2026-07-30');
    Object.values(quest.players).forEach((player) => {
      Object.values(player.moves).forEach((move) => { move.completed = true; });
      player.germanSentence = 'Heute machen wir Fortschritte.';
      player.answerIndex = 0;
    });
    expect(scoreQuest(quest, challenge)).toMatchObject({ combo: 2, status: 'perfect' });
  });

  it('keeps yesterday streak while today is in progress', () => {
    expect(calculateStreak([
      { date: '2026-07-28', victorious: true },
      { date: '2026-07-29', victorious: true },
      { date: '2026-07-30', victorious: false },
    ], '2026-07-30')).toBe(2);
  });
});
```

- [ ] **Step 4: Run tests and confirm failure**

Run:

```powershell
npm test
```

Expected: FAIL because the challenge and scoring modules do not exist.

- [ ] **Step 5: Implement challenges and scoring**

Create a challenge bank of at least 14 complete `GermanChallenge` objects. Implement deterministic UTC-day indexing:

```ts
export function challengeForDate(date: string): GermanChallenge {
  const day = Math.floor(Date.parse(`${date}T00:00:00Z`) / 86_400_000);
  return challenges[((day % challenges.length) + challenges.length) % challenges.length];
}
```

Implement empty state, player XP, combined outcome, and consecutive-day streak in `questScoring.ts`. Treat a submitted answer as `answerIndex !== null`, require at least two completed moves for Victory, and all three for Perfect.

- [ ] **Step 6: Run domain tests**

Run:

```powershell
npm test
```

Expected: PASS for all Daily Duo Quest domain tests.

### Task 2: Firebase repository and safe public configuration

**Files:**
- Create: `src/features/daily-duo-quest/firebase.ts`
- Create: `src/features/daily-duo-quest/questRepository.ts`
- Create: `.env.example`
- Create: `firestore.rules`
- Modify: `package.json`
- Modify: `README.md`

**Interfaces:**
- Consumes: `DailyQuestDocument`, `PlayerId`, `MoveKey`, and `emptyDailyQuest(date)`.
- Produces: `isFirebaseConfigured`, `subscribeToQuest(date, onData, onError)`, `updateMove(date, player, move, value)`, `updateSentence(date, player, sentence)`, and `submitAnswer(date, player, answerIndex)`.

- [ ] **Step 1: Install Firebase**

Add `"firebase": "^11.2.0"` to dependencies and run:

```powershell
npm install
```

Expected: Firebase is installed and recorded in `package-lock.json`.

- [ ] **Step 2: Add environment configuration**

Create `.env.example` containing all six `VITE_FIREBASE_*` names with placeholder values. In `firebase.ts`, validate that every value exists before calling `initializeApp`; export `isFirebaseConfigured` and a nullable Firestore instance.

- [ ] **Step 3: Implement repository writes**

Use `onSnapshot` for date subscriptions and `setDoc(..., { merge: true })` for isolated player-field writes. Use `serverTimestamp()` for `updatedAt`. When a date document does not exist, create it from `emptyDailyQuest(date)` with the deterministic `challengeId`.

- [ ] **Step 4: Add restrictive public rules**

Create rules for only `/daily_duo_quest/{date}`. Allow reads, creates, and updates; deny deletes. Validate exact top-level and player keys, text lengths, completion booleans, `answerIndex` null-or-integer range 0–3, bounded non-empty `challengeId`, and timestamp `updatedAt`.

- [ ] **Step 5: Document Firebase setup and limitations**

Add a README section with Firebase project creation, Firestore database enablement, environment variable copying, rules deployment, and the explicit warning that unauthenticated users can make structurally valid edits.

- [ ] **Step 6: Verify the TypeScript boundary**

Run:

```powershell
npm run build
```

Expected: TypeScript and Vite build successfully with Firebase configuration absent.

### Task 3: Bilingual page and real-time interactions

**Files:**
- Create: `src/features/daily-duo-quest/translations.ts`
- Create: `src/features/daily-duo-quest/QuestSummary.tsx`
- Create: `src/features/daily-duo-quest/PlayerQuestCard.tsx`
- Create: `src/features/daily-duo-quest/GermanQuest.tsx`
- Create: `src/features/daily-duo-quest/DailyDuoQuest.tsx`
- Create: `src/features/daily-duo-quest/DailyDuoQuest.css`

**Interfaces:**
- Consumes: `Language`, all domain helpers, and repository methods.
- Produces: `<DailyDuoQuest language={language} />`.

- [ ] **Step 1: Add complete English and German copy**

Create one typed translation object containing page titles, category labels, date controls, XP/status labels, save states, setup notice, retry copy, answer feedback, and public-board warning. Export `questCopy(language)`.

- [ ] **Step 2: Build the summary**

Render selected date, previous/next buttons, combined XP out of 14, shared streak, and textual `In Progress`, `Victory`, or `Perfect Day` status. Disable next-date navigation when the selected date is today.

- [ ] **Step 3: Build player cards**

Render labeled 140-character move inputs and keyboard-accessible completion checkboxes. Debounce text persistence by 450ms; write checkbox changes immediately. Display each player’s XP out of 6.

- [ ] **Step 4: Build the German quest**

Render phrase, meaning, hint, a 200-character example sentence, four radio choices, and a submit button per player. Lock a submitted answer. Reveal the correct answer and explanation only when both answer indexes are non-null.

- [ ] **Step 5: Compose real-time page state**

Subscribe whenever selected date changes, preserve last rendered state during read errors, expose retry, rollback failed optimistic writes, and render `Saving`, `Saved`, `Offline`, or `Retry` through an `aria-live` region. When Firebase configuration is absent, show setup instructions without throwing.

- [ ] **Step 6: Match the existing theme responsively**

Use existing CSS variables and glass styling. Place player cards in two columns above 820px and stack them below. Provide visible focus, textual statuses, high-contrast checked states, and mobile-friendly touch targets.

- [ ] **Step 7: Verify component behavior**

Run:

```powershell
npm test
npm run build
```

Expected: all domain tests pass and the production build completes.

### Task 4: Application navigation and final verification

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/App.tsx`
- Modify: `src/components/Sidebar.tsx`
- Modify: `src/components/Icons.tsx`

**Interfaces:**
- Consumes: `<DailyDuoQuest language={language} />`.
- Produces: `/quest` navigation through the existing history-state router.

- [ ] **Step 1: Extend the page union and route maps**

Change `PageView` to:

```ts
export type PageView = 'pulse' | 'chess' | 'quest' | 'docs';
```

Add `'/quest': 'quest'` to `PATH_MAP`, `quest: 'quest'` to `PAGE_TO_PATH`, import `DailyDuoQuest`, and render it when `activePage === 'quest'`.

- [ ] **Step 2: Add a Duo Quest sidebar entry**

Add a small trophy/duo SVG icon to `Icons.tsx`. Add localized `Duo Quest` / `Duo-Quest` copy and a sidebar button that calls `setActivePage('quest')`.

- [ ] **Step 3: Run automated verification**

Run:

```powershell
npm test
npm run build
```

Expected: all tests pass and `dist` builds without TypeScript errors.

- [ ] **Step 4: Verify in two browser sessions**

Start:

```powershell
npm run dev
```

Open `/quest` in two sessions and verify a move edited as Alizade appears in the second session, Sakar updates do not overwrite Alizade, answers reveal only after both submit, EN/DE switches all interface copy, previous dates load, tomorrow is inaccessible, and the layout stacks on a narrow viewport.

- [ ] **Step 5: Verify failure states**

Temporarily run without `.env` and confirm the setup notice renders. Restore configuration, disable the network, and confirm cached data remains visible with an Offline state. Reconnect and confirm queued writes synchronize.
