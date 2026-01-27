#!/bin/bash
# Upload all aircraft-styled images to R2

IMG_DIR="/Users/paulberesuita/Desktop/airplane-directory/images/aircraft-styled"

for file in "$IMG_DIR"/*; do
  filename=$(basename "$file")
  echo "Uploading $filename..."
  wrangler r2 object put airplane-directory-assets/images/aircraft-styled/"$filename" --file="$file" --remote
done

echo "Done!"
