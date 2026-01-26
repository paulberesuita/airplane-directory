#!/usr/bin/env node
/**
 * Download curated airline aircraft images from Wikimedia Commons
 *
 * Uses verified URLs from curated-image-urls.json
 * Downloads using Node https directly (avoiding shell escaping issues)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const CURATED_FILE = path.join(__dirname, 'curated-image-urls.json');
const IMAGES_DIR = path.join(__dirname, '..', 'images', 'airlines');

// Load curated URLs
const curated = JSON.parse(fs.readFileSync(CURATED_FILE, 'utf8'));
const images = curated.images;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    const request = (reqUrl) => {
      const urlObj = new URL(reqUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 AirplaneDirectory/1.0'
        }
      };

      https.get(options, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          file.close();
          fs.unlinkSync(destPath);
          const newFile = fs.createWriteStream(destPath);
          requestWithFile(response.headers.location, newFile, resolve, reject);
          return;
        }

        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(destPath);
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(destPath);

          // Check if it's actually an image (not error page)
          if (stats.size < 5000) {
            const content = fs.readFileSync(destPath, 'utf8');
            if (content.includes('<!DOCTYPE') || content.includes('<html')) {
              fs.unlinkSync(destPath);
              reject(new Error('Received HTML error page'));
              return;
            }
          }

          resolve({ size: stats.size });
        });
      }).on('error', (err) => {
        file.close();
        try { fs.unlinkSync(destPath); } catch(e) {}
        reject(err);
      });
    };

    const requestWithFile = (reqUrl, stream, res, rej) => {
      const urlObj = new URL(reqUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 AirplaneDirectory/1.0'
        }
      };

      https.get(options, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307) {
          stream.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          const newStream = fs.createWriteStream(destPath);
          requestWithFile(response.headers.location, newStream, res, rej);
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
            const content = fs.readFileSync(destPath, 'utf8');
            if (content.includes('<!DOCTYPE') || content.includes('<html')) {
              fs.unlinkSync(destPath);
              rej(new Error('Received HTML error page'));
              return;
            }
          }

          res({ size: stats.size });
        });
      }).on('error', (err) => {
        stream.close();
        try { fs.unlinkSync(destPath); } catch(e) {}
        rej(err);
      });
    };

    request(url);
  });
}

async function downloadAll() {
  console.log('\n🖼️  Downloading curated airline images\n');

  let downloaded = 0;
  let failed = 0;
  let skipped = 0;
  const failedImages = [];

  for (const [airlineSlug, aircraft] of Object.entries(images)) {
    const airlineDir = path.join(IMAGES_DIR, airlineSlug);

    // Create airline directory
    if (!fs.existsSync(airlineDir)) {
      fs.mkdirSync(airlineDir, { recursive: true });
    }

    console.log(`\n${airlineSlug}:`);

    for (const [aircraftSlug, url] of Object.entries(aircraft)) {
      const destPath = path.join(airlineDir, `${aircraftSlug}.jpg`);

      // Skip if already exists and is valid image
      if (fs.existsSync(destPath)) {
        const stats = fs.statSync(destPath);
        if (stats.size > 10000) {
          console.log(`  ✓ ${aircraftSlug}.jpg (exists, ${Math.round(stats.size/1024)}KB)`);
          skipped++;
          continue;
        }
        // Remove invalid file
        fs.unlinkSync(destPath);
      }

      process.stdout.write(`  ⏳ ${aircraftSlug}.jpg...`);

      try {
        const result = await downloadImage(url, destPath);
        console.log(` ✓ (${Math.round(result.size/1024)}KB)`);
        downloaded++;
      } catch (error) {
        console.log(` ✗ (${error.message})`);
        failed++;
        failedImages.push({ airline: airlineSlug, aircraft: aircraftSlug, error: error.message });
      }

      // Longer delay to avoid rate limiting (2 seconds)
      await sleep(2000);
    }
    // Extra delay between airlines
    await sleep(3000);
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Summary: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed\n`);

  if (failedImages.length > 0) {
    console.log('❌ Failed downloads:');
    for (const f of failedImages) {
      console.log(`  ${f.airline}/${f.aircraft}: ${f.error}`);
    }
  }

  // List what's missing from expected
  console.log('\n📋 Missing from curated list:');
  const expected = {
    'american-airlines': ['boeing-737-800', 'airbus-a321', 'embraer-e175', 'boeing-737-max-8', 'airbus-a321neo', 'airbus-a319', 'airbus-a320', 'boeing-777-200er', 'boeing-787-8', 'boeing-757-200', 'boeing-787-9', 'boeing-777-300er', 'boeing-767-300er'],
    'delta-air-lines': ['boeing-737-900er', 'airbus-a321', 'boeing-757-200', 'boeing-717', 'boeing-737-800', 'airbus-a320', 'boeing-767-300er', 'airbus-a319', 'airbus-a220-300', 'airbus-a220-100', 'airbus-a330-900neo', 'airbus-a321neo', 'airbus-a350-900', 'airbus-a330-300', 'boeing-767-400er', 'boeing-757-300', 'airbus-a330-200'],
    'united-airlines': ['boeing-737-900er', 'boeing-737-800', 'boeing-737-max-8', 'boeing-737-max-9', 'airbus-a319', 'airbus-a320', 'boeing-777-200er', 'boeing-787-9', 'boeing-737-700', 'boeing-757-200', 'boeing-767-300er', 'boeing-787-8', 'airbus-a321neo', 'boeing-787-10', 'boeing-777-300er', 'boeing-757-300', 'boeing-767-400er'],
    'southwest-airlines': ['boeing-737-700', 'boeing-737-max-8', 'boeing-737-800'],
    'jetblue-airways': ['airbus-a320', 'airbus-a321neo', 'airbus-a321', 'airbus-a220-300', 'embraer-e190'],
    'alaska-airlines': ['boeing-737-max-9', 'boeing-737-900er', 'boeing-737-800', 'embraer-e175', 'airbus-a330-200', 'boeing-717', 'airbus-a321neo', 'boeing-737-700', 'boeing-787-9'],
    'spirit-airlines': ['airbus-a320', 'airbus-a320neo', 'airbus-a321', 'airbus-a319'],
    'frontier-airlines': ['airbus-a320neo', 'airbus-a321neo', 'airbus-a320', 'airbus-a321']
  };

  for (const [airlineSlug, aircraftList] of Object.entries(expected)) {
    const curatedAirline = images[airlineSlug] || {};
    const missing = aircraftList.filter(a => !curatedAirline[a]);
    if (missing.length > 0) {
      console.log(`  ${airlineSlug}: ${missing.join(', ')}`);
    }
  }
}

downloadAll();
