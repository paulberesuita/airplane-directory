#!/usr/bin/env node
/**
 * Download airline logos - curated URLs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '..', 'images', 'logos');

// Verified working URLs from Wikimedia Commons/Wikipedia
const LOGO_URLS = {
  'virgin-atlantic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Virgin_Atlantic.svg/200px-Virgin_Atlantic.svg.png',
  'iberia': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Logo_de_Iberia.svg/200px-Logo_de_Iberia.svg.png',
  'aer-lingus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Aer_Lingus_logo.svg/200px-Aer_Lingus_logo.svg.png',
  'icelandair': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Icelandair_%281%29.svg/200px-Icelandair_%281%29.svg.png',
  'tap-portugal': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/TAP_Portugal_logo.svg/200px-TAP_Portugal_logo.svg.png',
  'norwegian': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Norwegian-logo.svg/200px-Norwegian-logo.svg.png',
  'sas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/SAS_logo.svg/200px-SAS_logo.svg.png',
  'qatar-airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Qatar_airways_logo.svg/200px-Qatar_airways_logo.svg.png',
  'etihad-airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Etihad_Airways_logo.svg/200px-Etihad_Airways_logo.svg.png',
  'turkish-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Turkish_Airlines_logo_%282019%29.svg/200px-Turkish_Airlines_logo_%282019%29.svg.png',
  'el-al': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/EL_AL_2017.svg/200px-EL_AL_2017.svg.png',
  'japan-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Japan_Airlines_Logo_%282002_-_2011%29.svg/200px-Japan_Airlines_Logo_%282002_-_2011%29.svg.png',
  'ana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/All_Nippon_Airways_Logo_%28Black%29.svg/200px-All_Nippon_Airways_Logo_%28Black%29.svg.png',
  'korean-air': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Korean_Air_lines_Logo.svg/200px-Korean_Air_lines_Logo.svg.png',
  'singapore-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Singapore_Airlines_Logo_2.svg/200px-Singapore_Airlines_Logo_2.svg.png',
  'cathay-pacific': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Cathay_Pacific_logo.svg/200px-Cathay_Pacific_logo.svg.png',
  'qantas': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Qantas_Airways_logo.svg/200px-Qantas_Airways_logo.svg.png',
  'air-new-zealand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Air_New_Zealand_logo_%282012%29.svg/200px-Air_New_Zealand_logo_%282012%29.svg.png',
  'eva-air': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/EVA_AIR_logo_%282015%29.svg/200px-EVA_AIR_logo_%282015%29.svg.png',
  'china-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/China_Airlines_Logo.svg/200px-China_Airlines_Logo.svg.png',
  'air-canada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Air_Canada_Logo_%282017%29.svg/200px-Air_Canada_Logo_%282017%29.svg.png',
  'westjet': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/WestJet_Airlines_Ltd._Logo.svg/200px-WestJet_Airlines_Ltd._Logo.svg.png',
  'aeromexico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Aerom%C3%A9xico_Logo.svg/200px-Aerom%C3%A9xico_Logo.svg.png',
  'latam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/LATAM-Logo.svg/200px-LATAM-Logo.svg.png',
  'avianca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Avianca_Logo.svg/200px-Avianca_Logo.svg.png',
  'copa-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Copa_Airlines_logo.svg/200px-Copa_Airlines_logo.svg.png',
};

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const makeRequest = (reqUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }

      const protocol = reqUrl.startsWith('https') ? https : require('http');

      protocol.get(reqUrl, {
        headers: { 'User-Agent': 'AirplaneDirectory/1.0 (educational project)' }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          makeRequest(response.headers.location, redirectCount + 1);
          return;
        }

        if (response.statusCode === 429) {
          reject(new Error('Rate limited'));
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        const file = fs.createWriteStream(destPath);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
        file.on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      }).on('error', reject);
    };

    makeRequest(url);
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
      const stats = fs.statSync(destPath);
      if (stats.size > 500) {
        console.log(`✓ ${slug}.png (exists)`);
        continue;
      }
    }

    process.stdout.write(`⏳ ${slug}.png...`);

    try {
      await downloadFile(url, destPath);

      const stats = fs.statSync(destPath);
      if (stats.size < 100) {
        fs.unlinkSync(destPath);
        console.log(` ✗ (too small)`);
      } else {
        console.log(` ✓ (${Math.round(stats.size/1024)}KB)`);
      }
    } catch (error) {
      console.log(` ✗ (${error.message})`);
      if (error.message === 'Rate limited') {
        console.log('   Waiting 30 seconds...');
        await new Promise(r => setTimeout(r, 30000));
      }
    }

    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\nDone! Upload with: node scripts/upload-logos.js');
}

main();
