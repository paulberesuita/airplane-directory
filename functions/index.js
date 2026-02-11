// GET / - Homepage with airlines and aircraft grid (SSR)
import { escapeHtml, formatNumber, kmToMiles, kmhToMph } from './_shared/utils.js';
import { airlineBrandColors } from './_shared/constants.js';
import { renderHead, renderHeader, renderFooter } from './_shared/layout.js';

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Fetch specific 6 airlines for homepage feature
    const { results: airlines } = await env.DB.prepare(`
      SELECT a.*, COUNT(DISTINCT af.aircraft_slug) as aircraft_types,
             SUM(af.count) as total_aircraft
      FROM airlines a
      LEFT JOIN airline_fleet af ON a.slug = af.airline_slug
      WHERE a.slug IN ('united-airlines', 'american-airlines', 'delta-air-lines', 'southwest-airlines', 'spirit-airlines', 'jetblue-airways')
      GROUP BY a.id
      ORDER BY a.fleet_size DESC
    `).all();

    // Fetch all aircraft that are in active airline fleets
    const { results: aircraft } = await env.DB.prepare(`
      SELECT DISTINCT ac.* FROM aircraft ac
      INNER JOIN airline_fleet af ON ac.slug = af.aircraft_slug
      ORDER BY CASE WHEN ac.image_url IS NOT NULL AND ac.image_url != '' THEN 0 ELSE 1 END, ac.manufacturer, ac.name
    `).all();

    // Get unique manufacturers
    const manufacturers = [...new Set(aircraft.map(a => a.manufacturer))].sort();

    const html = renderHomepage({ airlines, aircraft, manufacturers, baseUrl });

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error loading homepage:', error);
    return new Response(renderErrorPage(baseUrl), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}

function renderAirlineCard(airline, baseUrl) {
  const brandColor = airlineBrandColors[airline.slug] || '#3B82F6';
  // For light colors like Spirit's yellow, we need dark text
  const needsDarkText = ['spirit-airlines'].includes(airline.slug);
  const textColor = needsDarkText ? 'text-slate-800' : 'text-white';
  const textMutedColor = needsDarkText ? 'text-slate-600' : 'text-white/80';

  // Boarding pass style card with pixel accents
  return `
    <a href="/airlines/${escapeHtml(airline.slug)}"
       class="group block bg-[#faf8f5] overflow-hidden transition-all duration-300">
      <!-- Thin colored accent line at top -->
      <div class="h-1" style="background-color: ${brandColor};"></div>
      <!-- Light header -->
      <div class="px-4 py-2 flex items-center justify-between" style="background-color: #f5f2ed; border-bottom: 1px solid #d4c8b8;">
        <div class="flex items-center gap-2">
          <img src="${baseUrl}/images/airline-icons/${escapeHtml(airline.slug)}.png?v=5"
               alt="${escapeHtml(airline.name)} logo"
               class="w-6 h-6 object-contain"
               onerror="this.src='${baseUrl}/images/airline-icons/${escapeHtml(airline.slug)}.svg?v=5'; this.onerror=function(){this.style.display='none';};">
          <span class="font-semibold text-sm" style="color: #3d3629;">${escapeHtml(airline.name)}</span>
        </div>
        <span class="pixel-text tracking-wider" style="font-size: 8px; color: #a09485;">BOARDING PASS</span>
      </div>
      <!-- Ticket body -->
      <div class="flex relative">
        <!-- Semi-circle cutouts -->
        <div class="absolute left-[7.5rem] sm:left-[8.5rem] top-0 w-4 h-2 rounded-b-full" style="background-color: #f5f2ed;"></div>
        <div class="absolute left-[7.5rem] sm:left-[8.5rem] bottom-0 w-4 h-2 rounded-t-full" style="background-color: ${brandColor};"></div>
        <div class="absolute right-[6.5rem] sm:right-[7.5rem] top-0 w-4 h-2 rounded-b-full" style="background-color: #f5f2ed;"></div>
        <div class="absolute right-[6.5rem] sm:right-[7.5rem] bottom-0 w-4 h-2 rounded-t-full" style="background-color: ${brandColor};"></div>
        <!-- Left stub with IATA code -->
        <div class="w-28 sm:w-32 p-4 flex flex-col items-center justify-center shrink-0" style="border-right: 2px dashed #d4c8b8;">
          <span class="pixel-text" style="font-size: 20px; color: #4a4237;">${escapeHtml(airline.iata_code)}</span>
          <span class="pixel-text mt-2" style="font-size: 7px; color: #8c8279;">${escapeHtml(airline.icao_code || '')}</span>
        </div>
        <!-- Main ticket content -->
        <div class="flex-1 p-5 min-w-0">
          <div class="flex justify-between items-start gap-2">
            <div class="min-w-0">
              <p class="pixel-text uppercase tracking-wider" style="font-size: 8px; color: #a09485;">HUB</p>
              <h3 class="font-display text-lg font-semibold truncate" style="color: #3d3629;">
                ${escapeHtml(airline.headquarters)}
              </h3>
            </div>
            <div class="text-right shrink-0">
              <p class="pixel-text uppercase tracking-wider" style="font-size: 8px; color: #a09485;">FLEET</p>
              <p class="font-mono text-xl font-bold" style="color: #3d3629;">${formatNumber(airline.fleet_size)}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 flex justify-between text-sm" style="border-top: 1px solid #e0d9cf; color: #7a7062;">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>
              ${airline.aircraft_types || 0} types
            </span>
            <span class="shrink-0">Founded ${airline.founded || 'N/A'}</span>
          </div>
        </div>
        <!-- Barcode stub -->
        <div class="w-24 sm:w-28 bg-white flex items-center justify-center shrink-0" style="border-left: 1px dashed #d4c8b8;">
          <svg viewBox="0 0 100 40" class="h-20 w-auto rotate-90" preserveAspectRatio="xMidYMid meet">
            <rect x="0" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="2" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="5" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="8" y="0" width="3" height="40" fill="#1e293b"/>
            <rect x="12" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="14" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="18" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="20" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="23" y="0" width="3" height="40" fill="#1e293b"/>
            <rect x="27" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="30" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="33" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="36" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="38" y="0" width="3" height="40" fill="#1e293b"/>
            <rect x="42" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="45" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="48" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="51" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="53" y="0" width="3" height="40" fill="#1e293b"/>
            <rect x="57" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="61" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="63" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="67" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="70" y="0" width="3" height="40" fill="#1e293b"/>
            <rect x="74" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="77" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="80" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="83" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="85" y="0" width="3" height="40" fill="#1e293b"/>
            <rect x="89" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="93" y="0" width="1" height="40" fill="#1e293b"/>
            <rect x="95" y="0" width="2" height="40" fill="#1e293b"/>
            <rect x="98" y="0" width="2" height="40" fill="#1e293b"/>
          </svg>
        </div>
      </div>
    </a>`;
}

