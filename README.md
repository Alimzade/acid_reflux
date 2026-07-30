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

## Daily Duo Quest Firebase setup

1. Create a Firebase project, then create a **Cloud Firestore** database for it.
2. Register a web app in the Firebase project and copy `.env.example` to `.env.local`.
3. Replace all six `VITE_FIREBASE_*` placeholders in `.env.local` with the web app configuration values.
4. Deploy [firestore.rules](firestore.rules) using the Firebase console's **Rules** tab, or initialize the Firebase CLI with `firebase init firestore` and run `firebase deploy --only firestore:rules`.

The quest works without Firebase configuration, but sync is disabled until every variable is set. These rules deliberately permit unauthenticated reads and structurally valid writes for the two-person shared quest. That means anyone who discovers the project can alter valid quest data; use Firebase Authentication and identity-based rules before using this pattern for private or sensitive data.

Firestore rules tests require a local Java runtime with `java` available on `PATH`. Install Java, then run the isolated emulator suite on Windows with:

```powershell
npm.cmd run test:rules:emulator
```

The dedicated `npm.cmd run test:rules` command expects an already-running Firestore emulator and fails clearly when `FIRESTORE_EMULATOR_HOST` is absent. The normal `npm.cmd test` suite remains usable without Java and skips only the emulator-dependent rules cases.

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
