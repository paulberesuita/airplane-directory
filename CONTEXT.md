# Context

Key decisions, insights, and lessons learned. Update this when making significant decisions or discovering important information.

---

## 2026-02-04

### Airline Logo Fix - Icon Only (COMPLETE)

Fixed three problem logos with clean, high-quality versions.

**Fixed:**
- **Delta Air Lines** - Replaced Simple Icons SVG (had "DELTA" text) with clean triangle-only SVG extracted from Wikimedia Commons
- **Alaska Airlines** - Replaced blurry 32x32 PNG with clean 600x600 Eskimo face icon from SeekLogo
- **Spirit Airlines** - Replaced watermarked Airhex tail with clean 600x600 wordmark from SeekLogo (Spirit has no icon-only logo)

**Key learnings:**
- Logos are served from R2 via `functions/images/[[path]].js` with 1-year cache (`max-age=31536000`)
- CDN caching is aggressive - must use query param cache busting (`?v=N`) when replacing files
- Airhex tail logos have AIRHEX.COM watermarks - not usable
- SeekLogo has clean, high-quality logos via URL pattern: `https://images.seeklogo.com/logo-png/{prefix}/{digit}/{name}-logo-png_seeklogo-{id}.png`
- Wikimedia Commons can be accessed directly (not through Wikipedia) for official logos
- Some airlines (Spirit) don't have icon-only logos - their brand IS the wordmark

---

## 2026-01-27

### Sitemap Function Deployment

The sitemap.xml function existed and worked correctly locally, but production was serving stale content.

**Root Cause:** Cloudflare Pages Functions need to be redeployed to update. The function code was correct, but a fresh `wrangler pages deploy` was needed to serve the updated version.

**Key Learning:** When Functions aren't working in production but work locally, try redeploying before debugging code.

### Airline Logo Sourcing

Attempted multiple sources for airline logos.

**What didn't work:**
- Wikimedia Commons: Direct downloads return HTTP 403 (Forbidden), most logos are SVG
- Wikipedia: Same issue with direct downloads blocked

