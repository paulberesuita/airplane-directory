#!/usr/bin/env node
/**
 * Download airline logos from Wikimedia Commons
 * Usage: node scripts/download-airline-logos.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Airlines that need logos
const AIRLINES = [
  { slug: 'aer-lingus', name: 'Aer Lingus', search: 'Aer Lingus logo' },
  { slug: 'aeromexico', name: 'Aeromexico', search: 'Aeromexico logo' },
  { slug: 'air-canada', name: 'Air Canada', search: 'Air Canada logo' },
  { slug: 'air-france', name: 'Air France', search: 'Air France logo' },
  { slug: 'air-new-zealand', name: 'Air New Zealand', search: 'Air New Zealand logo' },
  { slug: 'alaska-airlines', name: 'Alaska Airlines', search: 'Alaska Airlines logo' },
  { slug: 'ana', name: 'All Nippon Airways', search: 'All Nippon Airways logo' },
  { slug: 'american-airlines', name: 'American Airlines', search: 'American Airlines logo' },
  { slug: 'avianca', name: 'Avianca', search: 'Avianca logo' },
  { slug: 'british-airways', name: 'British Airways', search: 'British Airways logo' },
  { slug: 'cathay-pacific', name: 'Cathay Pacific', search: 'Cathay Pacific logo' },
  { slug: 'china-airlines', name: 'China Airlines', search: 'China Airlines logo' },
  { slug: 'copa-airlines', name: 'Copa Airlines', search: 'Copa Airlines logo' },
  { slug: 'delta-air-lines', name: 'Delta Air Lines', search: 'Delta Air Lines logo' },
  { slug: 'eva-air', name: 'EVA Air', search: 'EVA Air logo' },
  { slug: 'el-al', name: 'El Al', search: 'El Al logo' },
  { slug: 'emirates', name: 'Emirates', search: 'Emirates airline logo' },
  { slug: 'etihad-airways', name: 'Etihad Airways', search: 'Etihad Airways logo' },
  { slug: 'finnair', name: 'Finnair', search: 'Finnair logo' },
  { slug: 'frontier-airlines', name: 'Frontier Airlines', search: 'Frontier Airlines logo' },
  { slug: 'iberia', name: 'Iberia', search: 'Iberia airline logo' },
  { slug: 'icelandair', name: 'Icelandair', search: 'Icelandair logo' },
  { slug: 'japan-airlines', name: 'Japan Airlines', search: 'Japan Airlines logo' },
  { slug: 'jetblue-airways', name: 'JetBlue', search: 'JetBlue logo' },
  { slug: 'klm', name: 'KLM', search: 'KLM logo' },
  { slug: 'korean-air', name: 'Korean Air', search: 'Korean Air logo' },
  { slug: 'latam', name: 'LATAM Airlines', search: 'LATAM Airlines logo' },
  { slug: 'lufthansa', name: 'Lufthansa', search: 'Lufthansa logo' },
  { slug: 'norwegian', name: 'Norwegian Air', search: 'Norwegian Air Shuttle logo' },
  { slug: 'qantas', name: 'Qantas', search: 'Qantas logo' },
  { slug: 'qatar-airways', name: 'Qatar Airways', search: 'Qatar Airways logo' },
  { slug: 'sas', name: 'SAS', search: 'SAS Scandinavian Airlines logo' },
  { slug: 'singapore-airlines', name: 'Singapore Airlines', search: 'Singapore Airlines logo' },
  { slug: 'southwest-airlines', name: 'Southwest Airlines', search: 'Southwest Airlines logo' },
  { slug: 'spirit-airlines', name: 'Spirit Airlines', search: 'Spirit Airlines logo' },
  { slug: 'swiss', name: 'Swiss', search: 'Swiss International Air Lines logo' },
  { slug: 'tap-portugal', name: 'TAP Portugal', search: 'TAP Air Portugal logo' },
  { slug: 'turkish-airlines', name: 'Turkish Airlines', search: 'Turkish Airlines logo' },
  { slug: 'united-airlines', name: 'United Airlines', search: 'United Airlines logo' },
  { slug: 'virgin-atlantic', name: 'Virgin Atlantic', search: 'Virgin Atlantic logo' },
  { slug: 'westjet', name: 'WestJet', search: 'WestJet logo' },
];

const OUTPUT_DIR = path.join(__dirname, '../images/logos');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'AirplaneDirectory/1.0 (https://airplane-directory.pages.dev; contact@example.com)'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }

      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ data: Buffer.concat(data), contentType: res.headers['content-type'] });
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function searchWikimedia(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json`;

  try {
    const { data } = await httpsGet(url);
    const json = JSON.parse(data.toString());
    return json.query?.search || [];
  } catch (error) {
    console.error(`Search error for "${query}":`, error.message);
    return [];
  }
}

async function getImageUrl(title) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url|mime&iiurlwidth=200&format=json`;

  try {
    const { data } = await httpsGet(url);
    const json = JSON.parse(data.toString());
    const pages = json.query?.pages || {};
    const page = Object.values(pages)[0];
    const imageinfo = page?.imageinfo?.[0];

    if (imageinfo) {
      // Prefer thumburl for PNGs at reasonable size
      return {
        url: imageinfo.thumburl || imageinfo.url,
        mime: imageinfo.mime
      };
    }
    return null;
  } catch (error) {
    console.error(`Image info error for "${title}":`, error.message);
    return null;
  }
}

async function downloadImage(url, outputPath) {
  try {
    const { data, contentType } = await httpsGet(url);

    // Check if it's actually an image
    if (!contentType?.startsWith('image/')) {
      throw new Error(`Not an image: ${contentType}`);
    }

    // Check minimum file size (skip tiny error pages)
    if (data.length < 1000) {
      throw new Error(`File too small: ${data.length} bytes`);
    }

    fs.writeFileSync(outputPath, data);
    return true;
  } catch (error) {
    console.error(`Download error:`, error.message);
    return false;
  }
}

async function processAirline(airline) {
  console.log(`\nProcessing: ${airline.name}`);

  const outputPath = path.join(OUTPUT_DIR, `${airline.slug}.png`);

  // Skip if already exists
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    if (stats.size > 1000) {
      console.log(`  Already exists (${Math.round(stats.size/1024)}KB)`);
      return { slug: airline.slug, status: 'exists' };
    }
  }

  // Search Wikimedia
  const results = await searchWikimedia(airline.search);

  if (results.length === 0) {
    console.log(`  No results found`);
    return { slug: airline.slug, status: 'not_found' };
  }

  // Try each result
  for (const result of results) {
    console.log(`  Trying: ${result.title}`);

    const imageInfo = await getImageUrl(result.title);
    if (!imageInfo) continue;

    // Skip SVG files (need conversion)
    if (imageInfo.mime === 'image/svg+xml') {
      console.log(`    Skipping SVG`);
      continue;
    }

    // Download
    const success = await downloadImage(imageInfo.url, outputPath);
    if (success) {
      const stats = fs.statSync(outputPath);
      console.log(`  Downloaded: ${Math.round(stats.size/1024)}KB`);
      return { slug: airline.slug, status: 'downloaded' };
    }

    await sleep(1000); // Rate limit
  }

  console.log(`  Failed to download`);
  return { slug: airline.slug, status: 'failed' };
}

async function main() {
  console.log('=== Airline Logo Downloader ===');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Airlines to process: ${AIRLINES.length}\n`);

  const results = { exists: [], downloaded: [], not_found: [], failed: [] };

  for (const airline of AIRLINES) {
    const result = await processAirline(airline);
    results[result.status].push(result.slug);
    await sleep(2000); // Rate limit between airlines
  }

  console.log('\n=== Summary ===');
  console.log(`Already existed: ${results.exists.length}`);
  console.log(`Downloaded: ${results.downloaded.length}`);
  console.log(`Not found: ${results.not_found.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.not_found.length > 0) {
    console.log('\nNot found:', results.not_found.join(', '));
  }
  if (results.failed.length > 0) {
    console.log('\nFailed:', results.failed.join(', '));
  }
}

main().catch(console.error);
