#!/bin/bash

# Download aircraft images from Wikimedia Commons using curl
# Each URL is obtained from the Wikimedia API

TEMP_DIR="$(dirname "$0")/../temp"
mkdir -p "$TEMP_DIR"

echo "Downloading aircraft images..."

# Define downloads: slug|url
DOWNLOADS=(
  "boeing-737-800|https://upload.wikimedia.org/wikipedia/commons/5/59/Boeing_737_800_plane.jpg"
  "boeing-737-max-8|https://upload.wikimedia.org/wikipedia/commons/a/a2/Southwest_Airlines_Boeing_737_MAX_8_N8713M.jpg"
  "airbus-a320neo|https://upload.wikimedia.org/wikipedia/commons/0/09/Airbus_A320neo_landing_06.jpg"
  "airbus-a321neo|https://upload.wikimedia.org/wikipedia/commons/a/a9/Airbus_A321-271NX%2C_Wizz_Air_JP7599291.jpg"
  "boeing-787-9|https://upload.wikimedia.org/wikipedia/commons/4/4d/All_Nippon_Airways_Boeing_787-9_JA893A_HND_2019.jpg"
  "boeing-777-300er|https://upload.wikimedia.org/wikipedia/commons/c/c6/Boeing_777-300ER_Singapore_Airlines.JPG"
  "boeing-747-400|https://upload.wikimedia.org/wikipedia/commons/a/a9/British_Airways_Boeing_747-400_G-CIVL.jpg"
  "boeing-767-300er|https://upload.wikimedia.org/wikipedia/commons/9/9a/Delta_Air_Lines_Boeing_767-332ER_N1608.jpg"
  "boeing-757-200|https://upload.wikimedia.org/wikipedia/commons/6/6c/Delta_Air_Lines_Boeing_757-232_N671DN.jpg"
  "airbus-a350-900|https://upload.wikimedia.org/wikipedia/commons/b/b6/Singapore_Airlines_Airbus_A350-941_%289V-SMQ%29.jpg"
  "airbus-a380|https://upload.wikimedia.org/wikipedia/commons/2/21/Singapore_Airlines_Airbus_A380_woah%21.jpg"
  "airbus-a330-300|https://upload.wikimedia.org/wikipedia/commons/8/8a/Cathay_Pacific_Airbus_A330-343_B-LAD.jpg"
  "embraer-e190-e2|https://upload.wikimedia.org/wikipedia/commons/f/fd/KLM_Cityhopper_E2-190_PH-NXA.jpg"
  "bombardier-crj-900|https://upload.wikimedia.org/wikipedia/commons/9/9e/Delta_Connection_%28Endeavor_Air%29_N946XJ_Bombardier_CRJ-900LR.jpg"
  "boeing-737-900er|https://upload.wikimedia.org/wikipedia/commons/9/99/Alaska_Airlines_Boeing_737-990ER_N428AS.jpg"
  "airbus-a319neo|https://upload.wikimedia.org/wikipedia/commons/8/85/Spirit_Airlines_N9002S_Airbus_A319-132.jpg"
  "boeing-787-8|https://upload.wikimedia.org/wikipedia/commons/4/44/United_Airlines_-_N26910_-_Boeing_787-8_Dreamliner_-_San_Francisco_International_Airport-0799.jpg"
  "airbus-a220-300|https://upload.wikimedia.org/wikipedia/commons/7/7e/Air_France_A220-300_F-HZUD.jpg"
  "embraer-e175|https://upload.wikimedia.org/wikipedia/commons/8/8a/Republic_Airways_%28United_Express%29_Embraer_175_N726YX.jpg"
)

for item in "${DOWNLOADS[@]}"; do
  IFS='|' read -r slug url <<< "$item"
  ext="${url##*.}"
  ext="${ext%%\?*}"  # Remove query params
  ext=$(echo "$ext" | tr '[:upper:]' '[:lower:]')  # Lowercase

  # Default to jpg if extension is weird
  if [[ "$ext" != "jpg" && "$ext" != "jpeg" && "$ext" != "png" ]]; then
    ext="jpg"
  fi

  outfile="$TEMP_DIR/$slug.$ext"

  echo "Downloading $slug..."
  curl -s -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
       -H "Accept: image/webp,image/apng,image/*,*/*;q=0.8" \
       -o "$outfile" \
       "$url"

  if [ -f "$outfile" ] && [ -s "$outfile" ]; then
    size=$(ls -lh "$outfile" | awk '{print $5}')
    echo "  Downloaded: $size"
  else
    echo "  FAILED"
    rm -f "$outfile"
  fi
done

echo ""
echo "Done! Files in $TEMP_DIR:"
ls -la "$TEMP_DIR"
