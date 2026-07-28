# Design Specification: Interactive Tech Clock Color Palette

**Date:** 2026-07-29  
**Project:** acid_reflux  
**Goal:** Allow users to click the digital clock numbers to cycle through 6 bold, masculine tech/sci-fi color presets with matching glows.

---

## 1. Palette Specifications
1. **Cyber White:** `#ffffff` (Text shadow: `rgba(255, 255, 255, 0.4)`)
2. **Deep Electric Blue:** `#3b82f6` (Text shadow: `rgba(59, 130, 246, 0.5)`)
3. **Matrix Green:** `#22c55e` (Text shadow: `rgba(34, 197, 94, 0.5)`)
4. **Hyper Cyan:** `#06b6d4` (Text shadow: `rgba(6, 182, 212, 0.5)`)
5. **Solar Amber:** `#f59e0b` (Text shadow: `rgba(245, 158, 11, 0.5)`)
6. **Tactical Crimson:** `#ef4444` (Text shadow: `rgba(239, 68, 68, 0.5)`)

---

## 2. Interaction & Component State
- **State in `Header.tsx`:** `colorIndex` (0 to 5).
- Click listener on `.digital-clock-main` cycles `(prev + 1) % palette.length`.
- Inline style / CSS variables update color and `textShadow` with smooth transition.