function renderAircraftCard(aircraft, baseUrl) {
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
         data-name="${escapeHtml(aircraft.name.toLowerCase())}"
         data-description="${escapeHtml((aircraft.description || '').toLowerCase())}">
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

function renderHomepage({ airlines, aircraft, manufacturers, baseUrl }) {
  const airlineCards = airlines.map(a => renderAirlineCard(a, baseUrl)).join('');
  // Show only first 6 aircraft as preview
  const aircraftPreview = aircraft.slice(0, 6).map(a => renderAircraftCard(a, baseUrl)).join('');

  const totalAircraft = airlines.reduce((sum, a) => sum + (a.fleet_size || 0), 0);

  // Build enhanced JSON-LD schemas
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "AirlinePlanes",
    "alternateName": "Airline Planes Directory",
    "url": baseUrl,
    "description": "Explore airline fleets and aircraft specifications. Know what planes you're flying on.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/aircraft?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AirlinePlanes",
    "url": baseUrl,
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
      "url": `${baseUrl}/airlines/${a.slug}`
    }))
  };

  const multipleJsonLd = `
  <script type="application/ld+json">${JSON.stringify(websiteSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(organizationSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(airlineListSchema)}</script>`;

  const extraStyles = `
    .aircraft-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .aircraft-card:hover { transform: translateY(-4px); }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(-45deg); }
      50% { transform: translateY(-6px) rotate(-45deg); }
    }
    .float-animation { animation: float 3s ease-in-out infinite; }
    .btn-vintage {
      background-color: #8b7355;
    }
    .btn-vintage:hover {
      background-color: #6b5640;
    }
    .btn-vintage-inner {
      background-color: #ffffff;
      color: #4a3f2f;
    }
    .btn-vintage:hover .btn-vintage-inner {
      background-color: #f5f0e6;
    }
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'AirlinePlanes — Know What Airlines Fly',
    description: `Explore the fleets of ${airlines.length} major airlines with ${formatNumber(totalAircraft)}+ aircraft. See which planes Emirates, British Airways, Lufthansa, Singapore Airlines and more operate.`,
    url: baseUrl,
    image: aircraft[0]?.image_url ? `${baseUrl}/images/aircraft-styled/${aircraft[0].slug}.webp` : null,
    jsonLd: null
  }, { extraStyles, extraHead: multipleJsonLd })}
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
  ${renderHeader()}

  <!-- Hero Section -->
  <header class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative text-center">
      <div class="max-w-3xl mx-auto">
        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 leading-tight">
          What plane are you flying today?
        </h1>
        <p class="text-white text-lg md:text-xl leading-relaxed">
          Find your airline. Discover your aircraft.
        </p>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 min-h-[60vh]">
    <!-- US Airlines Section -->
    <section class="mb-16">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-display text-2xl md:text-3xl font-semibold text-white">Airlines</h2>
          <p class="text-white/90 mt-1">Explore fleets of major carriers worldwide</p>
        </div>
        <a href="/airlines" class="text-white hover:text-white/80 font-medium flex items-center gap-1 transition-colors">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        ${airlineCards}
      </div>
    </section>

    <!-- Aircraft Section -->
    <section>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-display text-2xl md:text-3xl font-semibold text-white">Aircraft Types</h2>
          <p class="text-white/90 mt-1">${aircraft.length} plane types in airline fleets</p>
        </div>
        <a href="/aircraft" class="text-white hover:text-white/80 font-medium flex items-center gap-1 transition-colors">
          View all
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>

      <!-- Aircraft Preview Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        ${aircraftPreview}
      </div>

      <!-- View All Link -->
      <div class="text-center">
        <div class="btn-vintage pixel-clip p-1 inline-block transition-all">
          <a href="/aircraft" class="btn-vintage-inner pixel-clip inline-flex items-center gap-3 px-10 py-4 pixel-text transition-all" style="font-size: 10px;">
            <span>BROWSE ALL ${aircraft.length} AIRCRAFT</span>
            <span>&gt;</span>
          </a>
        </div>
      </div>
    </section>

  </main>

  ${renderFooter()}

  </div>
</body>
</html>`;
}

function renderErrorPage(baseUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Error — AirlinePlanes',
    description: 'Something went wrong loading the page.',
    url: baseUrl
  })}
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame flex items-center justify-center">
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
  </div>
</body>
</html>`;
}
