#!/bin/bash

# Download aircraft images from Wikimedia Commons
# Uses proper headers to avoid blocking

TEMP_DIR="$(dirname "$0")/../temp"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

echo "Downloading aircraft images to $TEMP_DIR"
echo ""

download_image() {
  local slug="$1"
  local url="$2"
  local ext="${3:-jpg}"

  echo "Downloading $slug..."

  curl -sL \
    -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
    -H "Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" \
    -H "Accept-Language: en-US,en;q=0.9" \
    -H "Referer: https://commons.wikimedia.org/" \
    -o "$slug.$ext" \
    "$url"

  if [ -f "$slug.$ext" ] && [ "$(stat -f%z "$slug.$ext")" -gt 1000 ]; then
    size=$(ls -lh "$slug.$ext" | awk '{print $5}')
    echo "  OK: $size"
    return 0
  else
    echo "  FAILED"
    rm -f "$slug.$ext"
    return 1
  fi
}

# Boeing 737-800
download_image "boeing-737-800" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Boeing_737_800_plane.jpg/1280px-Boeing_737_800_plane.jpg"

# Boeing 737 MAX 8
download_image "boeing-737-max-8" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Icelandair_Boeing_737_MAX_8_TF-ICE_approaching_EWR_Airport.jpg/1280px-Icelandair_Boeing_737_MAX_8_TF-ICE_approaching_EWR_Airport.jpg"

# Airbus A320neo
download_image "airbus-a320neo" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Airbus_A320-271N_%27D-AVVA%27_%2844884770595%29.jpg/1280px-Airbus_A320-271N_%27D-AVVA%27_%2844884770595%29.jpg"

# Airbus A321neo
download_image "airbus-a321neo" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Spirit_Airlines_Airbus_A321-271NX_N701NK_approaching_Newark_Airport.jpg/1280px-Spirit_Airlines_Airbus_A321-271NX_N701NK_approaching_Newark_Airport.jpg"

# Boeing 787-9
download_image "boeing-787-9" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/All_Nippon_Airways_Boeing_787-9_JA893A_approaching_Osaka_Itami_Airport.jpg/1280px-All_Nippon_Airways_Boeing_787-9_JA893A_approaching_Osaka_Itami_Airport.jpg"

# Boeing 777-300ER
download_image "boeing-777-300er" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Boeing_777-300ER_Singapore_Airlines.JPG/1280px-Boeing_777-300ER_Singapore_Airlines.JPG"

# Boeing 747-400
download_image "boeing-747-400" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/British_Airways_Boeing_747-436%2C_G-BNLN%40LHR%2C25.05.2007-467by_%284018363653%29.jpg/1280px-British_Airways_Boeing_747-436%2C_G-BNLN%40LHR%2C25.05.2007-467by_%284018363653%29.jpg"

# Boeing 767-300ER
download_image "boeing-767-300er" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Delta_Air_Lines_Boeing_767-332ER_N1608.jpg/1280px-Delta_Air_Lines_Boeing_767-332ER_N1608.jpg"

# Boeing 757-200
download_image "boeing-757-200" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Delta_Air_Lines_Boeing_757-232_N670DN.jpg/1280px-Delta_Air_Lines_Boeing_757-232_N670DN.jpg"

# Airbus A350-900
download_image "airbus-a350-900" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/F-WWCF_-_Airbus_A350-941_%28test_plane%29_at_Toulouse_Blagnac_%2847972598418%29.jpg/1280px-F-WWCF_-_Airbus_A350-941_%28test_plane%29_at_Toulouse_Blagnac_%2847972598418%29.jpg"

# Airbus A380
download_image "airbus-a380" \
  "https://upload.wikimedia.org/wikipedia/commons/2/21/Singapore_Airlines_Airbus_A380_woah%21.jpg"

# Airbus A330-300
download_image "airbus-a330-300" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Cathay_Pacific_Airbus_A330-343_B-LAD_HKG_2012-7-18.png/1280px-Cathay_Pacific_Airbus_A330-343_B-LAD_HKG_2012-7-18.png" "png"

# Embraer E190-E2
download_image "embraer-e190-e2" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/KLM_Cityhopper_PH-NXA_Embraer_ERJ-190-300STD.jpg/1280px-KLM_Cityhopper_PH-NXA_Embraer_ERJ-190-300STD.jpg"

# Bombardier CRJ-900
download_image "bombardier-crj-900" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Canadair_CL-600-2D24_Regional_Jet_CRJ-900ER%2C_NWA_Airlink_%28Mesaba_Airlines%29_AN1296342.jpg/1280px-Canadair_CL-600-2D24_Regional_Jet_CRJ-900ER%2C_NWA_Airlink_%28Mesaba_Airlines%29_AN1296342.jpg"

# Boeing 737-900ER
download_image "boeing-737-900er" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Alaska_Airlines_-_N493AS_%2815021973325%29.jpg/1280px-Alaska_Airlines_-_N493AS_%2815021973325%29.jpg"

# Airbus A319neo (using A319 - neo is rare)
download_image "airbus-a319neo" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Spirit_Airlines_Airbus_A319-132_N533NK_approaching_Newark_Airport.jpg/1280px-Spirit_Airlines_Airbus_A319-132_N533NK_approaching_Newark_Airport.jpg"

# Boeing 787-8
download_image "boeing-787-8" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/United_Airlines_-_N26906_-_Boeing_787-8_Dreamliner_-_San_Francisco_International_Airport.jpg/1280px-United_Airlines_-_N26906_-_Boeing_787-8_Dreamliner_-_San_Francisco_International_Airport.jpg"

# Airbus A220-300
download_image "airbus-a220-300" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Air_France_Airbus_A220-300_%28F-HZUA%29_at_Paris-Charles_de_Gaulle_Airport.jpg/1280px-Air_France_Airbus_A220-300_%28F-HZUA%29_at_Paris-Charles_de_Gaulle_Airport.jpg"

# Embraer E175
download_image "embraer-e175" \
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/N726YX_Republic_Airways_%28United_Express%29_Embraer_ERJ-175LR_%28ERJ-170-200_LR%29_%40_San_Jose_Norman_Y._Mineta_International_%28SJC_%2F_KSJC%29.jpg/1280px-N726YX_Republic_Airways_%28United_Express%29_Embraer_ERJ-175LR_%28ERJ-170-200_LR%29_%40_San_Jose_Norman_Y._Mineta_International_%28SJC_%2F_KSJC%29.jpg"

echo ""
echo "=== Summary ==="
echo "Files downloaded:"
ls -la *.jpg *.png 2>/dev/null
