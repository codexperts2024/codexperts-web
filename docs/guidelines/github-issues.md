# GitHub Issues & Project Board Guide

> How to create issues and manage the Kanban board on GitHub.com.
> Follow this guide whenever you pick up a new task from the sprint plan.

---

## 1. Creating an Issue

### Step-by-step

1. Go to the repo → **Issues** tab → **New issue**
2. Fill in the fields below

---

### Issue Title Format

```
[W{week}][{type}] Short description
```

| Field | Options | Example |
|-------|---------|---------|
| Week | W1 – W6 | `[W2]` |
| Type | `feat`, `fix`, `chore`, `docs`, `refactor` | `[feat]` |
| Description | Short, action-oriented | `Google OAuth login` |

**Full examples:**
```
[W2][feat] Google OAuth login
[W3][fix] Pending user redirect on login
[W4][chore] Set up Railway deployment
```

**Rules:**
- Always include the week prefix — check `pm_docs/sprint-plan.md` if unsure
- Lowercase type
- No period at the end

---

### Labels

Apply **both** a priority label and a type label:

| Label | When to use |
|-------|------------|
| `P0` | Critical — blocks other work |
| `P1` | High — must ship this sprint |
| `P2` | Medium — nice to have this sprint |
| `P3` | Low — backlog candidate |
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Config, setup, tooling |
| `docs` | Documentation only |
| `frontend` | UI / React work |
| `backend` | API / DB / Supabase work |
| `fullstack` | Touches both layers |

To add labels: click **Labels** on the right sidebar → select all that apply.

---

### Assignees

Click **Assignees** on the right sidebar → assign whoever picks up the task at the sprint meeting.

| Name | GitHub |
|------|--------|
| Paul | `paulsik` | PM / UI/UX |
| Sid | `siddiecity` | Backend (Monaco / Piston API) / UI/UX |
| Kai | `naik26m3` | Frontend |
| Andra | *(pending — assign once joined the org)* | Frontend / Backend (Supabase) |
| Gary | `GarySkywalker-droid` | Backend (Supabase / DB & Auth) |
| Dave | `SystemProgrammerWizzard` | Backend (FastAPI / Deployment) / Frontend |

**Rule:** Assign at the sprint meeting when tasks are claimed — not before. Unassigned issues stay in Backlog until claimed.

---

### Description (optional but recommended for complex tasks)

Use this template in the body:

```markdown
## Context
Why this issue exists / what problem it solves.

## Acceptance Criteria
- [ ] Specific thing that must be true when this is done
- [ ] Another condition

## Notes
Any links, references, or design decisions relevant to this task.
```

---

## 2. Adding an Issue to the Project Board

1. Open the issue you just created
2. On the right sidebar, find **Projects** → click the gear icon
3. Select **codeXperts — Sprint Board**
4. The issue will appear in the **Backlog** column by default

### Moving to the correct column

| Column | When to use |
|--------|------------|
| `Backlog` | Future sprint — not yet committed |
| `To Do` | Committed for the current sprint |
| `In Progress` | You have started working on it |
| `In Review` | PR is open and awaiting review |
| `Done` | PR merged to `develop` |

**Rule:** Move your issue to `In Progress` when you create your branch. Move to `In Review` when you open the PR.

---

## 3. Linking a PR to an Issue

When you open a Pull Request, add this line in the PR description:

```
closes #<issue-number>
```

This automatically moves the issue to **Done** when the PR merges.

---

## 4. Quick Reference — Full Flow

```
1. Create issue (title format + labels + assignee)
2. Add to Project Board → set column to "To Do"
3. Create your branch: feature/short-description
4. Move issue to "In Progress"
5. Open PR → write "closes #<issue-number>"
6. Move issue to "In Review"
7. PR merged → issue auto-closes → moves to "Done"
```
