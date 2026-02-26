// GET / - Homepage with airlines and aircraft grid (SSR)
import { escapeHtml, formatNumber, kmToMiles, kmhToMph } from './_shared/utils.js';
import { airlineBrandColors } from './_shared/constants.js';
import { renderHead, renderHeader, renderFooter, renderPage, htmlResponse, PROD_BASE } from './_shared.js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Fetch all airlines ordered by fleet size
    const { results: airlines } = await env.DB.prepare(`
      SELECT a.slug, a.name, a.iata_code, a.fleet_size,
             COUNT(DISTINCT af.aircraft_slug) as aircraft_types
      FROM airlines a
      LEFT JOIN airline_fleet af ON a.slug = af.airline_slug
      GROUP BY a.slug
      ORDER BY a.fleet_size DESC
    `).all();

    // Fetch all aircraft that are in active airline fleets
    const { results: aircraft } = await env.DB.prepare(`
      SELECT DISTINCT ac.* FROM aircraft ac
      INNER JOIN airline_fleet af ON ac.slug = af.aircraft_slug
      ORDER BY CASE WHEN ac.image_url IS NOT NULL AND ac.image_url != '' THEN 0 ELSE 1 END, ac.manufacturer, ac.name
    `).all();

    // Build aircraft → airlines lookup
    const { results: fleetRows } = await env.DB.prepare(
      'SELECT aircraft_slug, airline_slug FROM airline_fleet'
    ).all();
    const aircraftAirlines = {};
    for (const row of fleetRows) {
      if (!aircraftAirlines[row.aircraft_slug]) aircraftAirlines[row.aircraft_slug] = [];
      aircraftAirlines[row.aircraft_slug].push(row.airline_slug);
    }

    const html = renderHomepage({ airlines, aircraft, aircraftAirlines, baseUrl });
    return htmlResponse(html);
  } catch (error) {
    console.error('Error loading homepage:', error);
    return htmlResponse(renderErrorPage(baseUrl), 500);
  }
}

function renderAircraftCard(aircraft, baseUrl, airlineSlugs) {
  const rangeInMiles = kmToMiles(aircraft.range_km);
  const speedInMph = kmhToMph(aircraft.cruise_speed_kmh);
  const year = aircraft.first_flight ? aircraft.first_flight.split('-')[0] : '';

  const imageHtml = aircraft.image_url
    ? `<img src="${baseUrl}/images/aircraft/${escapeHtml(aircraft.slug)}.webp?v=5"
           alt="${escapeHtml(aircraft.name)}"
           class="w-full h-full object-cover"
           loading="lazy"
           onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center\\'><span class=\\'text-5xl\\'>&#9992;</span></div>'">`
    : `<div class="w-full h-full flex items-center justify-center"><span class="text-5xl">&#9992;</span></div>`;

  // Stamp collection style aircraft card with pixel-clip frame
  return `
    <div class="aircraft-card pixel-clip p-1 transition-transform duration-300 hover:scale-[1.02]"
         style="background-color: #8b7355;"
         data-manufacturer="${escapeHtml(aircraft.manufacturer)}"
         data-airlines="${escapeHtml(airlineSlugs)}">
      <a href="/aircraft/${escapeHtml(aircraft.slug)}"
         class="group block pixel-clip p-3"
         style="background-color: #ffffff;">

        <!-- Image -->
        <div class="mb-3">
          <div class="aspect-[16/10] overflow-hidden" style="background-color: #f0f0f0;">
            ${imageHtml}
          </div>
        </div>

        <!-- Aircraft name and manufacturer -->
        <div class="text-center mb-3">
          <h3 class="font-display text-lg font-bold mb-1" style="color: #4a3f2f;">
            ${escapeHtml(aircraft.name)}
          </h3>
          <p class="text-sm italic" style="color: #7a6b55; font-family: Georgia, serif;">
            ${escapeHtml(aircraft.manufacturer)} · ${year}
          </p>
        </div>

        <!-- Specs in vintage style -->
        <div class="flex justify-center gap-4 text-center pt-3" style="border-top: 1px solid #c9b896;">
          <div>
            <p class="text-xs uppercase tracking-wider mb-0.5" style="color: #9a8b75;">Passengers</p>
            <p class="font-mono font-bold" style="color: #4a3f2f;">${aircraft.passengers}</p>
          </div>
          <div style="border-left: 1px solid #c9b896; padding-left: 1rem;">
            <p class="text-xs uppercase tracking-wider mb-0.5" style="color: #9a8b75;">Range</p>
            <p class="font-mono font-bold" style="color: #4a3f2f;">${formatNumber(rangeInMiles)} mi</p>
          </div>
          <div style="border-left: 1px solid #c9b896; padding-left: 1rem;">
            <p class="text-xs uppercase tracking-wider mb-0.5" style="color: #9a8b75;">Speed</p>
            <p class="font-mono font-bold" style="color: #4a3f2f;">${formatNumber(speedInMph)} mph</p>
          </div>
        </div>
      </a>
    </div>`;
}

