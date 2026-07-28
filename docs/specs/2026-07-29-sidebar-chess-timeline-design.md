# Design Specification: Sidebar Navigation, Market Pulse Home, & Chess Match Timeline

**Date:** 2026-07-29  
**Project:** acid_reflux  
**Goal:** Transition navigation to a collapsible left sidebar, place Market Pulse as the main Home page, move concept documentation to a dedicated Docs section, and create a Chess Match Timeline page for commits.

---

## 1. Architecture & Component Tree

```text
acid_reflux/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx             # Collapsible left navigation sidebar
│   │   ├── Header.tsx              # Top bar with sidebar toggle & digital clock
│   │   ├── ConceptDocs.tsx         # Documentation hub
│   │   └── TerritoryManager.tsx    # Territory claims board
│   ├── features/
│   │   ├── market-pulse/
│   │   │   └── MarketPulse.tsx     # Home page market pulse component
│   │   └── chess-timeline/
│   │       └── ChessTimeline.tsx   # Chess match style commit log
│   ├── data/
│   │   └── db.json                 # JSON database with moves, claims & info
│   ├── App.tsx                     # Main layout & sidebar state manager
│   └── index.css                   # Glassmorphic sidebar & timeline styles
```

---

## 2. Page Navigation Breakdown
1. **📈 Market Pulse (Home):** Default active view upon landing. Focuses purely on Market Pulse statistics.
2. **♟️ Chess Match (Commit Timeline):** Chess move log presenting git commits as move pairs (`Move 1: White vs Black`) with author badges, git hashes, dates, and change logs.
3. **🗺️ Territory Manager (DB):** Active territory reservation board.
4. **📘 Documentation:** Dedicated concept rules, ethos, and AI remote guidelines.

---

## 3. Database Schema Updates (`src/data/db.json`)
Added `moves` array:
```json
"moves": [
  {
    "moveNumber": 1,
    "player": "Anar (White)",
    "piece": "♔",
    "hash": "fcfd6c4",
    "date": "2026-07-28",
    "title": "Initial acid_reflux ethos and spec",
    "details": ["Add design spec for Guide in Chaos dashboard", "Add .agents/ETHOS.md"]
  }
]
```
