# Meeting Notes — Kickoff Planning Session

**Date:** March 31, 2026
**Type:** Pre-kickoff PM planning (Paul)
**Next meeting:** Saturday, April 4, 2026 — 7:30 PM Google Meet (Full team kickoff)

---

## Team

| Name | Position |
|------|----------|
| Paul | PM + UI/UX |
| Kai | Frontend (CSS) |
| Andra | Frontend (CSS) |
| Gary | Backend (Supabase / DB) |
| Dave | Backend (FastAPI / Railway / Deployment) |

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

### Page Structure & Visibility

| Page | Route | Who Can See |
|------|-------|-------------|
| Home | `/` | Everyone |
| About Us | `/about` | Everyone |
| Schedule | `/schedule` | Everyone |
| Events | `/events` | Everyone |
| Join Us | `/join` | Public only (hidden after approval) |
| Problems | `/problems` | Members only |
| Members | `/members` | Members only |
| Admin | `/admin` | Admin only (icon only in navbar) |

### Navbar Layout

```
[Logo → /]  Home  About Us  Schedule  Events  [Join Us]  (Problems)  (Members)  [LinkedIn] [Email] [Instagram▾]  (Discord▾)  {⚙}
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

## Action Items Before Saturday's Full Team Meeting

| Item | Owner | Notes |
|------|-------|-------|
| Prepare Figma wireframes (rough layout for all pages) | Paul | Even low-fi is fine — team needs a shared visual |
| Set up Supabase project + draft DB schema | Gary | Must be ready Week 1 — blocks all frontend work |
| Set up Railway account | Dave | |
| Set up Vercel account + connect repo | Dave | |
| Review git-workflow.md | Everyone | Mandatory before first PR |
| Review sprint-plan.md and confirm task assignments | Everyone | Come to meeting with questions |

---

## Notes for Saturday Kickoff Agenda

1. Welcome + project goals (5 min)
2. Tech stack walkthrough — why Next.js, Supabase, FastAPI (10 min)
3. Figma wireframe walkthrough — page structure (10 min)
4. Git workflow demo — branch, PR, review (10 min)
5. GitHub Projects setup — Kanban board + issue assignment (10 min)
6. Environment setup walkthrough — .env, Supabase keys (10 min)
7. Task assignment + Sprint 1 kickoff (15 min)
8. Q&A + communication norms (Discord, response expectations) (10 min)
