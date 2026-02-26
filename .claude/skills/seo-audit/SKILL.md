---
name: seo-audit
description: Audit SEO health, find page opportunities, and check sitemap. Usage: /seo-audit
user_invokable: true
agent: seo
---

# SEO Audit

You've been invoked to **audit SEO health** across the site — check what's working, what's broken, and recommend what to build or fix.

- `/seo-audit` — Full audit (all checks below)
- `/seo-audit sitemap` — Sitemap health check only
- `/seo-audit content` — Thin content + internal linking check
- `/seo-audit pages` — Find page opportunities only
- `/seo-audit data` — Data quality check (missing fields, under-sourced)

---

## Full Audit

### 1. Check Meta Tags

Sample one page from each type and verify:

```bash
# Homepage
curl -s https://airlineplanes.com/ | grep -E '<title>|<meta name="description"|<meta property="og:|<meta name="twitter:'

# An aircraft page
curl -s https://airlineplanes.com/aircraft/boeing-737-800 | grep -E '<title>|<meta name="description"|<meta property="og:|<meta name="twitter:'

# A manufacturer page
curl -s https://airlineplanes.com/manufacturer/boeing | grep -E '<title>|<meta name="description"|<meta property="og:|<meta name="twitter:'

# An airline page
curl -s https://airlineplanes.com/airlines/delta-air-lines | grep -E '<title>|<meta name="description"|<meta property="og:|<meta name="twitter:'
```

### 2. Check Structured Data

```bash
# Check for JSON-LD on aircraft page
curl -s https://airlineplanes.com/aircraft/boeing-737-800 | grep -o '<script type="application/ld+json">.*</script>'

# Check manufacturer page
curl -s https://airlineplanes.com/manufacturer/boeing | grep -o '<script type="application/ld+json">.*</script>'
```

### 3. Check Sitemap & Robots

```bash
# Sitemap exists and has content
curl -s https://airlineplanes.com/sitemap.xml | head -20

# Robots.txt
curl -s https://airlineplanes.com/robots.txt
```

### 4. Run All Checks

After meta tags, structured data, and sitemap/robots, also run:
- **Thin Content Check** (see below)
- **Internal Linking Check** (see below)
- **Broken Links / 404 Check** (see below)
- **Image SEO Check** (see below)
- **Indexing Check** (see below)
- **Data Quality Check** (see below)

### 5. Present Audit Results

```markdown
## SEO Audit Results

### Meta Tags
| Page Type | Title | Description | OG Tags | Twitter Cards |
|-----------|-------|-------------|---------|---------------|
| Homepage  | [ok/missing] | [ok/missing] | [ok/missing] | [ok/missing] |
| Aircraft  | [ok/missing] | [ok/missing] | [ok/missing] | [ok/missing] |
| Manufacturer | [ok/missing] | [ok/missing] | [ok/missing] | [ok/missing] |
| Airline   | [ok/missing] | [ok/missing] | [ok/missing] | [ok/missing] |

### Structured Data
| Page Type | Schema Type | Status |
|-----------|-------------|--------|
| Homepage  | WebSite     | [ok/missing] |
| Aircraft  | Product     | [ok/missing] |
| Manufacturer | ItemList | [ok/missing] |
| Airline   | Organization | [ok/missing] |

### Sitemap Health
- [X/Y URLs match] — [see details below]

### Thin Content
- [X] aircraft with thin descriptions (<200 chars)
- [Y] aircraft with no description at all

### Internal Linking
- [ok/missing] Aircraft → manufacturer links
- [ok/missing] Aircraft → airline links
- [ok/missing] Manufacturer → aircraft links

### Broken Links
- [X] broken links found across [Y] pages checked

### Image SEO
- [X]% of aircraft have images
- Alt text: [ok/missing/generic]
- Lazy loading: [ok/missing]

### Indexing
- ~[X] pages indexed by Google (vs [Y] expected)

### Data Quality
- [X] aircraft missing key specs
- [Y] under-sourced entries (<2 sources)

### Robots.txt
- [ok/missing/issues]

### Recommendations
**High priority:**
- [issues that hurt rankings]

**Medium priority:**
- [improvements that help]

**Low priority:**
- [nice-to-haves]
```

