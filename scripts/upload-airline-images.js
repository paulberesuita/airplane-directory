#!/usr/bin/env node
/**
 * Upload airline-specific aircraft images to R2
 *
 * Usage:
 *   node scripts/upload-airline-images.js [--dry-run]
 *
 * Expected folder structure:
 *   images/airlines/
 *     american-airlines/
 *       boeing-737-800.jpg
 *       airbus-a321.jpg
 *     delta-air-lines/
 *       boeing-737-900er.jpg
 *       ...
 *
 * Images will be uploaded to R2 at:
 *   airlines/[airline-slug]/[aircraft-slug].jpg
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images', 'airlines');
const DRY_RUN = process.argv.includes('--dry-run');

// Expected airline-aircraft combinations from database
const EXPECTED_IMAGES = {
  'alaska-airlines': [
    'boeing-737-max-9', 'boeing-737-900er', 'boeing-737-800', 'embraer-e175',
    'airbus-a330-200', 'boeing-717', 'airbus-a321neo', 'boeing-737-700', 'boeing-787-9'
  ],
  'american-airlines': [
    'boeing-737-800', 'airbus-a321', 'embraer-e175', 'boeing-737-max-8',
    'airbus-a321neo', 'airbus-a319', 'airbus-a320', 'boeing-777-200er',
    'boeing-787-8', 'boeing-757-200', 'boeing-787-9', 'boeing-777-300er', 'boeing-767-300er'
  ],
  'delta-air-lines': [
    'boeing-737-900er', 'airbus-a321', 'boeing-757-200', 'boeing-717',
    'boeing-737-800', 'airbus-a320', 'boeing-767-300er', 'airbus-a319',
    'airbus-a220-300', 'airbus-a220-100', 'airbus-a330-900neo', 'airbus-a321neo',
    'airbus-a350-900', 'airbus-a330-300', 'boeing-767-400er', 'boeing-757-300', 'airbus-a330-200'
  ],
  'frontier-airlines': [
    'airbus-a320neo', 'airbus-a321neo', 'airbus-a320', 'airbus-a321'
  ],
  'jetblue-airways': [
    'airbus-a320', 'airbus-a321neo', 'airbus-a321', 'airbus-a220-300', 'embraer-e190'
  ],
  'southwest-airlines': [
    'boeing-737-700', 'boeing-737-max-8', 'boeing-737-800'
  ],
  'spirit-airlines': [
    'airbus-a320', 'airbus-a320neo', 'airbus-a321', 'airbus-a319'
  ],
  'united-airlines': [
    'boeing-737-900er', 'boeing-737-800', 'boeing-737-max-8', 'boeing-737-max-9',
    'airbus-a319', 'airbus-a320', 'boeing-777-200er', 'boeing-787-9',
    'boeing-737-700', 'boeing-757-200', 'boeing-767-300er', 'boeing-787-8',
    'airbus-a321neo', 'boeing-787-10', 'boeing-777-300er', 'boeing-757-300', 'boeing-767-400er'
  ]
};

function getAirlineName(slug) {
  const names = {
    'alaska-airlines': 'Alaska Airlines',
    'american-airlines': 'American Airlines',
    'delta-air-lines': 'Delta Air Lines',
    'frontier-airlines': 'Frontier Airlines',
    'jetblue-airways': 'JetBlue Airways',
    'southwest-airlines': 'Southwest Airlines',
    'spirit-airlines': 'Spirit Airlines',
    'united-airlines': 'United Airlines'
  };
  return names[slug] || slug;
}

function uploadToR2(localPath, r2Key) {
  const cmd = `wrangler r2 object put airplane-directory-assets/${r2Key} --file="${localPath}" --remote`;

  if (DRY_RUN) {
    console.log(`  [DRY RUN] Would upload: ${r2Key}`);
    return true;
  }

  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`  ✓ Uploaded: ${r2Key}`);
    return true;
  } catch (error) {
    console.error(`  ✗ Failed: ${r2Key} - ${error.message}`);
    return false;
  }
}

function checkStatus() {
  console.log('\n📊 Image Status Report\n');
  console.log('='.repeat(60));

  let totalExpected = 0;
  let totalFound = 0;
  let totalMissing = 0;

  const missingByAirline = {};

  for (const [airlineSlug, aircraftList] of Object.entries(EXPECTED_IMAGES)) {
    const airlineDir = path.join(IMAGES_DIR, airlineSlug);
    const airlineName = getAirlineName(airlineSlug);

    let found = 0;
    let missing = [];

    for (const aircraftSlug of aircraftList) {
      totalExpected++;
      const imagePath = path.join(airlineDir, `${aircraftSlug}.jpg`);

      if (fs.existsSync(imagePath)) {
        found++;
        totalFound++;
      } else {
        missing.push(aircraftSlug);
        totalMissing++;
      }
    }

    const status = missing.length === 0 ? '✓' : missing.length === aircraftList.length ? '✗' : '◐';
    console.log(`\n${status} ${airlineName}: ${found}/${aircraftList.length} images`);

    if (missing.length > 0 && missing.length < aircraftList.length) {
      console.log(`  Missing: ${missing.join(', ')}`);
    }

    if (missing.length > 0) {
      missingByAirline[airlineSlug] = missing;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n📈 Summary: ${totalFound}/${totalExpected} images (${totalMissing} missing)\n`);

  return { totalExpected, totalFound, totalMissing, missingByAirline };
}

function uploadAll() {
  console.log('\n🚀 Uploading images to R2\n');
  if (DRY_RUN) console.log('(DRY RUN - no actual uploads)\n');

  let uploaded = 0;
  let failed = 0;
  let skipped = 0;

  for (const [airlineSlug, aircraftList] of Object.entries(EXPECTED_IMAGES)) {
    const airlineDir = path.join(IMAGES_DIR, airlineSlug);
    const airlineName = getAirlineName(airlineSlug);

    console.log(`\n${airlineName}:`);

    for (const aircraftSlug of aircraftList) {
      const localPath = path.join(airlineDir, `${aircraftSlug}.jpg`);
      const r2Key = `airlines/${airlineSlug}/${aircraftSlug}.jpg`;

      if (!fs.existsSync(localPath)) {
        console.log(`  - Skipped (not found): ${aircraftSlug}.jpg`);
        skipped++;
        continue;
      }

      if (uploadToR2(localPath, r2Key)) {
        uploaded++;
      } else {
        failed++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Complete: ${uploaded} uploaded, ${failed} failed, ${skipped} skipped\n`);
}

function generateMissingList() {
  const { missingByAirline } = checkStatus();

  console.log('\n📋 Missing Images (copy-paste for research):\n');

  for (const [airlineSlug, missing] of Object.entries(missingByAirline)) {
    const airlineName = getAirlineName(airlineSlug);
    console.log(`\n### ${airlineName}`);
    for (const aircraft of missing) {
      console.log(`- [ ] ${aircraft}.jpg`);
    }
  }
}

// Main
const command = process.argv[2];

if (!fs.existsSync(IMAGES_DIR)) {
  console.log(`\n📁 Creating images directory: ${IMAGES_DIR}\n`);
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  // Create airline subdirectories
  for (const airlineSlug of Object.keys(EXPECTED_IMAGES)) {
    fs.mkdirSync(path.join(IMAGES_DIR, airlineSlug), { recursive: true });
  }
  console.log('Created airline subdirectories. Add images and run again.\n');
  process.exit(0);
}

switch (command) {
  case 'status':
    checkStatus();
    break;
  case 'missing':
    generateMissingList();
    break;
  case 'upload':
    uploadAll();
    break;
  default:
    console.log(`
Airline Image Upload Tool

Usage:
  node scripts/upload-airline-images.js <command> [options]

Commands:
  status    Check which images are present/missing
  missing   Generate a checklist of missing images
  upload    Upload all found images to R2

Options:
  --dry-run   Show what would be uploaded without uploading

Image Directory:
  ${IMAGES_DIR}

Expected structure:
  images/airlines/
    american-airlines/
      boeing-737-800.jpg
      airbus-a321.jpg
    delta-air-lines/
      ...
`);
}
