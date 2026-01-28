#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../images/aircraft');

const AIRCRAFT = [
  { slug: 'airbus-a318', search: 'Airbus A318 aircraft' },
  { slug: 'airbus-a319neo', search: 'Airbus A319neo' },
  { slug: 'airbus-a320', search: 'Airbus A320 aircraft' },
  { slug: 'airbus-a330-800neo', search: 'Airbus A330-800neo' },
  { slug: 'airbus-a330-900neo', search: 'Airbus A330-900neo' },
  { slug: 'airbus-a340-300', search: 'Airbus A340-300' },
  { slug: 'airbus-a340-500', search: 'Airbus A340-500' },
  { slug: 'airbus-a340-600', search: 'Airbus A340-600' },
  { slug: 'boeing-737-max-10', search: 'Boeing 737 MAX 10' },
  { slug: 'boeing-737-max-7', search: 'Boeing 737 MAX 7' },
  { slug: 'boeing-747-8i', search: 'Boeing 747-8 Intercontinental' },
  { slug: 'boeing-777-200lr', search: 'Boeing 777-200LR' },
  { slug: 'boeing-777-8', search: 'Boeing 777-8' },
  { slug: 'boeing-777-9', search: 'Boeing 777-9' },
  { slug: 'boeing-787-10', search: 'Boeing 787-10' },
  { slug: 'bombardier-crj-900', search: 'Bombardier CRJ-900' },
  { slug: 'embraer-e190-e2', search: 'Embraer E190-E2' }
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'AirplaneDirectory/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, {
      headers: {
        'User-Agent': 'AirplaneDirectory/1.0',
        'Referer': 'https://commons.wikimedia.org/'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(outputPath);
        return downloadFile(res.headers.location, outputPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(outputPath);
        if (stats.size < 5000) {
          fs.unlinkSync(outputPath);
          reject(new Error('File too small'));
        } else {
          resolve(stats.size);
        }
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      reject(err);
    });
  });
}

async function searchAndDownload(slug, searchTerm) {
  const outputPath = path.join(OUTPUT_DIR, `${slug}.jpg`);

  // Skip if already exists
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 5000) {
    return { status: 'skip', size: fs.statSync(outputPath).size };
  }

  // Search Wikipedia for image
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=6&format=json`;
  const searchResult = await fetchJson(searchUrl);

  if (!searchResult.query?.search?.length) {
    return { status: 'no_results' };
  }

  // Find first jpg image
  for (const result of searchResult.query.search.slice(0, 5)) {
    if (!result.title.toLowerCase().includes('.jpg')) continue;

    // Get image URL
    const infoUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(result.title)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
    const infoResult = await fetchJson(infoUrl);
    const pages = infoResult.query.pages;
    const pageId = Object.keys(pages)[0];
    const imageInfo = pages[pageId].imageinfo?.[0];

    if (imageInfo?.thumburl || imageInfo?.url) {
      const imageUrl = imageInfo.thumburl || imageInfo.url;
      try {
        const size = await downloadFile(imageUrl, outputPath);
        return { status: 'success', size, url: imageUrl };
      } catch (e) {
        // Try next result
      }
    }
    await sleep(500);
  }

  return { status: 'failed' };
}

async function main() {
  console.log('=== Downloading Missing Source Images ===\n');

  const results = { success: [], skip: [], failed: [] };

  for (const aircraft of AIRCRAFT) {
    process.stdout.write(`${aircraft.slug}... `);

    try {
      const result = await searchAndDownload(aircraft.slug, aircraft.search);

      if (result.status === 'skip') {
        console.log(`SKIP (${Math.round(result.size/1024)}KB exists)`);
        results.skip.push(aircraft.slug);
      } else if (result.status === 'success') {
        console.log(`OK (${Math.round(result.size/1024)}KB)`);
        results.success.push(aircraft.slug);
      } else {
        console.log('FAILED');
        results.failed.push(aircraft.slug);
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
      results.failed.push(aircraft.slug);
    }

    await sleep(1500);
  }

  console.log('\n=== Summary ===');
  console.log(`Downloaded: ${results.success.length}`);
  console.log(`Skipped: ${results.skip.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed:', results.failed.join(', '));
  }
}

main().catch(console.error);
