# PEA — Performance Suite

A multi-role performance evaluation dashboard (Q4 2025 cycle). Built with **React + Vite + Tailwind CSS**.

## Roles

Switch roles from the dropdown in the top bar. Each role has its own navigation, dashboard, and workflows:

| Role | Highlights |
|------|-----------|
| **Resource** | Personal workspace, self-evaluation, direct reports, evaluation history |
| **Manager** | Team evaluations, approvals, department completion, top performers, reports |
| **Tower Head** | Approval queue, rating overrides, HR submission, evaluation distribution |
| **HR Admin** | Questionnaire management, publish drafts, org-wide statistics, exports |
| **System Admin** | System health, Salesforce sync (with retry), audit log |

## Working features

- 🔀 Live role switching (persisted to `localStorage`)
- 🌙 Light / dark mode toggle
- ⭐ Interactive star-rating evaluation form with validation
- ✅ Approve / reject / override actions that update state in real time
- 🔄 Simulated Salesforce sync with success/failure + retry
- 📤 Publish drafts, submit to HR, toast notifications throughout

## Getting started

```bash
npm install
npm run dev      # start dev server → http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the build
```

## Structure

```
src/
  App.jsx              # shell: sidebar, top bar, role config & routing
  store.jsx            # in-memory state + actions (React context)
  data.js              # seed data
  ui.jsx               # reusable UI kit (Card, Badge, Stars, Button…)
  icons.jsx            # inline SVG icon set
  views/
    Resource.jsx
    Manager.jsx
    TowerHead.jsx
    HRAdmin.jsx
    SystemAdmin.jsx
    EvaluationModal.jsx
```

State is in-memory (seed data in `src/data.js`); no backend required.
