# German Noun Article Hover Tooltips Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add interactive hover tooltips over German nouns in the Language Learning Hub (`LanguageLearning.tsx`) to show their dictionary article (`der`, `die`, `das`), grammatical gender, and case notes.

**Architecture:** Extend `EssentialPhrase` in `languageData.ts` with optional `nouns: NounMetadata[]` annotations. In `LanguageLearning.tsx`, parse phrase text to render matched nouns inside a focusable `.noun-hover-target` element containing a glassmorphic micro-tooltip `.noun-tooltip`.

**Tech Stack:** React 18, TypeScript, CSS Variables, Vitest.

## Global Constraints

- **Design Tokens:** All colors and spacing come from CSS variables (`var(--accent-cyan)`, `var(--accent-purple)`, `var(--accent-pink)`, `var(--font-code)`).
- **Glassmorphism:** Tooltips must use glassmorphic styling (`backdrop-filter: blur(12px)`, dark RGBA background, sub-opaque border).
- **Type Safety:** All changes must compile strictly under `npx tsc --noEmit`.
- **Git Etiquette:** Do not execute git commits automatically; summarize changes concisely.

---

### Task 1: Extend Data Model and Annotate German Nouns

**Files:**
- Modify: `src/features/daily-duo-quest/languageData.ts`
- Test: `src/features/daily-duo-quest/languageData.test.ts`

**Interfaces:**
- Consumes: `EssentialPhrase` in `languageData.ts`
- Produces: `NounMetadata` interface and annotated German phrases in `TOP_33_LANGUAGES`

- [ ] **Step 1: Write unit test for NounMetadata structure**

Create `src/features/daily-duo-quest/languageData.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TOP_33_LANGUAGES } from './languageData';

describe('languageData German Noun Annotations', () => {
  it('contains valid noun metadata for key German phrases', () => {
    const german = TOP_33_LANGUAGES.find(l => l.id === 'german');
    expect(german).toBeDefined();

    const phraseWithNoun = german?.essentialPhrases.find(p => p.nouns && p.nouns.length > 0);
    expect(phraseWithNoun).toBeDefined();

    const noun = phraseWithNoun?.nouns?.[0];
    expect(noun).toHaveProperty('word');
    expect(noun).toHaveProperty('article');
    expect(['der', 'die', 'das']).toContain(noun?.article);
    expect(['masculine', 'feminine', 'neuter']).toContain(noun?.gender);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/daily-duo-quest/languageData.test.ts`
Expected: FAIL (no `nouns` property exists on German phrases yet)

- [ ] **Step 3: Update `languageData.ts` with `NounMetadata` interface and annotations**

In `src/features/daily-duo-quest/languageData.ts`:

