# Airplane Directory

A directory of commercial aircraft with specs, history, and images. Browse by manufacturer, explore airline fleets, compare aircraft, and enjoy aviation mini-apps.

**Live:** [airlineplanes.com](https://airlineplanes.com)

---

## On Session Start

**Read the recent sections of these files (first 150 lines):**
1. `CONTEXT.md` — Key decisions and lessons learned
2. `CHANGELOG.md` — Recent changes and current status

Both are ordered newest-first. Only read ~150 lines (last 1-2 sessions).

---

## How We Work

### Agents = Autonomous workers

Agents are **autonomous workers** that check state, recommend actions, and execute fully when you approve.

| Agent | Owns | Triggers |
|-------|------|----------|
| **content** | Data + content pages (research, verify, build pages, fix data) | "content", "research", "discover", "build pages", "data" |
| **product** | UX features, interactive tools, delights | "product", "build", "ship", "mini-apps", "quiz", "delights" |
| **seo** | Technical SEO (audit, fix, deploy) | "seo", "sitemap", "meta tags", "structured data", "seo audit" |
| **marketing** | Outreach, backlinks, campaigns, partnerships | "marketing", "outreach", "backlinks", "partnerships" |

Each agent is **fully autonomous** within its domain. No agent invokes another.

**Flow:**
```
You: "content" or describe what you want
    ↓
Agent checks state (runs queries)
    ↓
Agent recommends: "Boeing has 12 aircraft but 40% missing images. Fill images first."
    ↓
You: "do it" or "do 1 and 3" or "all of them"
    ↓
Agent executes autonomously (can run in parallel/background)
    ↓
Agent reports back: "Done. Filled 8 images for Boeing aircraft."
```

### Skills = How to do it

Skills are **detailed instructions** for specific tasks. Agents invoke skills when executing.

**Shared skills (all agents use):**
| Skill | What it does |
|-------|--------------|
| `/tasty-design` | Colors, typography, components |
| `/project-architecture` | DB schema, SSR patterns, D1/R2 usage |
| `/cloudflare-deploy` | Deploy commands |
**Agent-owned skills:**
| Agent | Skills |
|-------|--------|
| **content** | `/research-data`, `/research-images`, `/verify-data`, `/verify-airline`, `/query-data` |
| **product** | `/mini-tools`, `/delights` |
| **seo** | `/seo-audit` |
| **marketing** | `/outreach` |

### Backlog = Idea parking lot

`BACKLOG.md` is where agents note ideas and observations for later — not a work queue.

Agents discover their own immediate work through state checks. The backlog is the "not now, but someday" list. Each agent owns a section (`## Content`, `## Product`, `## SEO`, `## Marketing`).

### Documentation = What happened

After work completes, always update:
- **CHANGELOG.md** — What changed (Added, Changed, Fixed, Removed)
- **CONTEXT.md** — Why it changed, lessons learned

---

## Quick Reference

**Tech:** Cloudflare Pages + D1 (SQLite) + R2 (images). Vanilla HTML/JS + Tailwind CDN. All pages server-side rendered. No local dev — deploy and test on production.

**Architecture, DB schema, routing, shared modules:** `/project-architecture`

**Deploy, migrations, R2 uploads:** `/cloudflare-deploy`
