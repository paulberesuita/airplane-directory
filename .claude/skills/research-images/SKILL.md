---
name: research-images
description: Find and upload images for aircraft. Usage: /research-images [manufacturer] or /research-images [slug]
user_invokable: true
agent: content
---

# Research Images

Find and upload images for aircraft that don't have them.

## Your Task

Find images for: **{{args}}**

---

## If Manufacturer Provided — Batch Mode

### 1. Find Aircraft Needing Images

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE manufacturer = '[manufacturer]' AND (image_url IS NULL OR image_url = '') LIMIT 20;"
```

If no args provided, show image coverage across all manufacturers:
```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as total, SUM(CASE WHEN image_url IS NOT NULL AND LENGTH(image_url) > 0 THEN 1 ELSE 0 END) as with_images, COUNT(*) - SUM(CASE WHEN image_url IS NOT NULL AND LENGTH(image_url) > 0 THEN 1 ELSE 0 END) as missing FROM aircraft GROUP BY manufacturer ORDER BY missing DESC;"
```

Then process each aircraft using the workflow below.

## If Slug Provided — Single Aircraft

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, manufacturer FROM aircraft WHERE slug = '[SLUG]';"
```

Then process using the workflow below.

---

## Image Search Workflow

For EACH aircraft, do all steps before moving to the next.

### A. Find the Image

Try sources in order. Stop when you find a usable image.

**1. Wikipedia API:**
```bash
curl -s "https://en.wikipedia.org/w/api.php?action=query&titles=[Article_Name]&prop=pageimages&piprop=original&format=json"
```

**2. Wikimedia Commons search:**
```bash
curl -s "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=[Aircraft+Name]&srnamespace=6&format=json"
```
Then get URL: `action=query&titles=File:[filename]&prop=imageinfo&iiprop=url&format=json`

**3. Openverse (CC aggregator):**
```bash
curl -s "https://api.openverse.org/v1/images/?q=[Aircraft+Name]&license=by,by-sa,cc0,pdm&page_size=5" | jq '.results[0].url'
```
Aggregates Flickr, Wikimedia, and other CC sources. Use `license=by,by-sa,cc0,pdm` for permissive; add `by-nc,by-nc-sa` if none found.

**4. Planespotters.net** — High quality aircraft photos, check license per image

**5. Jetphotos.com** — Large aviation photo database, check license per image

**6. Manufacturer press images:**
- boeing.com/company/media
- airbus.com/en/newsroom
- embraer.com/global/en/media
- atr-aircraft.com/media
- bombardier.com/en/media

**7. Flickr Creative Commons:**
```
WebSearch: site:flickr.com "[aircraft name]" creative commons
```
Check license on each photo — BY and BY-SA are safest. BY-NC-SA acceptable for non-commercial editorial use.

**8. Airliners.net** — Massive aviation photo archive, check license per image

**9. Aviation museums/archives:**
- Smithsonian National Air and Space Museum (airandspace.si.edu)
- Museum of Flight (museumofflight.org)
- San Diego Air & Space Museum (Flickr: sdasm) — Thousands of public domain aviation photos
- Library of Congress (loc.gov) — Historical aviation photos

**10. Internet Archive** — Historical aviation photos, manufacturer brochures, vintage postcards. Pre-1929 publications are public domain.

### Source Priority

1. **Wikimedia Commons** — Creative Commons, safest
2. **Wikipedia article image** — Usually CC-licensed
3. **Openverse** — CC aggregator, fast license filtering
4. **Manufacturer press images** — Official photos, often freely usable
5. **SDASM Flickr** — Public domain aviation archive (thousands of photos)
6. **Planespotters.net** — High quality, check license
7. **Jetphotos.com** — Large database, check license
8. **Flickr Creative Commons** — With license filter
9. **Airliners.net** — Check license per image
10. **Aviation museums** — Smithsonian, Museum of Flight
11. **Internet Archive** — Historical photos, pre-1929 public domain
12. **Library of Congress** — Government photos, public domain

### Category-Specific Tips

- **Widebody jets (777, A350, etc.):** Wikipedia almost always has photos — check here first
- **Regional jets (E-Jets, CRJ, ATR):** Manufacturer press sites (Embraer, ATR, Bombardier)
- **Historic/retired (707, DC-10, Concorde):** SDASM Flickr archive, Wikimedia Commons, aviation museums, Internet Archive
- **Prototypes/in development (C919, MC-21):** Manufacturer press releases, aviation news sites
- **Military-derived (KC-135, P-8):** Wikimedia Commons military aviation categories, US gov photos (public domain)
- **Rare/low-production (VFW 614, Mercure):** Wikimedia Commons, aviation enthusiast Flickr accounts

### B. Download, Upload to R2, Update DB

All in one go per aircraft:

```bash
# Download
curl -L "[IMAGE_URL]" -o temp/[slug]-new.jpg

# Upload to R2
npx wrangler r2 object put airplane-directory-assets/aircraft/[slug].jpg --file=./temp/[slug]-new.jpg --remote

# Update database
npx wrangler d1 execute airplane-directory-db --remote --command "UPDATE aircraft SET image_url = 'aircraft/[slug].jpg' WHERE slug = '[slug]';"
```

### C. Verify

```bash
curl -sI "https://airlineplanes.com/images/aircraft/[slug].jpg" | head -3
```

Should return `200 OK` with `content-type: image/jpeg`.

---

## Rules

- **If you cannot find a photo of the actual aircraft, skip it.** A missing image is better than a wrong image.
- Only use CC-licensed, public domain, or explicitly permitted images
- Note the license and source for each image found
- Report skipped aircraft with the reason (no usable image found)
- Update CHANGELOG.md when done
