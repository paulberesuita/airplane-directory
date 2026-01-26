# Changelog

What we shipped. Builder appends here after each feature.

---

## 2026-01-26

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
