#!/usr/bin/env node

/**
 * Fetch aircraft images from Wikimedia Commons using proper API
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, '..', 'temp');

// Specific known-good filenames from Wikimedia Commons
const AIRCRAFT_IMAGES = {
  'boeing-737-800': 'Boeing_737_800_plane.jpg',
  'boeing-737-max-8': 'Icelandair_Boeing_737_MAX_8_TF-ICE_approaching_EWR_Airport.jpg',
  'airbus-a320neo': 'Vueling_EC-NFJ_A320neo.jpg',
  'airbus-a321neo': 'JetBlue_Airways_Airbus_A321-271NX_N2002J.jpg',
  'boeing-787-9': 'All_Nippon_Airways_Boeing_787-9_JA893A.jpg',
  'boeing-777-300er': 'Boeing_777-300ER_Singapore_Airlines.JPG',
  'boeing-747-400': 'British_Airways_Boeing_747-400_G-CIVL.jpg',
  'boeing-767-300er': 'Delta_Air_Lines_Boeing_767-300ER_N1608.jpg',
  'boeing-757-200': 'Delta_N670DN_Boeing_757-232_-_049.jpg',
  'airbus-a350-900': 'Singapore_Airlines_Airbus_A350-941_9V-SMQ.jpg',
  'airbus-a380': 'Singapore_Airlines_Airbus_A380_woah!.jpg',
  'airbus-a330-300': 'Cathay_Pacific_Airbus_A330-343_B-LAD.jpg',
  'embraer-e190-e2': 'KLM_Cityhopper_Embraer_E190-E2_PH-NXA.jpg',
  'bombardier-crj-900': 'Delta_Connection_Endeavor_Air_N935XJ_CRJ-900LR.jpg',
  'boeing-737-900er': 'Alaska_Airlines_Boeing_737-990ER_N428AS.jpg',
  'airbus-a319neo': 'Spirit_Airlines_Airbus_A319-132_N530NK.jpg', // A319 (neo very rare)
  'boeing-787-8': 'United_Airlines_Boeing_787-8_Dreamliner_N26910.jpg',
  'airbus-a220-300': 'Air_France_Airbus_A220-300_F-HZUC.jpg',
  'embraer-e175': 'United_Express_Embraer_175_N88327.jpg',
};

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

function httpsGet(url, isBinary = false) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'AircraftDirectory/1.0 (educational project; paul@example.com) node-https',
      }
    };

    const request = https.get(url, options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location, isBinary).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(isBinary ? buffer : buffer.toString());
      });
      res.on('error', reject);
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function getImageInfo(filename) {
  // Use Wikimedia API to get image info including URL
  const encodedFilename = encodeURIComponent(filename);
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodedFilename}&prop=imageinfo&iiprop=url|size&iiurlwidth=1200&format=json`;

  try {
    const response = await httpsGet(apiUrl);
    const data = JSON.parse(response);

    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pageId === '-1') {
      return null; // File not found
    }

    if (pages[pageId].imageinfo && pages[pageId].imageinfo[0]) {
      const info = pages[pageId].imageinfo[0];
      return {
        url: info.thumburl || info.url, // Use thumbnail if available, otherwise original
        width: info.thumbwidth || info.width,
        height: info.thumbheight || info.height,
        originalUrl: info.url
      };
    }
  } catch (e) {
    console.error(`  API error for ${filename}:`, e.message);
  }
  return null;
}

async function downloadImage(url, outputPath) {
  try {
    const data = await httpsGet(url, true);

    // Check if it's actually an image (starts with JPEG/PNG magic bytes)
    if (data.length < 100) {
      console.error(`  File too small (${data.length} bytes)`);
      return false;
    }

    fs.writeFileSync(outputPath, data);
    return true;
  } catch (e) {
    console.error(`  Download error:`, e.message);
    return false;
  }
}

async function processAircraft(slug, filename) {
  console.log(`\n${slug}:`);
  console.log(`  Looking up: ${filename}`);

  const info = await getImageInfo(filename);
  if (!info) {
    console.log(`  NOT FOUND on Wikimedia`);
    return null;
  }

  console.log(`  Size: ${info.width}x${info.height}`);
  console.log(`  URL: ${info.url.substring(0, 80)}...`);

  // Determine output extension
  const ext = path.extname(filename).toLowerCase() || '.jpg';
  const outputPath = path.join(TEMP_DIR, `${slug}${ext}`);

  // Download
  const success = await downloadImage(info.url, outputPath);

  if (success) {
    const stats = fs.statSync(outputPath);
    console.log(`  Downloaded: ${(stats.size / 1024).toFixed(1)} KB -> ${outputPath}`);
    return outputPath;
  }

  return null;
}

async function main() {
  console.log('Aircraft Image Fetcher');
  console.log('======================');
  console.log(`Output: ${TEMP_DIR}`);

  const results = [];

  for (const [slug, filename] of Object.entries(AIRCRAFT_IMAGES)) {
    const result = await processAircraft(slug, filename);
    results.push({ slug, path: result });

    // Be nice to the API
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n\n=== Summary ===');
  const downloaded = results.filter(r => r.path);
  const failed = results.filter(r => !r.path);

  console.log(`Downloaded: ${downloaded.length}/${results.length}`);

  if (failed.length > 0) {
    console.log(`\nFailed:`);
    failed.forEach(f => console.log(`  - ${f.slug}`));
  }

  // Generate upload commands
  console.log('\n\n=== Upload Commands ===');
  downloaded.forEach(d => {
    const ext = path.extname(d.path);
    console.log(`npx wrangler r2 object put airplane-directory-assets/aircraft/${d.slug}${ext} --file=${d.path}`);
  });
}

main().catch(console.error);
