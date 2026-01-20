#!/bin/bash

# Upload missing aircraft images to R2

TEMP_DIR="$(dirname "$0")/../temp"

# List of missing aircraft slugs
MISSING=(
  "airbus-a220-100"
  "airbus-a318"
  "airbus-a319"
  "airbus-a320"
  "airbus-a321"
  "airbus-a330-200"
  "airbus-a330-800neo"
  "airbus-a330-900neo"
  "airbus-a340-300"
  "airbus-a340-500"
  "airbus-a340-600"
  "airbus-a350-1000"
  "boeing-737-max-10"
  "boeing-737-max-7"
  "boeing-737-max-9"
  "boeing-737-700"
  "boeing-747-8i"
  "boeing-757-300"
  "boeing-767-400er"
  "boeing-777-200er"
  "boeing-777-200lr"
  "boeing-777-8"
  "boeing-777-9"
  "boeing-787-10"
)

echo "Uploading missing aircraft images to R2..."
echo ""

for slug in "${MISSING[@]}"; do
  # Check for jpg first, then png
  if [ -f "$TEMP_DIR/$slug.jpg" ]; then
    file="$TEMP_DIR/$slug.jpg"
    filename="$slug.jpg"
  elif [ -f "$TEMP_DIR/$slug.png" ]; then
    file="$TEMP_DIR/$slug.png"
    filename="$slug.png"
  else
    echo "SKIP: $slug (no file found)"
    continue
  fi

  echo "Uploading $filename..."
  npx wrangler r2 object put "airplane-directory-assets/aircraft/$filename" --file="$file" --remote 2>&1 | grep -E "Creating|Upload"
done

echo ""
echo "Done!"
