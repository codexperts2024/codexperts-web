# codeXperts Club — 6-Week Sprint Plan

**Period:** 6 weeks — Saturday 7:30 PM Google Meet
**Goal:** MVP complete + deployed at codexperts.ca

---

## Team

| Name | Position |
|------|----------|
| Paul | PM / UI/UX |
| Sid | Backend (Monaco Editor / Piston API) / UI/UX |
| Kai | Frontend |
| Andra | Frontend / Backend (Supabase) |
| Gary | Backend (Supabase / DB & Auth) |
| Dave | Backend (FastAPI / Railway / Deployment) / Frontend |

> **FS** = Full Stack task — requires both FE and BE collaboration

---

## All Tasks by Priority

### P0 — Critical (nothing works without these)

| # | Title | Position | Difficulty | Priority | Assignee |
|---|-------|----------|------------|----------|----------|
| 1 | Next.js project setup (folder structure, ESLint, Tailwind) | FE | Easy | P0 | FE |
| 2 | Supabase project + full DB schema | BE | Medium | P0 | BE |
| 3 | Google OAuth setup (Supabase Auth) | BE | Medium | P0 | BE |
| 4 | Supabase RLS policies (role-based access) | BE | Hard | P0 | BE |
| 5 | Vercel pipeline setup (develop → preview auto-deploy) | BE | Easy | P0 | BE |
| 6 | Railway FastAPI project setup + deploy | BE | Medium | P0 | BE |
| 7 | Next.js ↔ Supabase Auth session connection | FS | Medium | P0 | FE + BE |
| 8 | Protected Route / Role Guard middleware | FE | Medium | P0 | FE |
| 9 | Design system (colors, fonts, component standards) | FE | Easy | P0 | PM + FE |
| 10 | Full page wireframes (Figma) | FE | Medium | P0 | PM + FE |
| 11 | Social links config file (campus-expandable structure) | FE | Easy | P0 | FE |

---

### P1 — High (core MVP features)

| # | Title | Position | Difficulty | Priority | Assignee |
|---|-------|----------|------------|----------|----------|
| 12 | New signup → pending logic | BE | Medium | P1 | BE |
| 13 | Admin approval → member role API | BE | Medium | P1 | BE |
| 14 | Navbar (role-based visibility + social hover dropdowns) | FE | Medium | P1 | FE |
| 15 | Login / logout page UI | FE | Easy | P1 | FE |
| 16 | Home page (hero, CTAs, intro, Elfsight Instagram embed) | FE | Medium | P1 | FE |
| 17 | About Us page (club intro + Executive Board) | FE | Easy | P1 | FE |
| 18 | Schedule page (Google Calendar embed) | FE | Easy | P1 | FE |
| 19 | Events page (event cards) | FE | Medium | P1 | FE |
| 20 | Announcements page (public board) | FE | Easy | P1 | FE |
| 21 | Announcements CRUD API (Supabase announcements table) | BE | Easy | P1 | BE |
| 22 | Join Us page (signup form + Google Sign-In) | FE | Medium | P1 | FE |
| 23 | User profile page (view my info) | FE | Medium | P1 | FE |
| 24 | Profile edit (school, LinkedIn, GitHub) | FE | Easy | P1 | FE |
| 25 | Members page (member directory card list) | FE | Medium | P1 | FE |
| 26 | Coding problems list page | FE | Easy | P1 | FE |
| 27 | Problem detail page + Monaco Editor | FE | Hard | P1 | FE |
| 28 | Piston API integration (code execution) | BE | Medium | P1 | BE |
| 29 | FastAPI `/execute` endpoint | BE | Medium | P1 | BE |
| 30 | Submission save API (Supabase submissions table) | BE | Easy | P1 | BE |

---

### P2 — Medium (differentiating features)

| # | Title | Position | Difficulty | Priority | Assignee |
|---|-------|----------|------------|----------|----------|
| 31 | Admin panel — user management (pending list, approve) | FE | Medium | P2 | FE |
| 32 | Admin panel — role change | FE | Easy | P2 | FE |
| 33 | Admin panel — problem CRUD | FE | Medium | P2 | FE |
| 34 | Admin panel — announcements CRUD | FE | Easy | P2 | FE |
| 35 | QR attendance session creation (Admin) | FS | Hard | P2 | FE + BE |
| 36 | QR code display component | FE | Easy | P2 | FE |
| 37 | QR scan → check-in UI (mobile) | FE | Medium | P2 | FE |
| 38 | FastAPI `/attendance/verify` endpoint | BE | Hard | P2 | BE |
| 39 | Duplicate attendance prevention logic | BE | Medium | P2 | BE |
| 40 | View other members' submitted code | FE | Easy | P2 | FE |

---

### P3 — Low (polish features)

