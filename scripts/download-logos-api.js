#!/usr/bin/env node
/**
 * Download airline logos using Wikimedia API search
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGOS_DIR = path.join(__dirname, '..', 'images', 'logos');

// Airlines to download logos for
const AIRLINES = [
  { slug: 'virgin-atlantic', search: 'Virgin Atlantic logo' },
  { slug: 'iberia', search: 'Iberia airline logo' },
  { slug: 'aer-lingus', search: 'Aer Lingus logo' },
  { slug: 'icelandair', search: 'Icelandair logo' },
  { slug: 'tap-portugal', search: 'TAP Air Portugal logo' },
  { slug: 'norwegian', search: 'Norwegian Air Shuttle logo' },
  { slug: 'sas', search: 'SAS Scandinavian Airlines logo' },
  { slug: 'qatar-airways', search: 'Qatar Airways logo' },
  { slug: 'etihad-airways', search: 'Etihad Airways logo' },
  { slug: 'turkish-airlines', search: 'Turkish Airlines logo' },
  { slug: 'el-al', search: 'El Al logo' },
  { slug: 'japan-airlines', search: 'Japan Airlines logo' },
  { slug: 'ana', search: 'All Nippon Airways logo' },
  { slug: 'korean-air', search: 'Korean Air logo' },
  { slug: 'singapore-airlines', search: 'Singapore Airlines logo' },
  { slug: 'cathay-pacific', search: 'Cathay Pacific logo' },
  { slug: 'qantas', search: 'Qantas logo' },
  { slug: 'air-new-zealand', search: 'Air New Zealand logo' },
  { slug: 'eva-air', search: 'EVA Air logo' },
  { slug: 'china-airlines', search: 'China Airlines logo' },
  { slug: 'air-canada', search: 'Air Canada logo' },
  { slug: 'westjet', search: 'WestJet logo' },
  { slug: 'aeromexico', search: 'Aeromexico logo' },
  { slug: 'latam', search: 'LATAM Airlines logo' },
  { slug: 'avianca', search: 'Avianca logo' },
  { slug: 'copa-airlines', search: 'Copa Airlines logo' },
];

function searchWikimedia(query) {
  return new Promise((resolve, reject) => {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5&prop=imageinfo&iiprop=url|size&iiurlwidth=200&format=json`;

    https.get(searchUrl, {
      headers: { 'User-Agent': 'AirplaneDirectory/1.0 (educational project)' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.pages) {
            const pages = Object.values(json.query.pages);
            // Find SVG or PNG logos
            for (const page of pages) {
              if (page.imageinfo && page.imageinfo[0]) {
                const info = page.imageinfo[0];
                const url = info.thumburl || info.url;
                if (url && (url.includes('.svg') || url.includes('.png'))) {
                  resolve(url);
                  return;
                }
              }
            }
          }
          resolve(null);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);

    const request = (reqUrl) => {
      https.get(reqUrl, {
        headers: { 'User-Agent': 'AirplaneDirectory/1.0 (educational project)' }
      }, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          const newFile = fs.createWriteStream(destPath);
          request(response.headers.location);
          return;
        }

        if (response.statusCode === 429) {
          file.close();
          try { fs.unlinkSync(destPath); } catch(e) {}
          reject(new Error('Rate limited'));
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
          resolve();
        });
      }).on('error', (err) => {
        file.close();
        try { fs.unlinkSync(destPath); } catch(e) {}
        reject(err);
      });
    };

    request(url);
  });
}

async function main() {
  if (!fs.existsSync(LOGOS_DIR)) {
    fs.mkdirSync(LOGOS_DIR, { recursive: true });
  }

  console.log('Downloading airline logos via API search...\n');

  for (const airline of AIRLINES) {
    const destPath = path.join(LOGOS_DIR, `${airline.slug}.png`);

    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 500) {
        console.log(`✓ ${airline.slug}.png (exists)`);
        continue;
      }
    }

    process.stdout.write(`⏳ ${airline.slug}.png...`);

    try {
      // Search for logo
      const url = await searchWikimedia(airline.search);

      if (!url) {
        console.log(` ✗ (not found)`);
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      // Download it
      await downloadFile(url, destPath);

      // Verify file size
      const stats = fs.statSync(destPath);
      if (stats.size < 500) {
        fs.unlinkSync(destPath);
        console.log(` ✗ (too small)`);
      } else {
        console.log(` ✓`);
      }
    } catch (error) {
      console.log(` ✗ (${error.message})`);
      if (error.message === 'Rate limited') {
        console.log('   Waiting 30 seconds...');
        await new Promise(r => setTimeout(r, 30000));
      }
    }

    // Wait between requests
    await new Promise(r => setTimeout(r, 4000));
  }

  console.log('\nDone! Upload with: node scripts/upload-logos.js');
}

main();
