# Implementation Plan: Clock Timezone Tooltip (Approach A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `Header.tsx` and `index.css` to add an interactive timezone tooltip (Approach A).

**Architecture:** React state + CSS absolute positioning for floating tooltip.

**Tech Stack:** React, TypeScript, CSS.

## Global Constraints
- Preserve existing digital clock functionality.
- Output git commands as plain text for user execution.

---

### Task 1: Update Header Component and Add Tooltip Styling

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Update `src/components/Header.tsx`**
Calculate timezone, offset, and date, then render the info button and tooltip structure.

- [ ] **Step 2: Update `src/index.css`**
Add glassmorphic tooltip positioning and hover animation styles.
