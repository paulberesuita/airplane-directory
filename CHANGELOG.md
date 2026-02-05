# Changelog

What we shipped. Builder appends here after each feature.

---

## 2026-02-05

### Aircraft Images
- **Uploaded 17 missing aircraft images** to R2 storage from Wikimedia Commons
  - Airbus: A318, A319neo, A320, A330-800neo, A330-900neo, A340-300, A340-500, A340-600
  - Boeing: 737 MAX 7, 737 MAX 10, 747-8i, 777-200LR, 777-8, 777-9, 787-10
  - Regional: Bombardier CRJ-900, Embraer E190-E2
- All 45 aircraft now have real photos displayed

### Stamp Collection Card Design for Aircraft
- **Applied stamp collection style** to aircraft cards on homepage and /aircraft page
- **Visual elements:**
  - Double border with warm tan color (`#8b7355`)
  - Dashed inner frame around image
  - Vintage cream background (`#f5f0e6`)
  - Italic manufacturer name
  - Aircraft specs displayed as stamp-like details
- Uses `object-contain` to show full aircraft body in images

### Plausible Analytics
- **Added Plausible analytics** to all pages (homepage, airlines, aircraft, manufacturer, about)
- Privacy-friendly, no cookies, GDPR compliant

### Boarding Pass Card Design
- **Redesigned airline cards** on both homepage and /airlines page using boarding pass/ticket style
- **Visual elements:**
  - Thin brand-colored accent line at top
  - Light cream header with logo and airline name
  - Left stub with large IATA code
  - Main content area with hub city and fleet count
  - SVG barcode rotated 90° on right stub
  - Semi-circle cutouts at perforation lines (brand-colored at bottom)
- **Warm color palette:** Replaced gray tones with cream/tan (`#faf8f5`, `#f5f2ed`, `#d4c8b8`)
- **41 airline brand colors** mapped for accent lines and cutouts
- **Homepage shows top 6 airlines** — "View all" links to full list
- **Uploaded colored logos** for American Airlines and Alaska Airlines to R2

### Card Style Demo Page
- **Added `/demo/cards` page** — Visual comparison of 7 playful card styles for airline display
- **7 card styles included:**
  1. Logo Mosaic / Icon Grid — Tight grid of logos, names on hover
  2. Pixel-Border Cards — CSS clip-path stepped edges
  3. Floating Cards — Subtle CSS bobbing animation
  4. Stamp Collection — Passport stamp aesthetic with rotated cards
  5. Boarding Pass Style — Horizontal ticket layout with barcode
  6. Airplane Window Frames — Rounded frames like looking out a window
  7. Compact Pills/Chips — Small rounded badges
- Uses same 6 airlines across all styles for easy comparison
- Same sky background with Mario clouds as main site

---

## 2026-01-27

