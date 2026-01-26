---
name: verify-data
description: Check data quality and fill gaps. Usage: /verify-data [manufacturer?]
user_invokable: false
agent: seo
---

# Verify Data

You've been invoked to **verify data** quality and fill gaps.

**Operation:** Verify Data (from SEO agent)

## Your Task

Check data quality for: **{{args}}** (or all manufacturers if not specified)

---

## Process

### 1. Run Diagnostic Queries

```bash
# Missing required fields
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE description IS NULL OR description = '';"

# Missing source URLs
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE source_url IS NULL;"

# Manufacturer distribution (check for typos)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as count FROM aircraft GROUP BY manufacturer ORDER BY count DESC;"

# Under-sourced entries
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, source_count FROM aircraft WHERE source_count < 2 OR source_count IS NULL ORDER BY manufacturer;"

# Image coverage
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT COUNT(*) as total, SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as with_images FROM aircraft;"

# Missing specs
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE passengers IS NULL OR range_km IS NULL;"

# Aircraft without history entries
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT a.slug, a.name FROM aircraft a LEFT JOIN aircraft_history h ON a.slug = h.aircraft_slug WHERE h.id IS NULL;"
```

### 2. Report Findings

```markdown
## Data Quality Report

### Issues Found
- **Missing description:** X aircraft
- **Missing sources:** Y aircraft
- **Under-sourced (< 2 sources):** Z aircraft
- **Invalid manufacturers:** [list any typos]
- **Missing specs:** W aircraft
- **No history entries:** V aircraft

### Recommended Fixes
1. [Fix description]
2. [Fix description]

**Should I proceed with fixes?**
```

### 3. Fix Issues (after approval)

Create `scripts/fix-[issue].sql`:

```sql
-- Fix [issue description]
-- Generated on YYYY-MM-DD

UPDATE aircraft SET description = '[value]' WHERE slug = 'slug';
```

Run the fix:
```bash
npx wrangler d1 execute airplane-directory-db --file=./scripts/fix-[issue].sql --remote
```

### 4. Update Docs

- **CHANGELOG.md** — Document fixes made
- **CONTEXT.md** — Note any patterns or lessons learned

---

## What to Check

- **Missing required fields** — description, manufacturer, name
- **Missing sources** — source_url is NULL
- **Under-sourced entries** — source_count < 2 (need additional corroboration)
- **Manufacturer typos** — Not using established manufacturers (Boeing, Airbus, etc.)
- **Image coverage** — Aircraft without images
- **Missing specs** — passengers, range_km, cruise_speed_kmh, etc.
- **Broken URLs** — source_url returns 404

---

## Remember

- Report issues before fixing
- Create SQL scripts for fixes (don't run ad-hoc updates)
- Update CHANGELOG.md with fixes
