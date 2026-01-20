# Changelog

What we shipped. Builder appends here after each feature.

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