### SEO Improvements
- **Fixed sitemap.xml** — Now correctly generates 94 URLs (was returning stale content with 1 URL)
- **Added JSON-LD WebSite schema** to homepage for rich snippets in search results
- **Uploaded 41 airline logos** to R2 storage — 100% coverage for all airlines
  - Researched and downloaded from [SeekLogo](https://seeklogo.com) (free vector logo database)
  - US carriers: American, Delta, United, Southwest, JetBlue, Alaska, Spirit, Frontier
  - European: British Airways, Lufthansa, Air France, KLM, Finnair, Swiss, SAS, Norwegian, Icelandair, Virgin Atlantic, Iberia, TAP Portugal, Aer Lingus, Turkish Airlines
  - Asia-Pacific: Singapore Airlines, Cathay Pacific, Qantas, Air New Zealand, ANA, Japan Airlines, Korean Air, China Airlines, EVA Air
  - Middle East: Emirates, Qatar Airways, Etihad Airways, El Al
  - Americas: Air Canada, WestJet, Aeromexico, Avianca, Copa Airlines, LATAM

---

## 2026-01-26

### Aircraft Detail Page Expanded Specs UI
- **Redesigned Technical Specifications section** with glass morphism cards (bg-white/20, backdrop-blur-xl)
- **Organized specs into 8 categories:**
  - Performance: Range, cruise speed, service ceiling, climb rate
  - Dimensions: Length, wingspan (with metric + imperial)
  - Capacity: Passengers, cargo volume, max payload
  - Engines: Count, manufacturer, thrust per engine
  - Weights: MTOW, fuel capacity (with dual units)
  - Takeoff/Landing: Distances with unit conversion
  - Commercial: Total orders, delivered, list price
  - History: First flight, production status
- **Added Related Variants section** showing other aircraft in the same family (e.g., 737-700, 737-900ER on 737-800 page)
- **Added Sources section** displaying per-field data citations with source type badges (M=Manufacturer, D=Aviation Database, N=News)
- **Unit conversions throughout:**
  - kg to lbs for weights
  - liters to gallons for fuel
  - meters to feet for dimensions and distances
- **Updated SQL query** to fetch all 15 new specification columns

### Expanded Aircraft Specifications Data
- **Added 15 new spec columns** to aircraft table:
  - Performance: max_takeoff_weight_kg, fuel_capacity_liters, service_ceiling_m, takeoff_distance_m, landing_distance_m, climb_rate_fpm
  - Cargo: cargo_capacity_m3, max_payload_kg
  - Engine: engine_thrust_kn, engine_manufacturer
  - Commercial: total_orders, total_delivered, list_price_usd
  - Family: family_slug, variant_order
- **Populated all 45 aircraft** with expanded specifications:
  - Tier 1 (8): Boeing 737-800, 737 MAX 8, 737-900ER, Airbus A320neo, A321neo, Boeing 787-8, 787-9, 777-300ER
  - Tier 2 (33): All remaining Boeing and Airbus variants
  - Tier 3 (4): Embraer E175, E190, E190-E2, Bombardier CRJ-900
- **Created 21 aircraft families** with variant ordering:
  - Boeing: 737 NG, 737 MAX, 757, 767, 777 Classic, 777X, 787, 747 Classic, 747-8, 717
  - Airbus: A220, A320ceo, A320neo, A330ceo, A330neo, A340, A350, A380
  - Regional: Embraer E-Jet E1, E-Jet E2, Bombardier CRJ
- **Created aircraft_sources table** for per-field source tracking:
  - 75 source citations across 19 key aircraft
  - Source types: manufacturer (4), aviation_db (67), news (4)
  - Tracked fields: MTOW, fuel capacity, service ceiling, engine specs, orders/deliveries
- **Data sources:** Wikipedia, SKYbrary, Flugzeuginfo, Aero Corner, Aircraft Commerce, Airbus/Boeing official

### Manufacturer Pages
- **Created `/manufacturer` list page** showing all 4 manufacturers (Boeing, Airbus, Embraer, Bombardier)
- **Created `/manufacturer/[slug]` detail pages** with:
  - Company description, founding year, headquarters
  - Stats: total aircraft types, in production count, max passengers, max range
  - Grid of all aircraft from that manufacturer with glass morphism cards
  - JSON-LD Organization structured data for SEO
- **Updated sitemap.xml** to include manufacturer list and detail pages
- **Added Manufacturers link** to homepage footer navigation
- **Updated STRUCTURE.md** to mark manufacturer pages as built

### Airline Logos Uploaded
- **15 airline logos** uploaded to R2 storage:
  - US: American, Delta, United, Southwest, JetBlue, Alaska, Spirit, Frontier
  - International: British Airways, Lufthansa, Air France, KLM, Emirates, Finnair, Swiss
- Airlines without logos display IATA code fallback

### UI Polish - Transparent Design
- **Airlines page:** Removed solid backgrounds from nav and hero, removed card borders
- **Airline detail page:** Removed stats section, made description card semi-transparent (`bg-white/60 backdrop-blur-sm`)
- **Aircraft page:** New dedicated page at `/aircraft` with manufacturer filters (moved from homepage)
- **Aircraft detail page:** Removed hero gradient, white text with drop shadows
- **Footer:** Removed solid background across all pages

### International Airlines Expansion
- **Added 32 international airlines** flying to/from the USA:
  - **Europe (13):** British Airways, Lufthansa, Air France, KLM, Virgin Atlantic, Iberia, Swiss, Aer Lingus, Icelandair, TAP Portugal, Norwegian, SAS, Finnair
  - **Middle East (5):** Emirates, Qatar Airways, Etihad Airways, Turkish Airlines, El Al
  - **Asia-Pacific (9):** Japan Airlines, ANA, Korean Air, Singapore Airlines, Cathay Pacific, Qantas, Air New Zealand, EVA Air, China Airlines
  - **Americas (5):** Air Canada, WestJet, Aeromexico, LATAM, Avianca, Copa Airlines
- **233 fleet mappings** linking international airlines to aircraft types
- Updated site messaging from "US Airlines" to global focus
- Total airlines: 40 (8 US + 32 international)

### Homepage UI Improvements
- **Sky background** — Added blue sky gradient background image (fixed to viewport height)
- **Removed hero solid background** — Sky now visible through hero section
- **Lightened headline weights** — Changed from `font-bold` to `font-semibold`
- **Removed search input** — Simplified hero by removing search box
- **Airline logos** — Airline cards now display actual logos with IATA fallback
- **White text colors** — Updated all homepage text from black/gray to white for contrast against sky:
  - Section headers use `text-white drop-shadow`
  - Subtitles use `text-white/70`
  - Filter buttons use semi-transparent white with backdrop blur

---

## 2026-01-25

### Airline-Specific Aircraft Images
- **71 airline-livery images** downloaded and uploaded to R2
- Each airline's fleet page shows aircraft in that airline's livery
- Images sourced from Wikimedia Commons via API search
- Created scripts for automated image management:
  - `scripts/download-verified-images.js` — Searches Wikimedia API for verified URLs
  - `scripts/download-curated-images.js` — Downloads from curated URL list
  - `scripts/upload-airline-images.js` — Status check and R2 upload

### US Airlines Pivot
- **New Focus:** Airplane Directory now centers on US airline fleets
- **New Database Schema:**
  - `airlines` table — US carriers with IATA/ICAO codes, HQ, fleet size, description
  - `airline_fleet` junction table — Maps airlines to aircraft with counts
- **Seeded 8 major US airlines:** American, Delta, United, Southwest, JetBlue, Alaska, Spirit, Frontier
- **72 fleet mappings** linking airlines to aircraft types with counts and notes

### Airlines Pages
- Created `functions/airlines/[[slug]].js` — SSR pages for airline list and details
- **Airlines list page** (`/airlines`):
  - Grid of airline cards with fleet stats
  - JSON-LD ItemList schema for SEO
- **Airline detail pages** (`/airlines/[slug]`):
  - Airline info header with IATA code, HQ, founded date
  - Fleet grid showing all aircraft operated
  - JSON-LD Airline schema

### Homepage Redesign
- **Updated hero messaging:** "Know what planes US airlines fly"
- **Added stats banner:** Airlines count, total aircraft, aircraft types
- **New US Airlines section:** Grid of airline cards above aircraft section
- **Aircraft section:** Shows only aircraft in US airline fleets
- **Updated footer:** Added Airlines/Aircraft nav links

### Aircraft Page Updates
- Added "US Airlines Operating This Aircraft" section on detail pages
- Shows airline cards with aircraft count for each carrier

---

### Architecture Refactor: SSR Migration
- **Converted to Server-Side Rendering** — All pages now rendered server-side via Cloudflare Functions
  - `functions/index.js` — Homepage with aircraft grid
  - `functions/aircraft/[[slug]].js` — List page and detail pages
- **Removed static HTML** — Deleted `public/index.html` and `public/aircraft.html`
- **Benefits:** SEO crawlers now see full content, faster perceived performance, proper meta tags on first load

### Technical SEO
- Added `functions/sitemap.xml.js` — Dynamic XML sitemap with all aircraft URLs
- Added `public/robots.txt` — Points to sitemap, disallows /api/
- Added Open Graph tags for social sharing (og:title, og:description, og:image)
- Added Twitter Card meta tags
- Added JSON-LD structured data:
  - Homepage: WebSite schema
  - Aircraft list: ItemList schema
  - Aircraft detail: Product schema with specs

### Design System Alignment
- Updated Tailwind config to use custom color tokens (primary, muted, card, border, etc.)
- Changed font class from `font-heading` to `font-display` per design system
- Standardized on slate color palette (was mixing gray/slate)

### Infrastructure
- Fixed R2 binding: `BUCKET` → `IMAGES` in wrangler.toml
- Moved image serving from `/api/images/aircraft/[filename]` to `/images/aircraft/[slug].jpg`
- Updated `functions/images/[[path]].js` to use `IMAGES` binding

---

## 2026-01-20
### Aircraft Images in UI
- Added aircraft images to homepage cards with 16:9 aspect ratio
- Added hover zoom effect on card images
- Added large featured image to aircraft detail pages (responsive sizing)
- Graceful fallback to placeholder when images are missing
- Error handling for broken image links

### Aircraft History & Timeline Feature
- Created `aircraft_history` table for rich historical content
- New API endpoint: GET /api/aircraft/[slug]/history
- History section on aircraft detail pages with:
  - Timeline of key milestones with year markers
  - Development stories and narratives
  - Interesting facts grid
  - Records and achievements
  - Notable events/incidents
  - Legacy and impact summaries
- Added 278 history entries covering 42 aircraft:
  - Boeing: 737 family, 747, 757, 767, 777 family, 787 family
  - Airbus: A318-A321 family, A220, A330, A340, A350, A380
  - Regional: Embraer E175, E190-E2, Bombardier CRJ-900
- Content types: milestone, development, story, fact, record, incident, legacy

### Aircraft Images
- Added images for all 19 aircraft from Wikimedia Commons
- Images stored in R2 bucket at `aircraft/[slug].jpg`
- Added `image_url` column to aircraft table
- Created image serving API at `/api/images/aircraft/[filename]`
- Images sourced under Creative Commons licenses

### Additional Aircraft Data (Batch 4)
- Added 14 more aircraft to the database (43 total)
- New Boeing: 737-700, 737 MAX 7, 757-300, 767-400ER, 777-200ER, 777-8
- New Airbus: A318, A319, A320, A321 (classic ceo family), A330-200, A330-800neo, A340-300, A340-500

### Additional Aircraft Data (Batch 3)
- Added 10 more aircraft to the database
- New Boeing: 737 MAX 9, 737 MAX 10, 777-200LR, 777-9, 787-10, 747-8 Intercontinental
- New Airbus: A220-100, A330-900neo, A350-1000, A340-600

### Additional Aircraft Data (Batch 2)
- Added 5 new aircraft to the database
- New Boeing: 737-900ER, 787-8 Dreamliner
- New Airbus: A319neo, A220-300
- New Regional: Embraer E175

---

## 2026-01-19
### UI Polish
- Hero section with sky blue gradient, radial patterns, and floating plane icon
- Prominent search bar in hero with large styling and shadow
- Enhanced aircraft cards with spec preview (passengers, range, speed), hover lift animations
- Manufacturer filter buttons with active state shadows and hover effects
- Detail page hero header with gradient background and wave divider
- Fun fact card with coral accent and gradient background
- Color-coded spec sections (dimensions, performance, capacity, history)
- Stat cards with colored icons and hover effects
- Professional footer with logo and branding
- Fade-in animations throughout
- Subtle dot pattern background on main content area
- Improved empty and error states with larger icons and clearer messaging

### Directory UI
- Homepage with search and manufacturer filter buttons
- Aircraft cards showing name, manufacturer, passengers, range, status
- Individual aircraft detail pages with full specs
- API endpoints: GET /api/aircraft and GET /api/aircraft/[slug]
- Mobile-responsive design following brand guidelines
- Loading, empty, and error states

### Database & Research Setup
- Created aircraft table schema with 14 fields
- Populated 14 commercial aircraft (Boeing, Airbus, Embraer, Bombardier)
- Created research skills for data and images
- Set up R2 bucket for aircraft images

### Aircraft Covered (initial)
| Manufacturer | Aircraft |
|-------------|----------|
| Boeing | 737-800, 737 MAX 8, 747-400, 757-200, 767-300ER, 777-300ER, 787-9 |
| Airbus | A320neo, A321neo, A330-300, A350-900, A380 |
| Embraer | E190-E2 |
| Bombardier | CRJ-900 |

---

<!-- Example format:

## 2025-01-12
### Landing Page
- Hero section with value prop
- Email signup CTA
- Mobile responsive

## 2025-01-15
### PDF Export
- Export results to PDF
- Branded footer with logo
- Growth: "Powered by" badge on exports

-->
