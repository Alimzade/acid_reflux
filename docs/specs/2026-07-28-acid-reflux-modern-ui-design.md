# Design Specification: Acid Reflux Modern UI & JSON Database System

**Date:** 2026-07-28  
**Project:** acid_reflux  
**Goal:** Build a minimal, modern React single-page application containing the project concept documentation, an interactive Territory Reservation board, and a git-versioned local JSON database (`src/data/db.json`).

---

## 1. Architecture & Core Files

- **`src/data/db.json`**: Central git-committed database storing claims, developer names, AI agent pairs, reserved folder paths, and concept documentation.
- **`src/components/Header.tsx`**: Header navigation and live philosophy ticker.
- **`src/components/ConceptDocs.tsx`**: Visual card layout presenting project rules, AI remote connection guidelines, and Git push/pull frequency.
- **`src/components/TerritoryManager.tsx`**: Territory reservation UI displaying claimed folders and allowing contributors to add/export new claims.
- **`src/App.tsx`**: App container orchestrating navigation between Concept Docs and Territory Manager.
- **`src/index.css`**: Modern vanilla CSS with HSL dark mode, glassmorphism, glowing gradients, and smooth hover micro-animations.

---

## 2. Database Schema (`src/data/db.json`)

```json
{
  "projectInfo": {
    "name": "acid_reflux",
    "tagline": "Uncoordinated Collaboration in Harmony",
    "ethos": "Polite manners, continuous AI context, and frequent git synchronization."
  },
  "claims": [
    {
      "id": "claim-1",
      "developer": "Anar & AI Pair",
      "aiAgent": "Antigravity",
      "reservedPath": "src/features/guide-in-chaos",
      "title": "Guide in Chaos Dashboard",
      "description": "Territory manager and interactive rules board.",
      "status": "active",
      "timestamp": "2026-07-28"
    }
  ]
}
```

---

## 3. UI Aesthetics
- Dark mode theme with indigo, cyan, and magenta ambient radial gradients.
- Glassmorphic card styling (`backdrop-filter: blur(12px)`).
- Interactive territory claim form with copy-to-clipboard / JSON update snippet generator.
