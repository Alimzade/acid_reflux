# Daily Duo Quest Design

## Purpose

Daily Duo Quest turns Acid Reflux into a lightweight shared accountability game for Alizade and Sakar. It combines three personal quality-of-life actions with a cooperative German-learning challenge.

The first version should remain small, public, bilingual, and usable from the existing GitHub Pages deployment. It must not require user accounts.

## Goals

- Help both players take one meaningful daily action for money, health, and learning.
- Make daily German practice social and enjoyable.
- Provide friendly individual competition without weakening cooperation.
- Synchronize changes between both players in real time.
- Preserve completed days for later review.
- Match the existing dark glass visual system and EN/DE localization.

## Non-goals

- Authentication, private profiles, or access-controlled data.
- AI-generated challenges or automated evaluation of free-form German sentences.
- Payments, prizes, leaderboards, social sharing, or additional players.
- General habit tracking beyond the three defined daily categories.
- Push notifications or reminders.

## Navigation

Add a `Duo Quest` page to the existing sidebar and route it at `/quest`.

The label is:

- English: `Duo Quest`
- German: `Duo-Quest`

The page opens the current local calendar day by default. Previous and next controls allow reviewing existing dates. Navigation must not allow moving beyond today.

## Page structure

### Quest summary

The page header displays:

- Current selected date
- Shared streak
- Combined daily XP
- Day status
- Date navigation

Day status values:

- `In Progress`
- `Victory`
- `Perfect Day`

All labels have equivalent German translations.

### Player cards

Show two responsive player cards:

- Alizade
- Sakar

Each card contains:

1. Money Move
2. Health Move
3. Learning Move

Each move has:

- An editable text value limited to 140 characters
- A completion checkbox
- A visible completed state

The card displays the player's current daily XP out of 6.

On desktop, cards appear side by side. On narrow screens, they stack vertically.

### Deutsch Quest

Display one shared German challenge beneath the player cards.

Each challenge includes:

- A German word or phrase
- Its English meaning
- A short usage hint
- A multiple-choice translation question with four choices
- A short explanation shown after both players submit answers

Each player must:

- Write one original German example sentence, limited to 200 characters
- Select and submit one multiple-choice answer

Submitting an answer locks that answer for the selected day. Example sentences remain editable until the day is complete.

The suggested answer and explanation are revealed only after both players submit. Free-form sentences are not automatically judged for correctness.

## Challenge bank

Store a curated challenge bank in the repository. Each challenge has:

```ts
interface GermanChallenge {
  id: string;
  phrase: string;
  meaning: string;
  hint: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}
```

Select the daily challenge deterministically from the local date so both clients always receive the same challenge without storing the challenge body in Firestore.

The initial bank should contain at least 14 practical A2-B1 challenges. Content should focus on daily life, work, collaboration, money, health, and learning.

## Scoring

### Individual XP

- Completed Money Move: 1 XP
- Completed Health Move: 1 XP
- Completed Learning Move: 1 XP
- Non-empty German example sentence: 1 XP
- Correct translation answer: 2 XP

Maximum individual XP is 6.

### Team XP

When both players submit an example sentence and translation answer, award 2 Team Combo XP.

Maximum combined daily XP is:

```text
Alizade 6 + Sakar 6 + Team Combo 2 = 14 XP
```

### Day outcomes

`Victory` requires both players to:

- Complete at least two of their three personal moves
- Submit a non-empty German example sentence
- Submit a translation answer

`Perfect Day` requires both players to:

- Complete all three personal moves
- Submit a non-empty German example sentence
- Submit a translation answer

Translation answers do not need to be correct for Victory or Perfect Day. Correctness affects XP, not participation.

### Shared streak

A Victory or Perfect Day counts toward the shared streak.

The displayed streak is the number of consecutive victorious calendar days ending today. If today is still in progress, count consecutive victories ending yesterday. A missed past day breaks the streak.

## Firebase architecture

Use Cloud Firestore through the Firebase browser SDK. The existing GitHub Pages deployment remains static.

Use one document per local calendar date:

```text
daily_duo_quest/{YYYY-MM-DD}
```

Document shape:

