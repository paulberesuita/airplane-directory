---
name: research-images
description: Find and upload images for existing aircraft. Usage: /research-images [manufacturer?]
user_invokable: false
agent: seo
---

# Research Images

You've been invoked to **research images** for existing aircraft.

**Operation:** Research Images (from SEO agent)

## Your Task

Find and upload images for aircraft from: **{{args}}**

---

## If No Manufacturer Provided

Show the user which manufacturers need images:

1. **Query image coverage:**
   ```bash
   npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as total, SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as with_images, COUNT(*) - SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as missing FROM aircraft GROUP BY manufacturer ORDER BY missing DESC;"
   ```

2. **Show results:**
   ```
   ## Image Coverage
   | Manufacturer | Total | Has Image | Missing |
   |--------------|-------|-----------|---------|
   | Boeing       | 50    | 12        | 38      |
   | Airbus       | 48    | 8         | 40      |
   ...

   **Which manufacturer would you like to add images for?**
   ```

3. **Wait for user to pick before proceeding.**

---

## Process

**CRITICAL: Each image must be downloaded fresh, uploaded to R2, and database updated IMMEDIATELY — do not batch or defer.**

### Step 1: Find aircraft needing images
```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE manufacturer = '[manufacturer]' AND (image_url IS NULL OR image_url = '') LIMIT 20;"
```

### Step 2: For EACH aircraft (do all 3 steps before moving to next):

**A. Find the actual image URL (try in order, stop when found):**

1. **Wikipedia API** — Check if the aircraft has a Wikipedia article with a lead image:
   ```bash
   curl -s "https://en.wikipedia.org/w/api.php?action=query&titles=Boeing_737&prop=pageimages&piprop=original&format=json"
   ```

2. **Wikimedia Commons search** — Search for aircraft photos:
   ```bash
   curl -s "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Boeing+737&srnamespace=6&format=json"
   ```
   Then get the URL: `action=query&titles=File:[filename]&prop=imageinfo&iiprop=url&format=json`

3. **Planespotters.net** — High quality aircraft photos (check licensing)

4. **Manufacturer press images** — boeing.com/company/media, airbus.com/en/newsroom

- Get the direct image URL (ending in .jpg, .png, .webp, etc.)
- VERIFY it shows the real aircraft before proceeding

**B. Download, upload to R2, update DB — ALL IN ONE GO:**
```bash
# Download fresh (use unique timestamp to avoid cached files)
curl -L "[IMAGE_URL]" -o temp/[slug]-new.jpg

# Upload to R2 IMMEDIATELY
npx wrangler r2 object put airplane-directory-assets/aircraft/[slug].jpg --file=./temp/[slug]-new.jpg --remote

# Update database IMMEDIATELY
npx wrangler d1 execute airplane-directory-db --remote --command "UPDATE aircraft SET image_url = 'aircraft/[slug].jpg' WHERE slug = '[slug]';"
```

**C. Verify the upload worked:**
```bash
curl -sI "https://airplane-directory.pages.dev/images/aircraft/[slug].jpg" | head -3
```

### Step 3: Update CHANGELOG.md — Document images added

### Step 4: Deploy

```bash
wrangler pages deploy ./public --project-name=airplane-directory
```

### Step 5: Report results with verification URLs

Include URLs for verification:
- **Production:** `https://airplane-directory.pages.dev/images/aircraft/[slug].jpg`

---

## Image Sources (Priority Order)

**IMPORTANT: We want photos of the ACTUAL aircraft, not generic stock photos or illustrations.**

1. **Wikimedia Commons** — Creative Commons licensed, safest
2. **Planespotters.net** — High quality aircraft photos
3. **Manufacturer press images** — Official photos
4. **Flickr Creative Commons** — Search with license filter

**If you cannot find a photo of the actual aircraft, skip it and note it in the handoff.** A missing image is better than a wrong image.

---

## Remember

- Always use `--remote` flag for R2 and D1 commands
- Store only filename in image_url (e.g., `aircraft/[slug].jpg`)
- Update CHANGELOG.md when done
- Deploy after adding images
