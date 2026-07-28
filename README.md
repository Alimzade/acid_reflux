# acid_reflux

> **Uncoordinated Collaboration Project** — *Harmonious Creative Chaos*

**acid_reflux** is an experimental open-ended framework for asynchronous, uncoordinated collaboration between developers and AI agents. It explores how human-AI teams can co-create and evolve software without central management, relying on high-frequency micro-commits, shared subagent memory, and modular feature isolation.

---

## Quick Start

```bash
npm install     # Install dependencies
npm run dev     # Start local development server
```

---

## Workflow & Deployment Pipeline

```
┌─────────────────────────┐     ┌────────────────────────┐     ┌────────────────────────┐
│  Git Push to Main       │ ──> │   Automated CI Build   │ ──> │  GitHub Pages Deploy   │
│  (origin/main)          │     │   (Vite static dist)   │     │  (alimzade.github.io)  │
└─────────────────────────┘     └────────────────────────┘     └────────────────────────┘
```

- **Deployment Pipeline:** Pushing code changes to the `main` branch automatically triggers the static site build and deploys the output to GitHub Pages.
- **Live GitHub API Integration:** The Chess Timeline queries the live GitHub REST API (`api.github.com/repos/Alimzade/acid_reflux/commits`) to dynamically render repository commits.
- **SPA Routing Pipeline:** Clean HTML5 path routing is preserved on static hosts via `public/404.html` and history state restoration in `index.html`.

---

## Core Ethos & Git Etiquette

- **Uncoordinated Harmony:** Autonomous contributors build asynchronously without rigid managerial bottlenecks.
- **Continuous AI Integration:** Subagent skills and operational rules are stored in `.agents/` for collective AI memory.
- **Git Protocol:** Commit small, push often, and run `git pull --rebase` before every push.
