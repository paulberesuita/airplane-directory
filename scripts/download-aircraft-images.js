#!/usr/bin/env node

/**
 * Download aircraft images from Wikimedia Commons
 * Uses the Wikimedia API to find and download images
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '..', 'temp');

// Aircraft with their Wikimedia Commons search terms
const AIRCRAFT = [
  { slug: 'boeing-737-800', search: 'Boeing 737-800', filename: 'Boeing_737_800_plane.jpg' },
  { slug: 'boeing-737-max-8', search: 'Boeing 737 MAX 8', category: 'Boeing_737_MAX' },
  { slug: 'airbus-a320neo', search: 'Airbus A320neo', category: 'Airbus_A320neo' },
  { slug: 'airbus-a321neo', search: 'Airbus A321neo', category: 'Airbus_A321neo' },
  { slug: 'boeing-787-9', search: 'Boeing 787-9 Dreamliner', category: 'Boeing_787-9' },
  { slug: 'boeing-777-300er', search: 'Boeing 777-300ER', filename: 'Boeing_777-300ER_Singapore_Airlines.JPG' },
  { slug: 'boeing-747-400', search: 'Boeing 747-400', category: 'Boeing_747-400' },
  { slug: 'boeing-767-300er', search: 'Boeing 767-300ER', category: 'Boeing_767-300ER' },
  { slug: 'boeing-757-200', search: 'Boeing 757-200', category: 'Boeing_757-200' },
  { slug: 'airbus-a350-900', search: 'Airbus A350-900', category: 'Airbus_A350-900' },
  { slug: 'airbus-a380', search: 'Airbus A380', filename: 'Singapore_Airlines_Airbus_A380_woah!.jpg' },
  { slug: 'airbus-a330-300', search: 'Airbus A330-300', category: 'Airbus_A330-300' },
  { slug: 'embraer-e190-e2', search: 'Embraer E190-E2', category: 'Embraer_E-Jets_E2' },
  { slug: 'bombardier-crj-900', search: 'Bombardier CRJ-900', category: 'CRJ900' },
  { slug: 'boeing-737-900er', search: 'Boeing 737-900ER', category: 'Boeing_737-900ER' },
  { slug: 'airbus-a319neo', search: 'Airbus A319neo', category: 'Airbus_A319neo' },
  { slug: 'boeing-787-8', search: 'Boeing 787-8 Dreamliner', category: 'Boeing_787-8' },
  { slug: 'airbus-a220-300', search: 'Airbus A220-300', category: 'Airbus_A220' },
  { slug: 'embraer-e175', search: 'Embraer E175', category: 'Embraer_175' },
];

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'AirplaneDirectory/1.0 (https://example.com; contact@example.com)'
      }
    };

    https.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function getImageFromCategory(category) {
  // Use Wikimedia API to get images from a category
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtype=file&cmtitle=Category:${encodeURIComponent(category)}&cmlimit=10&format=json`;

  try {
    const response = await httpsGet(apiUrl);
    const data = JSON.parse(response.toString());

    if (data.query && data.query.categorymembers) {
      // Filter for jpg/png files, prefer files without airline-specific names
      const files = data.query.categorymembers.filter(f =>
        f.title.match(/\.(jpg|jpeg|png)$/i)
      );

      if (files.length > 0) {
        return files[0].title.replace('File:', '');
      }
    }
  } catch (e) {
    console.error(`  Error fetching category ${category}:`, e.message);
  }
  return null;
}

async function getImageUrl(filename) {
  // Get the actual file URL from Wikimedia
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`;

  try {
    const response = await httpsGet(apiUrl);
    const data = JSON.parse(response.toString());

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pages[pageId].imageinfo && pages[pageId].imageinfo[0]) {
      return pages[pageId].imageinfo[0].url;
    }
  } catch (e) {
    console.error(`  Error getting URL for ${filename}:`, e.message);
  }
  return null;
}

async function downloadImage(url, outputPath) {
  try {
    const data = await httpsGet(url);
    fs.writeFileSync(outputPath, data);
    return true;
  } catch (e) {
    console.error(`  Error downloading:`, e.message);
    return false;
  }
}

async function processAircraft(aircraft) {
  console.log(`\nProcessing: ${aircraft.slug}`);

  let filename = aircraft.filename;

  // If no specific filename, try to get one from the category
  if (!filename && aircraft.category) {
    console.log(`  Searching category: ${aircraft.category}`);
    filename = await getImageFromCategory(aircraft.category);
  }

  if (!filename) {
    console.log(`  No image found for ${aircraft.slug}`);
    return null;
  }

  console.log(`  Found: ${filename}`);

  // Get the actual URL
  const imageUrl = await getImageUrl(filename);
  if (!imageUrl) {
    console.log(`  Could not get URL for ${filename}`);
    return null;
  }

  console.log(`  URL: ${imageUrl}`);

  // Determine output extension
  const ext = path.extname(filename).toLowerCase() || '.jpg';
  const outputPath = path.join(TEMP_DIR, `${aircraft.slug}${ext}`);

  // Download
  console.log(`  Downloading to: ${outputPath}`);
  const success = await downloadImage(imageUrl, outputPath);

  if (success) {
    const stats = fs.statSync(outputPath);
    console.log(`  Downloaded: ${(stats.size / 1024).toFixed(1)} KB`);
    return outputPath;
  }

  return null;
}

async function main() {
  console.log('Aircraft Image Downloader');
  console.log('=========================');
  console.log(`Output directory: ${TEMP_DIR}\n`);

  const results = [];

  for (const aircraft of AIRCRAFT) {
    const result = await processAircraft(aircraft);
    results.push({ slug: aircraft.slug, path: result });

    // Small delay to be nice to the API
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n\nSummary:');
  console.log('========');
  const downloaded = results.filter(r => r.path);
  const failed = results.filter(r => !r.path);

  console.log(`Downloaded: ${downloaded.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed aircraft:');
    failed.forEach(f => console.log(`  - ${f.slug}`));
  }

  // Output the list for uploading
  console.log('\n\nFiles to upload:');
  downloaded.forEach(d => console.log(d.path));
}

main().catch(console.error);
