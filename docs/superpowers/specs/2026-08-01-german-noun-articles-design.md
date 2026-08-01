# Design Spec: German Noun Article & Gender Hover Tooltips

## Context
In the **Language Learning Hub** (`DailyDuoQuest` / `LanguageLearning.tsx`), users learn essential German phrases across CEFR levels (A1–C2). German nouns change their articles depending on grammatical case (Nominative, Accusative, Dative, Genitive), which can confuse learners (e.g. seeing *"den Zusammenhang"* instead of dictionary *"der Zusammenhang"*).

This feature adds interactive hover tooltips over German nouns to reveal their base dictionary article (`der`, `die`, `das`), grammatical gender (`masculine`, `feminine`, `neuter`), and case transformation notes.

---

## 1. Data Schema Enhancements (`src/features/daily-duo-quest/languageData.ts`)

Extend `EssentialPhrase` interface to support an optional `nouns` array:

```ts
export interface NounMetadata {
  word: string;       // Target noun as it appears in the phrase, e.g. "Zusammenhang"
  article: 'der' | 'die' | 'das';
  gender: 'masculine' | 'feminine' | 'neuter';
  noteEn?: string;    // e.g. "Accusative case: den Zusammenhang"
  noteDe?: string;    // e.g. "Akkusativ: den Zusammenhang"
}

export interface EssentialPhrase {
  category: 'greetings' | 'basics' | 'travel' | 'social' | 'idioms' | 'advanced';
  level: CefrLevel;
  phrase: string;
  pronunciation: string;
  en: string;
  de: string;
  nouns?: NounMetadata[];
}
```

### Data Annotations
Annotate key German nouns in `TOP_33_LANGUAGES` (German entries), including:
- `"Bahnhof"` -> `article: 'der'`, `gender: 'masculine'`
- `"Kaffee"` -> `article: 'der'`, `gender: 'masculine'`, `noteEn: "Accusative case: einen Kaffee"`
- `"Zusammenhang"` -> `article: 'der'`, `gender: 'masculine'`, `noteEn: "Accusative case: den Zusammenhang"`
- `"Toilette"` -> `article: 'die'`, `gender: 'feminine'`
- `"Meinung"` -> `article: 'die'`, `gender: 'feminine'`, `noteEn: "Dative case: meiner Meinung"`
- `"Karte"` -> `article: 'die'`, `gender: 'feminine'`
- `"Stamm"` -> `article: 'der'`, `gender: 'masculine'`
- `"Frage"` -> `article: 'die'`, `gender: 'feminine'`
- `"Lösung"` -> `article: 'die'`, `gender: 'feminine'`
- `"Hund"` -> `article: 'der'`, `gender: 'masculine'`

---

## 2. Component Logic (`src/features/daily-duo-quest/LanguageLearning.tsx`)

### Interactive Noun Parser
Create a helper component `RenderPhraseWithNounTooltips` that parses a phrase string against its `nouns` array:
- Matches whole noun tokens in the phrase string.
- Renders non-noun text as plain text spans.
- Renders matching nouns wrapped in a focusable, hoverable `.noun-hover-target` container.
- Embeds a glassmorphic micro-tooltip `.noun-tooltip` inside the container.

### Tooltip Content
- **Base Article & Noun**: e.g., `der Zusammenhang`
- **Gender Pill**:
  - `der` (masculine) -> Cyan badge (`var(--accent-cyan)`)
  - `die` (feminine) -> Pink badge (`var(--accent-pink)`)
  - `das` (neuter) -> Green badge (`#22c55e`)
- **Case Transformation Note** (if provided): e.g. *"In accusative case: den Zusammenhang"* / *"Akkusativ: den Zusammenhang"*.

---

## 3. Design System & CSS Standards (`LanguageLearning.css`)

- **Interactive Target (`.noun-hover-target`)**:
  - `border-bottom: 1px dotted var(--accent-cyan)`
  - `cursor: help`
  - `position: relative`
- **Tooltip Container (`.noun-tooltip`)**:
  - `position: absolute; bottom: 125%; left: 50%; transform: translateX(-50%);`
  - Glassmorphic card styling: `.glass-card` / `backdrop-filter: blur(12px)`
  - `background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255, 255, 255, 0.12)`
  - `padding: 0.4rem 0.65rem; border-radius: 6px; font-size: 0.78rem; z-index: 50;`
  - Micro-animation: fade & slight upward slide on hover (`opacity: 0` -> `opacity: 1`).

---

## 4. Verification & Testing Strategy

1. Run `npx tsc --noEmit` to verify zero TypeScript compilation errors.
2. Run `npm run test` to verify Vitest suite passes clean.
3. Validate UI interactive hover on German phrases in the browser.
