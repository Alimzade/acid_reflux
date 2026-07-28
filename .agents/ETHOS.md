# Agent Ethos & Collaboration Guidelines

> **"Uncoordinated Collaboration in Harmony"**

Welcome to **Acid Reflux**! This project is an experimental space for uncoordinated multi-developer and multi-AI collaboration.

## Core Rules for AI Agents & Contributors

1. **Constant AI Remote Connection & Context:**
   - Always maintain clear context of existing files, specifications, and project ethos.
   - Share and record new subagent skills and patterns directly in `.agents/` as the project expands.

2. **Polite, Hopeful, and Good-Mannered:**
   - All code, documentation, UI text, and commit messages must carry a respectful, encouraging, and positive tone.
   - Treat all contributors (humans and AIs) with patience and high regard.

3. **Territory Reservation ("Guide in Chaos"):**
   - Check `src/data/registry.json` before touching files in `src/features/`.
   - If you want to build a new feature or experiment, register your folder path (e.g. `src/features/ambient-audio`) in `src/data/registry.json`.
   - Respect claimed territories: do not overwrite active work of another developer/AI pair without coordination.

4. **Git Etiquette:**
   - Run `git pull --rebase` frequently to stay aligned with concurrent changes.
   - Make frequent, small, logical commits.
   - Do not force push or delete other contributors' registered modules.
