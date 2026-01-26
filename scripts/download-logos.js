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
  // US Airlines
  'american-airlines': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/American_Airlines_logo_2013.svg/200px-American_Airlines_logo_2013.svg.png',
  'delta-air-lines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Delta_logo.svg/200px-Delta_logo.svg.png',
  'united-airlines': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/United_Airlines_Logo.svg/200px-United_Airlines_Logo.svg.png',
  'southwest-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Southwest_Airlines_logo_2014.svg/200px-Southwest_Airlines_logo_2014.svg.png',
  'jetblue-airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/JetBlue_Airways_Logo.svg/200px-JetBlue_Airways_Logo.svg.png',
  'alaska-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Alaska_Airlines_logo_with_tagline.svg/200px-Alaska_Airlines_logo_with_tagline.svg.png',
  'spirit-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Spirit_Airlines_logo.svg/200px-Spirit_Airlines_logo.svg.png',
  'frontier-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Frontier_Airlines_logo.svg/200px-Frontier_Airlines_logo.svg.png',

  // European Airlines
  'british-airways': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/British_Airways_Logo.svg/200px-British_Airways_Logo.svg.png',
  'lufthansa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lufthansa_Logo_2018.svg/200px-Lufthansa_Logo_2018.svg.png',
  'air-france': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Air_France_Logo.svg/200px-Air_France_Logo.svg.png',
  'klm': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/KLM_logo.svg/200px-KLM_logo.svg.png',
  'virgin-atlantic': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Virgin_atlantic_logo.svg/200px-Virgin_atlantic_logo.svg.png',
  'iberia': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Iberia_%28airline%29_logo.svg/200px-Iberia_%28airline%29_logo.svg.png',
  'swiss': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Swiss_International_Air_Lines_Logo_2011.svg/200px-Swiss_International_Air_Lines_Logo_2011.svg.png',
  'aer-lingus': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Aer_Lingus_logo.svg/200px-Aer_Lingus_logo.svg.png',
  'icelandair': 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Icelandair_logo.svg/200px-Icelandair_logo.svg.png',
  'tap-portugal': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/TAP_Air_Portugal_Logo.svg/200px-TAP_Air_Portugal_Logo.svg.png',
  'norwegian': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Norwegian_logo.svg/200px-Norwegian_logo.svg.png',
  'sas': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/SAS_Scandinavian_Airlines_logo.svg/200px-SAS_Scandinavian_Airlines_logo.svg.png',
  'finnair': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Finnair_Logo.svg/200px-Finnair_Logo.svg.png',

  // Middle East Airlines
  'emirates': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/200px-Emirates_logo.svg.png',
  'qatar-airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Qatar_Airways_Logo.svg/200px-Qatar_Airways_Logo.svg.png',
  'etihad-airways': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Etihad-airways-logo.svg/200px-Etihad-airways-logo.svg.png',
  'turkish-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Turkish_Airlines_logo_2019_compact.svg/200px-Turkish_Airlines_logo_2019_compact.svg.png',
  'el-al': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/El_Al_Israel_Airlines_logo.svg/200px-El_Al_Israel_Airlines_logo.svg.png',

  // Asia-Pacific Airlines
  'japan-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Japan_Airlines_logo_%28full%29.svg/200px-Japan_Airlines_logo_%28full%29.svg.png',
  'ana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/All_Nippon_Airways_Logo.svg/200px-All_Nippon_Airways_Logo.svg.png',
  'korean-air': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Korean_Air_logo.svg/200px-Korean_Air_logo.svg.png',
  'singapore-airlines': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/200px-Singapore_Airlines_Logo_2.svg.png',
  'cathay-pacific': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Cathay_Pacific_logo.svg/200px-Cathay_Pacific_logo.svg.png',
  'qantas': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Qantas_Airways_logo_2016.svg/200px-Qantas_Airways_logo_2016.svg.png',
  'air-new-zealand': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Air_New_Zealand_logo.svg/200px-Air_New_Zealand_logo.svg.png',
  'eva-air': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/EVA_Air_logo.svg/200px-EVA_Air_logo.svg.png',
  'china-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/China_Airlines_logo.svg/200px-China_Airlines_logo.svg.png',

  // Americas Airlines (non-US)
  'air-canada': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Air_Canada_Logo.svg/200px-Air_Canada_Logo.svg.png',
  'westjet': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/WestJet_Logo.svg/200px-WestJet_Logo.svg.png',
  'aeromexico': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Aerom%C3%A9xico_Logo.svg/200px-Aerom%C3%A9xico_Logo.svg.png',
  'latam': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/LATAM_Airlines_logo.svg/200px-LATAM_Airlines_logo.svg.png',
  'avianca': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Avianca_Logo.svg/200px-Avianca_Logo.svg.png',
  'copa-airlines': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Copa_Airlines_logo.svg/200px-Copa_Airlines_logo.svg.png'
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

    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\nDone! Upload with: node scripts/upload-logos.js');
}

main();
