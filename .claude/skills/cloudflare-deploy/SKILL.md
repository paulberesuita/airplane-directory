---
name: cloudflare-deploy
description: Load deploy commands and environment details. Usage: /cloudflare-deploy
user_invokable: true
---

# Cloudflare Deploy

Deploy commands for the Airplane Directory.

---

## Project Details

| Resource | Name |
|----------|------|
| Pages Project | `airplane-directory` |
| D1 Database | `airplane-directory-db` |
| R2 Bucket | `airplane-directory-assets` |
| Domain | `airplane-directory.pages.dev` |
| Preview URL | `airplane-directory.pages.dev` |

**CRITICAL:** Both preview and production are the SAME project. One deploy updates both URLs.

---

## Commands

```bash
# Local dev
wrangler pages dev ./public --d1=DB=airplane-directory-db --local

# Run a migration (remote)
npx wrangler d1 execute airplane-directory-db --file=./migrations/XXX.sql --remote

# Run ad-hoc SQL (remote)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT COUNT(*) FROM aircraft;"

# Deploy (updates BOTH preview and production)
wrangler pages deploy ./public --project-name=airplane-directory

# Upload image to R2
npx wrangler r2 object put airplane-directory-assets/aircraft/slug.jpg --file=./temp/slug.jpg --remote

# List R2 objects
npx wrangler r2 object list airplane-directory-assets --remote
```

---

## wrangler.toml

```toml
name = "airplane-directory"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./public"

[[d1_databases]]
binding = "DB"
database_name = "airplane-directory-db"
database_id = "fea2251d-3288-41ae-a607-fce9e5950129"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "airplane-directory-assets"
```

---

## Migration Naming

Migrations are numbered sequentially:
```
migrations/
├── 001_create_aircraft.sql
├── 002_add_[feature].sql
├── 003_add_[feature].sql
└── ...
```

Always use the next number. Check existing migrations before creating.

---

## Post-Deploy Checklist

- [ ] Visit production URL — homepage loads
- [ ] Check a list page: `/aircraft`
- [ ] Check a detail page: `/aircraft/[slug]`
- [ ] Check images load (no broken thumbnails)
- [ ] No console errors in browser DevTools

---

## Common Issues

| Problem | Fix |
|---------|-----|
| Deploy goes to wrong project | Always use `--project-name=airplane-directory` |
| D1 command fails with auth error | Run `npx wrangler login` to refresh token |
| R2 upload 404s | Add `--remote` flag (defaults to local) |
| Page not updating | Edit `functions/[section]/[[slug]].js`, not `index.js` |
| New manufacturer not showing | Update manufacturer mappings in ALL SSR functions |
