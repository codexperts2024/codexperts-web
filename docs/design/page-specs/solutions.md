# Page: Solutions `/solutions` + `/solutions/:id`
> Visibility: member only

## Design Tokens (summary)
- BG: `#FFFFFF` / Surface: `#F9F9F9`
- Monaco: theme "vs" (light), font JetBrains Mono 14px
- Accent: `#C0392B` (Run button, active tab)
- Success: `#2E7D5E` (pass indicators)
- Warning: `#B45309` (forbidden pattern detected)
- Font: Montserrat (headings) / Inter (body / labels)

---

## Stitch Instructions

**FOLLOW THIS SPEC EXACTLY. Do not add, remove, or rearrange any element.**

- Background: `#FFFFFF`. Do NOT use dark mode or dark editor themes.
- Font: Montserrat for H1. Inter for labels, tabs, buttons. JetBrains Mono for Monaco editor content and output. Do NOT use any other font.
- Monaco editor theme: `vs` (LIGHT theme — white background, black code). Do NOT use dark theme (`vs-dark`).
- Render BOTH the selection list view AND the workspace view (`/solutions/:id`) as separate screens.
- The workspace has EXACTLY TWO tabs: [✏️ My Solution] and [👥 Community Solutions]. Active tab: border-bottom 2px `#C0392B`, bold. Do NOT add more tabs.
- Tab content is MUTUALLY EXCLUSIVE — only one tab content visible at a time.
- My Solution tab layout from top to bottom: language selector dropdown (top-right) → Monaco editor (400px tall) → button row ([▶ Run] PRIMARY RED, [✦ Evaluate] SECONDARY, [⬆ Submit] SECONDARY) → Output panel → Evaluation panel. Do NOT reorder.
- [▶ Run] button: bg `#C0392B`, text white. [✦ Evaluate] and [⬆ Submit]: secondary outline. Do NOT make all three buttons the same style.
- Output panel: bg `#F9F9F9`, font JetBrains Mono 13px, shows stdout + runtime. Only appears after Run is clicked — render it as visible for the mockup.
- Evaluation panel: bg `#FFFFFF`, border 1px `#E5E5E5`, radius 8px. Shows two sections: "Forbidden Patterns" checklist (✅/❌ per rule) and "Time Complexity" (Big-O + score /10). Do NOT add answer hints or code suggestions.
- Community Solutions tab: vertical list of member submissions (avatar + name + language + date). Click row → read-only Monaco viewer expands below (accordion). Do NOT show solutions side-by-side.
- Do NOT add a comment box, like button, or leaderboard.

---