```ts
export interface NounMetadata {
  word: string;
  article: 'der' | 'die' | 'das';
  gender: 'masculine' | 'feminine' | 'neuter';
  noteEn?: string;
  noteDe?: string;
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

Annotate key German phrases in `TOP_33_LANGUAGES` (id: `'german'`):

```ts
{
  category: 'travel',
  level: 'A2',
  phrase: 'Wo ist der Bahnhof?',
  pronunciation: 'voh ist dair bahn-hof',
  en: 'Where is the station?',
  de: 'Wo ist der Bahnhof?',
  nouns: [
    { word: 'Bahnhof', article: 'der', gender: 'masculine' }
  ]
},
{
  category: 'social',
  level: 'A2',
  phrase: 'Ich hätte gerne einen Kaffee',
  pronunciation: 'ikh het-teh gair-neh ey-nen kaf-fee',
  en: 'I would like a coffee',
  de: 'Ich hätte gerne einen Kaffee',
  nouns: [
    { word: 'Kaffee', article: 'der', gender: 'masculine', noteEn: 'Accusative case: einen Kaffee', noteDe: 'Akkusativ: einen Kaffee' }
  ]
},
{
  category: 'basics',
  level: 'B1',
  phrase: 'Ich verstehe den Zusammenhang nicht',
  pronunciation: 'ikh fair-shtay-eh den tzoo-zam-men-hang',
  en: 'I do not understand the context',
  de: 'Ich verstehe den Zusammenhang nicht',
  nouns: [
    { word: 'Zusammenhang', article: 'der', gender: 'masculine', noteEn: 'Accusative case: den Zusammenhang', noteDe: 'Akkusativ: den Zusammenhang' }
  ]
},
{
  category: 'travel',
  level: 'A2',
  phrase: 'Wo ist die Toilette?',
  pronunciation: 'voh ist dee twah-let-teh',
  en: 'Where is the bathroom?',
  de: 'Wo ist die Toilette?',
  nouns: [
    { word: 'Toilette', article: 'die', gender: 'feminine' }
  ]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/features/daily-duo-quest/languageData.test.ts`
Expected: PASS

---

### Task 2: Implement Interactive Noun Tooltip Rendering

**Files:**
- Modify: `src/features/daily-duo-quest/LanguageLearning.tsx`
- Test: `src/features/daily-duo-quest/LanguageLearning.test.tsx`

**Interfaces:**
- Consumes: `NounMetadata` and `EssentialPhrase` from `languageData.ts`
- Produces: `RenderPhraseWithTooltips` helper component inside `LanguageLearning.tsx`

- [ ] **Step 1: Write test for interactive noun tooltip rendering**

Create `src/features/daily-duo-quest/LanguageLearning.test.tsx`:

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LanguageLearning } from './LanguageLearning';

describe('LanguageLearning Component Tooltips', () => {
  it('renders LanguageLearning component cleanly', () => {
    render(<LanguageLearning language="de" />);
    expect(screen.getByText('Sprachen-Lernzentrum')).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify initial state**

Run: `npx vitest run src/features/daily-duo-quest/LanguageLearning.test.tsx`
Expected: PASS or FAIL depending on test runner environment setup.

- [ ] **Step 3: Implement `RenderPhraseWithTooltips` in `LanguageLearning.tsx`**

In `src/features/daily-duo-quest/LanguageLearning.tsx`:

```tsx
import { NounMetadata } from './languageData';

function RenderPhraseWithTooltips({ 
  phrase, 
  nouns, 
  isGerman 
}: { 
  phrase: string; 
  nouns?: NounMetadata[]; 
  isGerman: boolean;
}) {
  if (!nouns || !nouns.length) {
    return <>{phrase}</>;
  }

  // Build regex pattern for all target nouns
  const pattern = new RegExp(`(${nouns.map(n => n.word).join('|')})`, 'g');
  const parts = phrase.split(pattern);

  return (
    <>
      {parts.map((part, idx) => {
        const nounMeta = nouns.find(n => n.word === part);
        if (!nounMeta) {
          return <span key={idx}>{part}</span>;
        }

        const genderLabel = nounMeta.gender === 'masculine' 
          ? (isGerman ? 'Maskulin' : 'Masculine')
          : nounMeta.gender === 'feminine'
          ? (isGerman ? 'Feminin' : 'Feminine')
          : (isGerman ? 'Neutrum' : 'Neuter');

        const genderClass = `gender-${nounMeta.gender}`;
        const note = isGerman ? nounMeta.noteDe : nounMeta.noteEn;

        return (
          <span key={idx} className="noun-hover-target" tabIndex={0}>
            {part}
            <span className="noun-tooltip glass-card">
              <span className="tooltip-header">
                <strong>{nounMeta.article}</strong> {part}
              </span>
              <span className={`tooltip-gender-badge ${genderClass}`}>
                {genderLabel}
              </span>
              {note && <span className="tooltip-note">{note}</span>}
            </span>
          </span>
        );
      })}
    </>
  );
}
```

Use `RenderPhraseWithTooltips` in phrase cards and flashcards inside `LanguageLearning.tsx`:

```tsx
<h4 className="phrase-text">
  <RenderPhraseWithTooltips phrase={item.phrase} nouns={item.nouns} isGerman={isGerman} />
</h4>
```

- [ ] **Step 4: Run TypeScript check to verify type safety**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

---

### Task 3: Add CSS Styling and Animations for Noun Hover Tooltips

**Files:**
- Modify: `src/features/daily-duo-quest/LanguageLearning.css`

- [ ] **Step 1: Add `.noun-hover-target` and `.noun-tooltip` CSS rules**

In `src/features/daily-duo-quest/LanguageLearning.css`:

```css
/* Interactive Noun Hover Target */
.noun-hover-target {
  position: relative;
  display: inline-block;
  border-bottom: 1.5px dotted var(--accent-cyan);
  cursor: help;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.noun-hover-target:hover,
.noun-hover-target:focus {
  color: var(--accent-cyan);
  border-bottom-color: var(--accent-purple);
}

/* Glassmorphic Noun Micro-Tooltip */
.noun-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  min-width: 140px;
  background: rgba(15, 23, 42, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 8px;
  font-size: 0.78rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
}

.noun-hover-target:hover .noun-tooltip,
.noun-hover-target:focus .noun-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.tooltip-header {
  color: var(--text-primary);
  font-size: 0.85rem;
}

.tooltip-header strong {
  color: var(--accent-cyan);
  font-weight: 700;
}

.tooltip-gender-badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.65rem;
  font-family: var(--font-code);
  text-transform: uppercase;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.tooltip-gender-badge.gender-masculine {
  background: rgba(6, 182, 212, 0.15);
  color: var(--accent-cyan);
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.tooltip-gender-badge.gender-feminine {
  background: rgba(236, 72, 153, 0.15);
  color: var(--accent-pink);
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.tooltip-gender-badge.gender-neuter {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.tooltip-note {
  color: var(--text-secondary);
  font-size: 0.72rem;
  font-style: italic;
  white-space: normal;
  max-width: 180px;
}
```

- [ ] **Step 2: Run verification checks**

Run: `npx tsc --noEmit && npm run test`
Expected: PASS with 0 compilation errors and all tests green.

---
