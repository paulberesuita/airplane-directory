# Airplane Directory

A directory of commercial aircraft with specs, history, and images.

---

## On Session Start

**Before starting any work:**

1. **Read context:** Skim the first ~150 lines of:
   - `CONTEXT.md` — Key decisions and lessons learned
   - `CHANGELOG.md` — Recent changes and current status

Both files are ordered newest-first. Only read the top ~150 lines (covers the last 1-2 sessions).

---

## How We Work

### Agents = What to do

Agents are **advisors that execute**. They check state, recommend actions, and when you say "build it", they build.

| Agent | Focus | Triggers |
|-------|-------|----------|
| **product** | UX features for users on the site | "product", "build", "ship" |
| **seo** | Data + content + SEO pages | "seo", "research", "data" |
| **mini-apps** | Fun interactive tools | "mini-apps", "quiz", "tool" |
| **outreach** | Campaigns, backlinks, partnerships | "outreach", "backlinks" |

**Advisor mode flow:**
```
User: "seo"
    ↓
Agent checks state (runs queries, checks files)
    ↓
Agent recommends: "Boeing has 20 aircraft. Build manufacturer page?"
    ↓
User: "build it" or "add to backlog"
    ↓
Agent executes (or writes spec for later)
    ↓
Agent reports results, recommends next
```

### Skills = How to do it

Skills are **detailed instructions** for specific tasks. Agents invoke skills when executing.

**Shared skills (all agents use):**
| Skill | What it does |
|-------|--------------|
| `/design-system` | Colors, typography, components |
| `/coding-standards` | API patterns, D1/R2 usage |
| `/cloudflare-deploy` | Deploy commands |
| `/add-to-backlog` | Write spec + add to backlog |

**Agent-owned skills:**
| Agent | Skills |
|-------|--------|
| **seo** | `/research-data`, `/research-images`, `/verify-data`, `/verify-airline`, `/query-data`, `/build-seo-page`, `/optimize-seo` |
| **mini-apps** | `/build-tool` |
| **outreach** | `/cold-campaign` |
| **product** | *(builds directly, no special skills)* |

### STRUCTURE.md = The Overview

High-level overview of pages and how they connect to data:
- **URL patterns** — Routes and what they display
- **Data model** — Tables and fields
- **Page → Data mapping** — What queries power each page

### Backlog = What's planned

Each agent owns a section of `BACKLOG.md`:
- `## Product > ### Inbox` — Product agent
- `## SEO > ### Inbox` — SEO agent
- `## Mini-Apps > ### Inbox` — Mini-Apps agent
- `## Outreach > ### Inbox` — Outreach agent

Agents never touch each other's sections.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML/JS + Tailwind CDN |
| Hosting | Cloudflare Pages |
| Functions | Cloudflare Pages Functions |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 |

---

## Project Structure

```
/
├── public/                 # Static assets (HTML, CSS, JS)
├── functions/              # Cloudflare Pages Functions
├── migrations/             # SQL migrations
├── scripts/                # Seed scripts
├── specs/                  # Feature specifications
├── .claude/
│   ├── agents/             # Agent definitions (what to do)
│   │   ├── product.md
│   │   ├── seo.md
│   │   ├── mini-apps.md
│   │   └── outreach.md
│   └── skills/             # Skill definitions (how to do it)
│       ├── design-system/
│       ├── coding-standards/
│       ├── cloudflare-deploy/
│       └── ...
├── STRUCTURE.md            # Page overview
├── BACKLOG.md              # Work queue (Inbox → Done)
├── CHANGELOG.md            # Record of changes
├── CONTEXT.md              # Key decisions & lessons
└── wrangler.toml           # Cloudflare config
```

---

## Deploy Commands

```bash
# Local dev
wrangler pages dev ./public --d1=DB=airplane-directory-db --local

# Run migration
npx wrangler d1 execute airplane-directory-db --file=./migrations/XXX.sql --remote

# Deploy
wrangler pages deploy ./public --project-name=airplane-directory
```

---

## Documentation Requirements

**After making changes, update:**

1. **CHANGELOG.md** — What changed (Added, Changed, Fixed, Removed)
2. **CONTEXT.md** — Why it changed, lessons learned
