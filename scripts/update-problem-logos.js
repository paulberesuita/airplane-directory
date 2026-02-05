#!/usr/bin/env node
/**
 * Update problematic airline logos with better SeekLogo versions
 * These logos were either too small (200xNN) or had internal padding (600x600)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../images/logos');

// Logos that need better versions (wide horizontal or padded)
const LOGOS = [
  { slug: 'american-airlines', url: 'https://images.seeklogo.com/logo-png/44/1/american-airlines-logo-png_seeklogo-445363.png' },
  { slug: 'delta-air-lines', url: 'https://images.seeklogo.com/logo-png/47/1/delta-airlines-logo-png_seeklogo-474183.png' },
  { slug: 'united-airlines', url: 'https://images.seeklogo.com/logo-png/43/1/united-airlines-logo-png_seeklogo-436581.png' },
  { slug: 'southwest-airlines', url: 'https://images.seeklogo.com/logo-png/25/1/southwest-airlines-logo-png_seeklogo-255783.png' },
  { slug: 'jetblue-airways', url: 'https://images.seeklogo.com/logo-png/40/1/jetblue-logo-png_seeklogo-407384.png' },
  { slug: 'alaska-airlines', url: 'https://images.seeklogo.com/logo-png/49/1/alaska-airlines-logo-png_seeklogo-491751.png' },
  { slug: 'frontier-airlines', url: 'https://images.seeklogo.com/logo-png/32/1/frontier-airlines-logo-png_seeklogo-323681.png' },
  { slug: 'spirit-airlines', url: 'https://images.seeklogo.com/logo-png/29/1/spirit-airlines-logo-png_seeklogo-291990.png' },
  { slug: 'british-airways', url: 'https://images.seeklogo.com/logo-png/44/1/british-airways-logo-png_seeklogo-442863.png' },
  { slug: 'lufthansa', url: 'https://images.seeklogo.com/logo-png/33/1/lufthansa-logo-png_seeklogo-334372.png' },
  { slug: 'air-france', url: 'https://images.seeklogo.com/logo-png/49/1/air-france-logo-png_seeklogo-498361.png' },
  { slug: 'finnair', url: 'https://images.seeklogo.com/logo-png/25/1/finnair-logo-png_seeklogo-253959.png' },
  { slug: 'swiss', url: 'https://seeklogo.com/images/S/swiss-airlines-logo-2C60BFE332-seeklogo.com.png' },
  { slug: 'klm', url: 'https://images.seeklogo.com/logo-png/31/1/klm-royal-dutch-airlines-logo-png_seeklogo-313115.png' },
  { slug: 'emirates', url: 'https://images.seeklogo.com/logo-png/40/1/emirates-logo-png_seeklogo-407369.png' },
  { slug: 'copa-airlines', url: 'https://images.seeklogo.com/logo-png/3/1/copa-airlines-logo-png_seeklogo-35231.png' },
  { slug: 'iberia', url: 'https://images.seeklogo.com/logo-png/49/1/iberia-airlines-logo-png_seeklogo-498144.png' },
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
  console.log('=== Updating Problem Logos ===\n');
  console.log(`Replacing ${LOGOS.length} logos in ${OUTPUT_DIR}\n`);

  const results = { success: [], failed: [] };

  for (const logo of LOGOS) {
    const outputPath = path.join(OUTPUT_DIR, `${logo.slug}.png`);

    // Back up existing file
    if (fs.existsSync(outputPath)) {
      const backupPath = outputPath + '.bak';
      fs.copyFileSync(outputPath, backupPath);
    }

    try {
      console.log(`[DOWN] ${logo.slug}...`);
      const size = await downloadFile(logo.url, outputPath);
      console.log(`  OK - ${Math.round(size/1024)}KB`);
      results.success.push(logo.slug);

      // Remove backup on success
      const backupPath = outputPath + '.bak';
      if (fs.existsSync(backupPath)) {
        fs.unlinkSync(backupPath);
      }
    } catch (err) {
      console.log(`  FAIL - ${err.message}`);
      results.failed.push(logo.slug);

      // Restore from backup on failure
      const backupPath = outputPath + '.bak';
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, outputPath);
        fs.unlinkSync(backupPath);
        console.log(`  Restored from backup`);
      }
    }

    await sleep(1500); // Rate limit
  }

  console.log('\n=== Summary ===');
  console.log(`Updated: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed logos:', results.failed.join(', '));
  }
}

main().catch(console.error);
