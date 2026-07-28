# Implementation Plan: Acid Reflux Modern UI & JSON DB

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold React application files, create `src/data/db.json`, build modern dark-mode components for Concept Docs and Territory Reservation, and assemble the main layout.

**Architecture:** Single page React TypeScript application with component modularity and central JSON database.

**Tech Stack:** React, TypeScript, Vanilla CSS.

## Global Constraints
- Preserve `.agents/AGENTS.md` and `.agents/ETHOS.md`.
- Output git commands as plain text for user execution.
- Maintain modern glassmorphism aesthetic in CSS.

---

### Task 1: Setup React Files & Local Database (`src/data/db.json`)

**Files:**
- Create: `src/data/db.json`
- Create: `src/types/index.ts`
- Create: `index.html`
- Create: `package.json`
- Create: `vite.config.ts`

- [ ] **Step 1: Create `src/types/index.ts`**
Define TypeScript interfaces for Claim, ProjectInfo, and Database schema.

- [ ] **Step 2: Create `src/data/db.json`**
Populate initial JSON data with project info, rules, and initial territory claim.

- [ ] **Step 3: Create package.json and vite.config.ts**
Ensure minimal standard Vite React configuration.

---

### Task 2: Build UI Components & CSS Design System

**Files:**
- Create: `src/index.css`
- Create: `src/components/Header.tsx`
- Create: `src/components/ConceptDocs.tsx`
- Create: `src/components/TerritoryManager.tsx`
- Create: `src/App.tsx`
- Create: `src/main.tsx`

- [ ] **Step 1: Write `src/index.css` design system**
Implement HSL colors, glassmorphism card classes, glowing badges, and responsive grid layouts.

- [ ] **Step 2: Write `Header.tsx`, `ConceptDocs.tsx`, and `TerritoryManager.tsx`**
Build interactive React components reading from `db.json` and offering claim reservation forms.

- [ ] **Step 3: Assemble `App.tsx` and `main.tsx`**
Combine components into tabbed/scaffolded view and verify React compilation.
