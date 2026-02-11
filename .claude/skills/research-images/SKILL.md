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

**3. Planespotters.net** — High quality aircraft photos

**4. Manufacturer press images:**
- boeing.com/company/media
- airbus.com/en/newsroom
- embraer.com/global/en/media

**5. Flickr Creative Commons** — With license filter

### Source Priority

1. **Wikimedia Commons** — Creative Commons, safest
2. **Wikipedia article image** — Usually CC-licensed
3. **Manufacturer press images** — Official photos, often freely usable
4. **Planespotters.net** — High quality, check license
5. **Flickr Creative Commons** — With license filter
6. **Airliners.net** — Check license per image

### Category-Specific Tips

- **Widebody jets:** Wikipedia almost always has photos
- **Regional jets:** Manufacturer press sites (Embraer, ATR, Bombardier)
- **Historic/retired:** Wikimedia Commons, aviation museums
- **Prototypes/in development:** Manufacturer press releases

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
