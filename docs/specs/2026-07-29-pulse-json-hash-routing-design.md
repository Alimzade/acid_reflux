# Design Specification: Static Pulse JSON, Date Selector, & Hash Routing

**Date:** 2026-07-29  
**Project:** acid_reflux  
**Goal:** Eliminate slow external API calls by serving market pulse stories from a version-controlled static `pulse.json` dataset (last 3 days), adding a top-right date selector, and implementing hash-based URL routing (`/#/home`, `/#/chess`, `/#/docs`) for page reload persistence on GitHub Pages.

---

## 1. Static Pulse Database Schema (`src/data/pulse.json`)

```json
{
  "dates": ["2026-07-29", "2026-07-28", "2026-07-27"],
  "storiesByDate": {
    "2026-07-29": [
      {
        "url": "https://example.com/story-1",
        "title": "Global Central Banks Align on Rate Stabilizations",
        "seendate": "2026-07-29T10:00:00Z",
        "domain": "reuters.com",
        "impact": "High",
        "sentiment": "Positive",
        "category": "Macro",
        "tickers": ["USD", "EUR"]
      }
    ],
    "2026-07-28": [],
    "2026-07-27": []
  }
}
```

---

## 2. Hash-Based URL Routing
- **Routes:**
  - `/#/home` -> Home (Market Pulse)
  - `/#/chess` -> Chess Match Timeline
  - `/#/docs` -> Documentation & Ethos
- Integrates with browser `window.location.hash` and `hashchange` event.
- Prevents page resets to Home upon browser reload.

---

## 3. Date Selector UI
- Dropdown positioned in top-right of `MarketPulse` header.
- Displays formatted dates: "Today (Jul 29)", "Yesterday (Jul 28)", "Jul 27".
- Instant switching between market snapshots without external fetch delays.
