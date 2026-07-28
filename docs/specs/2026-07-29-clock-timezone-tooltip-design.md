# Design Specification: Digital Clock Timezone Tooltip (Approach A)

**Date:** 2026-07-29  
**Project:** acid_reflux  
**Goal:** Enhance the digital clock in `Header.tsx` with an interactive Info button (`ℹ️`) that reveals a glassmorphic floating tooltip showing timezone name, UTC offset, and local date.

---

## 1. UI Components & Layout
- **Target File:** `src/components/Header.tsx`
- **Styling File:** `src/index.css`
- **Clock Layout:**
  - Standard time display: `LOCAL TIME 23:58:16`
  - Info button: `<button className="clock-info-btn" aria-label="Timezone info">ℹ️</button>`
  - Tooltip container: `<div className="clock-tooltip">...</div>` appearing above/below on hover or focus.

---

## 2. Dynamic Timezone Data
- **Timezone Name:** Extracted via `Intl.DateTimeFormat().resolvedOptions().timeZone` (e.g. `Europe/Stockholm`).
- **UTC Offset:** Calculated from Date timezone offset (e.g., `UTC+02:00`).
- **Local Date:** Formatted date string (e.g. `Wednesday, July 29, 2026`).
