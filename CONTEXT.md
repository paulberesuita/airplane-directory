# Context

Key decisions, insights, and lessons learned. Update this when making significant decisions or discovering important information.

---

## 2026-01-25

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
