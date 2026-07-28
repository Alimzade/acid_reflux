# Implementation Plan: Connected Unified Clock Widget

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a connected single-container clock widget with a right-attached square trigger for timezone tooltip.

**Architecture:** Refactored JSX markup in `Header.tsx` and flex layout in `index.css`.

**Tech Stack:** React, TypeScript, Vanilla CSS.

## Global Constraints
- Preserve timezone calculations.
- Output git commands as plain text for user execution.

---

### Task 1: Update Header JSX & CSS Styling

**Files:**
- Modify: `src/components/Header.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Refactor `Header.tsx` JSX**
Wrap the clock readout and timezone trigger in a single outer `.digital-clock-unified` container.

- [ ] **Step 2: Update `index.css`**
Style the unified container, vertical divider line, and right square trigger button.