## View 1: Problem Selection `/solutions`

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PAGE HEADER  (bg: #F9F9F9, padding: 32px 0)        │
│  H1: "Solutions"                                    │
│  Subtitle: "Pick a problem to solve or review"      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  PROBLEM LIST  (bg: #FFFFFF, padding: 48px 0)       │
│  max-width: 900px, centered                         │
│                                                     │
│  ┌──────┬──────────────────┬────────┬───────┬─────┐ │
│  │ Week │ Title            │ Lang   │ Due   │ ✓   │ │
│  ├──────┼──────────────────┼────────┼───────┼─────┤ │
│  │  12  │ Graph Traversal  │ Python │ Apr 20│  ✓  │ │
│  │  11  │ DP — Knapsack    │ Java   │ Apr 13│     │ │
│  │  10  │ Binary Search    │ C++    │ Apr 06│  ✓  │ │
│  └──────┴──────────────────┴────────┴───────┴─────┘ │
│                                                     │
│  ✓ column: green if submitted, dash if not          │
│  Click row → /solutions/:id                         │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## View 2: Solution Workspace `/solutions/:id`

```
┌─────────────────────────────────────────────────────┐
│ NAVBAR                                    [Log In]  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  BREADCRUMB + PROBLEM TITLE  (bg: #F9F9F9)          │
│  Solutions  /  Week 12 — Graph Traversal            │
│  [Python]  ·  Due Apr 20, 2026                      │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  TABS                                               │
│  [✏️ My Solution]   [👥 Community Solutions]        │
│  active tab: border-bottom 2px #C0392B, bold        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ── TAB: My Solution ─────────────────────────────  │
│                                                     │
│  Language selector: [Python ▾]  (top-right of editor│
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Monaco Editor                              │    │
│  │  theme: vs (light)                          │    │
│  │  font: JetBrains Mono 14px                  │    │
│  │  height: ~400px                             │    │
│  │  minimap: disabled                          │    │
│  │                                             │    │
│  │  1  def solution():                         │    │
│  │  2      pass                                │    │
│  │  ...                                        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  [▶ Run]          [✦ Evaluate]       [⬆ Submit]    │
│   Primary red      Secondary outline  Secondary     │
│                                                     │
│  ── Output (shown after Run) ─────────────────────  │
│  ┌─────────────────────────────────────────────┐    │
│  │  Output                                     │    │
│  │  bg: #F9F9F9, font: JetBrains Mono 13px     │    │
│  │  > Running...                               │    │
│  │  > [stdout result]                          │    │
│  │  > Runtime: 0.023s                          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── Evaluation (shown after Evaluate) ────────────  │
│  ┌─────────────────────────────────────────────┐    │
│  │  Evaluation  (powered by Gemma 3)           │    │
│  │  ─────────────────────────────────────────  │    │
│  │  Forbidden Patterns                         │    │
│  │   ✅  break       not used                  │    │
│  │   ✅  STL / sort  not used                  │    │
│  │   ❌  STL / map   detected — Line 12        │    │
│  │                                             │    │
│  │  Time Complexity                            │    │
│  │   Estimated: O(n²)                          │    │
│  │   Score: 6 / 10                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ── TAB: Community Solutions ──────────────────── │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  [Avatar] Member1  ·  Python  ·  Apr 18      │   │
│  │  [Avatar] Member2  ·  Java    ·  Apr 17      │   │
│  │  [Avatar] Member3  ·  Python  ·  Apr 16      │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  Click row → expands read-only Monaco viewer        │
│  below the row (accordion style)                    │
│                                                     │
├─────────────────────────────────────────────────────┤
│ FOOTER                                              │
└─────────────────────────────────────────────────────┘
```

---

## Button Specs

### [▶ Run]
```
Style: Primary — bg #C0392B, text white, radius 6px
Action: Sends code to Piston API for execution
        Shows Output panel below editor
        Output: stdout, stderr, runtime
        Running state: button shows spinner, disabled
```

### [✦ Evaluate]
```
Style: Secondary outline
Action: Sends code to Gemma 3 API for evaluation
        Returns two sections:
          1. Forbidden Patterns — checklist per rule
             ✅ rule name — "not used"
             ❌ rule name — "detected — Line N"
          2. Time Complexity
             Estimated Big-O + Score out of 10
        Does NOT reveal the answer or solution approach
        Loading state: button shows spinner, disabled
```

### [⬆ Submit]
```
Style: Secondary outline
Action: Saves current editor code as member's official submission
        Stored in DB: submissions table
        Confirmation: "Solution submitted!" toast message
        After submit: ✓ appears in problem list
```

---

## Evaluation Rules Config
```
Forbidden patterns are configurable per problem (not global).
Admin sets rules when creating a problem.
Examples:
  - break statement
  - STL containers (map, set, sort, etc.)
  - built-in sort functions
  - recursion (if iterative solution required)

Gemma 3 receives: { code, language, forbidden_rules[] }
Returns: { patterns: [{rule, detected, line}], complexity: {big_o, score} }
```

---

## Community Solutions — Read-only Viewer
```
Accordion row per member submission:
  Collapsed: avatar + name + language + submitted date
  Expanded: read-only Monaco editor (same theme, no editing)
             height: 300px
             Options button disabled, no line selection

Visibility: all approved members can see all submissions
```

---

## Notes
- Code execution via Piston API (supports Python, Java, C++, etc.)
- Evaluation via Gemma 3 (Google) — no answer hints, no full feedback
- In-person feedback from professor — Evaluate is supplementary only
- Forbidden rules set per problem by admin at creation time
- Submit saves to `submissions` table — one submission per member per problem (overwrite on re-submit)
