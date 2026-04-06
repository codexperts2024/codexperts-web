# Meeting Notes — Kickoff Planning Session

**Date:** April 4, 2026
**Type:** Full team kickoff — 7:30 PM Google Meet
**Attendees:** Paul, Sid, Kai, Andra, Gary, Dave

---

## Team

| Name | Position |
|------|----------|
| Paul | PM / UI/UX |
| Sid | Backend (Monaco Editor / Piston API) / UI/UX |
| Kai | Frontend |
| Andra | Frontend / Backend |
| Gary | Backend (Supabase / DB & Auth) |
| Dave | Backend (FastAPI / Railway / Deployment) / Frontend |

---

## Git Workflow — Read Before You Start

> **Important:** Do not commit or merge directly to `main` or `develop`. Always work on a feature branch.

### Correct Branch Flow

```
main          ← production only. Never touch directly.
└── develop   ← integration branch. All features merge here first.
    └── feature/your-feature-name   ← your personal work branch
```

### Step-by-Step

```bash
# 1. Always start from develop (not main)
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feature/your-feature-name

# 3. Do your work, commit as you go
git add .
git commit -m "feat: describe what you did"

# 4. Push your branch
git push origin feature/your-feature-name

# 5. Open a Pull Request → target: develop (NOT main)
# Wait for at least 1 reviewer approval before merging
```

### develop → main
Only Paul (PM) opens PRs from `develop` → `main` at the end of each sprint when features are stable and ready for production.

**Full guide:** [`docs/guidelines/git-workflow.md`](../../docs/guidelines/git-workflow.md)

---

## Decisions Made Today

### Tech Stack (Final)

| Layer | Tech | Platform |
|-------|------|----------|
| Frontend | Next.js 15 + React + Tailwind CSS | Vercel |
| Backend | FastAPI (Python) | Railway |
| Database & Auth | Supabase (PostgreSQL + Google OAuth) | Supabase managed |
| Code Editor | Monaco Editor (`@monaco-editor/react`) | — |
| Code Execution | Piston API | Free, external |
| Domain | codexperts.ca | Free subdomain first → purchase after MVP |

### Backend Split — FastAPI vs Supabase

Two backend systems, two different jobs:

**Gary → Supabase (Database + Auth)**
- Stores all data: users, problems, submissions, attendance, announcements
- Handles Google OAuth login and session management
- Enforces access control via RLS (Row-Level Security) — e.g. members-only data, admin-only writes
- Frontend calls Supabase directly using `@supabase/supabase-js` — no middleman needed for standard CRUD

**Dave → FastAPI (API Server on Railway)**
- Handles logic that can't run in the browser or requires a trusted server
- `POST /execute` — receives code + language from frontend, proxies to Piston API, returns stdout/stderr (browser can't call Piston directly due to CORS)
- `POST /attendance/verify` — validates QR token, checks session is still active, writes attendance record (server-side so users can't fake check-ins)
- Deployed on Railway; frontend calls it via `fetch`

> **Rule of thumb:** Simple read/write → Supabase directly. External API calls or security-sensitive logic → FastAPI.

### Page Structure & Visibility

| Page | Route | Who Can See |
|------|-------|-------------|
| Home | `/` | Everyone |
| About Us | `/about` | Everyone |
| Schedule | `/schedule` | Everyone |
| Announcements | `/announcements` | Everyone |
| Events | `/events` | Everyone |
| Join Us | `/join` | Public only (hidden after approval) |
| Problems | `/problems` | Members only |
| Solutions | `/solutions` | Members only |
| Members | `/members` | Members only |
| Admin | `/admin` | Admin only (icon only in navbar) |

### Navbar Layout

```
[Logo → /]  Home  About Us  Updates▾  Events  [Join Us]  (Practice▾)  (Members)  [LinkedIn] [Email] [Instagram▾]  (Discord▾)  {⚙}

Updates▾   → Schedule / Announcements
Practice▾  → Problems / Solutions        (members only)
```

### Social Links

| Platform | Visibility | Behavior |
|----------|------------|----------|
| LinkedIn | Public | Single link |
| Email | Public | Single mailto: link |
| Instagram | Public | Hover dropdown: Seneca / York (expandable for TMU+) |
| Discord | Members only | Hover dropdown: Seneca / York (expandable for TMU+) |

**Social feed embeds (Instagram posts on site):** Use [Elfsight](https://elfsight.com) widget — Instagram Graph API requires Meta Developer approval and is too complex for MVP scope.

### Schedule Page
- Google Calendar embed (iframe) as default — frontend task
- Upgrade to Google Calendar API later if needed

---

## 6-Week Sprint Overview

| Week | Focus | Done When |
|------|-------|-----------|
| 1 | Foundation, auth setup, design system, env setup | Google login works, all team members running locally |
| 2 | Navbar, auth flow, public pages (Home/About/Schedule/Events/Join) | Full user flow: sign up → admin approval → member access |
| 3 | Member features: profile, directory, coding problems, Monaco + Piston | Submit code and save results |
| 4 | Admin panel, QR attendance | Admin manages users + QR check-in works |
| 5 | Heatmap, responsive design, social feed embed | Mobile works, activity heatmap visible |
| 6 | QA, full deployment, domain | codexperts.ca live with all features |

Full task breakdown: [`pm_docs/sprint-plan.md`](../sprint-plan.md)

---

## Tonight's Kickoff Agenda

1. Welcome + project goals (5 min)
2. Tech stack walkthrough — Next.js, Supabase, FastAPI + role split (10 min)
3. Figma wireframe walkthrough — page structure (10 min)
4. Git workflow demo — branch, PR, review (10 min)
5. GitHub Projects setup — Kanban board + issue assignment (10 min)
6. Environment setup walkthrough — `.env`, Supabase keys (10 min)
7. Task assignment + Sprint 1 kickoff (15 min)
8. Q&A + communication norms (Discord, response expectations) (10 min)

---

## Pre-Meeting Action Items (Status Check Tonight)

| Item | Owner | Status |
|------|-------|--------|
| Figma wireframes (rough layout for all pages) | Paul + Sid | |
| Supabase project + draft DB schema | Gary | |
| Railway account setup | Dave | |
| Vercel account + repo connected | Dave | |
| Reviewed git-workflow.md | Everyone | |
| Reviewed sprint-plan.md | Everyone | |
