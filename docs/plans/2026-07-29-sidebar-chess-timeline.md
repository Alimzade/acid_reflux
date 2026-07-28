# Implementation Plan: Sidebar Navigation & Chess Match Timeline

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement collapsible left sidebar, Market Pulse home page, Chess Match commit timeline, and updated `db.json`.

**Architecture:** React state for active page view & sidebar collapsed state.

**Tech Stack:** React, TypeScript, Vanilla CSS.

## Global Constraints
- Preserve digital clock widget in top header.
- Output git commands as plain text for user execution.

---

### Task 1: Update `src/types/index.ts` & `src/data/db.json`

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/data/db.json`

- [ ] **Step 1: Update `src/types/index.ts`**
Add `ChessMove` interface to database model.

- [ ] **Step 2: Update `src/data/db.json`**
Add `moves` array representing project commit history.

---

### Task 2: Create MarketPulse & ChessTimeline Components

**Files:**
- Create: `src/features/market-pulse/MarketPulse.tsx`
- Create: `src/features/chess-timeline/ChessTimeline.tsx`

- [ ] **Step 1: Create `MarketPulse.tsx`**
Build clean home page market pulse component.

- [ ] **Step 2: Create `ChessTimeline.tsx`**
Build alternating chess move timeline log with author badges, git hashes, and dates.

---

### Task 3: Create Sidebar & Assemble App Layout

**Files:**
- Create: `src/components/Sidebar.tsx`
- Modify: `src/components/Header.tsx`
- Modify: `src/App.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Create `Sidebar.tsx` and update `Header.tsx`**
Add sidebar navigation list and sidebar toggle button.

- [ ] **Step 2: Update `App.tsx` & `index.css`**
Connect sidebar collapse state and test page switching.
