# Structure

High-level overview of pages and how they connect to data.

---

## URL Patterns

| Pattern | Example | Status | Function |
|---------|---------|--------|----------|
| `/` | Homepage | Built | `functions/index.js` |
| `/airlines` | Airline list | Built | `functions/airlines/[[slug]].js` |
| `/airlines/[slug]` | Airline detail | Built | `functions/airlines/[[slug]].js` |
| `/aircraft` | Aircraft list | Built | `functions/aircraft/[[slug]].js` |
| `/aircraft/[slug]` | Aircraft detail | Built | `functions/aircraft/[[slug]].js` |
| `/sitemap.xml` | Sitemap | Built | `functions/sitemap.xml.js` |
| `/images/*` | Images | Built | `functions/images/[[path]].js` |
| `/manufacturer` | Manufacturer list | Built | `functions/manufacturer/[[slug]].js` |
| `/manufacturer/[slug]` | Manufacturer detail | Built | `functions/manufacturer/[[slug]].js` |
| `/compare/[a]-vs-[b]` | Comparison | Planned | — |
| `/best/[topic]` | Top list | Planned | — |

### API Endpoints (JSON)

| Pattern | Status | Function |
|---------|--------|----------|
| `/api/aircraft` | Built | `functions/api/aircraft/index.js` |
| `/api/aircraft/[slug]` | Built | `functions/api/aircraft/[slug].js` |
| `/api/aircraft/[slug]/history` | Built | `functions/api/aircraft/[slug]/history.js` |

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

### airlines
US airline carriers.

| Field | Type | Used By |
|-------|------|---------|
| slug | text | URL routing, FK reference |
| name | text | Display |
| iata_code | text | Display (e.g., "AA", "DL") |
| icao_code | text | Display |
| headquarters | text | Airline detail |
| founded | int | Airline detail |
| fleet_size | int | Stats display |
| destinations | int | Stats display |
| description | text | Airline detail |
| website | text | Link to official site |

### airline_fleet
Junction table linking airlines to aircraft.

| Field | Type | Used By |
|-------|------|---------|
| airline_slug | text | FK to airlines |
| aircraft_slug | text | FK to aircraft |
| count | int | Fleet stats |
| notes | text | Context (e.g., "Domestic routes") |

---

## Page → Data Mapping

| Page | Query |
|------|-------|
| Homepage | Airlines + fleet stats via JOIN, Aircraft in US fleets via `INNER JOIN airline_fleet` |
| Airlines List | `SELECT * FROM airlines ORDER BY fleet_size DESC` |
| Airline Detail | Airline info + fleet with JOIN to aircraft table |
| Aircraft Detail | Aircraft + `SELECT * FROM aircraft_history WHERE aircraft_slug = ?` + Airlines operating via JOIN |
| Manufacturer | `SELECT * FROM aircraft WHERE manufacturer = ?` |
| Comparison | `SELECT * FROM aircraft WHERE slug IN (?, ?)` |

---

## Images

Served from R2 via `/images/aircraft/[slug].jpg`
