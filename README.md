```
 ██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗██████╗ ███████╗██████╗ ████████╗███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██╔════╝
██║     ██║   ██║██║  ██║█████╗   ╚███╔╝ ██████╔╝█████╗  ██████╔╝   ██║   ███████╗
██║     ██║   ██║██║  ██║██╔══╝   ██╔██╗ ██╔═══╝ ██╔══╝  ██╔══██╗   ██║   ╚════██║
╚██████╗╚██████╔╝██████╔╝███████╗██╔╝ ██╗██║     ███████╗██║  ██║   ██║   ███████║
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

# codeXperts Club — Official Website

> A collaborative portfolio project built with Agile methodology, showcasing real-world team workflows, role-based access control, and modern full-stack development practices.

---

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%7C%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Agile Process

This project follows a **5-phase Agile sprint cycle** across 6 weekly sprints, with the full team meeting every Saturday at 7:30 PM via Google Meet. Each phase reflects real-world software team practices.

```
Planning → Design → Development → Testing → Review & Release
   ↑                                               │
   └───────────────── next sprint ◀────────────────┘
```

---

### 1. Planning

Each sprint begins by defining goals, refining the backlog, and assigning GitHub Issues to team members.

- **Week 1** — Defined 6-week roadmap and MVP scope · Created GitHub Issues · Assigned tasks across FE/BE · Set up GitHub Projects Kanban board

---

### 2. Design

Covers UI/UX wireframes, system architecture decisions, DB schema design, and API contract definition — not just visual design, but how the entire system is structured.

- **Week 1** — Finalized sitemap and page visibility rules · Produced Figma wireframes for all 8 pages · Finalized DB schema (profiles, problems, submissions, sessions, attendances, announcements) · Defined navbar structure and social link config
- **Week 2** — Members page structure defined · Individual profile page spec (`/members/:id`) · Self-edit mode with per-field visibility controls · Student/Graduate status toggle · Stitch wireframes finalized for all member-facing views

---

### 3. Development

Team members work on feature branches tied to their assigned issues. No direct commits to `develop` or `main`.

- **Week 1** — Next.js + Tailwind project setup · Supabase project created + Google OAuth configured · RLS policies drafted · Vercel + Railway pipelines connected · Placeholder pages scaffolded for all routes

---

### 4. Testing

Manual QA on Vercel preview deployments. Each PR is reviewed by at least one team member before merging to `develop`.

- **Week 1** — Google login → pending user flow tested end-to-end · Vercel preview deploy verified · Environment variable setup confirmed across team

---

### 5. Review & Release

Sprint retrospective held at each Saturday meeting. `develop` is merged to `main` when the sprint goals are met and testing passes.

- **Week 1** — Sprint retrospective completed · Foundation merged to `develop` · Preview URL shared with team

---

### GitHub Projects — Kanban Board

| Column | Description |
|--------|-------------|
| `Backlog` | Unscheduled items |
| `Ready` | Committed for current sprint |
| `In Progress` | Actively being developed |
| `In Review` | PR open, awaiting review |
| `Done` | Merged and deployed |

### Issue & PR Convention
- **Issue title format:** `[Type] Short description`
  - Types: `feat`, `fix`, `docs`, `refactor`, `chore`
- **PR title format:** mirrors the linked issue
- All PRs require at least **1 reviewer approval** before merge
- PRs are linked to their corresponding issue

### Branch Strategy
```
main
└── develop
    ├── feature/auth-google-login
    ├── feature/admin-dashboard
    ├── fix/member-approval-flow
    └── docs/update-readme
