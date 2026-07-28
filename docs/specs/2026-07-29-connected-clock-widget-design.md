# Design Specification: Connected Unified Clock & Timezone Widget

**Date:** 2026-07-29  
**Project:** acid_reflux  
**Goal:** Redesign the digital clock in `Header.tsx` into a single connected visual container with a right-attached square timezone trigger.

---

## 1. Structure & Layout
- **Unified Outer Container:** `.digital-clock-unified` (single dark glassmorphic box with border and shadow).
- **Left Section (Time Readout):** `.digital-clock-main` showing `LOCAL TIME  00:05:24`.
- **Right Section (Connected Square Trigger):** `.clock-tz-trigger` (vertical divider line + square icon trigger `🌐`).
- **Tooltip Popup:** Positioned floating below the right connected square trigger when hovered/focused.

---

## 2. Target Files
- `src/components/Header.tsx`
- `src/index.css`
