# Airplane Directory

A directory of commercial aircraft with specs, history, and images. Browse by manufacturer, explore airline fleets, compare aircraft, and enjoy aviation mini-apps.

**Live:** [airlineplanes.com](https://airlineplanes.com)

## Tech Stack

Cloudflare Pages + D1 (SQLite) + R2 (images). Vanilla HTML/JS + Tailwind CDN. All pages server-side rendered.

## Agents

Each agent is fully autonomous within its domain. No agent invokes another.

| Agent | Owns |
|-------|------|
| **content** | Data, specs, images, content pages |
| **product** | UX features, mini-apps, delights |
| **seo** | Technical SEO audits, fixes, deploys |
| **marketing** | Outreach, backlinks, partnerships |

## Docs

| Doc | Purpose |
|-----|---------|
| `CLAUDE.md` | How we work (agents, skills, workflow) |
| `BACKLOG.md` | Idea parking lot for future work |
| `CHANGELOG.md` | What we shipped |
| `CONTEXT.md` | Key decisions & lessons learned |
