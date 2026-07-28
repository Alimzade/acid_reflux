# Implementation Plan: Static Pulse JSON, Date Selector, & Hash Routing

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `src/data/pulse.json`, update `MarketPulse.tsx` with date selector, and implement hash-based URL routing in `App.tsx`.

---

### Task 1: Create `src/data/pulse.json` & Update Types

**Files:**
- Create: `src/data/pulse.json`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Create `src/data/pulse.json`**
Add 3 days of market pulse stories data (Jul 29, Jul 28, Jul 27).

- [ ] **Step 2: Update `src/types/index.ts`**
Add `PulseDataset` interface.

---

### Task 2: Implement Hash Routing in `App.tsx` & `Sidebar.tsx`

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/Sidebar.tsx`

- [ ] **Step 1: Update `App.tsx`**
Sync `activePage` state with `window.location.hash` (`/#/home`, `/#/chess`, `/#/docs`).

- [ ] **Step 2: Update `Sidebar.tsx`**
Update click handlers to set location hash.

---

### Task 3: Refactor `MarketPulse.tsx` to Use `pulse.json` & Date Selector

**Files:**
- Modify: `src/components/MarketPulse.tsx`

- [ ] **Step 1: Refactor `MarketPulse.tsx`**
Remove external GDELT API JSONP script loading, load from static `pulse.json`, and render date selector dropdown.