```ts
interface DailyQuestDocument {
  challengeId: string;
  players: {
    alizade: PlayerQuestState;
    sakar: PlayerQuestState;
  };
  updatedAt: Timestamp;
}

interface PlayerQuestState {
  moves: {
    money: DailyMove;
    health: DailyMove;
    learning: DailyMove;
  };
  germanSentence: string;
  answerIndex: number | null;
}

interface DailyMove {
  text: string;
  completed: boolean;
}
```

XP, status, and streak are derived in the client and are not stored as authoritative values.

## Synchronization

- Subscribe to the selected date with a Firestore real-time listener.
- Create the document with empty player state when it does not exist.
- Debounce text updates to avoid writing on every keystroke.
- Write checkbox and answer changes immediately.
- Use merge writes so one player's change does not replace the other player's state.
- Show `Saving`, `Saved`, `Offline`, or `Retry` status.
- Preserve the last rendered data if a listener or write fails.

## Public access and Firestore rules

The board is intentionally publicly viewable and editable without authentication. The interface must state this clearly.

Firestore security rules must:

- Permit reads only from the `daily_duo_quest` collection.
- Permit create and update, but not delete.
- Reject unknown top-level fields.
- Require exactly the two player keys `alizade` and `sakar`.
- Limit move text to 140 characters.
- Limit German sentences to 200 characters.
- Require booleans for completion fields.
- Require answer indexes to be `null` or an integer from 0 through 3.
- Require a non-empty bounded challenge ID.
- Require a server timestamp-compatible update field.

These rules reduce malformed or oversized writes, but they cannot identify or block a person who submits a structurally valid edit. The public-editing limitation must be documented in the README.

## Firebase configuration

Read Firebase configuration from Vite environment variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Add `.env.example` with placeholder values. Do not commit a populated `.env` file.

Firebase browser configuration is not a secret. Firestore rules are the security boundary.

If configuration is missing, render a setup notice instead of crashing the application.

## Components and boundaries

Keep the feature under:

```text
src/features/daily-duo-quest/
```

Suggested units:

- `DailyDuoQuest.tsx`: page composition and selected date
- `QuestSummary.tsx`: date, XP, status, and streak
- `PlayerQuestCard.tsx`: one player's three moves and XP
- `GermanQuest.tsx`: shared language challenge
- `challengeBank.ts`: curated challenge definitions and deterministic selection
- `questScoring.ts`: pure XP, outcome, and streak calculations
- `questRepository.ts`: Firestore conversion, subscription, and writes
- `types.ts`: feature-specific data types
- `translations.ts`: EN/DE feature copy

Firestore details must not leak into visual components. Scoring and challenge selection must remain pure and independently testable.

## Localization

Translate all interface labels, statuses, instructions, errors, and accessibility text into English and German.

The German phrase, example sentences, and challenge choices remain unchanged when switching interface language. Their English explanations may use German equivalents in DE mode where helpful, but the learning target must remain clear.

Reuse the existing application-level `Language` state.

## Accessibility

- Associate every input with a visible label.
- Make completion controls keyboard accessible.
- Provide text alongside color-based status indicators.
- Announce save state and answer results through an `aria-live` region.
- Maintain visible focus styles.
- Do not disable zoom or text selection inside inputs.

## Error handling

- Missing Firebase configuration: show setup instructions.
- Read failure: keep existing data and show a retry action.
- Write failure: restore the last confirmed value and show an error.
- Offline state: show cached data as offline and queue supported Firestore writes.
- Invalid local data: fall back to an empty valid state.
- Missing challenge ID: derive the correct challenge from the selected date.

## Verification

Add tests for:

- Deterministic challenge selection
- Individual and combined XP
- Victory and Perfect Day rules
- Streak behavior with today in progress
- Firestore document serialization and validation
- EN/DE feature labels

Also verify:

- Production TypeScript/Vite build
- Side-by-side desktop layout
- Stacked mobile layout
- Real-time synchronization in two browser sessions
- Missing-configuration behavior
- Firestore rules using the Firebase Emulator Suite or rules tests

## Delivery sequence

1. Add pure types, challenge bank, scoring, and tests.
2. Add Firebase configuration and repository boundary.
3. Add page components and sidebar routing.
4. Add EN/DE copy and responsive styling.
5. Add Firestore rules and environment documentation.
6. Verify locally, with emulators, and through a production build.