```

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code only |
| `develop` | Integration branch — all features merge here first |
| `feature/*` | Individual feature or fix branches |

> **Rule:** Never commit directly to `main`. All changes go through `develop` via reviewed PRs.

---

## Key Features

### 1. Coding Problems & Submission
- Weekly problems posted by executives
- Monaco Editor (VSCode-style) for writing code in-browser
- Piston API for code execution — supports Python, Java, C++, and more
- Submissions saved and visible to all members

### 2. QR Attendance Check
- Admin starts a session before each meeting — generates a unique token
- Members scan the QR code to check in automatically
- Session expires after a set time or when admin closes it
- Duplicate check-in prevention built in

### 3. Activity Heatmap
- GitHub-style contribution graph per member profile
- Combines submission history and attendance records
- More activity = deeper color

### 4. Member Directory & Profile
- Profile cards: photo, name, school, status badge, LinkedIn, GitHub
- Filter by cohort, school, status, and role
- Individual profile pages: bio, activity heatmap, achievement badges
- Self-editable profile — members update their own photo, bio, LinkedIn, GitHub, email, and Student/Graduate status
- Per-field visibility control — each field can be shown or hidden from other members

---

## System Architecture

### Role-Based Access Control (RBAC)

```
Public (Unauthenticated)
  └── Member (Approved)
        └── Executive
              └── Admin
```

| Role | Access Level |
|------|-------------|
| **Public** | Landing page, public announcements |
| **Member** | Club dashboard, member directory, problem submissions |
| **Executive** | Post problems, manage sessions |
| **Admin** | User approval, role management, full access |

**Onboarding Flow:**
```
Google Sign-In → pending status → Admin approval → member role assigned
```

### Backend Architecture

```
Frontend (Next.js — Vercel)
│
├── Supabase
│   ├── Auth (Google OAuth only)
│   └── PostgreSQL
│       ├── profiles       → id, name, email, role (pending|member|executive|admin),
│       │                     school, cohort, status (student|graduate), bio,
│       │                     linkedin, github, avatar_url,
│       │                     profile_visibility (JSONB: photo/bio/linkedin/github/email)
│       ├── problems       → id, title, description, file_url, created_at
│       ├── submissions    → profile_id, problem_id, code, language, ai_feedback
│       ├── sessions       → token, expires_time, is_active (QR attendance sessions)
│       ├── attendances    → profile_id, session_id, checked_at
│       └── announcements  → author_id, title, content, created_at
│
└── FastAPI (Railway)                  ← lives in backend/ subfolder
    ├── /health            → service health check
    ├── /execute           → proxy to Piston API (code execution)      [W3]
    └── /attendance/verify → QR token validation logic                 [W4]
```

> **Monorepo structure:** Next.js runs from repo root (Vercel), FastAPI lives in `backend/` subfolder (Railway root directory = `backend/`).

---

## Deployment

| Layer | Platform | Domain |
|-------|----------|--------|
| Frontend | Vercel | codexperts.ca |
| Backend | Railway | auto-assigned Railway URL |
| Database & Auth | Supabase | managed |

> Domain: Starting with Vercel free subdomain. Will migrate to `codexperts.ca` upon MVP completion.

---

## Folder Structure

```
codexperts-web/
├── public/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.js        # Root layout (Navbar included)
│   │   ├── page.js          # / Home
│   │   ├── about/           # /about
│   │   ├── schedule/        # /schedule
│   │   ├── announcements/   # /announcements
│   │   ├── events/          # /events
│   │   ├── join/            # /join
│   │   ├── problems/        # /problems (member only)
│   │   ├── solutions/       # /solutions (member only)
│   │   ├── members/         # /members (member only)
│   │   └── admin/           # /admin (admin only)
│   ├── components/
│   │   ├── common/          # Navbar, Footer
│   │   ├── auth/            # ProtectedRoute, RoleGuard
│   │   └── ui/              # Button, Card, Modal
│   ├── config/
│   │   └── socialLinks.js   # Campus social media links config
│   ├── lib/
│   │   └── supabase.js      # Supabase client singleton (import from here)
│   ├── hooks/               # useAuth, useRole
│   ├── contexts/            # AuthContext
│   ├── services/            # Supabase service modules
│   └── utils/               # Helper functions, constants
├── docs/
│   ├── design/              # Design system, sitemap, and page-level specs
│   │   ├── design-system.md # Color tokens, typography, component specs
│   │   ├── sitemap.md       # Page routes, visibility rules, nav structure
│   │   └── page-specs/      # Per-page layout and component specs (FE reference)
│   ├── guidelines/          # code-conventions.md, git-workflow.md, issue-workflow.md
│   ├── meeting-notes/       # Sprint meeting records
│   ├── sprints/             # Sprint plan + weekly specs (sprint-plan.md, w1–w6.md)
│   └── schema/              # Database schema definitions (schema.sql + per-table .sql files)
├── backend/
│   ├── main.py              # FastAPI entry point (/health, /execute, /attendance/verify)
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Backend env vars template
│   └── routers/             # Route modules (added per sprint)
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A Supabase project with **Authentication** (Google provider) and **PostgreSQL** enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/codexperts2024/codexperts-web.git
cd codexperts-web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Supabase config values in .env.local

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:3000`.

---

## Team

| Name | Role |
|------|------|
| **Paul** | PM / UI/UX |
| **Sid** | Backend (Monaco Editor / Piston API) / UI/UX |
| **Kai** | Frontend |
| **Andra** | Frontend / Backend |
| **Gary** | Backend (Supabase / DB & Auth) |
| **Dave** | Backend (FastAPI / Railway / Deployment) / Frontend |

---

*Built with intention. Deployed with confidence.*
