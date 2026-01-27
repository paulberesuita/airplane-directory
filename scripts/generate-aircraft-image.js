#!/usr/bin/env node
/**
 * Generate stylized aircraft images using Nano Banana Pro (Gemini 3 Pro Image)
 *
 * Usage:
 *   GOOGLE_AI_API_KEY=your-key node scripts/generate-aircraft-image.js boeing-737-800
 *
 * Or set GOOGLE_AI_API_KEY in your environment
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '..', 'images', 'aircraft-styled');

// Aircraft to generate (can override with CLI arg)
const aircraftSlug = process.argv[2];
const forceGenerate = process.argv.includes('--force');

if (!GOOGLE_AI_API_KEY) {
  console.error('Error: GOOGLE_AI_API_KEY environment variable not set');
  console.error('Get your free key at: https://ai.google.dev/');
  process.exit(1);
}

if (!aircraftSlug) {
  console.error('Usage: node scripts/generate-aircraft-image.js <aircraft-slug> [--force]');
  console.error('Example: node scripts/generate-aircraft-image.js boeing-737-800');
  console.error('         node scripts/generate-aircraft-image.js boeing-737-800 --force');
  process.exit(1);
}

// Map slugs to proper names for the prompt
const aircraftNames = {
  'boeing-737-700': 'Boeing 737-700',
  'boeing-737-800': 'Boeing 737-800',
  'boeing-737-900er': 'Boeing 737-900ER',
  'boeing-737-max-7': 'Boeing 737 MAX 7',
  'boeing-737-max-8': 'Boeing 737 MAX 8',
  'boeing-737-max-9': 'Boeing 737 MAX 9',
  'boeing-737-max-10': 'Boeing 737 MAX 10',
  'boeing-757-200': 'Boeing 757-200',
  'boeing-757-300': 'Boeing 757-300',
  'boeing-767-300er': 'Boeing 767-300ER',
  'boeing-767-400er': 'Boeing 767-400ER',
  'boeing-777-200er': 'Boeing 777-200ER',
  'boeing-777-200lr': 'Boeing 777-200LR',
  'boeing-777-300er': 'Boeing 777-300ER',
  'boeing-777-8': 'Boeing 777-8',
  'boeing-777-9': 'Boeing 777-9',
  'boeing-787-8': 'Boeing 787-8 Dreamliner',
  'boeing-787-9': 'Boeing 787-9 Dreamliner',
  'boeing-787-10': 'Boeing 787-10 Dreamliner',
  'boeing-747-400': 'Boeing 747-400',
  'boeing-747-8i': 'Boeing 747-8 Intercontinental',
  'boeing-717': 'Boeing 717',
  'airbus-a220-100': 'Airbus A220-100',
  'airbus-a220-300': 'Airbus A220-300',
  'airbus-a318': 'Airbus A318',
  'airbus-a319': 'Airbus A319',
  'airbus-a319neo': 'Airbus A319neo',
  'airbus-a320': 'Airbus A320',
  'airbus-a320neo': 'Airbus A320neo',
  'airbus-a321': 'Airbus A321',
  'airbus-a321neo': 'Airbus A321neo',
  'airbus-a330-200': 'Airbus A330-200',
  'airbus-a330-300': 'Airbus A330-300',
  'airbus-a330-800neo': 'Airbus A330-800neo',
  'airbus-a330-900neo': 'Airbus A330-900neo',
  'airbus-a340-300': 'Airbus A340-300',
  'airbus-a340-500': 'Airbus A340-500',
  'airbus-a340-600': 'Airbus A340-600',
  'airbus-a350-900': 'Airbus A350-900',
  'airbus-a350-1000': 'Airbus A350-1000',
  'airbus-a380': 'Airbus A380',
  'embraer-e175': 'Embraer E175',
  'embraer-e190': 'Embraer E190',
  'embraer-e190-e2': 'Embraer E190-E2',
  'bombardier-crj-900': 'Bombardier CRJ-900',
};

const aircraftName = aircraftNames[aircraftSlug] || aircraftSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Check if aircraft is fully visible in the image
async function checkImageQuality(imageData, mimeType) {
  console.log('Checking if aircraft is fully visible...');

  const prompt = `Look at this aircraft photo carefully. Check if the NOSE (front) and TAIL (rear) of the airplane are both fully visible in the frame.

Answer with exactly one word:
- FULL - if both the nose AND tail are completely visible (not cut off at edges)
- CUTOFF - if the nose OR tail is cut off/cropped at the image edges`;

  const requestBody = {
    contents: [{
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageData
          }
        },
        { text: prompt }
      ]
    }],
    generationConfig: {
      temperature: 0,
    }
  };

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            console.error('Quality check error:', response.error.message);
            resolve('UNKNOWN');
            return;
          }
          const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const result = text.toUpperCase().includes('CUTOFF') ? 'CUTOFF' :
                        text.toUpperCase().includes('FULL') ? 'FULL' : 'UNKNOWN';
          resolve(result);
        } catch (e) {
          console.error('Quality check parse error:', e.message);
          resolve('UNKNOWN');
        }
      });
    });
    req.on('error', (e) => {
      console.error('Quality check request error:', e.message);
      resolve('UNKNOWN');
    });
    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

async function generateImage() {
  console.log(`\nStylizing image for: ${aircraftName}`);
  console.log('Using Nano Banana Pro (gemini-3-pro-image-preview)...\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Find existing image
  const inputDir = path.join(__dirname, '..', 'images', 'aircraft');
  const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  let inputPath = null;
  let imageData = null;
  let mimeType = null;

  for (const ext of possibleExtensions) {
    const testPath = path.join(inputDir, `${aircraftSlug}.${ext}`);
    if (fs.existsSync(testPath)) {
      inputPath = testPath;
      imageData = fs.readFileSync(testPath).toString('base64');
      mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
      break;
    }
  }

  if (!inputPath) {
    console.error(`No source image found for ${aircraftSlug}`);
    console.error(`Looked in: ${inputDir}`);
    process.exit(1);
  }

  console.log(`Source image: ${inputPath}`);

  // Pre-check: Is the aircraft fully visible?
  if (forceGenerate) {
    console.log('--force flag set, skipping quality check...\n');
  } else {
    const quality = await checkImageQuality(imageData, mimeType);

    if (quality === 'CUTOFF') {
      console.error('\n✗ SKIPPED: Aircraft is cut off in the source image.');
      console.error('  Find a better source image where the full aircraft is visible.');
      console.error('  Or use --force to generate anyway.');
      process.exit(1);
    } else if (quality === 'FULL') {
      console.log('✓ Aircraft is fully visible. Proceeding with stylization...\n');
    } else {
      console.log('? Could not determine image quality. Proceeding anyway...\n');
    }
  }

  const prompt = `Transform this airplane photo into a flat vector illustration. Render the aircraft in a warm palette of golden, beige, and tan tones with blue accents, against a solid uniform sky background using exactly this blue color: #2563EB. Minimalist style, clean shapes, limited color gradient, and no realistic shading. No black outlines or strokes. Keep the airline logos and text visible on the aircraft.`;

  const requestBody = {
    contents: [{
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageData
          }
        },
        { text: prompt }
      ]
    }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    }
  };

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GOOGLE_AI_API_KEY}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.error) {
            console.error('API Error:', response.error.message);
            reject(new Error(response.error.message));
            return;
          }

          if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            const parts = response.candidates[0].content.parts;

            for (const part of parts) {
              if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                const imageData = part.inlineData.data;
                const extension = part.inlineData.mimeType === 'image/png' ? 'png' : 'jpg';
                const outputPath = path.join(OUTPUT_DIR, `${aircraftSlug}.${extension}`);

                fs.writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
                console.log(`✓ Image saved to: ${outputPath}`);
                console.log(`\nTo view: open "${outputPath}"`);
                console.log(`\nIf you like it, upload with:`);
                console.log(`  npx wrangler r2 object put "airplane-directory-assets/aircraft/${aircraftSlug}.${extension}" --file="${outputPath}" --remote`);
                resolve(outputPath);
                return;
              }

              if (part.text) {
                console.log('Model response:', part.text);
              }
            }

            console.error('No image in response');
            reject(new Error('No image generated'));
          } else {
            console.error('Unexpected response format:', JSON.stringify(response, null, 2));
            reject(new Error('Unexpected response format'));
          }
        } catch (e) {
          console.error('Parse error:', e.message);
          console.error('Raw response:', data.substring(0, 500));
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error('Request error:', e.message);
      reject(e);
    });

    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

generateImage().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
