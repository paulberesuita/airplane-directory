---
name: research-data
description: Research aircraft data for this directory. Usage: /research-data [category?]
user_invokable: false
agent: seo
---

# Research Data

You've been invoked to **research aircraft data** for this directory.

**Operation:** Research Data (from SEO agent)

## Your Task

Research aircraft for: **{{args}}**

---

## If No Category/Target Provided

Show the user what's been done and what's available:

1. **Query current coverage:**
   ```bash
   npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as items FROM aircraft GROUP BY manufacturer ORDER BY items DESC;"
   ```

2. **Show results and suggest options:**
   ```
   ## Current Coverage
   | Manufacturer | Items |
   |--------------|-------|
   | Boeing       | 45    |
   | Airbus       | 52    |
   ...

   ## Manufacturers That Need Research
   - [Manufacturer with low coverage]
   - [New manufacturer to add]
   - ...

   **Which manufacturer would you like to research?**
   ```

3. **Wait for user to pick before proceeding.**

---

## Process

### 1. Propose Research Plan

```markdown
## Research Proposal: [Manufacturer/Category]

### Target Areas
- [Aircraft type 1] (est. X aircraft) — [why important]
- [Aircraft type 2] (est. Y aircraft) — [significance]

### Primary Sources
- Manufacturer official website
- Aviation industry databases (planespotters.net, airfleets.net)
- Wikipedia for specifications
- Aviation publications (Aviation Week, Flight Global)

**Does this look right?**
```

**Wait for approval before proceeding.**

### 2. Research Aircraft

For each aircraft, gather:
- Name and unique identifier (for slug)
- Manufacturer
- First flight date
- Passenger capacity
- Range (km)
- Cruise speed (km/h)
- Length (m), Wingspan (m)
- Number of engines
- Status (in production, out of production, prototype)
- Description/content
- Fun fact
- **Minimum 2 independent source URLs**

**Good sources:**
- Manufacturer official specs (boeing.com, airbus.com)
- Aviation databases (planespotters.net, airfleets.net)
- Wikipedia for factual verification
- Aviation publications

### 3. Create Seed File

Create `scripts/seed-[manufacturer].sql`:

```sql
-- Seed data for [Manufacturer] aircraft
-- Generated on YYYY-MM-DD

INSERT OR REPLACE INTO aircraft (slug, name, manufacturer, description, first_flight, passengers, range_km, cruise_speed_kmh, length_m, wingspan_m, engines, status, fun_fact, source_url, sources, source_count)
VALUES
  ('boeing-777-300er', 'Boeing 777-300ER', 'Boeing', 'Long-range wide-body twin-engine jet airliner...',
   '2003-02-24', 396, 13650, 905, 73.9, 64.8, 2, 'In Production',
   'The 777 is the world''s largest twinjet.',
   'https://www.boeing.com/commercial/777',
   '["https://www.boeing.com/commercial/777","https://en.wikipedia.org/wiki/Boeing_777"]', 2);
```

### 4. Run Migration

```bash
npx wrangler d1 execute airplane-directory-db --file=./scripts/seed-[manufacturer].sql --remote
```

### 5. Verify and Report

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT COUNT(*) as items FROM aircraft WHERE manufacturer = '[manufacturer]';"
```

Update CHANGELOG.md and CONTEXT.md, then report:
> "[Manufacturer] now has [X] aircraft. Notable additions: [highlights]"

---

## Data Quality Rules

- **Don't make up data** — Everything must be sourced
- **Minimum 2 independent sources per aircraft** — Skip aircraft that can't be corroborated
- **Track all source URLs** — Store in `sources` JSON array, set `source_count`
- **Use established manufacturers only** — Boeing, Airbus, Embraer, Bombardier, ATR, etc.
- **Update docs when done** — CONTEXT.md and CHANGELOG.md

---

## Schema Reference

The `aircraft` table has these fields:
- `slug` — URL-safe identifier (e.g., boeing-737-800)
- `name` — Display name (e.g., Boeing 737-800)
- `manufacturer` — Boeing, Airbus, Embraer, etc.
- `description` — Brief content about the aircraft
- `first_flight` — Date of first flight
- `passengers` — Typical passenger capacity
- `range_km` — Range in kilometers
- `cruise_speed_kmh` — Cruise speed in km/h
- `length_m` — Length in meters
- `wingspan_m` — Wingspan in meters
- `engines` — Number of engines
- `status` — In Production, Out of Production, Prototype
- `fun_fact` — Interesting fact about the aircraft
- `source_url` — Primary source
- `sources` — JSON array of all sources
- `source_count` — Number of sources

---

## Sources to Search

| Source Type | Examples |
|-------------|----------|
| Manufacturer sites | boeing.com, airbus.com, embraer.com |
| Aviation databases | planespotters.net, airfleets.net |
| Reference sites | Wikipedia, official airline specs |
| Publications | Aviation Week, Flight Global |
