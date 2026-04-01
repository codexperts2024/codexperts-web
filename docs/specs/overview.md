# codeXperts Club — Product Overview

> codeXperts is a university coding club platform built to support members across multiple campuses.
> It provides a space for weekly coding challenges, attendance tracking, and community engagement —
> all behind role-based access that mirrors a real-world product team structure.

---

## Role-Based Access Control

```
Public (Unauthenticated)
  └── Member (Admin-approved)
        └── Executive
              └── Admin
```

| Role | Who | Access |
|------|-----|--------|
| **Public** | Anyone | Home, About, Schedule, Events, Announcements, Join Us |
| **Member** | Approved club members | Problems, Submissions, Member Directory, Profile |
| **Executive** | Club execs | Post problems, post announcements, manage sessions |
| **Admin** | Club admin | User approval, role management, full access |

**Onboarding flow:**
```
Google Sign-In → pending status → Admin approval → member role assigned
```

> Only Google OAuth is supported. No email/password login.

---

## Page Structure

```
[Logo → /]   Home   About Us   Schedule   Events   Announcements   [Join Us]   (Problems)   (Members)   [L][E][I▾](D▾){⚙}
```

| Page | Route | Visibility | Description |
|------|-------|------------|-------------|
| Home | `/` | Public | Hero, mission, Instagram social feed (Elfsight), CTAs |
| About Us | `/about` | Public | Club intro, Executive Board cards |
| Schedule | `/schedule` | Public | Google Calendar embed, weekly meeting times |
| Events | `/events` | Public | Event cards (hackathons, workshops, socials) |
| Announcements | `/announcements` | Public | Club announcements posted by Executives/Admins |
| Join Us | `/join` | Public (non-member only) | Google Sign-In, pending flow explanation |
| Problems | `/problems` | Member | Weekly coding problems + Monaco Editor |
| Members | `/members` | Member | Member directory + profile pages |
| Admin | `/admin` | Admin | User approval, role mgmt, problem CRUD, QR sessions |

---

## Feature 1 — Coding Problems & Submissions

Weekly coding challenges posted by executives. Members write and run code directly in the browser.

**How it works:**
- Executives post a problem with a prompt and constraints
- Members open the problem detail page — a Monaco Editor (VSCode-style) loads in the browser
- Members hit "Run" — code is sent to FastAPI `/execute`, which proxies to the Piston API
- Results return in real-time (stdout / stderr)
- Members submit their solution — saved to the `submissions` table in Supabase
- All members can view each other's submitted code for a given problem

**Supported languages:** Python, Java, C++, JavaScript (via Piston API)

---

## Feature 2 — QR Attendance Check

Replaces manual attendance sheets. Admin starts a session before each meeting; members scan to check in.

**How it works:**
- Admin opens the Admin panel and starts an attendance session — a unique token is generated
- A QR code is displayed (contains the token + session ID)
- Members scan the QR code on their phone — triggers a POST to FastAPI `/attendance/verify`
- FastAPI validates the token and records attendance in the `attendances` table
- Duplicate check-in is blocked at the API level
- Admin can close the session manually or it expires automatically

---

## Feature 3 — Activity Heatmap

A GitHub-style contribution graph on each member's profile page, showing engagement over time.

**How it works:**
- Heatmap data is aggregated from two tables: `submissions` + `attendances`
- Each day with activity gets a color — more activity = deeper shade
- Displayed as a 52-week grid (same visual pattern as GitHub contributions)
- Data is fetched via a FastAPI aggregation endpoint

---

## Feature 4 — Member Directory

A searchable, filterable list of all approved members.

**How it works:**
- Each member has a profile card: photo, name, school/campus, LinkedIn, GitHub
- Members can edit their own profile (school, LinkedIn, GitHub links)
- Directory can be filtered by cohort (class year) and campus
- Only visible to approved members (role: member and above)

---

## Feature 5 — Announcements Board

A public-facing board where Executives and Admins post club-wide announcements.

**How it works:**
- Executives/Admins create announcements from the Admin panel (title, body, date)
- Announcements are displayed at `/announcements` in reverse chronological order
- Visible to everyone including unauthenticated visitors
- Stored in a dedicated `announcements` table in Supabase

---

## Feature 6 — Schedule (Google Calendar Embed)

Displays the club's weekly and monthly meeting schedule without requiring Google account access.

**How it works:**
- A public Google Calendar is embedded directly on the `/schedule` page
- Shows recurring Saturday meetings, events, and deadlines
- Executives manage the calendar directly in Google Calendar — no backend work needed
- Always up to date; no manual sync required

---

## Feature 7 — Social Feed (Instagram via Elfsight)

Displays recent Instagram posts from club accounts on the Home page.

**How it works:**
- Elfsight widget embedded on the Home page (`/`)
- Pulls posts from `@codexperts_seneca` and `@codexperts_yorku`
- No Meta API approval required — Elfsight handles the Instagram connection
- Visible to all public visitors

> Using Elfsight (not Instagram Graph API) — Meta's API requires app review and is too complex for MVP scope.

---

## Admin Panel

Central management dashboard for admins and executives.

**Sections:**
- **User Management** — view pending signups, approve or reject, change roles
- **Problem CRUD** — create, edit, delete weekly coding problems
- **Announcements CRUD** — create, edit, delete announcements
- **Attendance Sessions** — start/stop QR sessions, view attendance per session

---

## Tech Stack

| Layer | Technology | Platform |
|-------|-----------|----------|
| Frontend | Next.js 15 + React + Tailwind CSS | Vercel |
| Backend | FastAPI (Python) | Railway |
| Database & Auth | Supabase (PostgreSQL + Google OAuth) | Managed |
| Code Editor | Monaco Editor | In-browser |
| Code Execution | Piston API (via FastAPI proxy) | External |
| Social Feed | Elfsight embed (Instagram) | External |
| Schedule | Google Calendar embed | External |

---

## Database Schema (Supabase)

| Table | Purpose |
|-------|---------|
| `profiles` | User info, role, cohort, social links |
| `problems` | Weekly coding problems posted by executives |
| `submissions` | Code submissions per user per problem |
| `sessions` | QR attendance sessions (token, start/end time) |
| `attendances` | Attendance records per session per user |
| `announcements` | Club announcements posted by executives/admins |
