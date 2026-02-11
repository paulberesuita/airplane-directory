# Airplane Directory

A directory of commercial aircraft with specs, history, and images. Browse by manufacturer, explore airline fleets, compare aircraft, and enjoy aviation mini-apps.

**Live:** [airplanedirectory.com](https://airplanedirectory.com)

---

## On Session Start

**Read the recent sections of these files (first 150 lines):**
1. `CONTEXT.md` — Key decisions and lessons learned
2. `CHANGELOG.md` — Recent changes and current status

Both are ordered newest-first. Only read ~150 lines (last 1-2 sessions).

---

## How We Work

### Agents = Autonomous workers

Agents are **autonomous workers** that receive a task, execute it fully, and report back. The main agent checks state, recommends actions, and spawns workers when you approve.

| Agent | Focus | Triggers |
|-------|-------|----------|
| **content** | Research aircraft, fill specs/images, verify data | "content", "research", "discover", "data", "images" |
| **seo** | Technical SEO, audits, programmatic pages | "seo", "sitemap", "meta tags", "build pages" |
| **product** | UX features for users on the site | "product", "build", "ship" |
| **mini-apps** | Fun interactive tools | "mini-apps", "quiz", "tool" |
| **outreach** | Campaigns, backlinks, partnerships | "outreach", "backlinks" |

**Flow:**
```
You: "seo" or describe what you want
    |
Main agent checks state (runs queries)
    |
Main agent recommends: "Boeing has 20 aircraft. Build manufacturer page?"
    |
You: "do it" or "do 1 and 3" or "all of them"
    |
Workers execute autonomously (can run in parallel/background)
    |
Workers report back: "Done. Built Boeing manufacturer page."
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
| **content** | `/research-data`, `/research-images`, `/verify-data`, `/verify-airline`, `/query-data` |
| **seo** | `/build-seo-page`, `/optimize-seo` |
| **mini-apps** | `/build-tool` |
| **outreach** | `/cold-campaign` |
| **product** | *(builds directly, no special skills)* |

### Backlog = What's planned

Each agent owns a section of `BACKLOG.md`:
- `## Product > ### Inbox` — Product agent
- `## SEO > ### Inbox` — SEO agent
- `## Mini-Apps > ### Inbox` — Mini-Apps agent
- `## Outreach > ### Inbox` — Outreach agent

Agents never touch each other's sections.

**Backlog items always have specs:** When adding to backlog, agents invoke `/add-to-backlog` which writes a full spec to `specs/[name].md`.

### Documentation = What happened

After work completes, always update:
- **CHANGELOG.md** — What changed (Added, Changed, Fixed, Removed)
- **CONTEXT.md** — Why it changed, lessons learned

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML/JS + Tailwind CDN |
| Hosting | Cloudflare Pages |
| Functions | Cloudflare Pages Functions (SSR) |
| Database | Cloudflare D1 (SQLite) |
| Storage | Cloudflare R2 |

---

## Project Structure

```
/
├── public/                 # Static assets
├── functions/              # Cloudflare Pages Functions (SSR)
│   ├── index.js            # GET /
│   ├── about.js            # GET /about
│   ├── sources.js          # GET /sources
│   ├── aircraft/
│   │   └── [[slug]].js     # GET /aircraft AND /aircraft/[slug]
│   ├── airlines/
│   │   └── [[slug]].js     # GET /airlines AND /airlines/[slug]
│   ├── manufacturer/
│   │   └── [[slug]].js     # GET /manufacturer AND /manufacturer/[slug]
│   ├── images/
│   │   └── [[path]].js     # GET /images/* (R2 proxy)
│   ├── sitemap.xml.js      # GET /sitemap.xml
│   ├── llms-full.txt.js    # GET /llms-full.txt
│   └── api/                # JSON API endpoints
│       └── aircraft/
├── migrations/             # SQL migrations
├── scripts/                # Seed scripts
├── specs/                  # Feature specifications
├── .claude/
│   ├── agents/             # Autonomous workers
│   │   ├── content.md
│   │   ├── seo.md
│   │   ├── product.md
│   │   ├── mini-apps.md
│   │   └── outreach.md
│   └── skills/             # Skill definitions (how to do it)
│       ├── add-to-backlog/
│       ├── build-seo-page/
│       ├── build-tool/
│       ├── cloudflare-deploy/
│       ├── coding-standards/
│       ├── cold-campaign/
│       ├── design-system/
│       ├── optimize-seo/
│       ├── query-data/
│       ├── research-data/
│       ├── research-images/
│       ├── verify-airline/
│       └── verify-data/
├── STRUCTURE.md            # Data model & page mapping
├── BACKLOG.md              # Work queue (Inbox → Done)
├── CHANGELOG.md            # Record of changes
├── CONTEXT.md              # Key decisions & lessons
└── wrangler.toml           # Cloudflare config
```

---

## Routing Architecture

All pages are **server-side rendered** by Cloudflare Pages Functions.

### Function Routing

```
functions/
├── index.js                    # GET /
├── about.js                    # GET /about
├── sources.js                  # GET /sources
├── aircraft/
│   └── [[slug]].js             # GET /aircraft AND /aircraft/[slug]
├── airlines/
│   └── [[slug]].js             # GET /airlines AND /airlines/[slug]
├── manufacturer/
│   └── [[slug]].js             # GET /manufacturer AND /manufacturer/[slug]
├── images/
│   └── [[path]].js             # GET /images/* (R2 proxy)
├── sitemap.xml.js              # GET /sitemap.xml
├── llms-full.txt.js            # GET /llms-full.txt
└── api/
    └── aircraft/
        ├── index.js            # GET /api/aircraft
        ├── [slug].js           # GET /api/aircraft/[slug]
        └── [slug]/
            └── history.js      # GET /api/aircraft/[slug]/history
```

**CRITICAL:** `[[slug]].js` handles both index and detail pages. Don't create `index.js` in the same directory.

### Key Rendering Functions

| File | Renders |
|------|---------|
| `functions/index.js` | Homepage |
| `functions/about.js` | About page |
| `functions/sources.js` | Sources/attribution page |
| `functions/aircraft/[[slug]].js` | /aircraft and /aircraft/[slug] |
| `functions/airlines/[[slug]].js` | /airlines and /airlines/[slug] |
| `functions/manufacturer/[[slug]].js` | /manufacturer and /manufacturer/[slug] |
| `functions/sitemap.xml.js` | /sitemap.xml |
| `functions/llms-full.txt.js` | /llms-full.txt (AI crawler content) |

---

## Environments

| Environment | URL |
|-------------|-----|
| Local dev | `localhost:8788` |
| Preview | `airplane-directory.pages.dev` |
| Production | `airplanedirectory.com` |

---

## Deploy Commands

```bash
# Local dev
wrangler pages dev ./public --d1=DB=airplane-directory-db --local

# Run migration
npx wrangler d1 execute airplane-directory-db --file=./migrations/XXX.sql --remote

# Deploy (updates BOTH preview and production)
wrangler pages deploy ./public --project-name=airplane-directory
```
