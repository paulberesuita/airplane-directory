# Directory Template

A template for building directory-style apps with Claude agents.

## Quick Start

1. Update `CLAUDE.md` with your project name and details
2. Invoke **planner** to plan features
3. Invoke **builder** to build from backlog

```bash
# Local dev
wrangler pages dev ./public --d1=DB=PROJECT-db --local

# Deploy
wrangler pages deploy ./public --project-name=PROJECT
```

## Project Structure

```
/
├── public/                 # Static assets
├── functions/              # Cloudflare Pages Functions
├── specs/                  # Feature specifications
├── examples/               # Starter templates
├── .claude/
│   ├── agents/             # planner, builder, researcher
│   └── skills/             # design-system, coding-standards, cloudflare-deploy
├── BACKLOG.md              # Work queue
├── CHANGELOG.md            # What changed
└── CONTEXT.md              # Decisions & lessons
```

## Agents

| Agent | Purpose | Triggers |
|-------|---------|----------|
| **planner** | Plans features, maintains backlog | "plan", "backlog" |
| **builder** | Builds from backlog, deploys | "build", "ship" |
| **researcher** | Gathers data, stores in D1/R2 | "research", "populate" |

## Docs

- `CLAUDE.md` — Project overview, tech stack
- `BACKLOG.md` — Work queue (Inbox → Done)
- `CONTEXT.md` — Key decisions & lessons learned
- `CHANGELOG.md` — What we shipped