| # | Title | Position | Difficulty | Priority | Assignee |
|---|-------|----------|------------|----------|----------|
| 41 | Activity heatmap component (GitHub-style) | FE | Hard | P3 | FE |
| 42 | Heatmap data aggregation API (attendance + submissions) | BE | Medium | P3 | BE |
| 43 | Cohort / campus filter (member directory) | FE | Easy | P3 | FE |
| 44 | Responsive design audit (mobile optimization) | FE | Medium | P3 | FE |
| 45 | Domain codexperts.ca connection | BE | Easy | P3 | BE |

> **Note on social feed:** Instagram Graph API requires Meta Developer approval — too complex for MVP. Use Elfsight widget embed instead (included in Home page build, task #16). LinkedIn API is not feasible for third-party post pulls; show LinkedIn as a link only.

---

## 6-Week Sprint Schedule

### Week 1 — Kickoff + Foundation + Design
**Goal: All team members running locally + Google login working + design direction set**

> DB schema (BE) and Figma wireframes (PM) must be finalized this week — both are hard blockers for all frontend work starting Week 2.

| Task | Role |
|------|------|
| Figma wireframes (all pages, rough layout) | PM + FE |
| Design system (colors, fonts) | PM + FE |
| Next.js initial setup (Tailwind, ESLint, folder structure) | FE |
| Social links config file structure | FE |
| Supabase project creation + full DB schema | BE |
| Google OAuth setup + Supabase Auth config | BE |
| RLS policy draft | BE |
| Vercel setup (develop branch → preview auto-deploy) | BE |
| Railway FastAPI setup + Hello World deploy | BE |
| Next.js ↔ Supabase session connection | FS |
| GitHub Projects Kanban + all issues created | PM |
| Component research + dev environment setup | FE |

**Done when:** Google login works end-to-end, all 6 team members can run the app locally

---

### Week 2 — Navbar + Auth Flow + Public Pages
**Goal: Navigation + full auth flow + all public-facing pages complete**

| Task | Role |
|------|------|
| pending → admin approval → member role API | BE |
| Announcements table + CRUD API (Supabase) | BE |
| Navbar component (role-based visibility + social hover dropdowns) | FE |
| Protected Route / Role Guard | FE |
| Home page (hero, CTAs, Elfsight Instagram embed) | FE |
| About Us page (club intro + Executive Board section) | FE |
| Schedule page (Google Calendar embed) | FE |
| Events page (event cards) | FE |
| Announcements page (public board, reverse chrono) | FE |
| Login / logout page UI | FE |
| Join Us page (signup form) | FE |
| Admin panel — pending user approval UI | FE |
| Admin panel — announcements CRUD UI | FE |

**Done when:** Public pages navigable, new signup → admin approval → member access working, announcements visible on `/announcements`

---

### Week 3 — Member Features + Coding Problems
**Goal: Member-only features + full coding problem flow**

| Task | Role |
|------|------|
| FastAPI `/execute` + Piston API integration | BE |
| Submission save API (submissions table) | BE |
| User profile page + edit | FE |
| Members page (directory) | FE |
| Coding problems list page | FE |
| Problem detail page + Monaco Editor | FE |
| Code run button → FastAPI call | FE |
| View other members' submitted code | FE |

**Done when:** Problem → Monaco → run code → save submission flow works end-to-end

---

### Week 4 — Admin Panel + QR Attendance
**Goal: Admin management + QR attendance system**

| Task | Role |
|------|------|
| Admin — problem CRUD UI | FE |
| Admin — role change UI | FE |
| QR session creation (Admin) + session management API | BE |
| QR code display component | FE |
| QR scan → check-in UI (mobile) | FE |
| FastAPI `/attendance/verify` endpoint | BE |
| Duplicate attendance prevention logic | BE |

**Done when:** Admin starts QR session → member scans → attendance record saved

---

### Week 5 — Heatmap + Polish + Social Feed
**Goal: Activity heatmap + responsive design + social media embed**

| Task | Role |
|------|------|
| Heatmap data aggregation API | BE |
| Activity heatmap component | FE |
| Cohort / campus filter (member directory) | FE |
| Social media feed embed — Elfsight (Instagram: Seneca + York) | FE |
| Responsive design audit (mobile) | FE |
| Overall UI consistency pass | PM + FE |

**Done when:** Heatmap visible on member profile, mobile layout works, Instagram feed embedded

---

### Week 6 — QA + Full Deployment
**Goal: Production deployment + domain + full QA**

| Task | Role |
|------|------|
| Full flow QA (scenario testing all user types) | All |
| Bug fixes | TBD |
| Vercel main branch → production deploy | BE |
| Railway FastAPI production env config | BE |
| Domain codexperts.ca connection | BE |
| README + docs final cleanup | PM |

**Done when:** codexperts.ca live with all features working across all roles