**What worked:**
- [SeekLogo](https://seeklogo.com) has free PNG downloads with consistent URL pattern
- URL format: `https://images.seeklogo.com/logo-png/{prefix}/{digit}/{name}-logo-png_seeklogo-{id}.png`
- Downloaded all 26 missing logos successfully (5-16KB each)
- Total: 41/41 airlines now have logos (100% coverage)

**Key Learning:** SeekLogo is a reliable free source for brand logos. The URL pattern is predictable once you have the logo ID from their website. Always set proper User-Agent and Referer headers when downloading.

### R2 Image Serving Path Bug

The `/images/[[path]].js` function was stripping the `images/` prefix from the R2 key.

**Bug:** Route `/images/logos/airline.png` → key `logos/airline.png` → 404 (file is at `images/logos/airline.png`)

**Fix:** Prepend `images/` to the R2 key in the function:
```js
const key = 'images/' + params.path.join('/');
```

**Key Learning:** When using catch-all routes like `[[path]]`, the route prefix is NOT included in params. Must manually prepend it when constructing R2 keys.

### JSON-LD Coverage

All pages now have appropriate structured data:
- Homepage: WebSite schema
- Aircraft list: ItemList schema
- Aircraft detail: Product schema with additionalProperty
- Airlines list: ItemList with Airline items
- Airlines detail: Airline schema
- Manufacturer list: ItemList with Organization items
- Manufacturer detail: Organization schema

---

## 2026-01-26

### Aircraft Detail Page Specs UI Design

Redesigned the technical specifications section to display all expanded data.

**Design Decisions:**
- Used glass morphism cards (`bg-white/20 backdrop-blur-xl`) to match site's existing style
- 3-column grid on large screens, 2 on medium, 1 on mobile
- Conditional rendering for optional fields (only show cards/rows when data exists)
- Dual unit display (metric + imperial) for weights, distances, volumes

**Category Organization:**
- Grouped 15+ fields into 8 logical categories users would expect
- Performance first (what users care about most: range, speed, ceiling)
- Commercial last (orders/deliveries/price — more niche interest)

**Related Variants Pattern:**
- Query aircraft with same `family_slug` but different `slug`
- Sort by `variant_order` to show smaller variants first
- Shows passengers + range as quick comparison stats

**Sources Display:**
- De-duplicated by source_url (same source often cited for multiple fields)
- Badge system: M=Manufacturer (blue), D=Database (green), N=News (amber)
- Shows notes when available for context

**Key learnings:**
- Keep conditional checks simple: `${aircraft.field ? \`...\` : ''}` pattern works well
- Entire category cards can be conditionally rendered for cleaner output
- Glass morphism works well for spec cards but Airlines/Related sections kept solid cards for differentiation

---

### Aircraft Data Expansion Strategy

Expanded aircraft table with detailed specifications and per-field source tracking.

**Data Collection Approach:**
- Used web search to find manufacturer specs from multiple sources
- Cross-referenced Wikipedia, SKYbrary, Flugzeuginfo, and manufacturer sites
- Prioritized data accuracy over completeness (left fields NULL if uncertain)

**Family Grouping Logic:**
- `family_slug` groups variants together (e.g., all 737 MAX variants share `boeing-737-max`)
- `variant_order` provides sort order within family (smaller variant first)
- Enables future "compare variants" and "family overview" pages

**Source Tracking Decision:**
- Created `aircraft_sources` table for per-field attribution
- Each source record links to one aircraft + one field + one URL
- Source types: `manufacturer` (official), `aviation_db` (Wikipedia, SKYbrary), `news` (Simple Flying, etc.)
- Not every field has a source — focused on key specs (MTOW, fuel, engines, orders)

**Key learnings:**
- Boeing and Airbus stopped publishing list prices in 2018/2019; use historical prices with caveat
- Service ceiling is consistently ~41,000 ft for narrowbodies, ~43,000 ft for widebodies
- MTOW varies significantly by configuration; used most common/max values
- Orders/deliveries change frequently; stored as snapshot with accessed_at date

**What's missing (future work):**
- Some aircraft still need sources added to aircraft_sources
- Could add more per-field sources for completeness
- Max payload and climb rate fields not populated for many aircraft

---

### Manufacturer Pages Architecture

Created programmatic SEO pages for manufacturers without a dedicated database table.

**Approach:**
- Manufacturer metadata (description, founded, headquarters, website) stored as a constant in the function file
- Aircraft counts and stats derived from `aircraft` table using `GROUP BY manufacturer`
- Slug is lowercase version of manufacturer name (e.g., "Boeing" -> "boeing")

**Why this works:**
- Only 4 manufacturers, so hardcoded metadata is maintainable
- Stats stay accurate because they're calculated from aircraft table at runtime
- No migration needed, no data duplication

**Key pattern:**
- List page: Query `SELECT manufacturer, COUNT(*) ... GROUP BY manufacturer`
- Detail page: Lookup metadata from constant, query `SELECT * FROM aircraft WHERE LOWER(manufacturer) = ?`

---

### International Airlines Image Strategy

Attempted to download airline-specific aircraft images for 199 international airline/aircraft combinations.

**What didn't work:**
- Wikimedia API search with queries like "British Airways Boeing 777" rarely finds matching images
- Many airline-specific livery photos aren't on Wikimedia Commons with predictable naming

**What we did instead:**
- Use existing generic aircraft images (already in R2) for international airline fleet pages
- The fleet cards have a built-in fallback chain:
  1. First tries `/images/airlines/{airline}/{aircraft}.jpg` (airline-specific)
  2. Falls back to `/images/aircraft/{aircraft}.jpg` (generic)
  3. Final fallback: plane emoji placeholder

**Key learning:**
- Airline-specific aircraft photos are hard to source automatically at scale
- Generic aircraft images are acceptable for MVP — they show the actual aircraft type
- Better to ship with fallbacks than block on perfect images

### R2 Bucket Naming

Watch out for bucket name mismatches:
- `wrangler.toml` has `bucket_name = "airplane-directory-assets"`
- Double-check you're uploading to the right bucket name with `--remote` flag

---

## 2026-01-25

### Wikimedia Commons Image Sourcing

Downloaded 71 airline-specific aircraft images from Wikimedia Commons.

**What worked:**
- Using the Wikimedia API to search and get verified thumburls
- API returns actual working URLs (thumburl field) that can be downloaded directly
- Rate limiting with retries (2-4 sec between requests, 15 sec retry on 429)
- Node.js https for downloads (avoids shell escaping issues with special characters)

**What didn't work:**
- Guessing URLs based on filename patterns — Wikimedia URLs aren't predictable
- Fast downloads — triggered 429 rate limiting
- Direct URL encoding from curated lists with special characters (;, @) — they 404
- Shell commands (curl via execSync) with URLs containing encoded special chars

**Key learnings:**
- Always use the Wikimedia API to get actual URLs, don't construct them manually
- thumburl from the API gives properly formatted, working URLs
- Rate limiting is aggressive — need 2+ seconds between requests
- Files under 5KB are likely HTML error pages, not images
- R2 uploads use `wrangler r2 object put bucket/key --file=path --remote`

**Scripts created:**
- `download-verified-images.js` — Searches API, downloads with retries
- `upload-airline-images.js` — Checks status and uploads to R2

---

### US Airlines Pivot Decision

Pivoted the product from a general aircraft encyclopedia to a focused US airlines fleet guide.

**Why we pivoted:**
- Users care about planes they'll actually fly on
- "What planes does Delta fly?" is a more compelling entry point than browsing all aircraft
- Airlines provide natural organization and filtering
- Better SEO opportunity with airline-specific content

**New architecture:**
- Airlines as primary navigation (homepage features airlines prominently)
- Aircraft linked to airlines via junction table (`airline_fleet`)
- Aircraft pages show which US airlines operate them
- Only shows aircraft that are actually in US airline fleets

**Data model additions:**
```sql
airlines (slug, name, iata_code, icao_code, headquarters, founded, fleet_size, destinations, description, website)
airline_fleet (airline_slug, aircraft_slug, count, notes)
```

**Key learnings:**
- Junction tables need foreign keys to enforce referential integrity
- Seeding order matters: airlines first, then aircraft, then fleet mappings
- SUM + COUNT aggregates help show fleet stats without additional queries

---

### SSR Migration Decision

Migrated from static HTML + client-side fetching to full server-side rendering. The original architecture had `public/index.html` and `public/aircraft.html` as static files that fetched data via API on page load.

**Why we changed:**
- SEO crawlers saw empty pages (no content until JavaScript ran)
- Page titles and meta descriptions were generic until JS updated them
- No structured data (JSON-LD) on initial page load
- Slower perceived performance (blank → loading → content)

**New architecture:**
- `functions/index.js` — Returns complete homepage HTML with all aircraft data
- `functions/aircraft/[[slug]].js` — Returns complete HTML for list and detail pages
- All meta tags, OG tags, and JSON-LD baked into initial response
- Client-side JS only for interactive filtering (not data fetching)

**Key learnings:**
- Cloudflare Pages Functions with `[[slug]].js` pattern handles both bare path and parameterized paths
- Check `params.slug?.[0]` — undefined for bare path, string for detail path
- `escapeHtml()` is critical when rendering database content in HTML
- JSON-LD should match Schema.org types (Product for aircraft, ItemList for collections)

---

### Image Serving Path Change

Changed image serving from `/api/images/aircraft/[filename]` to `/images/aircraft/[slug].jpg`.

**Why:**
- Cleaner URLs that match the design system standard
- Consistent with the `/images/` pattern documented in coding-standards
- Aligns with the R2 binding rename from `BUCKET` to `IMAGES`

**Key learnings:**
- The `[[path]].js` pattern lets you capture multiple path segments
- `params.path.join('/')` reconstructs the full key for R2 lookup

---

### Design System Token Alignment

Reviewed codebase against design-system skill and found inconsistencies:
- Was using `text-gray-*` instead of `text-slate-*`
- Was using `font-heading` instead of `font-display`
- Mixed raw Tailwind colors with custom tokens

**Standardized to:**
- `text-slate-800` for body text
- `text-muted` (slate-500) for secondary text
- `font-display` for headings
- Custom color tokens: `primary`, `background`, `card`, `border`, `muted`, `accent`

---

## 2026-01-20

### Aircraft Image Research

Downloaded aircraft images from Wikimedia Commons for all 19 aircraft in the database. Used the Wikimedia API to search for images and curl with proper headers to download them.

**Key learnings:**
- Wikimedia Commons blocks programmatic downloads without proper headers
- Need `Referer: https://commons.wikimedia.org/` header to download images
- Wikimedia API (action=query&list=search) works for finding image filenames
- Original images are very large; use thumbnail URLs where possible
- Images under Creative Commons licenses are safe for use with attribution

**Image serving approach:**
- Images stored in R2 at `aircraft/[slug].jpg`
- Served via API endpoint `/api/images/aircraft/[filename]`
- Long cache headers (1 year) since images rarely change

---

## 2026-01-19

### Database Reuse Decision

Hit D1 database limit (10 databases). Reused `haunted-places-db` for this project instead of creating a new one. The aircraft table coexists with the existing places table.

**Key learnings:**
- D1 free tier has a 10 database limit
- Multiple tables in one database is fine for related projects
- Check `wrangler d1 list` before creating new databases

---

### Aircraft Schema Design

Designed schema focused on what aviation enthusiasts care about:
- Specs for comparison (range, passengers, dimensions, speed)
- Historical context (first flight, production status)
- Fun facts that make each aircraft memorable
- Source tracking for data provenance

**Key learnings:**
- Passenger counts should be ranges (varies by airline configuration)
- Include both metric and common units where possible
- Fun facts add personality and engagement to data

---

<!-- Example format:

## 2026-01-15

### Decision Title

What was decided and why.

**Key learnings:**
- Insight 1
- Insight 2

---

-->
