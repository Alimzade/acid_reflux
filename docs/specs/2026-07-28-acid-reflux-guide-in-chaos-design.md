# Acid Reflux: Uncoordinated Collaboration Design Specification

**Date:** 2026-07-28  
**Project:** acid_reflux  
**Concept:** Guide in Chaos — An uncoordinated, highly creative, multi-developer & multi-AI collaborative React application.

---

## 1. Overview & Vision
*Acid Reflux* is an experimental, hopeful, and fun collaborative repository. Developers and AI agents contribute concurrently without strict central management. To prevent total collision while preserving creative freedom, the application centers around a **"Guide in Chaos"** dashboard where team members reserve territory (folders/features), announce active work, and view current project modules.

---

## 2. Architecture & Technology Stack
- **Build Tool & Framework:** Vite + React (TypeScript).
- **Styling:** Modern Vanilla CSS with dark mode aesthetics, glassmorphism, vibrant gradients, and micro-animations.
- **State & Territory Registry:** Lightweight JSON schema (`src/data/registry.json`) tracking reserved zones, developers, active AI subagents, and feature modules.
- **Modular Directory Structure:**
  ```text
  acid_reflux/
  ├── .agents/
  │   ├── AGENTS.md            # Repository & AI collaboration rules
  │   └── ETHOS.md             # Project vision & agent collaboration guidelines
  ├── docs/
  │   └── specs/               # Design specs and documentation
  ├── src/
  │   ├── assets/              # Shared media and styles
  │   ├── components/          # Shared UI components (Guide in Chaos UI)
  │   ├── data/
  │   │   └── registry.json    # Territory reservation registry
  │   ├── features/            # Feature modules reserved by developers/AI pairs
  │   ├── App.tsx              # Main entry combining Guide in Chaos & Feature Sandbox
  │   └── main.tsx             # Application bootstrap
  ├── README.md                # Polite, hopeful project introduction & Git etiquette
  └── package.json
  ```

---

## 3. Core Features: "Guide in Chaos" Page
1. **Hero Section:**
   - Hopeful, vibrant introduction with glassmorphic banner.
   - Live reminder of core principles: Good manners, constant AI alignment, frequent `git pull` & `git push`.
2. **Territory Reservation Board (Claims Board):**
   - Displays developer/AI pairs, active folder paths (`src/features/...`), and feature descriptions.
   - Status indicators (`Active`, `Completed`, `Shelved`).
3. **Module Showcase Grid:**
   - Dynamic sandbox container rendering exported feature components registered in `registry.json`.
4. **Git Etiquette & Collaboration Card:**
   - Quick guide for contributors on pull/push frequency and conflict resolution.

---

## 5. Agent Guidelines & Remote Connection (`.agents/ETHOS.md`)
- **Constant AI Connection:** Encourages developers and agents to maintain continuous context and share agent skills as the codebase grows.
- **Polite & Hopeful Tone:** Maintain respectful, encouraging communication in code, commits, and agent notes.
- **Territory Respect:** Check `registry.json` before modifying existing `src/features/` subfolders; claim a new folder for new experiments.

---

## 6. Verification Plan
- Verify Vite project initialization and TypeScript compilation (`npm run build`).
- Verify dev server startup (`npm run dev`).
- Verify visual UI presentation and interactive claim board functionality.
