# Airplane Directory

A directory of commercial aircraft with specs, history, and images. Browse by manufacturer, explore airline fleets, compare aircraft, and enjoy aviation mini-apps.

**Live:** [airlineplanes.com](https://airlineplanes.com)

## Tech Stack

Cloudflare Pages + D1 (SQLite) + R2 (images). Vanilla HTML/JS + Tailwind CDN. All pages server-side rendered.

## Agents

| Agent | Purpose |
|-------|---------|
| **content** | Data + content pages (research, verify, build) |
| **product** | UX features, interactive tools, delights |
| **seo** | Technical SEO (audit, fix, deploy) |
| **marketing** | Outreach, backlinks, campaigns |

## Deploy

```bash
wrangler pages deploy ./public --project-name=airplane-directory
```

## Docs

- `CLAUDE.md` — How we work, agents, skills
- `BACKLOG.md` — Idea parking lot
- `CHANGELOG.md` — What we shipped
- `CONTEXT.md` — Key decisions & lessons learned
