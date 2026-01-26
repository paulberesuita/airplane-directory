# Structure

High-level overview of pages and how they connect to data.

---

## URL Patterns

| Pattern | Example | Description |
|---------|---------|-------------|
| `/` | Homepage | Hero + search + aircraft grid |
| `/aircraft` | List | All aircraft with filters |
| `/aircraft/[slug]` | Detail | Single aircraft specs + history |
| `/manufacturer/[slug]` | Manufacturer | Aircraft from one manufacturer |
| `/compare/[a]-vs-[b]` | Comparison | Side-by-side specs |
| `/best/[topic]` | Top list | Curated rankings |

---

## Data Model

### aircraft
Core table with specs and metadata.

| Field | Type | Used By |
|-------|------|---------|
| slug | text | URL routing |
| name | text | Display everywhere |
| manufacturer | text | Filtering, manufacturer pages |
| description | text | Detail page |
| passengers, range_km, cruise_speed_kmh | int | Specs display, comparisons |
| length_m, wingspan_m, engines | num | Specs display |
| status | text | Filtering (in production, etc.) |
| image_url | text | Cards, detail page |
| fun_fact | text | Detail page |

### aircraft_history
Timeline entries linked to aircraft.

| Field | Type | Used By |
|-------|------|---------|
| aircraft_slug | text | FK to aircraft |
| content_type | text | milestone, development, story, fact, record, incident, legacy |
| year | int | Timeline sorting |
| title, content | text | Timeline display |

---

## Page → Data Mapping

| Page | Query |
|------|-------|
| Homepage | `SELECT * FROM aircraft ORDER BY name` |
| Aircraft Detail | `SELECT * FROM aircraft WHERE slug = ?` + `SELECT * FROM aircraft_history WHERE aircraft_slug = ?` |
| Manufacturer | `SELECT * FROM aircraft WHERE manufacturer = ?` |
| Comparison | `SELECT * FROM aircraft WHERE slug IN (?, ?)` |

---

## Images

Served from R2 via `/images/aircraft/[slug].jpg`
