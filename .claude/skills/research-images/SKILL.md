# Research Images Skill

How to find images for commercial aircraft in the airplane directory.

## Image Types Needed

- **Primary image**: Clean side profile or 3/4 view of the aircraft
- Shows the full aircraft clearly
- Ideally in flight or on ground with minimal background clutter

## Best Sources

1. **Manufacturer press kits**
   - Boeing media resources
   - Airbus newsroom/media
   - High quality, official images

2. **Wikimedia Commons**
   - Search for "[aircraft model]"
   - Look for images with permissive licenses (CC-BY, public domain)
   - Good variety of angles

3. **Airline press releases**
   - Often have clean promotional shots
   - May need to check licensing

## Quality Requirements

- Minimum size: 600x400 pixels
- Format: PNG or JPG
- Clear, well-lit image
- Aircraft should be the main subject
- Avoid heavily branded airline liveries if possible (generic/manufacturer livery preferred)

## Naming Convention

- `[slug].jpg` or `[slug].png` - main image
- Examples:
  - `boeing-737-800.jpg`
  - `airbus-a320neo.png`

## Download Process

1. Find high-quality image from approved sources
2. Verify licensing allows use
3. Download to temp folder
4. Resize if needed (keep aspect ratio)
5. Upload to R2

## Upload Command

```bash
npx wrangler r2 object put airplane-directory-assets/aircraft/[slug].jpg --file=./temp/[slug].jpg
```

## Incremental Research

When adding to existing data:
1. Check R2 for existing images before downloading
2. Only download images for new aircraft
3. List existing: query the aircraft table and check R2

## Notes

- Prioritize manufacturer images for consistency
- Aircraft in neutral/manufacturer livery look best for directory
- Avoid images with heavy watermarks
