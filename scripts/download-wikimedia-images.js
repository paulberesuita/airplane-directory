#!/usr/bin/env node
/**
 * Download aircraft images from Wikimedia Commons
 *
 * Usage:
 *   node scripts/download-wikimedia-images.js
 *
 * This script searches Wikimedia Commons for airline-specific aircraft images
 * and downloads the best match for each airline-aircraft combination.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES_DIR = path.join(__dirname, '..', 'images', 'airlines');

// Airline-aircraft combinations with search terms
const SEARCH_CONFIG = {
  'american-airlines': {
    name: 'American Airlines',
    aircraft: {
      'boeing-737-800': 'Boeing 737-800 American Airlines',
      'airbus-a321': 'Airbus A321 American Airlines',
      'embraer-e175': 'Embraer 175 American Eagle',
      'boeing-737-max-8': 'Boeing 737 MAX 8 American Airlines',
      'airbus-a321neo': 'Airbus A321neo American Airlines',
      'airbus-a319': 'Airbus A319 American Airlines',
      'airbus-a320': 'Airbus A320 American Airlines',
      'boeing-777-200er': 'Boeing 777-200 American Airlines',
      'boeing-787-8': 'Boeing 787-8 American Airlines',
      'boeing-757-200': 'Boeing 757-200 American Airlines',
      'boeing-787-9': 'Boeing 787-9 American Airlines',
      'boeing-777-300er': 'Boeing 777-300ER American Airlines',
      'boeing-767-300er': 'Boeing 767-300 American Airlines'
    }
  },
  'delta-air-lines': {
    name: 'Delta Air Lines',
    aircraft: {
      'boeing-737-900er': 'Boeing 737-900ER Delta Air Lines',
      'airbus-a321': 'Airbus A321 Delta Air Lines',
      'boeing-757-200': 'Boeing 757-200 Delta Air Lines',
      'boeing-717': 'Boeing 717 Delta Air Lines',
      'boeing-737-800': 'Boeing 737-800 Delta Air Lines',
      'airbus-a320': 'Airbus A320 Delta Air Lines',
      'boeing-767-300er': 'Boeing 767-300 Delta Air Lines',
      'airbus-a319': 'Airbus A319 Delta Air Lines',
      'airbus-a220-300': 'Airbus A220-300 Delta Air Lines',
      'airbus-a220-100': 'Airbus A220-100 Delta Air Lines',
      'airbus-a330-900neo': 'Airbus A330-900neo Delta Air Lines',
      'airbus-a321neo': 'Airbus A321neo Delta Air Lines',
      'airbus-a350-900': 'Airbus A350-900 Delta Air Lines',
      'airbus-a330-300': 'Airbus A330-300 Delta Air Lines',
      'boeing-767-400er': 'Boeing 767-400ER Delta Air Lines',
      'boeing-757-300': 'Boeing 757-300 Delta Air Lines',
      'airbus-a330-200': 'Airbus A330-200 Delta Air Lines'
    }
  },
  'united-airlines': {
    name: 'United Airlines',
    aircraft: {
      'boeing-737-900er': 'Boeing 737-900ER United Airlines',
      'boeing-737-800': 'Boeing 737-800 United Airlines',
      'boeing-737-max-8': 'Boeing 737 MAX 8 United Airlines',
      'boeing-737-max-9': 'Boeing 737 MAX 9 United Airlines',
      'airbus-a319': 'Airbus A319 United Airlines',
      'airbus-a320': 'Airbus A320 United Airlines',
      'boeing-777-200er': 'Boeing 777-200 United Airlines',
      'boeing-787-9': 'Boeing 787-9 United Airlines',
      'boeing-737-700': 'Boeing 737-700 United Airlines',
      'boeing-757-200': 'Boeing 757-200 United Airlines',
      'boeing-767-300er': 'Boeing 767-300 United Airlines',
      'boeing-787-8': 'Boeing 787-8 United Airlines',
      'airbus-a321neo': 'Airbus A321neo United Airlines',
      'boeing-787-10': 'Boeing 787-10 United Airlines',
      'boeing-777-300er': 'Boeing 777-300ER United Airlines',
      'boeing-757-300': 'Boeing 757-300 United Airlines',
      'boeing-767-400er': 'Boeing 767-400ER United Airlines'
    }
  },
  'southwest-airlines': {
    name: 'Southwest Airlines',
    aircraft: {
      'boeing-737-700': 'Boeing 737-700 Southwest Airlines',
      'boeing-737-max-8': 'Boeing 737 MAX 8 Southwest Airlines',
      'boeing-737-800': 'Boeing 737-800 Southwest Airlines'
    }
  },
  'jetblue-airways': {
    name: 'JetBlue Airways',
    aircraft: {
      'airbus-a320': 'Airbus A320 JetBlue Airways',
      'airbus-a321neo': 'Airbus A321neo JetBlue Airways',
      'airbus-a321': 'Airbus A321 JetBlue Airways',
      'airbus-a220-300': 'Airbus A220-300 JetBlue Airways',
      'embraer-e190': 'Embraer 190 JetBlue Airways'
    }
  },
  'alaska-airlines': {
    name: 'Alaska Airlines',
    aircraft: {
      'boeing-737-max-9': 'Boeing 737 MAX 9 Alaska Airlines',
      'boeing-737-900er': 'Boeing 737-900ER Alaska Airlines',
      'boeing-737-800': 'Boeing 737-800 Alaska Airlines',
      'embraer-e175': 'Embraer 175 Horizon Air',
      'airbus-a330-200': 'Airbus A330-200 Hawaiian Airlines',
      'boeing-717': 'Boeing 717 Hawaiian Airlines',
      'airbus-a321neo': 'Airbus A321neo Hawaiian Airlines',
      'boeing-737-700': 'Boeing 737-700 Alaska Airlines',
      'boeing-787-9': 'Boeing 787-9 Hawaiian Airlines'
    }
  },
  'spirit-airlines': {
    name: 'Spirit Airlines',
    aircraft: {
      'airbus-a320': 'Airbus A320 Spirit Airlines',
      'airbus-a320neo': 'Airbus A320neo Spirit Airlines',
      'airbus-a321': 'Airbus A321 Spirit Airlines',
      'airbus-a319': 'Airbus A319 Spirit Airlines'
    }
  },
  'frontier-airlines': {
    name: 'Frontier Airlines',
    aircraft: {
      'airbus-a320neo': 'Airbus A320neo Frontier Airlines',
      'airbus-a321neo': 'Airbus A321neo Frontier Airlines',
      'airbus-a320': 'Airbus A320 Frontier Airlines',
      'airbus-a321': 'Airbus A321 Frontier Airlines'
    }
  }
};

// Wikimedia Commons API endpoint
const WIKI_API = 'https://commons.wikimedia.org/w/api.php';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      headers: {
        'User-Agent': 'AirplaneDirectory/1.0 (https://airplane-directory.pages.dev; contact@example.com)'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error: ${data.substring(0, 100)}`));
        }
      });
    }).on('error', reject);
  });
}

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    const doRequest = (reqUrl) => {
      const urlObj = new URL(reqUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'User-Agent': 'AirplaneDirectoryBot/1.0 (https://airplane-directory.pages.dev; educational project; paul@tinybuild.studio) node-https'
        }
      };

      https.get(options, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          file.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          const newFile = fs.createWriteStream(destPath);
          doRequestWithStream(response.headers.location, newFile, resolve, reject);
          return;
        }

        if (response.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          // Verify file size
          const stats = fs.statSync(destPath);
          if (stats.size < 1000) {
            fs.unlinkSync(destPath);
            reject(new Error('File too small - likely blocked'));
          } else {
            resolve();
          }
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    };

    const doRequestWithStream = (reqUrl, stream, res, rej) => {
      const urlObj = new URL(reqUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'User-Agent': 'AirplaneDirectoryBot/1.0 (https://airplane-directory.pages.dev; educational project; paul@tinybuild.studio) node-https'
        }
      };

      https.get(options, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          stream.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          const newStream = fs.createWriteStream(destPath);
          doRequestWithStream(response.headers.location, newStream, res, rej);
          return;
        }

        if (response.statusCode !== 200) {
          stream.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          rej(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          const stats = fs.statSync(destPath);
          if (stats.size < 1000) {
            fs.unlinkSync(destPath);
            rej(new Error('File too small - likely blocked'));
          } else {
            res();
          }
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        rej(err);
      });
    };

    doRequest(url);
  });
}

async function searchWikimediaImages(searchTerm) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${searchTerm} filetype:jpg`,
    gsrnamespace: '6', // File namespace
    gsrlimit: '5',
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
    iiurlwidth: '1280'
  });

  const url = `${WIKI_API}?${params.toString()}`;

  try {
    const data = await fetchJson(url);

    if (!data.query || !data.query.pages) {
      return [];
    }

    const results = Object.values(data.query.pages)
      .filter(page => page.imageinfo && page.imageinfo[0])
      .map(page => ({
        title: page.title,
        url: page.imageinfo[0].thumburl || page.imageinfo[0].url,
        originalUrl: page.imageinfo[0].url,
        width: page.imageinfo[0].width,
        height: page.imageinfo[0].height,
        mime: page.imageinfo[0].mime
      }))
      .filter(img => img.mime === 'image/jpeg' && img.width >= 800)
      .sort((a, b) => b.width - a.width);

    return results;
  } catch (error) {
    console.error(`  Error searching for "${searchTerm}":`, error.message);
    return [];
  }
}

async function downloadAirlineImages(airlineSlug, dryRun = false) {
  const config = SEARCH_CONFIG[airlineSlug];
  if (!config) {
    console.log(`Unknown airline: ${airlineSlug}`);
    return;
  }

  const airlineDir = path.join(IMAGES_DIR, airlineSlug);
  if (!fs.existsSync(airlineDir)) {
    fs.mkdirSync(airlineDir, { recursive: true });
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`${config.name}`);
  console.log('='.repeat(50));

  for (const [aircraftSlug, searchTerm] of Object.entries(config.aircraft)) {
    const destPath = path.join(airlineDir, `${aircraftSlug}.jpg`);

    // Skip if already exists
    if (fs.existsSync(destPath)) {
      console.log(`  ✓ ${aircraftSlug}.jpg (exists)`);
      continue;
    }

    console.log(`  Searching: ${aircraftSlug}...`);

    const results = await searchWikimediaImages(searchTerm);

    if (results.length === 0) {
      console.log(`  ✗ ${aircraftSlug}.jpg (no images found)`);
      continue;
    }

    const bestMatch = results[0];

    if (dryRun) {
      console.log(`  → Would download: ${bestMatch.title}`);
      console.log(`    URL: ${bestMatch.url}`);
    } else {
      try {
        await downloadFile(bestMatch.url, destPath);
        console.log(`  ✓ ${aircraftSlug}.jpg (downloaded)`);
      } catch (error) {
        console.log(`  ✗ ${aircraftSlug}.jpg (download failed: ${error.message})`);
      }
    }

    // Rate limiting - be nice to Wikimedia
    await sleep(1000);
  }
}

async function downloadAllImages(dryRun = false) {
  console.log('\n🔍 Searching Wikimedia Commons for airline aircraft images\n');
  if (dryRun) console.log('(DRY RUN - no actual downloads)\n');

  for (const airlineSlug of Object.keys(SEARCH_CONFIG)) {
    await downloadAirlineImages(airlineSlug, dryRun);
  }

  console.log('\n✅ Done!\n');
  console.log('Run "node scripts/upload-airline-images.js status" to check results.');
  console.log('Run "node scripts/upload-airline-images.js upload" to upload to R2.\n');
}

async function listSearchTerms() {
  console.log('\n📋 Search terms for manual lookup:\n');

  for (const [airlineSlug, config] of Object.entries(SEARCH_CONFIG)) {
    console.log(`\n### ${config.name}`);
    for (const [aircraftSlug, searchTerm] of Object.entries(config.aircraft)) {
      const destPath = path.join(IMAGES_DIR, airlineSlug, `${aircraftSlug}.jpg`);
      const exists = fs.existsSync(destPath);
      const status = exists ? '✓' : '○';
      console.log(`${status} ${aircraftSlug}: "${searchTerm}"`);
    }
  }
}

// Main
const command = process.argv[2];
const dryRun = process.argv.includes('--dry-run');

switch (command) {
  case 'download':
    downloadAllImages(dryRun);
    break;
  case 'list':
    listSearchTerms();
    break;
  case 'airline':
    const airlineSlug = process.argv[3];
    if (!airlineSlug) {
      console.log('Usage: node scripts/download-wikimedia-images.js airline <airline-slug>');
      console.log('Airlines:', Object.keys(SEARCH_CONFIG).join(', '));
    } else {
      downloadAirlineImages(airlineSlug, dryRun);
    }
    break;
  default:
    console.log(`
Wikimedia Commons Image Downloader

Usage:
  node scripts/download-wikimedia-images.js <command> [options]

Commands:
  download              Download all missing images from Wikimedia Commons
  airline <slug>        Download images for a specific airline
  list                  List all search terms (for manual lookup)

Options:
  --dry-run             Show what would be downloaded without downloading

Examples:
  node scripts/download-wikimedia-images.js download
  node scripts/download-wikimedia-images.js airline delta-air-lines
  node scripts/download-wikimedia-images.js download --dry-run
`);
}