function renderHomepage({ airlines, aircraft, aircraftAirlines, baseUrl }) {
  const allCards = aircraft.map(a => {
    const slugs = (aircraftAirlines[a.slug] || []).join(',');
    return renderAircraftCard(a, baseUrl, slugs);
  }).join('');

  const totalAircraft = airlines.reduce((sum, a) => sum + (a.fleet_size || 0), 0);

  // Airline filter pills with logos
  const airlinePills = airlines.map(al => {
    return `
    <button onclick="filterByAirline('${escapeHtml(al.slug)}')"
            class="airline-pill flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap"
            style="border: 1px solid rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); border-radius: 9999px;"
            data-airline="${escapeHtml(al.slug)}">
      <img src="${baseUrl}/images/airline-icons/${escapeHtml(al.slug)}.png?v=5" alt="" class="w-4 h-4 object-contain"
           onerror="this.style.display='none';">
      <span>${escapeHtml(al.iata_code || al.name)}</span>
      <span class="text-xs opacity-60">${al.aircraft_types}</span>
    </button>`;
  }).join('');

  // Build enhanced JSON-LD schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AirlinePlanes",
    "alternateName": "Airline Planes Directory",
    "url": PROD_BASE,
    "description": "Explore airline fleets and aircraft specifications. Know what planes you're flying on.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${PROD_BASE}/aircraft?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AirlinePlanes",
    "url": PROD_BASE,
    "description": "A curated directory of commercial aircraft and the airlines that fly them.",
    "sameAs": []
  };

  const airlineListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Major Airlines",
    "description": "Airlines with detailed fleet information",
    "numberOfItems": airlines.length,
    "itemListElement": airlines.slice(0, 20).map((a, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": a.name,
      "url": `${PROD_BASE}/airlines/${a.slug}`
    }))
  };

  const multipleJsonLd = `
  <script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(airlineListSchema)}</script>`;

  const extraStyles = `
    .aircraft-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .aircraft-card:hover { transform: translateY(-4px); }
    .airline-pill:hover { background-color: rgba(255,255,255,0.15) !important; }
    .airline-pill.active { background-color: rgba(255,255,255,0.25) !important; color: #ffffff !important; border-color: rgba(255,255,255,0.6) !important; }
  `;

  const head = renderHead({
    title: 'AirlinePlanes — Know What Airlines Fly',
    description: `Explore the fleets of ${airlines.length} major airlines with ${formatNumber(totalAircraft)}+ aircraft. See which planes Emirates, British Airways, Lufthansa, Singapore Airlines and more operate.`,
    url: PROD_BASE,
    image: aircraft[0]?.image_url ? `${PROD_BASE}/images/aircraft-styled/${aircraft[0].slug}.webp` : null,
    jsonLd: null
  }, { extraStyles, extraHead: multipleJsonLd });

  const body = `
  ${renderHeader()}

  <!-- Hero Section -->
  <header class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative text-center">
      <div class="max-w-3xl mx-auto">
        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 leading-tight">
          What plane are you flying today?
        </h1>
        <p class="text-white text-lg md:text-xl leading-relaxed mb-8">
          Pick your airline. Discover your aircraft.
        </p>

        <!-- Airline Filter Pills -->
        <div class="flex flex-wrap justify-center gap-2">
          <button onclick="filterByAirline('')"
                  class="airline-pill active flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all whitespace-nowrap"
                  style="border: 1px solid rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); border-radius: 9999px;"
                  data-airline="">
            All Airlines
          </button>
          ${airlinePills}
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 min-h-[60vh]">

    <!-- Results count -->
    <div class="flex items-center justify-between mb-6">
      <p id="results-count" class="text-white/80 font-medium">${aircraft.length} aircraft</p>
      <a href="/airlines" class="text-white/70 hover:text-white text-sm font-medium transition-colors">
        View all airlines &rarr;
      </a>
    </div>

    <!-- Aircraft Grid -->
    <div id="aircraft-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${allCards}
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="hidden text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
        <span class="text-4xl text-white/50">&#9992;</span>
      </div>
      <h3 class="font-display text-2xl font-semibold text-white mb-2">No aircraft found</h3>
      <p class="text-white/70 mb-6">No aircraft match this airline.</p>
      <button onclick="filterByAirline('')" class="text-white/80 hover:text-white font-medium transition-colors">
        Show all aircraft
      </button>
    </div>

  </main>

  ${renderFooter()}

  <script>
    const grid = document.getElementById('aircraft-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsCount = document.getElementById('results-count');
    const pills = document.querySelectorAll('.airline-pill');
    let selectedAirline = '';

    function filterByAirline(airline) {
      selectedAirline = airline;
      pills.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.airline === airline);
      });

      const cards = grid.querySelectorAll('.aircraft-card');
      let count = 0;
      cards.forEach(card => {
        const airlines = card.dataset.airlines ? card.dataset.airlines.split(',') : [];
        const match = !selectedAirline || airlines.includes(selectedAirline);
        card.style.display = match ? '' : 'none';
        if (match) count++;
      });

      resultsCount.textContent = count === 1 ? '1 aircraft' : count + ' aircraft';
      emptyState.classList.toggle('hidden', count > 0);
      grid.classList.toggle('hidden', count === 0);
    }
  </script>`;

  return renderPage(head, body);
}

function renderErrorPage(baseUrl) {
  const head = renderHead({
    title: 'Error — AirlinePlanes',
    description: 'Something went wrong loading the page.',
    url: PROD_BASE
  });

  const body = `
  <div class="flex items-center justify-center min-h-[60vh]">
  <div class="text-center px-4">
    <div class="inline-flex items-center justify-center w-24 h-24 bg-error-bg rounded-full mb-6">
      <span class="text-4xl">&#9992;</span>
    </div>
    <h1 class="font-display text-3xl font-bold text-slate-800 mb-3">Something went wrong</h1>
    <p class="text-muted text-lg mb-8">We could not load the aircraft data. Please try again.</p>
    <a href="/" class="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-hover transition-all">
      Try Again
    </a>
  </div>
  </div>`;

  return renderPage(head, body);
}
