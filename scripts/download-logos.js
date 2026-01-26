#!/usr/bin/env node
/**
 * Download airline logos from Wikimedia Commons
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '..', 'images', 'logos');

// Curated logo URLs from Wikimedia Commons (PNG/SVG converted to PNG)
const LOGO_URLS = {
  'american-airlines': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/American_Airlines_logo_2013.svg/200px-American_Airlines_logo_2013.svg.png',
  'delta-air-lines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Delta_logo.svg/200px-Delta_logo.svg.png',
  'united-airlines': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/United_Airlines_Logo.svg/200px-United_Airlines_Logo.svg.png',
  'southwest-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Southwest_Airlines_logo_2014.svg/200px-Southwest_Airlines_logo_2014.svg.png',
  'jetblue-airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/JetBlue_Airways_Logo.svg/200px-JetBlue_Airways_Logo.svg.png',
  'alaska-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Alaska_Airlines_logo_with_tagline.svg/200px-Alaska_Airlines_logo_with_tagline.svg.png',
  'spirit-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Spirit_Airlines_logo.svg/200px-Spirit_Airlines_logo.svg.png',
  'frontier-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Frontier_Airlines_logo.svg/200px-Frontier_Airlines_logo.svg.png'
};

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    const request = (reqUrl) => {
      https.get(reqUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 AirplaneDirectory/1.0'
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          fs.unlinkSync(destPath);
          const newFile = fs.createWriteStream(destPath);
          requestWithStream(response.headers.location, newFile, resolve, reject);
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
          resolve();
        });
      }).on('error', reject);
    };

    const requestWithStream = (reqUrl, stream, res, rej) => {
      https.get(reqUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 AirplaneDirectory/1.0'
        }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          stream.close();
          fs.unlinkSync(destPath);
          const newStream = fs.createWriteStream(destPath);
          requestWithStream(response.headers.location, newStream, res, rej);
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
          res();
        });
      }).on('error', rej);
    };

    request(url);
  });
}

async function main() {
  if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
  }

  console.log('Downloading airline logos...\n');

  for (const [slug, url] of Object.entries(LOGO_URLS)) {
    const destPath = path.join(LOGOS_DIR, `${slug}.png`);

    if (fs.existsSync(destPath)) {
      console.log(`✓ ${slug}.png (exists)`);
      continue;
    }

    process.stdout.write(`⏳ ${slug}.png...`);

    try {
      await downloadFile(url, destPath);
      console.log(' ✓');
    } catch (error) {
      console.log(` ✗ (${error.message})`);
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nDone! Upload with: node scripts/upload-logos.js');
}

main();
