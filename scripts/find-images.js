#!/usr/bin/env node

/**
 * Search Wikimedia Commons for aircraft images and output download commands
 */

const https = require('https');

const AIRCRAFT = [
  { slug: 'boeing-737-800', search: 'Boeing 737-800' },
  { slug: 'boeing-737-max-8', search: 'Boeing 737 MAX 8' },
  { slug: 'airbus-a320neo', search: 'Airbus A320neo' },
  { slug: 'airbus-a321neo', search: 'Airbus A321neo' },
  { slug: 'boeing-787-9', search: 'Boeing 787-9' },
  { slug: 'boeing-777-300er', search: 'Boeing 777-300ER' },
  { slug: 'boeing-747-400', search: 'Boeing 747-400' },
  { slug: 'boeing-767-300er', search: 'Boeing 767-300ER' },
  { slug: 'boeing-757-200', search: 'Boeing 757-200' },
  { slug: 'airbus-a350-900', search: 'Airbus A350-900' },
  { slug: 'airbus-a380', search: 'Airbus A380' },
  { slug: 'airbus-a330-300', search: 'Airbus A330-300' },
  { slug: 'embraer-e190-e2', search: 'Embraer E190-E2' },
  { slug: 'bombardier-crj-900', search: 'CRJ-900' },
  { slug: 'boeing-737-900er', search: 'Boeing 737-900ER' },
  { slug: 'airbus-a319neo', search: 'Airbus A319neo' },
  { slug: 'boeing-787-8', search: 'Boeing 787-8' },
  { slug: 'airbus-a220-300', search: 'Airbus A220-300' },
  { slug: 'embraer-e175', search: 'Embraer E175' },
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
  // Search for files on Commons
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=5&format=json`;

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
  // Get direct image URL
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

  // Filter for jpg/png images, prefer ones with the aircraft name
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
  console.error('Finding aircraft images on Wikimedia Commons...\n');

  const results = [];

  for (const aircraft of AIRCRAFT) {
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
  console.log('# Auto-generated download script');
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
}

main().catch(console.error);
