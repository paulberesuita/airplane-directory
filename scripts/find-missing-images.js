#!/usr/bin/env node

/**
 * Search Wikimedia Commons for missing aircraft images
 */

const https = require('https');

const MISSING_AIRCRAFT = [
  { slug: 'airbus-a220-100', search: 'Airbus A220-100' },
  { slug: 'airbus-a318', search: 'Airbus A318' },
  { slug: 'airbus-a319', search: 'Airbus A319' },
  { slug: 'airbus-a320', search: 'Airbus A320' },
  { slug: 'airbus-a321', search: 'Airbus A321' },
  { slug: 'airbus-a330-200', search: 'Airbus A330-200' },
  { slug: 'airbus-a330-800neo', search: 'Airbus A330-800neo' },
  { slug: 'airbus-a330-900neo', search: 'Airbus A330-900neo' },
  { slug: 'airbus-a340-300', search: 'Airbus A340-300' },
  { slug: 'airbus-a340-500', search: 'Airbus A340-500' },
  { slug: 'airbus-a340-600', search: 'Airbus A340-600' },
  { slug: 'airbus-a350-1000', search: 'Airbus A350-1000' },
  { slug: 'boeing-737-max-10', search: 'Boeing 737 MAX 10' },
  { slug: 'boeing-737-max-7', search: 'Boeing 737 MAX 7' },
  { slug: 'boeing-737-max-9', search: 'Boeing 737 MAX 9' },
  { slug: 'boeing-737-700', search: 'Boeing 737-700' },
  { slug: 'boeing-747-8i', search: 'Boeing 747-8 Intercontinental' },
  { slug: 'boeing-757-300', search: 'Boeing 757-300' },
  { slug: 'boeing-767-400er', search: 'Boeing 767-400ER' },
  { slug: 'boeing-777-200er', search: 'Boeing 777-200ER' },
  { slug: 'boeing-777-200lr', search: 'Boeing 777-200LR' },
  { slug: 'boeing-777-8', search: 'Boeing 777-8' },
  { slug: 'boeing-777-9', search: 'Boeing 777-9' },
  { slug: 'boeing-787-10', search: 'Boeing 787-10' },
];

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'AircraftDirectory/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString()));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function searchImages(query) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=10&format=json`;

  try {
    const response = await httpsGet(searchUrl);
    const data = JSON.parse(response);

    if (data.query && data.query.search) {
      return data.query.search.map(r => r.title.replace('File:', ''));
    }
  } catch (e) {
    console.error(`Search error for ${query}:`, e.message);
  }
  return [];
}

async function getImageUrl(filename) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&format=json`;

  try {
    const response = await httpsGet(apiUrl);
    const data = JSON.parse(response);
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];

    if (pages[pageId].imageinfo && pages[pageId].imageinfo[0]) {
      return pages[pageId].imageinfo[0].url;
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

async function findBestImage(aircraft) {
  console.error(`\nSearching for: ${aircraft.search}`);

  const files = await searchImages(aircraft.search);
  console.error(`  Found ${files.length} results`);

  // Filter for jpg/png images
  const jpgFiles = files.filter(f => f.match(/\.(jpg|jpeg|png)$/i));

  for (const file of jpgFiles) {
    console.error(`  Trying: ${file}`);
    const url = await getImageUrl(file);
    if (url) {
      return { filename: file, url };
    }
  }

  return null;
}

async function main() {
  console.error('Finding missing aircraft images on Wikimedia Commons...\n');

  const results = [];

  for (const aircraft of MISSING_AIRCRAFT) {
    const image = await findBestImage(aircraft);
    if (image) {
      results.push({ slug: aircraft.slug, ...image });
      console.error(`  URL: ${image.url}`);
    } else {
      console.error(`  NO IMAGE FOUND`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  // Output shell script
  console.log('#!/bin/bash');
  console.log('# Auto-generated download script for missing aircraft images');
  console.log('cd "$(dirname "$0")/../temp"');
  console.log('');

  for (const r of results) {
    const ext = r.filename.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
    console.log(`# ${r.filename}`);
    console.log(`curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \\`);
    console.log(`  -H "Referer: https://commons.wikimedia.org/" \\`);
    console.log(`  -o "${r.slug}.${ext}" \\`);
    console.log(`  "${r.url}"`);
    console.log('');
  }

  console.error(`\n\nFound images for ${results.length}/${MISSING_AIRCRAFT.length} aircraft`);
}

main().catch(console.error);
