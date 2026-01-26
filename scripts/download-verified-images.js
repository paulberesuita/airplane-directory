#!/usr/bin/env node
/**
 * Download verified airline aircraft images from Wikimedia Commons
 *
 * Uses Wikimedia API to search for images and get verified URLs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'images', 'airlines');

// Airline-aircraft search terms
const SEARCH_CONFIG = {
  'american-airlines': {
    name: 'American Airlines',
    aircraft: {
      'boeing-737-800': 'American Airlines Boeing 737-800',
      'airbus-a321': 'American Airlines Airbus A321',
      'airbus-a319': 'American Airlines Airbus A319',
      'airbus-a320': 'American Airlines Airbus A320',
      'boeing-777-200er': 'American Airlines Boeing 777-200',
      'boeing-787-8': 'American Airlines Boeing 787-8',
      'boeing-787-9': 'American Airlines Boeing 787-9',
      'boeing-757-200': 'American Airlines Boeing 757-200',
      'boeing-777-300er': 'American Airlines Boeing 777-300',
      'boeing-767-300er': 'American Airlines Boeing 767-300',
      'boeing-737-max-8': 'American Airlines Boeing 737 MAX 8',
      'airbus-a321neo': 'American Airlines Airbus A321neo',
      'embraer-e175': 'American Eagle Embraer 175'
    }
  },
  'delta-air-lines': {
    name: 'Delta Air Lines',
    aircraft: {
      'boeing-717': 'Delta Air Lines Boeing 717',
      'boeing-757-200': 'Delta Air Lines Boeing 757-200',
      'boeing-757-300': 'Delta Air Lines Boeing 757-300',
      'boeing-767-300er': 'Delta Air Lines Boeing 767-300',
      'boeing-767-400er': 'Delta Air Lines Boeing 767-400',
      'boeing-737-800': 'Delta Air Lines Boeing 737-800',
      'boeing-737-900er': 'Delta Air Lines Boeing 737-900',
      'airbus-a319': 'Delta Air Lines Airbus A319',
      'airbus-a320': 'Delta Air Lines Airbus A320',
      'airbus-a321': 'Delta Air Lines Airbus A321',
      'airbus-a321neo': 'Delta Air Lines Airbus A321neo',
      'airbus-a220-100': 'Delta Air Lines Airbus A220-100',
      'airbus-a220-300': 'Delta Air Lines Airbus A220-300',
      'airbus-a330-200': 'Delta Air Lines Airbus A330-200',
      'airbus-a330-300': 'Delta Air Lines Airbus A330-300',
      'airbus-a330-900neo': 'Delta Air Lines Airbus A330-900',
      'airbus-a350-900': 'Delta Air Lines Airbus A350-900'
    }
  },
  'united-airlines': {
    name: 'United Airlines',
    aircraft: {
      'boeing-737-700': 'United Airlines Boeing 737-700',
      'boeing-737-800': 'United Airlines Boeing 737-800',
      'boeing-737-900er': 'United Airlines Boeing 737-900',
      'boeing-737-max-8': 'United Airlines Boeing 737 MAX 8',
      'boeing-737-max-9': 'United Airlines Boeing 737 MAX 9',
      'boeing-757-200': 'United Airlines Boeing 757-200',
      'boeing-757-300': 'United Airlines Boeing 757-300',
      'boeing-767-300er': 'United Airlines Boeing 767-300',
      'boeing-767-400er': 'United Airlines Boeing 767-400',
      'boeing-777-200er': 'United Airlines Boeing 777-200',
      'boeing-777-300er': 'United Airlines Boeing 777-300',
      'boeing-787-8': 'United Airlines Boeing 787-8',
      'boeing-787-9': 'United Airlines Boeing 787-9',
      'boeing-787-10': 'United Airlines Boeing 787-10',
      'airbus-a319': 'United Airlines Airbus A319',
      'airbus-a320': 'United Airlines Airbus A320',
      'airbus-a321neo': 'United Airlines Airbus A321neo'
    }
  },
  'southwest-airlines': {
    name: 'Southwest Airlines',
    aircraft: {
      'boeing-737-700': 'Southwest Airlines Boeing 737-700',
      'boeing-737-800': 'Southwest Airlines Boeing 737-800',
      'boeing-737-max-8': 'Southwest Airlines Boeing 737 MAX 8'
    }
  },
  'jetblue-airways': {
    name: 'JetBlue Airways',
    aircraft: {
      'airbus-a320': 'JetBlue Airways Airbus A320',
      'airbus-a321': 'JetBlue Airways Airbus A321',
      'airbus-a321neo': 'JetBlue Airways Airbus A321neo',
      'airbus-a220-300': 'JetBlue Airways Airbus A220-300',
      'embraer-e190': 'JetBlue Airways Embraer 190'
    }
  },
  'alaska-airlines': {
    name: 'Alaska Airlines',
    aircraft: {
      'boeing-737-700': 'Alaska Airlines Boeing 737-700',
      'boeing-737-800': 'Alaska Airlines Boeing 737-800',
      'boeing-737-900er': 'Alaska Airlines Boeing 737-900',
      'boeing-737-max-9': 'Alaska Airlines Boeing 737 MAX 9',
      'embraer-e175': 'Horizon Air Embraer 175',
      'boeing-717': 'Hawaiian Airlines Boeing 717',
      'airbus-a321neo': 'Hawaiian Airlines Airbus A321neo',
      'airbus-a330-200': 'Hawaiian Airlines Airbus A330-200',
      'boeing-787-9': 'Hawaiian Airlines Boeing 787-9'
    }
  },
  'spirit-airlines': {
    name: 'Spirit Airlines',
    aircraft: {
      'airbus-a319': 'Spirit Airlines Airbus A319',
      'airbus-a320': 'Spirit Airlines Airbus A320',
      'airbus-a320neo': 'Spirit Airlines Airbus A320neo',
      'airbus-a321': 'Spirit Airlines Airbus A321'
    }
  },
  'frontier-airlines': {
    name: 'Frontier Airlines',
    aircraft: {
      'airbus-a320': 'Frontier Airlines Airbus A320',
      'airbus-a320neo': 'Frontier Airlines Airbus A320neo',
      'airbus-a321': 'Frontier Airlines Airbus A321',
      'airbus-a321neo': 'Frontier Airlines Airbus A321neo'
    }
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'AirplaneDirectory/1.0 (educational project)'
      }
    }, (res) => {
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

async function searchWikimedia(searchTerm) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${searchTerm} filetype:jpg`,
    gsrnamespace: '6',
    gsrlimit: '3',
    prop: 'imageinfo',
    iiprop: 'url|size|mime',
    iiurlwidth: '1280'
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params}`;

  try {
    const data = await fetchJson(url);

    if (!data.query || !data.query.pages) {
      return null;
    }

    // Find best image (prefer exterior shots, larger sizes)
    const pages = Object.values(data.query.pages);
    for (const page of pages) {
      if (page.imageinfo && page.imageinfo[0]) {
        const info = page.imageinfo[0];
        // Skip interior shots
        if (page.title.toLowerCase().includes('interior')) continue;
        // Skip if not JPEG
        if (info.mime !== 'image/jpeg') continue;
        // Return the thumb URL
        return info.thumburl || info.url;
      }
    }

    return null;
  } catch (error) {
    console.error(`  Search error: ${error.message}`);
    return null;
  }
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    const doRequest = (reqUrl) => {
      const urlObj = new URL(reqUrl);

      https.get({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'User-Agent': 'AirplaneDirectory/1.0 (educational project)'
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          file.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          const newFile = fs.createWriteStream(destPath);
          doRequestWithFile(response.headers.location, newFile, resolve, reject);
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
          const stats = fs.statSync(destPath);
          if (stats.size < 5000) {
            fs.unlinkSync(destPath);
            reject(new Error('File too small'));
            return;
          }
          resolve({ size: stats.size });
        });
      }).on('error', (err) => {
        file.close();
        try { fs.unlinkSync(destPath); } catch(e) {}
        reject(err);
      });
    };

    const doRequestWithFile = (reqUrl, stream, res, rej) => {
      const urlObj = new URL(reqUrl);

      https.get({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'User-Agent': 'AirplaneDirectory/1.0 (educational project)'
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          stream.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          const newStream = fs.createWriteStream(destPath);
          doRequestWithFile(response.headers.location, newStream, res, rej);
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
          if (stats.size < 5000) {
            fs.unlinkSync(destPath);
            rej(new Error('File too small'));
            return;
          }
          res({ size: stats.size });
        });
      }).on('error', (err) => {
        stream.close();
        try { fs.unlinkSync(destPath); } catch(e) {}
        rej(err);
      });
    };

    doRequest(url);
  });
}

async function downloadAll() {
  console.log('\n🔍 Searching Wikimedia Commons and downloading images\n');

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const [airlineSlug, config] of Object.entries(SEARCH_CONFIG)) {
    const airlineDir = path.join(IMAGES_DIR, airlineSlug);
    if (!fs.existsSync(airlineDir)) {
      fs.mkdirSync(airlineDir, { recursive: true });
    }

    console.log(`\n${config.name}:`);

    for (const [aircraftSlug, searchTerm] of Object.entries(config.aircraft)) {
      const destPath = path.join(airlineDir, `${aircraftSlug}.jpg`);

      // Skip if already exists and is valid
      if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        if (stats.size > 10000) {
          console.log(`  ✓ ${aircraftSlug}.jpg (exists, ${Math.round(stats.size/1024)}KB)`);
          skipped++;
          continue;
        }
        fs.unlinkSync(destPath);
      }

      process.stdout.write(`  🔍 ${aircraftSlug}.jpg...`);

      // Search for image
      const imageUrl = await searchWikimedia(searchTerm);

      if (!imageUrl) {
        console.log(` ✗ (no image found)`);
        failed++;
        await sleep(1500);
        continue;
      }

      // Download image with retry for 429
      let retries = 2;
      let success = false;

      while (retries > 0 && !success) {
        try {
          const result = await downloadImage(imageUrl, destPath);
          console.log(` ✓ (${Math.round(result.size/1024)}KB)`);
          downloaded++;
          success = true;
        } catch (error) {
          if (error.message.includes('429') && retries > 1) {
            process.stdout.write(` (retry in 15s)...`);
            await sleep(15000);
            retries--;
          } else {
            console.log(` ✗ (${error.message})`);
            failed++;
            break;
          }
        }
      }

      // Rate limiting - 4 seconds between requests
      await sleep(4000);
    }

    // Extra delay between airlines - 8 seconds
    await sleep(8000);
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Summary: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed\n`);
}

// Check for single airline arg
const airlineArg = process.argv[2];
if (airlineArg && SEARCH_CONFIG[airlineArg]) {
  // Download single airline
  const limitedConfig = { [airlineArg]: SEARCH_CONFIG[airlineArg] };
  Object.keys(SEARCH_CONFIG).forEach(k => delete SEARCH_CONFIG[k]);
  Object.assign(SEARCH_CONFIG, limitedConfig);
}

downloadAll();
