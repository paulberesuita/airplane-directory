---
name: deep-research
description: Deep research on aircraft specs, verify data quality, verify airline fleets. Usage: /deep-research [slug or manufacturer]
user_invokable: true
agent: content
---

# Deep Research

You've been invoked to **deeply research an aircraft** to verify and expand its data, or **verify data quality** across the database.

- `/deep-research [slug]` — Deep research on a specific aircraft
- `/deep-research verify [manufacturer]` — Check data quality and fill gaps
- `/deep-research airline [airline-slug]` — Verify airline fleet data

## Your Task

Research: **{{args}}**

---

## If No Target Provided

Show aircraft that need deeper research:

```bash
# Aircraft with thin data (missing specs)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, source_count, CASE WHEN passengers IS NULL THEN 'missing' ELSE 'ok' END as passengers, CASE WHEN range_km IS NULL THEN 'missing' ELSE 'ok' END as range FROM aircraft WHERE passengers IS NULL OR range_km IS NULL OR source_count < 2 ORDER BY source_count ASC LIMIT 20;"
```

**Wait for user to pick before proceeding.**

---

## Deep Research on One Aircraft

### 1. Check Current Data

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT * FROM aircraft WHERE slug = '[slug]';"
```

### 2. Research from Multiple Sources

**Primary sources (most reliable):**
1. Manufacturer official specs (boeing.com, airbus.com, embraer.com)
2. Aviation databases (planespotters.net, airfleets.net)
3. Wikipedia for factual verification
4. Aviation publications (Aviation Week, Flight Global, Simple Flying)

**For each source, extract:**
- Exact specifications (passengers, range, speed, dimensions)
- First flight date and certification history
- Production numbers and variants
- Interesting facts and records
- Operator information

### 3. Update Database

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "UPDATE aircraft SET
  passengers = [value],
  range_km = [value],
  cruise_speed_kmh = [value],
  length_m = [value],
  wingspan_m = [value],
  description = '[expanded]',
  sources = '[updated JSON array]',
  source_count = [count]
WHERE slug = '[slug]';"
```

### 4. Report

```markdown
## Research Complete: [Aircraft Name]

**Before:** [X] sources, [missing fields]
**After:** [Y] sources, all specs filled

### Key Findings
- [Notable finding]
- [Notable finding]

### Sources Used
| # | Source | Fields Verified |
|---|--------|----------------|
| 1 | [url] | specs, first flight |
| 2 | [url] | passengers, range |
```

Update CHANGELOG.md and CONTEXT.md.

---

## Verify Mode — Check Data Quality

When invoked with `/deep-research verify [manufacturer]`:

### 1. Run Diagnostic Queries

```bash
# Missing specs
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE manufacturer = '[manufacturer]' AND (passengers IS NULL OR range_km IS NULL);"

# Under-sourced entries
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, source_count FROM aircraft WHERE manufacturer = '[manufacturer]' AND (source_count < 2 OR source_count IS NULL);"

# Missing descriptions
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE manufacturer = '[manufacturer]' AND (description IS NULL OR description = '');"
```

### 2. Report & Fix

Present findings, get approval, create `scripts/fix-[issue].sql` for fixes.

---

## Airline Mode — Verify Fleet Data

When invoked with `/deep-research airline [airline-slug]`:

### 1. Pull Current Data

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT * FROM airlines WHERE slug = '[airline-slug]';"
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT af.*, a.name as aircraft_name FROM airline_fleet af JOIN aircraft a ON af.aircraft_slug = a.aircraft_slug WHERE af.airline_slug = '[airline-slug]' ORDER BY af.count DESC;"
```

### 2. Research & Verify

Verify against **at least 2 independent sources:**

| Priority | Source | Best For |
|----------|--------|----------|
| 1 | Planespotters.net | Fleet counts by type |
| 2 | Airline's official fleet page | Fleet types, configs |
| 3 | Wikipedia | Fleet table, history |
| 4 | ch-aviation.com | Fleet details |
| 5 | airfleets.net | Fleet composition |

### 3. Build Corrections

Create `scripts/verify-airline-[slug].sql` with corrections and source comments.

### 4. Save Sources

Save verification sources to `airline_fleet_sources` table:

```sql
INSERT INTO airline_fleet_sources (airline_slug, field_name, value_set, source_url, source_name, source_type, accessed_at, notes)
VALUES ('[slug]', '[field]', '[value]', 'https://...', '[Source]', '[type]', 'YYYY-MM-DD', '[notes]');
```

**Source types:** `official`, `aviation_db`, `reference`, `news`, `regulatory`

### 5. Report

Present changes made, sources used, and confidence levels. Update CHANGELOG.md and CONTEXT.md.

---

## Data Quality Rules

- **Don't make up data** — Everything must be sourced
- **Minimum 2 independent sources** — Skip data that can't be corroborated
- **Track all source URLs** — Store in `sources` JSON array
- **Report before fixing** — Show changes and get approval
- **SQL scripts only** — Create scripts in `scripts/`, don't run ad-hoc updates
- **Update docs** — CHANGELOG.md and CONTEXT.md when done
