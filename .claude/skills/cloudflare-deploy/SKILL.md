# Cloudflare Deploy

Setup and deploy commands for Cloudflare Pages.

## New Project Setup

```bash
# 1. Create project
npx wrangler pages project create PROJECT_NAME

# 2. Create D1 database (if needed)
npx wrangler d1 create PROJECT_NAME-db

# 3. Create R2 bucket (if needed)
npx wrangler r2 bucket create PROJECT_NAME-assets

# 4. Set secrets
npx wrangler pages secret put API_KEY --project-name PROJECT_NAME
```

## wrangler.toml

```toml
name = "PROJECT_NAME"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./public"

[[d1_databases]]
binding = "DB"
database_name = "PROJECT_NAME-db"
database_id = "your-database-id"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "PROJECT_NAME-assets"
```

## Commands

```bash
# Local dev
wrangler pages dev ./public --d1=DB=PROJECT_NAME-db --local

# Run migration
npx wrangler d1 execute PROJECT_NAME-db --file=./migrations/XXX.sql --remote

# Deploy
wrangler pages deploy ./public --project-name=PROJECT_NAME

# Upload to R2
npx wrangler r2 object put PROJECT_NAME-assets/items/file.png --file=./file.png
```

## Post-Deploy Checklist

- [ ] Preview URL works
- [ ] No console errors
- [ ] API endpoints respond
