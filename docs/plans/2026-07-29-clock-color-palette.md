# Implementation Plan: Tech Clock Color Palette

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement click-to-cycle color palette for digital clock numbers in `Header.tsx`.

**Architecture:** React state array of color configurations applied via inline CSS variables.

**Tech Stack:** React, TypeScript, CSS.

## Global Constraints
- Preserve existing timezone popup and unified container structure.
- Output git commands as plain text for user execution.

---

### Task 1: Add Color Palette State & Click Handler

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Update `Header.tsx`**
Define the 6-color tech palette array, add `colorIndex` state, and attach `onClick` to `.digital-clock-main`.

- [ ] **Step 2: Update `index.css`**
Add cursor pointer and smooth transition properties to `.digital-clock-main` and `.digital-clock-time`.