---

## Sitemap Health Check

When invoked with `/seo-audit sitemap` or as part of a full audit.

### 1. Fetch and Parse Sitemap

```bash
# Get the sitemap
curl -s https://airlineplanes.com/sitemap.xml > /tmp/sitemap.xml

# Count URLs in sitemap
grep -c '<loc>' /tmp/sitemap.xml
```

### 2. Compare Against Database

```bash
# Total aircraft in DB
npx wrangler d1 execute airplane-directory-db --remote --json --command "SELECT COUNT(*) as total FROM aircraft"

# Total manufacturers
npx wrangler d1 execute airplane-directory-db --remote --json --command "SELECT COUNT(DISTINCT manufacturer) as manufacturers FROM aircraft"

# Total airlines
npx wrangler d1 execute airplane-directory-db --remote --json --command "SELECT COUNT(*) as total FROM airlines"

# Get all aircraft slugs from DB
npx wrangler d1 execute airplane-directory-db --remote --json --command "SELECT slug FROM aircraft ORDER BY slug"
```

### 3. Cross-Reference

Check that the sitemap includes:
- `https://airlineplanes.com/` (homepage)
- `https://airlineplanes.com/aircraft` (aircraft index)
- `https://airlineplanes.com/aircraft/[slug]` for every aircraft in DB
- `https://airlineplanes.com/airlines` (airlines index)
- `https://airlineplanes.com/airlines/[slug]` for every airline in DB
- `https://airlineplanes.com/manufacturer/[name]` for every manufacturer

**Find missing URLs:**
- Extract all slugs from sitemap
- Compare against all slugs in DB
- Report any aircraft in DB but not in sitemap
- Report any URLs in sitemap that return 404

### 4. Validate URLs

Spot-check a sample of sitemap URLs to make sure they return 200:

```bash
curl -sI https://airlineplanes.com/aircraft/[slug1] | head -1
curl -sI https://airlineplanes.com/aircraft/[slug2] | head -1
curl -sI https://airlineplanes.com/airlines/[slug1] | head -1
curl -sI https://airlineplanes.com/manufacturer/boeing | head -1
```

### 5. Report Sitemap Health

```markdown
## Sitemap Health

**URLs in sitemap:** [X]
**Expected URLs:** [Y] (1 homepage + aircraft index + [N] aircraft + airlines index + [M] airlines + [P] manufacturers + other)
**Match:** [X/Y] ([percentage]%)

### Missing from Sitemap
| URL | Type | Issue |
|-----|------|-------|
| /aircraft/[slug] | aircraft | In DB but not in sitemap |

### Dead URLs in Sitemap
| URL | Status | Issue |
|-----|--------|-------|
| /aircraft/[slug] | 404 | In sitemap but returns 404 |

### Recommendations
- [Fix sitemap generation if URLs are missing]
- [Remove dead URLs]
- [Submit updated sitemap to Google Search Console]
```

---

## Page Opportunities

When invoked with `/seo-audit pages` or as part of a full audit.

### 1. Find Opportunities

```bash
# Manufacturers with 3+ aircraft (candidates for manufacturer pages)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as aircraft FROM aircraft GROUP BY manufacturer HAVING aircraft >= 3 ORDER BY aircraft DESC;"

# Airlines with fleet data (candidates for airline pages)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT a.name, a.fleet_size, COUNT(af.aircraft_slug) as mapped FROM airlines a LEFT JOIN airline_fleet af ON a.slug = af.airline_slug GROUP BY a.slug ORDER BY a.fleet_size DESC;"
```

### 2. Check What Pages Already Exist

```bash
# Check if manufacturer pages exist
curl -sI https://airlineplanes.com/manufacturer/boeing | head -1
curl -sI https://airlineplanes.com/manufacturer/airbus | head -1

# Check if airline pages exist
curl -sI https://airlineplanes.com/airlines/delta-air-lines | head -1
```

### 3. Present Opportunities

```markdown
## Page Opportunities

### Manufacturer Pages (not yet built)
| Manufacturer | Aircraft | Priority |
|-------------|----------|----------|
| [name] | [X] | Build first |

### Comparison Pages
| Comparison | Search Volume | Priority |
|-----------|--------------|----------|
| A320 vs 737 | High | Build |

### What to Build Next
Recommend the top 3 pages to build, with reasoning.
```

