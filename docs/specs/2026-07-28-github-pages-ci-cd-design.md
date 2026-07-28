# Design Specification: GitHub Actions Automated GitHub Pages Deployment

**Date:** 2026-07-28  
**Project:** acid_reflux  
**Goal:** Automate live website building and deployment to GitHub Pages on every push to the `main` branch using GitHub Actions.

---

## 1. Requirements & Base Path
- **Vite Base Path:** Update `vite.config.ts` so `base: '/acid_reflux/'` is configured, ensuring assets resolve properly when hosted on `https://alimzade.github.io/acid_reflux/`.
- **Workflow Automation:** Create `.github/workflows/deploy.yml` configured with standard GitHub Pages deployment permissions.

---

## 2. GitHub Actions Workflow Architecture (`.github/workflows/deploy.yml`)

1. **Trigger:** `push` events to the `main` branch.
2. **Permissions:** `contents: read`, `pages: write`, `id-token: write`.
3. **Jobs:**
   - **Build Job:** Checkout repo, setup Node.js, install dependencies (`npm ci` / `npm install`), execute `npm run build`, upload dist artifact.
   - **Deploy Job:** Deploy built artifact to GitHub Pages.

---

## 3. GitHub Repository Settings Required (User Action)
- Go to repository **Settings** -> **Pages**.
- Change **Source** to **GitHub Actions**.
