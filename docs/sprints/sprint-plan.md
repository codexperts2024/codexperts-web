# codeXperts Club — 6-Week Sprint Plan

**Period:** 6 weeks — Saturday 7:30 PM Google Meet
**Goal:** MVP complete + deployed at codexperts.ca

---

## Team

| Name | GitHub | Position |
|------|--------|----------|
| Paul | `minsikpaul92` | PM / UI/UX |
| Sid | `siddiecity` | Backend (Monaco Editor / Piston API) / UI/UX |
| Kai | `naik26m3` | Frontend |
| Andra | `kazzledazz` | Frontend / Backend (Supabase) |
| Gary | `GarySkywalker-droid` | Backend (Supabase / DB & Auth) |
| Dave | `SystemProgrammerWizzard` | Backend (FastAPI / Railway / Deployment) / Frontend |

> **FS** = Full Stack task — requires both FE and BE collaboration

---

## All Tasks by Priority

### P0 — Critical (nothing works without these)

| Issue | Title | Position | Difficulty | Priority | Assignee |
|-------|-------|----------|------------|----------|----------|
| [#1](https://github.com/codexperts2024/codexperts-web/issues/1) | Next.js project setup (folder structure, ESLint, Tailwind) | FE | Easy | P0 | Paul |
| [#2](https://github.com/codexperts2024/codexperts-web/issues/2) | Supabase project + full DB schema | BE | Medium | P0 | Paul, Gary |
| [#3](https://github.com/codexperts2024/codexperts-web/issues/3) | Google OAuth setup (Supabase Auth) | BE | Medium | P0 | Paul, Gary |
| [#4](https://github.com/codexperts2024/codexperts-web/issues/4) | Supabase RLS policies (role-based access) | BE | Hard | P0 | Gary |
| [#5](https://github.com/codexperts2024/codexperts-web/issues/5) | Vercel pipeline setup (develop → preview auto-deploy) | BE | Easy | P0 | Paul, Dave |
| [#6](https://github.com/codexperts2024/codexperts-web/issues/6) | Railway FastAPI project setup + deploy | BE | Medium | P0 | Dave |
| [#7](https://github.com/codexperts2024/codexperts-web/issues/7) | Next.js ↔ Supabase Auth session connection | FS | Medium | P0 | Dave, Andra |
| [#8](https://github.com/codexperts2024/codexperts-web/issues/8) | Protected Route / Role Guard middleware | FE | Medium | P0 | Kai |
| [#9](https://github.com/codexperts2024/codexperts-web/issues/9) | Design system (colors, fonts, component standards) | FE | Easy | P0 | Paul, Sid |
| [#10](https://github.com/codexperts2024/codexperts-web/issues/10) | Full page wireframes (Figma) | FE | Medium | P0 | Paul, Sid |
| [#11](https://github.com/codexperts2024/codexperts-web/issues/11) | Social links config file (campus-expandable structure) | FE | Easy | P0 | Paul |

---

### P1 — High (core MVP features)

| Issue | Title | Position | Difficulty | Priority | Assignee |
|-------|-------|----------|------------|----------|----------|
| [#12](https://github.com/codexperts2024/codexperts-web/issues/12) | New signup → pending logic | BE | Medium | P1 | Gary |
| [#13](https://github.com/codexperts2024/codexperts-web/issues/13) | Admin approval → member role API | BE | Medium | P1 | Gary |
| [#14](https://github.com/codexperts2024/codexperts-web/issues/14) | Navbar (role-based visibility + social hover dropdowns) | FE | Medium | P1 | Dave |
| [#15](https://github.com/codexperts2024/codexperts-web/issues/15) | Login / logout page UI | FE | Easy | P1 | Dave |
| [#16](https://github.com/codexperts2024/codexperts-web/issues/16) | Home page (hero, CTAs, intro, Elfsight Instagram embed) | FE | Medium | P1 | Kai |
| [#17](https://github.com/codexperts2024/codexperts-web/issues/17) | About Us page (club intro + Executive Board) | FE | Easy | P1 | Kai |
| [#57](https://github.com/codexperts2024/codexperts-web/issues/57) | Our Team page (/team) | FE | Easy | P1 | Kai |
| [#18](https://github.com/codexperts2024/codexperts-web/issues/18) | Schedule page (Google Calendar embed) | FE | Easy | P1 | Andra |
| [#19](https://github.com/codexperts2024/codexperts-web/issues/19) | Events page (event cards) | FE | Medium | P1 | Andra |
| [#46](https://github.com/codexperts2024/codexperts-web/issues/46) | Announcements page (public board) ✅ | FE | Easy | P1 | — |
| [#47](https://github.com/codexperts2024/codexperts-web/issues/47) | Announcements CRUD API (Supabase) ✅ | BE | Easy | P1 | — |
| [#20](https://github.com/codexperts2024/codexperts-web/issues/20) | Join Us — signup modal | FE | Medium | P1 | Dave |
| [#21](https://github.com/codexperts2024/codexperts-web/issues/21) | Member profile page `/members/:id` (view any member) | FE | Medium | P1 | Andra |
| [#22](https://github.com/codexperts2024/codexperts-web/issues/22) | Self-edit mode on own profile (photo, bio, LinkedIn, GitHub, email, status toggle, per-field visibility) | FE | Medium | P1 | Andra |
| [#23](https://github.com/codexperts2024/codexperts-web/issues/23) | Members page (directory grid + cohort/school/status/role filters) | FE | Medium | P1 | Kai |
| [#24](https://github.com/codexperts2024/codexperts-web/issues/24) | Coding problems list page | FE | Easy | P1 | Andra |
| [#25](https://github.com/codexperts2024/codexperts-web/issues/25) | Problem detail page + Monaco Editor | FE | Hard | P1 | Kai |
| [#26](https://github.com/codexperts2024/codexperts-web/issues/26) | Piston API integration (code execution) | BE | Medium | P1 | Dave |
| [#27](https://github.com/codexperts2024/codexperts-web/issues/27) | FastAPI `/execute` endpoint | BE | Medium | P1 | Dave |
| [#28](https://github.com/codexperts2024/codexperts-web/issues/28) | Submission save API (Supabase submissions table) | BE | Easy | P1 | Gary |
| [#58](https://github.com/codexperts2024/codexperts-web/issues/58) | Solutions page (/solutions + /solutions/:id) | FE | Hard | P1 | Sid |

---

### P2 — Medium (differentiating features)

| Issue | Title | Position | Difficulty | Priority | Assignee |
|-------|-------|----------|------------|----------|----------|
| [#29](https://github.com/codexperts2024/codexperts-web/issues/29) | Admin panel — user management (pending list, approve) | FE | Medium | P2 | Kai |
| [#30](https://github.com/codexperts2024/codexperts-web/issues/30) | Admin panel — role change | FE | Easy | P2 | Kai |
| [#31](https://github.com/codexperts2024/codexperts-web/issues/31) | Admin panel — problem CRUD | FE | Medium | P2 | Andra |
| [#59](https://github.com/codexperts2024/codexperts-web/issues/59) | Admin panel — announcements CRUD UI | FE | Easy | P2 | Paul |
| [#32](https://github.com/codexperts2024/codexperts-web/issues/32) | QR attendance session creation (Admin) | FS | Hard | P2 | Gary, Andra |
| [#33](https://github.com/codexperts2024/codexperts-web/issues/33) | QR code display component | FE | Easy | P2 | Andra |
| [#34](https://github.com/codexperts2024/codexperts-web/issues/34) | QR scan → check-in UI (mobile) | FE | Medium | P2 | Kai |
| [#35](https://github.com/codexperts2024/codexperts-web/issues/35) | FastAPI `/attendance/verify` endpoint | BE | Hard | P2 | Dave |
| [#36](https://github.com/codexperts2024/codexperts-web/issues/36) | Duplicate attendance prevention logic | BE | Medium | P2 | Gary |
| [#37](https://github.com/codexperts2024/codexperts-web/issues/37) | View other members' submitted code | FE | Easy | P2 | Andra |
| [#55](https://github.com/codexperts2024/codexperts-web/issues/55) | Navbar wireframe — mobile layout | FE | Easy | P2 | Paul, Sid, Andra |

---

### P3 — Low (polish + post-MVP)

| Issue | Title | Position | Difficulty | Priority | Assignee |
|-------|-------|----------|------------|----------|----------|
| [#38](https://github.com/codexperts2024/codexperts-web/issues/38) | Activity heatmap component (GitHub-style) | FE | Hard | P3 | Kai |
| [#39](https://github.com/codexperts2024/codexperts-web/issues/39) | Heatmap data aggregation API (attendance + submissions) | BE | Medium | P3 | Gary |
| [#40](https://github.com/codexperts2024/codexperts-web/issues/40) | Cohort / campus filter (member directory) | FE | Easy | P3 | Andra |
| [#41](https://github.com/codexperts2024/codexperts-web/issues/41) | Responsive design audit (mobile optimization) | FE | Medium | P3 | Kai, Andra |
| [#42](https://github.com/codexperts2024/codexperts-web/issues/42) | Social media feed embed — Elfsight (Seneca + York Instagram) | FE | Easy | P3 | Andra |
| [#43](https://github.com/codexperts2024/codexperts-web/issues/43) | Domain codexperts.ca connection | BE | Easy | P3 | Dave |
| [#60](https://github.com/codexperts2024/codexperts-web/issues/60) | Solutions — AI code evaluation (Gemma 3) | FS | Hard | P3 | TBD |

> **Note on Elfsight:** Free plan shows Elfsight branding watermark. Consider paid plan before portfolio demo.
> **Note on Piston API:** Free external service, no SLA. Handle timeout/error gracefully in UI.

---

## 6-Week Sprint Schedule

### Week 1 — Kickoff + Foundation + Design
**Goal: All team members running locally + Google login working + design direction set**

> DB schema (Gary) and Figma wireframes (Paul) must be finalized this week — both are hard blockers for all frontend work starting Week 2.

| Issue | Task | Role |
|-------|------|------|
| [#10](https://github.com/codexperts2024/codexperts-web/issues/10) | Figma wireframes (all pages, rough layout) | PM + FE |
| [#9](https://github.com/codexperts2024/codexperts-web/issues/9) | Design system (colors, fonts) | PM + FE |
| [#1](https://github.com/codexperts2024/codexperts-web/issues/1) | Next.js initial setup (Tailwind, ESLint, folder structure) | FE |
| [#11](https://github.com/codexperts2024/codexperts-web/issues/11) | Social links config file structure | FE |
| [#2](https://github.com/codexperts2024/codexperts-web/issues/2) | Supabase project creation + full DB schema | BE |
| [#3](https://github.com/codexperts2024/codexperts-web/issues/3) | Google OAuth setup + Supabase Auth config | BE |
| [#4](https://github.com/codexperts2024/codexperts-web/issues/4) | RLS policy draft | BE |
| [#5](https://github.com/codexperts2024/codexperts-web/issues/5) | Vercel setup (develop branch → preview auto-deploy) | BE |
| [#6](https://github.com/codexperts2024/codexperts-web/issues/6) | Railway FastAPI setup + Hello World deploy | BE |
| [#7](https://github.com/codexperts2024/codexperts-web/issues/7) | Next.js ↔ Supabase session connection | FS |
| — | GitHub Projects Kanban + all issues created | PM |
| — | Component research + dev environment setup | FE |

**Done when:** Google login works end-to-end, all 6 team members can run the app locally

---

### Week 2 — Navbar + Auth Flow + Public Pages
**Goal: Navigation + full auth flow + all public-facing pages complete**

| Issue | Task | Role |
|-------|------|------|
| [#12](https://github.com/codexperts2024/codexperts-web/issues/12) | pending → admin approval → member role API | BE |
| [#45](https://github.com/codexperts2024/codexperts-web/issues/45) | Announcements table + CRUD API (Supabase) | BE |
| [#14](https://github.com/codexperts2024/codexperts-web/issues/14) | Navbar component (role-based visibility + social hover dropdowns) | FE |
| [#55](https://github.com/codexperts2024/codexperts-web/issues/55) | Navbar wireframe — mobile layout | Design |
| [#8](https://github.com/codexperts2024/codexperts-web/issues/8) | Protected Route / Role Guard | FE |
| [#16](https://github.com/codexperts2024/codexperts-web/issues/16) | Home page (hero, CTAs, Elfsight Instagram embed) | FE |
| [#17](https://github.com/codexperts2024/codexperts-web/issues/17) | About Us page (club intro + Executive Board section) | FE |
| [#57](https://github.com/codexperts2024/codexperts-web/issues/57) | Our Team page (/team) | FE |
| [#18](https://github.com/codexperts2024/codexperts-web/issues/18) | Schedule page (Google Calendar embed) | FE |
| [#19](https://github.com/codexperts2024/codexperts-web/issues/19) | Events page (event cards) | FE |
| [#46](https://github.com/codexperts2024/codexperts-web/issues/46) | Announcements page (public board, reverse chrono) ✅ | FE |
| [#15](https://github.com/codexperts2024/codexperts-web/issues/15) | Login / logout page UI | FE |
| [#20](https://github.com/codexperts2024/codexperts-web/issues/20) | Join Us — signup modal | FE |
| [#29](https://github.com/codexperts2024/codexperts-web/issues/29) | Admin panel — pending user approval UI | FE |
| [#59](https://github.com/codexperts2024/codexperts-web/issues/59) | Admin panel — announcements CRUD UI | FE |

**Done when:** Public pages navigable, new signup → admin approval → member access working, announcements visible on `/announcements`

---

### Week 3 — Member Features + Coding Problems
**Goal: Member-only features + full coding problem flow**

| Issue | Task | Role |
|-------|------|------|
| [#26](https://github.com/codexperts2024/codexperts-web/issues/26) | FastAPI `/execute` + Piston API integration | BE |
| [#27](https://github.com/codexperts2024/codexperts-web/issues/27) | FastAPI `/execute` endpoint | BE |
| [#28](https://github.com/codexperts2024/codexperts-web/issues/28) | Submission save API (submissions table) | BE |
| [#21](https://github.com/codexperts2024/codexperts-web/issues/21) | Member profile page `/members/:id` (view any member) | FE |
| [#22](https://github.com/codexperts2024/codexperts-web/issues/22) | Self-edit mode on own profile (photo, bio, LinkedIn, GitHub, email, status, visibility) | FE |
| [#23](https://github.com/codexperts2024/codexperts-web/issues/23) | Members page (directory grid + filters) | FE |
| [#24](https://github.com/codexperts2024/codexperts-web/issues/24) | Coding problems list page | FE |
| [#25](https://github.com/codexperts2024/codexperts-web/issues/25) | Problem detail page + Monaco Editor | FE |
| [#58](https://github.com/codexperts2024/codexperts-web/issues/58) | Solutions page (/solutions + /solutions/:id) | FE |
| [#37](https://github.com/codexperts2024/codexperts-web/issues/37) | View other members' submitted code | FE |

**Done when:** Problem → Monaco → run code → save submission → view solutions flow works end-to-end

---

### Week 4 — Admin Panel + QR Attendance
**Goal: Admin management + QR attendance system**

| Issue | Task | Role |
|-------|------|------|
| [#30](https://github.com/codexperts2024/codexperts-web/issues/30) | Admin — role change UI | FE |
| [#31](https://github.com/codexperts2024/codexperts-web/issues/31) | Admin — problem CRUD UI | FE |
| [#32](https://github.com/codexperts2024/codexperts-web/issues/32) | QR session creation (Admin) + session management API | FS |
| [#33](https://github.com/codexperts2024/codexperts-web/issues/33) | QR code display component | FE |
| [#34](https://github.com/codexperts2024/codexperts-web/issues/34) | QR scan → check-in UI (mobile) | FE |
| [#35](https://github.com/codexperts2024/codexperts-web/issues/35) | FastAPI `/attendance/verify` endpoint | BE |
| [#36](https://github.com/codexperts2024/codexperts-web/issues/36) | Duplicate attendance prevention logic | BE |

**Done when:** Admin starts QR session → member scans → attendance record saved

---

### Week 5 — Heatmap + Polish + Social Feed
**Goal: Activity heatmap + responsive design + social media embed**

| Issue | Task | Role |
|-------|------|------|
| [#39](https://github.com/codexperts2024/codexperts-web/issues/39) | Heatmap data aggregation API | BE |
| [#38](https://github.com/codexperts2024/codexperts-web/issues/38) | Activity heatmap component | FE |
| [#40](https://github.com/codexperts2024/codexperts-web/issues/40) | Cohort / campus filter (member directory) | FE |
| [#42](https://github.com/codexperts2024/codexperts-web/issues/42) | Social media feed embed — Elfsight (Instagram: Seneca + York) | FE |
| [#41](https://github.com/codexperts2024/codexperts-web/issues/41) | Responsive design audit (mobile) | FE |
| — | Overall UI consistency pass | PM + FE |

**Done when:** Heatmap visible on member profile, mobile layout works, Instagram feed embedded

---

### Week 6 — QA + Full Deployment
**Goal: Production deployment + domain + full QA**

| Issue | Task | Role |
|-------|------|------|
| — | Full flow QA (scenario testing all user types) | All |
| — | Bug fixes | TBD |
| — | Vercel main branch → production deploy | BE |
| — | Railway FastAPI production env config | BE |
| [#43](https://github.com/codexperts2024/codexperts-web/issues/43) | Domain codexperts.ca connection | BE |
| — | README + docs final cleanup | PM |

**Done when:** codexperts.ca live with all features working across all roles
