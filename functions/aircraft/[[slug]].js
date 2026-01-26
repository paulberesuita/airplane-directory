// GET /aircraft and GET /aircraft/[slug] - Aircraft list and detail pages (SSR)
export async function onRequestGet(context) {
  const { env, request, params } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  const slug = params.slug?.[0];

  try {
    if (!slug) {
      return renderListPage(context, baseUrl);
    }
    return renderDetailPage(context, slug, baseUrl);
  } catch (error) {
    console.error('Error:', error);
    return new Response(renderErrorPage(baseUrl, 'Something went wrong'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

// === Utilities ===

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function kmToMiles(km) {
  return Math.round(km * 0.621371);
}

function kmhToMph(kmh) {
  return Math.round(kmh * 0.621371);
}

function metersToFeet(m) {
  return Math.round(m * 3.28084);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// === Shared Components ===

function renderHead({ title, description, url, image, jsonLd }) {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(url)}">

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Airplane Directory">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ''}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ''}

  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}

  <!-- Fonts & Tailwind -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
          },
          colors: {
            'primary': '#0EA5E9',
            'primary-hover': '#0284C7',
            'background': 'rgba(248, 250, 252, 0.85)',
            'card': 'rgba(255, 255, 255, 0.95)',
            'border': '#E2E8F0',
            'muted': '#64748B',
            'accent': '#F87171',
            'error': '#dc2626',
            'error-bg': '#fef2f2',
            'success': '#16a34a',
            'success-bg': '#f0fdf4',
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-image: url('/images/sky-bg.jpg');
      background-size: 100% 100vh;
      background-position: top center;
      background-attachment: fixed;
      background-repeat: no-repeat;
    }
  </style>`;
}

function renderHeader(baseUrl) {
  return `
  <header class="sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <div class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
          </svg>
        </div>
        <span class="text-xl font-bold font-display text-white drop-shadow">Airplane Directory</span>
      </a>
      <nav class="flex gap-6 text-sm">
        <a href="/airlines" class="text-white/70 hover:text-white transition-colors">Airlines</a>
        <a href="/aircraft" class="text-white font-medium">Aircraft</a>
      </nav>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <span class="font-display font-bold text-white text-lg drop-shadow">Airplane Directory</span>
        </div>
        <p class="text-white/60 text-sm text-center md:text-left drop-shadow">
          Know what you're flying on. US airline fleets and aircraft information.
        </p>
      </div>
    </div>
  </footer>`;
}

// === List Page ===

async function renderListPage(context, baseUrl) {
  const { env } = context;

  const { results: aircraft } = await env.DB.prepare(
    'SELECT * FROM aircraft ORDER BY CASE WHEN image_url IS NOT NULL AND image_url != \'\' THEN 0 ELSE 1 END, manufacturer, name'
  ).all();

  const manufacturers = [...new Set(aircraft.map(a => a.manufacturer))].sort();

  const filterButtons = manufacturers.map(m => `
    <button onclick="filterByManufacturer('${escapeHtml(m)}')"
            class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all backdrop-blur-sm"
            data-manufacturer="${escapeHtml(m)}">
      ${escapeHtml(m)}
    </button>
  `).join('');

  const cards = aircraft.map(a => {
    const rangeInMiles = kmToMiles(a.range_km);
    const speedInMph = kmhToMph(a.cruise_speed_kmh);
    const statusClass = a.status === 'In Production'
      ? 'bg-success-bg text-success'
      : a.status === 'In Service'
        ? 'bg-primary/10 text-primary'
        : 'bg-slate-100 text-muted';

    const imageHtml = a.image_url
      ? `<div class="aspect-[16/9] overflow-hidden bg-slate-100">
           <img src="${baseUrl}/images/aircraft/${escapeHtml(a.slug)}.jpg" alt="${escapeHtml(a.name)}"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
                onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-slate-100\\'><span class=\\'text-4xl opacity-30\\'>&#9992;</span></div>'">
         </div>`
      : `<div class="aspect-[16/9] bg-slate-100 flex items-center justify-center">
           <span class="text-4xl opacity-30">&#9992;</span>
         </div>`;

    const year = a.first_flight ? a.first_flight.split('-')[0] : '';

    return `
      <a href="/aircraft/${escapeHtml(a.slug)}"
         class="aircraft-card group block bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/30 transition-all duration-300 border border-white/30"
         data-manufacturer="${escapeHtml(a.manufacturer)}">
        ${imageHtml}
        <div class="p-4">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-semibold font-display text-white group-hover:text-white transition-colors">${escapeHtml(a.name)}</h3>
            <span class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white">${escapeHtml(a.status)}</span>
          </div>
          <p class="text-sm text-white font-medium mb-2">${escapeHtml(a.manufacturer)}</p>
          <p class="text-sm text-white/90 line-clamp-2 mb-4">${escapeHtml(a.description)}</p>
          <div class="flex items-center gap-1 pt-3 border-t border-white/20">
            <div class="flex-1 text-center py-1.5 rounded bg-white/10">
              <p class="text-xs text-white/90 mb-0.5">Pax</p>
              <p class="text-sm font-semibold text-white">${a.passengers}</p>
            </div>
            <div class="flex-1 text-center py-1.5 rounded bg-white/10">
              <p class="text-xs text-white/90 mb-0.5">Range</p>
              <p class="text-sm font-semibold text-white">${formatNumber(rangeInMiles)} mi</p>
            </div>
            <div class="flex-1 text-center py-1.5 rounded bg-white/10">
              <p class="text-xs text-white/90 mb-0.5">Speed</p>
              <p class="text-sm font-semibold text-white">${formatNumber(speedInMph)} mph</p>
            </div>
          </div>
        </div>
      </a>`;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Aircraft Directory | Airplane Directory',
    description: `Browse ${aircraft.length} commercial aircraft from ${manufacturers.join(', ')}. Every plane type flown by major airlines.`,
    url: `${baseUrl}/aircraft`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Commercial Aircraft Directory",
      "description": `Directory of ${aircraft.length} commercial aircraft`,
      "numberOfItems": aircraft.length,
      "itemListElement": aircraft.slice(0, 10).map((a, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "url": `${baseUrl}/aircraft/${a.slug}`
      }))
    }
  })}
  <style>
    .aircraft-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .aircraft-card:hover { transform: translateY(-4px); }
    .filter-btn.active { background: rgba(255,255,255,0.95); color: #0EA5E9; border-color: white; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
</head>
<body class="bg-background text-slate-800 min-h-screen font-sans">
  ${renderHeader(baseUrl)}

  <!-- Hero -->
  <div class="text-white">
    <div class="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h1 class="font-display text-3xl md:text-4xl font-semibold mb-3 text-white">Aircraft Directory</h1>
      <p class="text-white text-lg max-w-2xl">
        Every plane type flown by major airlines. Browse specs, history, and details.
      </p>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <!-- Manufacturer Filters -->
    <div class="mb-8">
      <p class="text-white/90 text-sm font-medium mb-3 uppercase tracking-wide">Filter by manufacturer</p>
      <div id="manufacturer-filters" class="flex flex-wrap gap-2">
        <button onclick="filterByManufacturer('')"
                class="filter-btn active px-4 py-2 rounded-lg text-sm font-medium bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 transition-all backdrop-blur-sm"
                data-manufacturer="">
          All Aircraft
        </button>
        ${filterButtons}
      </div>
    </div>

    <!-- Results Count -->
    <div class="flex items-center justify-between mb-6">
      <p id="results-count" class="text-white/80 font-medium">${aircraft.length} aircraft</p>
      <button id="clear-filters-btn" onclick="clearFilters()" class="hidden text-white hover:text-white/80 text-sm font-medium transition-colors">
        Clear filters
      </button>
    </div>

    <!-- Aircraft Grid -->
    <div id="aircraft-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${cards}
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="hidden text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
        <span class="text-4xl text-white/50">&#9992;</span>
      </div>
      <h3 class="font-display text-2xl font-semibold text-white mb-2">No aircraft found</h3>
      <p class="text-white/90 mb-6 max-w-md mx-auto">No aircraft match your current filter.</p>
      <button onclick="clearFilters()" class="inline-flex items-center gap-2 bg-white text-primary font-medium px-6 py-3 rounded-xl hover:bg-white/90 transition-all">
        Clear filter
      </button>
    </div>
  </main>

  ${renderFooter()}

  <script>
    const aircraftGrid = document.getElementById('aircraft-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsCount = document.getElementById('results-count');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let selectedManufacturer = '';

    function filterAircraft() {
      const cards = aircraftGrid.querySelectorAll('.aircraft-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const manufacturer = card.dataset.manufacturer;
        const matchesManufacturer = !selectedManufacturer || manufacturer === selectedManufacturer;

        if (matchesManufacturer) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      resultsCount.textContent = visibleCount === 1 ? '1 aircraft' : visibleCount + ' aircraft';
      emptyState.classList.toggle('hidden', visibleCount > 0);
      aircraftGrid.classList.toggle('hidden', visibleCount === 0);
      clearFiltersBtn.classList.toggle('hidden', !selectedManufacturer);
    }

    function filterByManufacturer(manufacturer) {
      selectedManufacturer = manufacturer;
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.manufacturer === manufacturer);
      });
      filterAircraft();
    }

    function clearFilters() {
      selectedManufacturer = '';
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.manufacturer === '');
      });
      filterAircraft();
    }
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

// === Detail Page ===

async function renderDetailPage(context, slug, baseUrl) {
  const { env } = context;

  const aircraft = await env.DB.prepare(
    'SELECT * FROM aircraft WHERE slug = ?'
  ).bind(slug).first();

  if (!aircraft) {
    return new Response(renderErrorPage(baseUrl, 'Aircraft not found'), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // Fetch history
  const { results: history } = await env.DB.prepare(
    'SELECT * FROM aircraft_history WHERE aircraft_slug = ? ORDER BY year ASC, id ASC'
  ).bind(slug).all();

  // Fetch related aircraft (same manufacturer)
  const { results: related } = await env.DB.prepare(
    'SELECT slug, name, image_url FROM aircraft WHERE manufacturer = ? AND slug != ? LIMIT 4'
  ).bind(aircraft.manufacturer, slug).all();

  // Fetch airlines that operate this aircraft
  const { results: airlines } = await env.DB.prepare(`
    SELECT a.slug, a.name, a.iata_code, f.count, f.notes
    FROM airline_fleet f
    JOIN airlines a ON f.airline_slug = a.slug
    WHERE f.aircraft_slug = ?
    ORDER BY f.count DESC
  `).bind(slug).all();

  const imageUrl = aircraft.image_url ? `${baseUrl}/images/aircraft/${aircraft.slug}.jpg` : null;
  const rangeInMiles = kmToMiles(aircraft.range_km);
  const speedInMph = kmhToMph(aircraft.cruise_speed_kmh);
  const year = aircraft.first_flight ? aircraft.first_flight.split('-')[0] : '';

  // Status badge - now unified since we use transparent background
  const statusLabel = aircraft.status;

  // Group history by type
  const grouped = { milestone: [], development: [], story: [], fact: [], record: [], incident: [], legacy: [] };
  history.forEach(h => {
    if (grouped[h.content_type]) grouped[h.content_type].push(h);
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: `${aircraft.name} — Specs & History | Airplane Directory`,
    description: aircraft.description?.substring(0, 155) || `Learn about the ${aircraft.name} from ${aircraft.manufacturer}. Specs, history, and fun facts.`,
    url: `${baseUrl}/aircraft/${slug}`,
    image: imageUrl,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": aircraft.name,
      "description": aircraft.description,
      "brand": { "@type": "Brand", "name": aircraft.manufacturer },
      "image": imageUrl,
      "category": "Commercial Aircraft",
      "additionalProperty": [
        { "@type": "PropertyValue", "name": "Passengers", "value": aircraft.passengers },
        { "@type": "PropertyValue", "name": "Range", "value": `${formatNumber(aircraft.range_km)} km` },
        { "@type": "PropertyValue", "name": "Cruise Speed", "value": `${formatNumber(aircraft.cruise_speed_kmh)} km/h` },
        { "@type": "PropertyValue", "name": "First Flight", "value": aircraft.first_flight }
      ]
    }
  })}
  <style>
    .stat-card:hover { transform: translateY(-2px); }
    .fun-fact-card {
      background: linear-gradient(135deg, #FEF2F2 0%, #FFF7ED 100%);
      border-left: 4px solid #F87171;
    }
  </style>
</head>
<body class="bg-background text-slate-800 min-h-screen font-sans">
  <!-- Hero Header -->
  <header class="relative">
    <div class="absolute top-1/2 right-8 -translate-y-1/2 opacity-20 hidden lg:block">
      <svg class="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      <a href="/aircraft" class="inline-flex items-center text-white/70 hover:text-white font-medium mb-8 text-sm transition-colors drop-shadow">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to All Aircraft
      </a>

      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8">
        <div>
          <p class="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2 drop-shadow">${escapeHtml(aircraft.manufacturer)}</p>
          <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight drop-shadow-lg">${escapeHtml(aircraft.name)}</h1>
        </div>
        <span class="shrink-0 inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white self-start sm:self-auto drop-shadow">
          ${escapeHtml(statusLabel)}
        </span>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Aircraft Liveries Gallery -->
    ${airlines.length > 0 ? `
    <div class="mb-10">
      <h2 class="font-display text-lg font-semibold text-white mb-4 drop-shadow">Airline Liveries</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        ${airlines.map(a => `
          <a href="/airlines/${escapeHtml(a.slug)}" class="group block relative rounded-xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all">
            <img src="${baseUrl}/images/airlines/${escapeHtml(a.slug)}/${escapeHtml(slug)}.jpg"
                 alt="${escapeHtml(a.name)} ${escapeHtml(aircraft.name)}"
                 class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                 loading="lazy"
                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'w-full h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center\\'><span class=\\'text-4xl opacity-30\\'>&#9992;</span></div><div class=\\'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3\\'><span class=\\'text-white font-semibold text-sm\\'>${escapeHtml(a.name)}</span></div>';">
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <div class="flex items-center justify-between">
                <span class="text-white font-semibold text-sm">${escapeHtml(a.name)}</span>
                <span class="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded">${a.count}</span>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
    ` : imageUrl ? `
    <div class="mb-10">
      <div class="relative rounded-2xl overflow-hidden shadow-lg border border-border">
        <img src="${imageUrl}" alt="${escapeHtml(aircraft.name)}" class="w-full h-64 sm:h-80 md:h-96 object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
      </div>
    </div>
    ` : `
    <div class="mb-10">
      <div class="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
        <span class="text-6xl opacity-30">&#9992;</span>
      </div>
    </div>
    `}

    <!-- Description -->
    <div class="mb-10">
      <p class="text-white/80 text-lg leading-relaxed max-w-3xl drop-shadow">${escapeHtml(aircraft.description)}</p>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
      <div class="stat-card bg-card rounded-2xl shadow-sm border border-border p-5 text-center transition-all">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <p class="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Passengers</p>
        <p class="font-display text-2xl font-bold text-slate-800">${aircraft.passengers}</p>
      </div>
      <div class="stat-card bg-card rounded-2xl shadow-sm border border-border p-5 text-center transition-all">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-xl mb-3">
          <svg class="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
        <p class="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Range</p>
        <p class="font-display text-2xl font-bold text-slate-800">${formatNumber(rangeInMiles)} mi</p>
      </div>
      <div class="stat-card bg-card rounded-2xl shadow-sm border border-border p-5 text-center transition-all">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl mb-3">
          <svg class="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <p class="text-muted text-xs font-semibold uppercase tracking-wide mb-1">Cruise Speed</p>
        <p class="font-display text-2xl font-bold text-slate-800">${formatNumber(speedInMph)} mph</p>
      </div>
      <div class="stat-card bg-card rounded-2xl shadow-sm border border-border p-5 text-center transition-all">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-xl mb-3">
          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <p class="text-muted text-xs font-semibold uppercase tracking-wide mb-1">First Flight</p>
        <p class="font-display text-2xl font-bold text-slate-800">${year}</p>
      </div>
    </div>

    ${aircraft.fun_fact ? `
    <!-- Fun Fact Card -->
    <div class="fun-fact-card rounded-2xl p-6 mb-10">
      <div class="flex items-start gap-4">
        <div class="shrink-0 w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <div>
          <h3 class="font-display text-lg font-bold text-slate-800 mb-2">Did You Know?</h3>
          <p class="text-muted leading-relaxed">${escapeHtml(aircraft.fun_fact)}</p>
        </div>
      </div>
    </div>
    ` : ''}

    ${history.length > 0 ? renderHistorySection(grouped) : ''}

    <!-- Technical Specifications -->
    <div class="mb-10">
      <h2 class="font-display text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
        </span>
        Technical Specifications
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-card rounded-2xl shadow-sm border border-border p-6 border-t-4 border-t-primary">
          <h3 class="font-display text-lg font-semibold text-slate-800 mb-4">Dimensions</h3>
          <dl class="space-y-3">
            <div class="flex justify-between py-2 border-b border-border">
              <dt class="text-muted">Length</dt>
              <dd class="font-semibold">${aircraft.length_m}m (${metersToFeet(aircraft.length_m)} ft)</dd>
            </div>
            <div class="flex justify-between py-2">
              <dt class="text-muted">Wingspan</dt>
              <dd class="font-semibold">${aircraft.wingspan_m}m (${metersToFeet(aircraft.wingspan_m)} ft)</dd>
            </div>
          </dl>
        </div>

        <div class="bg-card rounded-2xl shadow-sm border border-border p-6 border-t-4 border-t-success">
          <h3 class="font-display text-lg font-semibold text-slate-800 mb-4">Performance</h3>
          <dl class="space-y-3">
            <div class="flex justify-between py-2 border-b border-border">
              <dt class="text-muted">Range</dt>
              <dd class="font-semibold">${formatNumber(aircraft.range_km)} km (${formatNumber(rangeInMiles)} mi)</dd>
            </div>
            <div class="flex justify-between py-2">
              <dt class="text-muted">Cruise Speed</dt>
              <dd class="font-semibold">${formatNumber(aircraft.cruise_speed_kmh)} km/h (${formatNumber(speedInMph)} mph)</dd>
            </div>
          </dl>
        </div>

        <div class="bg-card rounded-2xl shadow-sm border border-border p-6 border-t-4 border-t-violet-500">
          <h3 class="font-display text-lg font-semibold text-slate-800 mb-4">Capacity</h3>
          <dl class="space-y-3">
            <div class="flex justify-between py-2 border-b border-border">
              <dt class="text-muted">Passengers</dt>
              <dd class="font-semibold">${aircraft.passengers}</dd>
            </div>
            <div class="flex justify-between py-2">
              <dt class="text-muted">Engines</dt>
              <dd class="font-semibold">${aircraft.engines}</dd>
            </div>
          </dl>
        </div>

        <div class="bg-card rounded-2xl shadow-sm border border-border p-6 border-t-4 border-t-amber-500">
          <h3 class="font-display text-lg font-semibold text-slate-800 mb-4">History</h3>
          <dl class="space-y-3">
            <div class="flex justify-between py-2 border-b border-border">
              <dt class="text-muted">First Flight</dt>
              <dd class="font-semibold">${formatDate(aircraft.first_flight)}</dd>
            </div>
            <div class="flex justify-between py-2">
              <dt class="text-muted">Status</dt>
              <dd class="font-semibold">${escapeHtml(aircraft.status)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    ${airlines.length > 0 ? `
    <!-- Airlines Operating This Aircraft -->
    <div class="mb-10">
      <h2 class="font-display text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </span>
        US Airlines Operating This Aircraft
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${airlines.map(a => `
          <a href="/airlines/${escapeHtml(a.slug)}" class="group block bg-card rounded-xl border border-border p-4 hover:shadow-lg hover:border-primary/30 transition-all">
            <div class="flex items-center gap-3 mb-2">
              <span class="bg-primary/10 text-primary text-sm font-bold px-2 py-1 rounded">${escapeHtml(a.iata_code)}</span>
              <span class="bg-slate-100 text-slate-700 text-sm font-semibold px-2 py-1 rounded">${a.count}</span>
            </div>
            <h3 class="font-semibold text-slate-800 group-hover:text-primary transition-colors">${escapeHtml(a.name)}</h3>
            ${a.notes ? `<p class="text-xs text-muted mt-1">${escapeHtml(a.notes)}</p>` : ''}
          </a>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${related.length > 0 ? `
    <!-- Related Aircraft -->
    <div class="mb-10">
      <h2 class="font-display text-2xl font-bold text-slate-800 mb-6">More from ${escapeHtml(aircraft.manufacturer)}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${related.map(r => `
          <a href="/aircraft/${escapeHtml(r.slug)}" class="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all">
            ${r.image_url
              ? `<div class="aspect-[4/3] overflow-hidden">
                   <img src="${baseUrl}/images/aircraft/${escapeHtml(r.slug)}.jpg" alt="${escapeHtml(r.name)}"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                 </div>`
              : `<div class="aspect-[4/3] bg-slate-100 flex items-center justify-center">
                   <span class="text-2xl opacity-30">&#9992;</span>
                 </div>`
            }
            <div class="p-3">
              <p class="font-medium text-sm group-hover:text-primary transition-colors">${escapeHtml(r.name)}</p>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- Source Attribution -->
    ${aircraft.source_url ? `
    <div class="text-center py-6 border-t border-border">
      <p class="text-muted text-sm">
        Data sourced from
        <a href="${escapeHtml(aircraft.source_url)}" target="_blank" rel="noopener" class="text-primary hover:text-primary-hover font-medium underline underline-offset-2 transition-colors">
          ${escapeHtml(new URL(aircraft.source_url).hostname)}
        </a>
      </p>
    </div>
    ` : ''}

    <!-- Back to Directory CTA -->
    <div class="text-center py-8">
      <a href="/" class="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Explore More Aircraft
      </a>
    </div>
  </main>

  ${renderFooter()}
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
}

function renderHistorySection(grouped) {
  let html = `
    <div class="mb-10">
      <h2 class="font-display text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        <span class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </span>
        History & Timeline
      </h2>`;

  // Milestones timeline
  if (grouped.milestone.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="font-display text-lg font-semibold text-slate-700 mb-4">Key Milestones</h3>
        <div class="relative border-l-2 border-amber-200 pl-6 ml-3 space-y-6">
          ${grouped.milestone.map(m => `
            <div class="relative">
              <div class="absolute -left-9 w-4 h-4 bg-amber-400 rounded-full border-2 border-white"></div>
              <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
                <span class="text-amber-600 font-semibold text-sm">${m.year || ''}</span>
                <h4 class="font-display font-semibold text-slate-800 mt-1">${escapeHtml(m.title)}</h4>
                <p class="text-muted text-sm mt-2">${escapeHtml(m.content)}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // Development stories
  if (grouped.development.length > 0 || grouped.story.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="font-display text-lg font-semibold text-slate-700 mb-4">Development Story</h3>
        <div class="space-y-4">
          ${grouped.development.map(d => `
            <div class="bg-card rounded-xl p-5 shadow-sm border border-border">
              <h4 class="font-display font-semibold text-slate-800 mb-2">${escapeHtml(d.title)}</h4>
              <p class="text-muted leading-relaxed">${escapeHtml(d.content)}</p>
            </div>
          `).join('')}
          ${grouped.story.map(s => `
            <div class="bg-gradient-to-br from-primary/5 to-blue-50 rounded-xl p-5 border border-primary/10">
              <h4 class="font-display font-semibold text-slate-800 mb-2">${escapeHtml(s.title)}</h4>
              <p class="text-muted leading-relaxed">${escapeHtml(s.content)}</p>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // Facts
  if (grouped.fact.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="font-display text-lg font-semibold text-slate-700 mb-4">Interesting Facts</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${grouped.fact.map(f => `
            <div class="bg-card rounded-xl p-4 shadow-sm border border-border">
              <h4 class="font-semibold text-slate-800 text-sm">${escapeHtml(f.title)}</h4>
              <p class="text-muted text-sm mt-1">${escapeHtml(f.content)}</p>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // Records
  if (grouped.record.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="font-display text-lg font-semibold text-slate-700 mb-4">Records & Achievements</h3>
        <div class="space-y-4">
          ${grouped.record.map(r => `
            <div class="bg-gradient-to-br from-success/5 to-green-50 rounded-xl p-5 border border-success/10">
              <h4 class="font-display font-semibold text-slate-800">${escapeHtml(r.title)}</h4>
              <p class="text-muted mt-1">${escapeHtml(r.content)}</p>
              ${r.year ? `<span class="inline-block mt-2 text-xs text-success font-medium">${r.year}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // Legacy
  if (grouped.legacy.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="font-display text-lg font-semibold text-slate-700 mb-4">Legacy & Impact</h3>
        <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
          ${grouped.legacy.map(l => `
            <div class="mb-4 last:mb-0">
              <h4 class="font-display font-semibold text-amber-800 mb-2">${escapeHtml(l.title)}</h4>
              <p class="text-amber-900/80 leading-relaxed">${escapeHtml(l.content)}</p>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  html += `</div>`;
  return html;
}

function renderErrorPage(baseUrl, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Not Found | Airplane Directory',
    description: message,
    url: baseUrl
  })}
</head>
<body class="bg-background text-slate-800 min-h-screen font-sans">
  ${renderHeader(baseUrl)}

  <div class="max-w-5xl mx-auto px-4 py-20 text-center">
    <div class="inline-flex items-center justify-center w-24 h-24 bg-error-bg rounded-full mb-6">
      <span class="text-4xl">&#9992;</span>
    </div>
    <h1 class="font-display text-3xl font-bold text-slate-800 mb-3">${escapeHtml(message)}</h1>
    <p class="text-muted text-lg mb-8 max-w-md mx-auto">The aircraft you are looking for may have been removed or the link is incorrect.</p>
    <a href="/" class="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-hover transition-all">
      Back to Directory
    </a>
  </div>

  ${renderFooter()}
</body>
</html>`;
}
