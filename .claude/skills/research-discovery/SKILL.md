---
name: research-discovery
description: Discover aircraft, fill images, and show coverage overview. Usage: /research-discovery [manufacturer?] or /research-discovery images [manufacturer]
user_invokable: true
agent: content
---

# Research Discovery

You've been invoked to **discover new aircraft** for a manufacturer or **show a high-level overview** of current coverage.

- `/research-discovery` — Show coverage overview, gaps, and recommendations
- `/research-discovery [manufacturer]` — Discover new aircraft for a manufacturer
- `/research-discovery images [manufacturer]` — Find and upload images for aircraft missing them

## Your Task

Discover aircraft for: **{{args}}**

---

## If No Manufacturer Provided — Coverage Overview

Show what we have and where the gaps are.

### 1. Run Coverage Queries

```bash
# Aircraft per manufacturer
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as aircraft FROM aircraft GROUP BY manufacturer ORDER BY aircraft DESC;"

# Image coverage per manufacturer
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as total, SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as with_images, ROUND(100.0 * SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) / COUNT(*), 1) as image_pct FROM aircraft GROUP BY manufacturer ORDER BY total DESC;"

# Spec completeness
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as total, SUM(CASE WHEN passengers IS NOT NULL AND range_km IS NOT NULL THEN 1 ELSE 0 END) as complete_specs FROM aircraft GROUP BY manufacturer ORDER BY total DESC;"

# Status distribution
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT status, COUNT(*) as count FROM aircraft GROUP BY status ORDER BY count DESC;"

# Total counts
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT COUNT(*) as total_aircraft, COUNT(DISTINCT manufacturer) as manufacturers FROM aircraft;"
```

### 2. Present Overview

```markdown
## Coverage Overview

**Total:** [X] aircraft across [Y] manufacturers

### Manufacturer Coverage
| Manufacturer | Aircraft | Images | Specs Complete | Health |
|-------------|----------|--------|----------------|--------|
| Boeing      | 45       | 92%    | 85%            | Good   |
| Airbus      | 48       | 80%    | 90%            | Good   |

**Health scoring:**
- Good: 80%+ images, 80%+ specs complete
- OK: 60%+ images
- Needs work: Below thresholds

### Expansion Opportunities

**Manufacturers to research:**
Compare against major commercial aircraft manufacturers:
| Tier | Manufacturers |
|------|--------------|
| Tier 1 (must-have) | Boeing, Airbus, Embraer, Bombardier/De Havilland Canada |
| Tier 2 (high value) | ATR, COMAC, Mitsubishi, Tupolev, Sukhoi |
| Tier 3 (solid) | Fokker, BAe/BAC, McDonnell Douglas, Lockheed, Saab |

### Coverage Gaps
- [Manufacturer] has [X] aircraft but only [Y]% images → run `/research-discovery images [manufacturer]`
- [Manufacturer] missing from database → run `/research-discovery [manufacturer]`
- [Manufacturer] has spec gaps → run `/deep-research verify [manufacturer]`

## What would you like to do?
```

**Wait for user to pick an action before proceeding.**

---

## If Manufacturer Provided — Discover Aircraft

### 1. Check Existing Coverage

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, status FROM aircraft WHERE manufacturer = '[manufacturer]' ORDER BY name;"
```

### 2. Propose Discovery Plan

```markdown
## Discovery Plan: [Manufacturer]

**Already have:** [X] aircraft

### Target Aircraft
- [Aircraft family 1] (est. X variants) — [why important]
- [Aircraft family 2] (est. Y variants) — [significance]

### Primary Sources
- Manufacturer official website
- Aviation databases (planespotters.net, airfleets.net)
- Wikipedia for specifications
- Aviation publications (Aviation Week, Flight Global)

**Does this look right?**
```

**Wait for approval before proceeding.**

### 3. Research Aircraft

For each aircraft, gather:

| Field | Required | Notes |
|-------|----------|-------|
| `slug` | Yes | URL-safe identifier (e.g., boeing-737-800) |
| `name` | Yes | Display name (e.g., Boeing 737-800) |
| `manufacturer` | Yes | Boeing, Airbus, Embraer, etc. |
| `description` | Yes | Brief content about the aircraft |
| `first_flight` | Yes | Date of first flight |
| `passengers` | Yes | Typical passenger capacity |
| `range_km` | Yes | Range in kilometers |
| `cruise_speed_kmh` | Yes | Cruise speed in km/h |
| `length_m` | Yes | Length in meters |
| `wingspan_m` | Yes | Wingspan in meters |
| `engines` | Yes | Number of engines |
| `status` | Yes | In Production, Out of Production, Prototype |
| `fun_fact` | Yes | Interesting fact |
| `source_url` | Yes | Primary source URL |
| `sources` | Yes | JSON array of 2+ sources |
| `source_count` | Yes | Number of sources |

**Minimum 2 independent sources per aircraft.**

### 4. Create Seed File & Run

Create `scripts/seed-[manufacturer].sql` and run:
```bash
npx wrangler d1 execute airplane-directory-db --file=./scripts/seed-[manufacturer].sql --remote
```

### 5. Report & Update Docs

Update CHANGELOG.md and CONTEXT.md.

---

## Images Mode — Fill Missing Images

When invoked with `/research-discovery images [manufacturer]`, use `/research-images [manufacturer]` to find and upload images.

See the `/research-images` skill for the full image search workflow, source priority, and upload steps.

---

## Remember

- This is **discovery** — find aircraft, get specs, categorize
- Minimum 2 sources per aircraft for discovery
- Don't make up data — everything must be sourced
- Check existing aircraft first to avoid duplicates
- Update CHANGELOG.md and CONTEXT.md when done
