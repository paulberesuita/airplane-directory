# Context

Key decisions, insights, and lessons learned. Update this when making significant decisions or discovering important information.

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
