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

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%7C%20Auth%20%7C%20Functions-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## Agile Process

This project follows a structured Agile workflow designed to reflect industry-standard team practices.

### Sprint-Based Development
- Work is broken into **1-week sprints** with clear goals and deliverables
- Sprint planning, review, and retrospective are conducted each cycle
- Backlog is maintained and prioritized continuously

### GitHub Projects — Kanban Board
| Column | Description |
|--------|-------------|
| `Backlog` | Unscheduled items |
| `To Do` | Committed for current sprint |
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
| **Member** | Club dashboard, member directory |
| **Executive** | Project management, internal docs |
| **Admin** | User approval, role management, full access |

**Onboarding Flow:**
```
Google Sign-In → pending status → Admin approval → member role assigned
```

### Firebase Architecture

```
Firebase
├── Authentication
│   └── Google OAuth Provider
├── Firestore
│   ├── /users/{uid}         → profile, role, status
│   ├── /announcements/{id}  → public & member posts
│   └── /projects/{id}       → club project records
└── Cloud Functions
    ├── onUserCreate         → set pending status on new signup
    └── approveUser          → admin-triggered role assignment
```

---

## Folder Structure

```
codexperts-web/
├── public/
├── src/
│   ├── assets/              # Images, icons, static files
│   ├── components/
│   │   ├── common/          # Shared layout components (Navbar, Footer)
│   │   ├── auth/            # Login, ProtectedRoute, RoleGuard
│   │   └── ui/              # Reusable UI primitives (Button, Card, Modal)
│   ├── pages/
│   │   └── Admin/           # Admin-only views (UserManagement, Approvals)
│   ├── hooks/               # Custom React hooks (useAuth, useRole)
│   ├── contexts/            # React Context providers (AuthContext)
│   ├── services/            # Firebase service modules (auth.js, db.js)
│   ├── routes/              # Route definitions and role-based guards
│   └── utils/               # Helper functions and constants
├── docs/
│   ├── meeting-notes/       # Sprint meeting records
│   ├── guidelines/          # Coding standards, contribution guide
│   └── schema/              # Firestore data models
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- A Firebase project with **Authentication** and **Firestore** enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<org>/codexperts-web.git
cd codexperts-web

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your Firebase config values in .env.local

# 4. Start the development server
npm start
```

The app will be running at `http://localhost:3000`.

### Environment Variables

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

---

## Team

| Name | Role |
|------|------|
| **Gary** | Database & Cloud Functions |
| **Kai** | Frontend, CSS |
| **Dave** | Server Architecture & Deployment |
| **Paul** | Frontend, Project Manager |

---

*Built with intention. Deployed with confidence.*
