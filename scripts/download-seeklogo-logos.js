#!/usr/bin/env node
/**
 * Download airline logos from SeekLogo
 * Sources researched from seeklogo.com
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../images/logos');

// All 26 missing airline logos with their SeekLogo PNG URLs
const LOGOS = [
  { slug: 'aer-lingus', url: 'https://images.seeklogo.com/logo-png/48/1/aer-lingus-logo-png_seeklogo-483984.png' },
  { slug: 'aeromexico', url: 'https://images.seeklogo.com/logo-png/22/1/aeromexico-logo-png_seeklogo-222813.png' },
  { slug: 'air-canada', url: 'https://images.seeklogo.com/logo-png/43/1/air-canada-logo-png_seeklogo-437663.png' },
  { slug: 'air-new-zealand', url: 'https://images.seeklogo.com/logo-png/0/1/air-new-zealand-logo-png_seeklogo-5166.png' },
  { slug: 'ana', url: 'https://images.seeklogo.com/logo-png/0/1/ana-logo-png_seeklogo-8607.png' },
  { slug: 'avianca', url: 'https://images.seeklogo.com/logo-png/51/1/avianca-logo-png_seeklogo-513389.png' },
  { slug: 'cathay-pacific', url: 'https://images.seeklogo.com/logo-png/31/1/cathay-pacific-logo-png_seeklogo-312434.png' },
  { slug: 'china-airlines', url: 'https://images.seeklogo.com/logo-png/28/1/china-airlines-logo-png_seeklogo-286730.png' },
  { slug: 'copa-airlines', url: 'https://images.seeklogo.com/logo-png/3/1/copa-airlines-logo-png_seeklogo-35231.png' },
  { slug: 'eva-air', url: 'https://images.seeklogo.com/logo-png/5/1/eva-air-logo-png_seeklogo-50384.png' },
  { slug: 'el-al', url: 'https://images.seeklogo.com/logo-png/4/1/el-al-israel-airlines-logo-png_seeklogo-46413.png' },
  { slug: 'etihad-airways', url: 'https://images.seeklogo.com/logo-png/61/1/etihad-airways-logo-png_seeklogo-612893.png' },
  { slug: 'iberia', url: 'https://images.seeklogo.com/logo-png/49/1/iberia-airlines-logo-png_seeklogo-498144.png' },
  { slug: 'icelandair', url: 'https://images.seeklogo.com/logo-png/53/1/icelandair-logo-png_seeklogo-537145.png' },
  { slug: 'japan-airlines', url: 'https://images.seeklogo.com/logo-png/31/1/japan-airlines-jal-logo-png_seeklogo-312431.png' },
  { slug: 'korean-air', url: 'https://images.seeklogo.com/logo-png/54/1/korean-air-logo-png_seeklogo-546252.png' },
  { slug: 'latam', url: 'https://images.seeklogo.com/logo-png/30/1/latam-logo-png_seeklogo-306538.png' },
  { slug: 'norwegian', url: 'https://images.seeklogo.com/logo-png/45/1/norwegian-air-shuttle-logo-png_seeklogo-458066.png' },
  { slug: 'qantas', url: 'https://images.seeklogo.com/logo-png/49/1/qantas-logo-png_seeklogo-492480.png' },
  { slug: 'qatar-airways', url: 'https://images.seeklogo.com/logo-png/11/1/qatar-airways-logo-png_seeklogo-114154.png' },
  { slug: 'sas', url: 'https://images.seeklogo.com/logo-png/49/1/sas-scandinavian-airlines-logo-png_seeklogo-492100.png' },
  { slug: 'singapore-airlines', url: 'https://images.seeklogo.com/logo-png/12/1/singapore-airlines-logo-png_seeklogo-126965.png' },
  { slug: 'tap-portugal', url: 'https://images.seeklogo.com/logo-png/37/1/tap-air-portugal-logo-png_seeklogo-370684.png' },
  { slug: 'turkish-airlines', url: 'https://images.seeklogo.com/logo-png/50/1/turkish-airlines-logo-png_seeklogo-502733.png' },
  { slug: 'virgin-atlantic', url: 'https://images.seeklogo.com/logo-png/27/1/virgin-atlantic-logo-png_seeklogo-278181.png' },
  { slug: 'westjet', url: 'https://images.seeklogo.com/logo-png/33/1/westjet-logo-png_seeklogo-333409.png' },
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': 'https://seeklogo.com/',
        'Accept': 'image/png,image/*'
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(outputPath);
        return downloadFile(response.headers.location, outputPath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(outputPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(outputPath);
        if (stats.size < 1000) {
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

async function main() {
  console.log('=== SeekLogo Airline Logo Downloader ===\n');
  console.log(`Downloading ${LOGOS.length} logos to ${OUTPUT_DIR}\n`);

  const results = { success: [], failed: [], skipped: [] };

  for (const logo of LOGOS) {
    const outputPath = path.join(OUTPUT_DIR, `${logo.slug}.png`);

    // Skip if already exists and valid
    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath);
      if (stats.size > 1000) {
        console.log(`[SKIP] ${logo.slug} - already exists (${Math.round(stats.size/1024)}KB)`);
        results.skipped.push(logo.slug);
        continue;
      }
    }

    try {
      console.log(`[DOWN] ${logo.slug}...`);
      const size = await downloadFile(logo.url, outputPath);
      console.log(`  OK - ${Math.round(size/1024)}KB`);
      results.success.push(logo.slug);
    } catch (err) {
      console.log(`  FAIL - ${err.message}`);
      results.failed.push(logo.slug);
    }

    await sleep(1500); // Rate limit
  }

  console.log('\n=== Summary ===');
  console.log(`Downloaded: ${results.success.length}`);
  console.log(`Skipped (already exist): ${results.skipped.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed logos:', results.failed.join(', '));
  }
}

main().catch(console.error);
