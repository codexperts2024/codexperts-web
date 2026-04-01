# Git Workflow — Branch & PR Guide

> This guide defines how the codeXperts team collaborates on GitHub.
> Following this workflow minimizes conflicts and keeps code reviews efficient.

---

## Branch Structure

```
main
└── develop
    ├── feature/auth-google-login
    ├── feature/admin-dashboard
    ├── fix/member-approval-flow
    └── docs/update-readme
```

| Branch | Purpose | Direct commits |
|--------|---------|----------------|
| `main` | Production. Always deployable. | Not allowed |
| `develop` | Integration branch. All features merge here first. | Not allowed |
| `feature/*` | New feature development | Allowed |
| `fix/*` | Bug fixes | Allowed |
| `docs/*` | Documentation only | Allowed |
| `chore/*` | Config, packages, tooling | Allowed |

---

## Branch Naming

```
<type>/<short-description>
```

- Lowercase, words separated by hyphens (`-`)
- Keep it short and descriptive

```bash
# Good
feature/google-login
feature/admin-user-approval
fix/navbar-mobile-layout
docs/code-conventions
chore/install-tailwind

# Bad
feature/loginPage       # no camelCase
my-branch               # missing type prefix
fix/bug                 # too vague
```

---

## Starting Work — Create a Branch

```bash
# 1. Make sure develop is up to date
git checkout develop
git pull origin develop

# 2. Create your branch
git checkout -b feature/my-feature

# 3. Start working
```

---

## Commit Convention

### Format
```
<type>: <subject>
```

### Types

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, whitespace (no logic change) |
| `refactor` | Refactoring (no behavior change) |
| `chore` | Build, packages, config |

### Examples
```bash
# Good
git commit -m "feat: add Google OAuth login"
git commit -m "fix: redirect pending users to waiting screen"
git commit -m "docs: add git workflow guide"
git commit -m "chore: install tailwindcss"

# Bad
git commit -m "update"          # too vague
git commit -m "Fix bug"         # missing type, uppercase
git commit -m "done"            # not descriptive
```

---

## Creating a Pull Request

### Pre-PR Checklist
- [ ] Branch is up to date with `develop`
- [ ] App runs without errors locally (`npm run dev`)
- [ ] All `console.log` removed
- [ ] Related issue number confirmed

### Sync with develop before pushing
```bash
# Pull latest develop into your branch
git checkout develop
git pull origin develop
git checkout feature/my-feature
git merge develop

# Resolve any conflicts, then
git add .
git commit -m "chore: merge develop into feature/my-feature"

# Push your branch
git push origin feature/my-feature
```

### Opening a PR on GitHub
1. Go to the repo → **Pull requests** → **New pull request**
2. Set `base: develop` ← `compare: feature/my-feature`
3. Fill out the PR template below

---

## PR Template

```markdown
## Summary
- Brief description of what was implemented or changed

## Related Issue
closes #<issue-number>

## Screenshots (if UI changes)
| Before | After |
|--------|-------|
|        |       |

## Checklist
- [ ] Tested locally
- [ ] No console.log left
- [ ] Follows code conventions
```

### PR Title Format
```
feat: implement Google OAuth login
fix: resolve pending user redirect issue
```

---

## Code Review Rules

- Minimum **1 Approve** required before merging
- Reviewers should respond within **24 hours** of PR creation
- The **PR author** merges after approval

### Review Comment Prefixes
| Prefix | Meaning |
|--------|---------|
| `[required]` | Must be fixed before merge |
| `[suggestion]` | Recommended change, author decides |
| `[question]` | Asking for clarification |
| `[praise]` | Highlighting good code |

---

## Cleanup After Merge

```bash
# Delete the local branch after it's merged
git checkout develop
git pull origin develop
git branch -d feature/my-feature
```

---

## Full Flow Summary

```
1. Pull develop → create your branch
2. Write code → commit (follow conventions)
3. Sync latest develop into your branch
4. Push → open PR (base: develop)
5. Review → Approve → Merge
6. Delete local branch
```
