# Guide in Chaos & Acid Reflux Initialization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a Vite + React + TypeScript application with a "Guide in Chaos" dashboard, a territory reservation system (`registry.json`), project ethos documentation (`.agents/ETHOS.md`), and updated `README.md`.

**Architecture:** Vite-powered React single page application. Modular `src/features/` directory for developer claims, controlled via `src/data/registry.json`. Modern vanilla CSS with dark mode aesthetics and glassmorphism.

**Tech Stack:** React 18+, TypeScript, Vite, Vanilla CSS.

## Global Constraints
- Preserve `.agents/AGENTS.md` rules without deleting existing rules.
- Follow commit rules: output git commit commands as plain text for the user, concise subject + dashed bullet points.
- Implement rich, modern aesthetics (glassmorphism, vibrant dark gradient theme, smooth UI micro-interactions).

---

### Task 1: Initialize Vite Project & Setup Directory Architecture

**Files:**
- Create/Modify: `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/vite-env.d.ts`

**Interfaces:**
- Consumes: Standard Vite React TypeScript template structure.
- Produces: Runnable React app scaffold.

- [ ] **Step 1: Scaffold Vite React TypeScript app**
Run Vite template generation or install dependencies (`react`, `react-dom`, `vite`, `@vitejs/plugin-react`, `typescript`).

- [ ] **Step 2: Verify build and dependencies**
Run `npm run build` or inspect build status to ensure non-breaking initial configuration.

---

### Task 2: Ethos Documentation & README Update

**Files:**
- Create: `.agents/ETHOS.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: Design spec requirements for uncoordinated collaboration guidelines.
- Produces: Clear documentation for human developers and AI agents.

- [ ] **Step 1: Create `.agents/ETHOS.md`**
Detail constant AI remote connection, polite manners, hopeful attitude, and territory reservation rules.

- [ ] **Step 2: Update `README.md`**
Write a welcoming, hopeful README explaining the Acid Reflux experiment, Git etiquette (`git pull --rebase` / `git push`), and how to claim territory.

---

### Task 3: Territory Registry & Guide in Chaos Dashboard Component

**Files:**
- Create: `src/data/registry.json`
- Create: `src/components/GuideInChaos.tsx`
- Create: `src/components/GuideInChaos.css`
- Modify: `src/App.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `src/data/registry.json` schema.
- Produces: Visual claim board, active project metrics, territory reservation UI, and dynamic feature sandbox container.

- [ ] **Step 1: Create `src/data/registry.json`**
Initialize with default active developers, AI agents, reserved folders, and initial feature modules.

- [ ] **Step 2: Create `GuideInChaos.tsx` and styling**
Build a glassmorphic dashboard header, territory cards, rules of chaos banner, and active feature viewer.

- [ ] **Step 3: Connect `src/App.tsx` and test dev build**
Integrate `GuideInChaos` into `App.tsx` and verify clean rendering.
