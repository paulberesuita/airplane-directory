---
name: add-to-backlog
description: Add work items to BACKLOG.md with proper specs. Internal skill for agents.
user_invokable: false
---

# Add to Backlog

You've been asked to **add work to the backlog** instead of building immediately. This means writing a spec and adding a backlog entry.

---

## Two Steps

### 1. Write a Spec

Create `specs/[kebab-case-name].md` using this template:

```markdown
# [Type]: [Name]

## Why

[One sentence: why this matters, what problem it solves]

## Requirements

- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

## Implementation Notes

[Technical details discovered during research — data available, queries needed, files to modify, patterns to follow]

## User Flow

1. User does X
2. System responds Y
3. User sees Z

## Not Included

- [What we're NOT doing — scope boundaries]

## Open Questions

- [Questions to resolve before/during build, if any]
```

**Key principle:** Include enough detail that anyone can pick this up later and build it without re-researching.

### 2. Add Backlog Entry

Add to `BACKLOG.md` under the correct agent's `### Inbox` section.

**Format:**
```markdown
- **[Type] Name** — Brief description → `specs/filename.md`
```

**Types by agent:**

| Agent | Types |
|-------|-------|
| Product | `[Feature]`, `[Easter Egg]`, `[Fix]` |
| SEO | `[Data]`, `[Page]`, `[Technical]`, `[Optimization]` |
| Mini-Apps | `[Tool]` |
| Outreach | `[Campaign]` |

**Examples:**
```markdown
## Product
### Inbox
- **[Feature] Dark Mode** — Toggle between light/dark themes → `specs/dark-mode.md`

## SEO
### Inbox
- **[Data] Expand Category X** — Research 40 items for category X → `specs/expand-category-x.md`
- **[Page] City page for Austin** — 12 items, high search volume → `specs/city-page-austin.md`
- **[Technical] Build sitemap.xml** — Dynamic sitemap for Google indexing → `specs/sitemap-robots.md`

## Mini-Apps
### Inbox
- **[Tool] Score Calculator** — Calculate your score based on inputs → `specs/tool-score-calculator.md`

## Outreach
### Inbox
- **[Campaign] Blogger Outreach** — Reach out to 10 relevant bloggers → `specs/campaign-bloggers.md`
```

---

## Spec Quality Checklist

Before finishing, verify the spec has:

- [ ] Clear "Why" — Someone can understand the value
- [ ] Concrete requirements — Checkboxes, not vague goals
- [ ] Implementation notes — Data queries, files to modify, patterns
- [ ] Scope boundaries — What's NOT included
- [ ] No open blockers — Or blockers are clearly listed

---

## After Adding

Confirm to the user:
```
Added to backlog:
- **[Type] Name** → `specs/filename.md`

[Brief summary of what's in the spec]
```