---

## Thin Content Check

When invoked with `/seo-audit content` or as part of a full audit.

### 1. Query Thin Pages

```bash
# Aircraft with very short descriptions (under 200 chars)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, manufacturer, LENGTH(description) as desc_len FROM aircraft WHERE LENGTH(description) < 200 ORDER BY desc_len ASC LIMIT 30;"

# Aircraft with no description at all
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, manufacturer FROM aircraft WHERE description IS NULL OR description = '' OR LENGTH(description) < 50;"

# Overall thin content stats by manufacturer
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as total, SUM(CASE WHEN LENGTH(description) < 200 THEN 1 ELSE 0 END) as thin, SUM(CASE WHEN LENGTH(description) >= 500 THEN 1 ELSE 0 END) as rich FROM aircraft GROUP BY manufacturer ORDER BY thin DESC;"
```

### 2. Report

```markdown
## Thin Content Report

**Total aircraft:** [X]
**Rich (500+ chars):** [Y] ([%])
**Thin (<200 chars):** [Z] ([%])
**Empty/near-empty:** [W]

### Worst Offenders
| Aircraft | Manufacturer | Desc Length | Action |
|----------|-------------|-------------|--------|
| [name] | [mfr] | [X] chars | Run `/deep-research [slug]` |

### Manufacturers with Most Thin Content
| Manufacturer | Total | Thin | Rich | Action |
|-------------|-------|------|------|--------|
| [name] | [X] | [Y] | [Z] | Prioritize for `/deep-research` |
```

---

## Internal Linking Check

Check that pages link to related content — this distributes SEO authority across the site.

### 1. Check Aircraft → Manufacturer Links

```bash
curl -s https://airlineplanes.com/aircraft/boeing-737-800 | grep -o 'href="/manufacturer/[^"]*"'
```

### 2. Check Aircraft → Related Aircraft

```bash
curl -s https://airlineplanes.com/aircraft/boeing-737-800 | grep -o 'href="/aircraft/[^"]*"' | head -10
```

### 3. Check Manufacturer → Aircraft Links

```bash
curl -s https://airlineplanes.com/manufacturer/boeing | grep -o 'href="/aircraft/[^"]*"' | wc -l
```

### 4. Find Linking Gaps

```bash
# Manufacturers with multiple aircraft — these should cross-link
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as aircraft FROM aircraft GROUP BY manufacturer HAVING aircraft >= 3 ORDER BY aircraft DESC;"
```

### 5. Report

```markdown
## Internal Linking Report

### Aircraft Pages
- [ok/missing] Link to manufacturer page
- [ok/missing] Links to other aircraft by same manufacturer
- [ok/missing] Links to airlines operating this aircraft

### Manufacturer Pages
- [ok/missing] Links to all aircraft by this manufacturer

### Airline Pages
- [ok/missing] Links to fleet aircraft

### Recommendations
- [Add "Other [Manufacturer] aircraft" section to aircraft pages]
- [Add "Airlines operating this aircraft" section]
- [Ensure manufacturer page lists all aircraft]
```

---

## Broken Links / 404 Check

### 1. Spot-Check Internal Links

Fetch a few pages and verify their internal links resolve:

```bash
# Get all internal links from a manufacturer page
curl -s https://airlineplanes.com/manufacturer/boeing | grep -o 'href="/aircraft/[^"]*"' | sort -u | while read link; do
  url="https://airlineplanes.com$(echo $link | tr -d 'href="')"
  status=$(curl -sI "$url" | head -1 | awk '{print $2}')
  echo "$url: $status"
done
```

### 2. Check Recently Added Aircraft

```bash
# Get the newest aircraft and verify their pages load
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug FROM aircraft ORDER BY rowid DESC LIMIT 10;"
```

Then spot-check each:
```bash
curl -sI https://airlineplanes.com/aircraft/[slug] | head -1
```

---

## Image SEO Check

### 1. Check Alt Text

```bash
curl -s https://airlineplanes.com/aircraft/boeing-737-800 | grep -o '<img[^>]*>' | head -5
```

