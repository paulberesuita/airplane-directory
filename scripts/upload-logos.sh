#!/bin/bash
# Upload all logos to R2

LOGO_DIR="/Users/paulberesuita/Desktop/airplane-directory/images/logos"

for file in "$LOGO_DIR"/*.png; do
  filename=$(basename "$file")
  echo "Uploading $filename..."
  wrangler r2 object put airplane-directory-assets/images/logos/"$filename" --file="$file" --remote
done

echo "Done!"
