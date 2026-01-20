#!/bin/bash

# Upload aircraft images to R2

TEMP_DIR="$(dirname "$0")/../temp"

echo "Uploading images to R2..."
echo ""

for file in "$TEMP_DIR"/*.jpg "$TEMP_DIR"/*.png; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "Uploading $filename..."
    npx wrangler r2 object put "airplane-directory-assets/aircraft/$filename" --file="$file" --remote 2>&1 | grep -v "wrangler"
  fi
done

echo ""
echo "Done!"