Look for:
- `alt=""` or missing `alt` attribute — bad for SEO
- Generic alt text like "image" — not helpful
- Descriptive alt text like "Boeing 737-800 aircraft" — good

### 2. Check Image Loading

```bash
# Check if images use lazy loading
curl -s https://airlineplanes.com/aircraft | grep -o '<img[^>]*loading="lazy"[^>]*>' | head -3

# Check for width/height attributes (prevents CLS)
curl -s https://airlineplanes.com/aircraft | grep -o '<img[^>]*width="[^"]*"[^>]*>' | head -3
```

### 3. Find Aircraft Missing Images

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, manufacturer FROM aircraft WHERE image_url IS NULL OR image_url = '' ORDER BY manufacturer LIMIT 20;"
```

---

## Indexing Check

### 1. Check Indexed Pages

Use WebSearch:
```
site:airlineplanes.com
```

Note the approximate result count.

### 2. Check Key Pages Are Indexed

```
site:airlineplanes.com/aircraft/boeing-737-800
site:airlineplanes.com/manufacturer/boeing
site:airlineplanes.com/airlines/delta-air-lines
```

### 3. Compare Against Expected

```bash
# Expected page count
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT (SELECT COUNT(*) FROM aircraft) + (SELECT COUNT(*) FROM airlines) + (SELECT COUNT(DISTINCT manufacturer) FROM aircraft) + 4 as expected_pages;"
```

The +4 accounts for homepage, aircraft index, airlines index, about page.

---

## Data Quality Check

When invoked with `/seo-audit data` or as part of a full audit. Bad data = bad pages = bad SEO.

### 1. Run Diagnostic Queries

```bash
# Missing key specs (passengers, range, speed)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, manufacturer FROM aircraft WHERE passengers IS NULL OR range_km IS NULL OR cruise_speed_kmh IS NULL ORDER BY manufacturer LIMIT 30;"

# Missing source URLs
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, manufacturer FROM aircraft WHERE NOT EXISTS (SELECT 1 FROM aircraft_sources WHERE aircraft_sources.aircraft_slug = aircraft.slug) LIMIT 20;"

# Status distribution (check for non-standard values)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT status, COUNT(*) as count FROM aircraft GROUP BY status ORDER BY count DESC;"

# Aircraft with no description
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, manufacturer FROM aircraft WHERE description IS NULL OR LENGTH(description) < 50 LIMIT 20;"
```

### 2. Report

```markdown
## Data Quality Report

**Total aircraft checked:** [X]

### Missing Fields
| Issue | Count | Impact |
|-------|-------|--------|
| Missing key specs | [X] | Incomplete pages, poor user experience |
| Missing descriptions | [Y] | Thin content, hurts SEO |
| No sources | [Z] | Can't verify data, credibility issue |

### Invalid Status Values
| Status | Count | Suggested Fix |
|--------|-------|---------------|
| [non-standard] | [X] | Change to [correct] |

### Recommended Fixes
1. **[Fix]** — Create migration script for [issue]
2. **[Fix]** — Run `/deep-research [manufacturer]` to fill gaps
3. **[Fix]** — Standardize status with UPDATE query

**Fixes should be written as SQL migration scripts in `scripts/fix-[issue].sql`.**
Report issues before fixing — don't run ad-hoc updates.
```

---

## SEO Checklist by Page Type

Every page must have:
- Title tag (unique, keyword-rich, <60 chars)
- Meta description (compelling, <160 chars)
- Open Graph tags (og:title, og:description, og:image, og:type)
- Twitter card tags
- Canonical URL
- Structured data (Schema.org JSON-LD)
- Internal links to related pages
- Semantic HTML (h1, article, nav)

Schema types and title patterns are in `/project-architecture`.

---

## Verification Tools

After any SEO changes:
- **Structured data:** https://search.google.com/test/rich-results
- **OG tags:** Facebook Sharing Debugger
- **Sitemap:** Submit to Google Search Console

---

## Remember

- This skill **audits and recommends** — the SEO agent builds
- Always check sitemap health when new aircraft are added
- All pages need proper SEO elements before launch
- Update CHANGELOG.md and CONTEXT.md after fixes
