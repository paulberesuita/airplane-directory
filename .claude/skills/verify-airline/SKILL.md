---
name: verify-airline
description: Verify airline fleet data and save sources. Usage: /verify-airline [airline-slug]
user_invokable: true
agent: seo
---

# Verify Airline

You've been invoked to **verify and correct airline fleet data** for a specific airline, and **save the sources** used.

**Operation:** Verify Airline Fleet Data

## Your Task

Verify data for: **{{args}}**

If no airline slug was provided, list available airlines and ask which one to verify.

---

## Process

### 1. Pull Current Data

```bash
# List all airlines (if no slug provided)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, iata_code, fleet_size, headquarters, founded FROM airlines ORDER BY name;"

# Get airline info
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT * FROM airlines WHERE slug = '[airline-slug]';"

# Get fleet data
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT af.*, a.name as aircraft_name, a.manufacturer FROM airline_fleet af JOIN aircraft a ON af.aircraft_slug = a.aircraft_slug WHERE af.airline_slug = '[airline-slug]' ORDER BY af.count DESC;"
```

### 2. Research & Verify

For the airline, verify these fields against **at least 2 independent sources**:

**Airline-level fields:**
| Field | Check |
|-------|-------|
| `name` | Official name (check airline website) |
| `iata_code` | 2-letter IATA code |
| `icao_code` | 3-letter ICAO code |
| `headquarters` | City, State/Country |
| `founded` | Year founded |
| `fleet_size` | Total fleet size (active aircraft) |
| `destinations` | Number of destinations served |
| `description` | Accurate, factual, 2-3 sentences |
| `website` | Current official URL |

**Fleet-level fields (for each aircraft type):**
| Field | Check |
|-------|-------|
| `aircraft_slug` | Correct aircraft mapped (exists in our DB) |
| `count` | Number of this type in active fleet |
| `notes` | How the airline uses this aircraft (route types, special config) |

### 3. Best Sources for Airline Fleet Data

| Priority | Source | URL Pattern | Best For |
|----------|--------|-------------|----------|
| 1 | **Planespotters.net** | planespotters.net/airline/[name] | Fleet counts by type, active/stored |
| 2 | **Airline's official fleet page** | varies | Fleet types, cabin configs |
| 3 | **Wikipedia** | en.wikipedia.org/wiki/[Airline]#Fleet | Fleet table, orders, history |
| 4 | **ch-aviation.com** | ch-aviation.com/portal/airline/[code] | Fleet details |
| 5 | **airfleets.net** | airfleets.net/flottecie/[name].htm | Fleet composition |

**Search queries to try:**
- `"[airline name]" fleet composition 2026`
- `"[airline name]" fleet size aircraft types`
- `"[airline IATA]" fleet planespotters`
- `site:planespotters.net "[airline name]"`

### 4. Build Corrections

Create `scripts/verify-airline-[slug].sql`:

```sql
-- Verify airline fleet data: [Airline Name]
-- Verified on: YYYY-MM-DD
-- Sources:
--   [1] https://source1.com/...
--   [2] https://source2.com/...

-- Airline info corrections
UPDATE airlines SET
  fleet_size = [number],
  destinations = [number],
  description = '[corrected description]'
WHERE slug = '[airline-slug]';

-- Fleet corrections (update counts)
UPDATE airline_fleet SET count = [new_count], notes = '[usage notes]'
WHERE airline_slug = '[airline-slug]' AND aircraft_slug = '[aircraft-slug]';

-- Add missing fleet entries
INSERT OR IGNORE INTO airline_fleet (airline_slug, aircraft_slug, count, notes)
VALUES ('[airline-slug]', '[aircraft-slug]', [count], '[notes]');

-- Remove aircraft no longer in fleet
DELETE FROM airline_fleet
WHERE airline_slug = '[airline-slug]' AND aircraft_slug = '[aircraft-slug]';
```

### 5. Save Sources

After verifying, save the sources used to `airline_fleet_sources` table:

```sql
-- Save verification sources
INSERT INTO airline_fleet_sources (airline_slug, field_name, value_set, source_url, source_name, source_type, accessed_at, notes)
VALUES
  ('[slug]', 'fleet_size', '[value]', 'https://...', 'Planespotters.net', 'aviation_db', 'YYYY-MM-DD', 'Active fleet count'),
  ('[slug]', 'fleet_composition', 'Boeing 737-800: 40', 'https://...', 'Wikipedia', 'reference', 'YYYY-MM-DD', 'Fleet table'),
  ('[slug]', 'headquarters', 'Chicago, Illinois', 'https://...', 'Airline website', 'official', 'YYYY-MM-DD', NULL);
```

**Source types:** `official` (airline website), `aviation_db` (planespotters, airfleets), `reference` (Wikipedia), `news` (press releases, articles), `regulatory` (FAA, DOT)

### 6. Run & Verify

```bash
# Run corrections
npx wrangler d1 execute airplane-directory-db --file=./scripts/verify-airline-[slug].sql --remote

# Verify results
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT af.aircraft_slug, a.name, af.count, af.notes FROM airline_fleet af JOIN aircraft a ON af.aircraft_slug = a.aircraft_slug WHERE af.airline_slug = '[slug]' ORDER BY af.count DESC;"
```

### 7. Report & Update Docs

Present a summary:

```markdown
## Verification Report: [Airline Name]

### Changes Made
- Fleet size: [old] -> [new]
- Added: [aircraft types added]
- Removed: [aircraft types removed]
- Updated counts: [list changes]

### Sources Used
| # | Source | URL | Fields Verified |
|---|--------|-----|-----------------|
| 1 | Planespotters.net | [url] | Fleet counts |
| 2 | Wikipedia | [url] | Fleet table, HQ, founded |
| 3 | [Airline].com | [url] | Official fleet page |

### Data Confidence
- High: [fields verified by 2+ sources]
- Medium: [fields with 1 source]
- Unverified: [fields we couldn't confirm]
```

Update **CHANGELOG.md** and **CONTEXT.md**.

---

## Migration: airline_fleet_sources Table

If the `airline_fleet_sources` table doesn't exist yet, create it first:

```sql
-- Migration: Add airline fleet sources table
CREATE TABLE IF NOT EXISTS airline_fleet_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  airline_slug TEXT NOT NULL,
  field_name TEXT NOT NULL,
  value_set TEXT,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL,
  accessed_at TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (airline_slug) REFERENCES airlines(slug)
);

CREATE INDEX IF NOT EXISTS idx_afs_airline ON airline_fleet_sources(airline_slug);
```

Run: `npx wrangler d1 execute airplane-directory-db --file=./migrations/012_airline_fleet_sources.sql --remote`

---

## Rules

- **Don't make up data** -- everything must be sourced
- **Minimum 2 sources** for fleet counts and airline info
- **Save all sources** to `airline_fleet_sources` table
- **Report before applying** -- show changes and get approval
- **SQL scripts only** -- don't run ad-hoc updates, create scripts in `scripts/`
- **Update docs** -- CHANGELOG.md and CONTEXT.md
- **Be conservative** -- if a source is unclear, note it as low confidence rather than guessing
