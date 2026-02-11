// GET /airlines and GET /airlines/[slug] - Airlines list and detail pages (SSR)
import { escapeHtml, formatNumber, kmToMiles, kmhToMph } from '../_shared/utils.js';
import { airlineBrandColors } from '../_shared/constants.js';
import { renderHead, renderHeader, renderFooter } from '../_shared/layout.js';

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

function renderAirlineCard(airline, baseUrl) {
  const brandColor = airlineBrandColors[airline.slug] || '#3B82F6';

  return `
    <a href="/airlines/${escapeHtml(airline.slug)}"
       class="group block bg-[#faf8f5] overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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
        <span class="text-xs font-medium tracking-wider" style="color: #a09485;">BOARDING PASS</span>
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
          <span class="font-mono text-3xl font-bold" style="color: #4a4237;">${escapeHtml(airline.iata_code)}</span>
          <span class="text-xs mt-1" style="color: #8c8279;">${escapeHtml(airline.icao_code || '')}</span>
        </div>
        <!-- Main ticket content -->
        <div class="flex-1 p-5 min-w-0">
          <div class="flex justify-between items-start gap-2">
            <div class="min-w-0">
              <p class="text-xs uppercase tracking-wider" style="color: #a09485;">Hub</p>
              <h3 class="font-display text-lg font-semibold group-hover:text-primary transition-colors truncate" style="color: #3d3629;">
                ${escapeHtml(airline.headquarters)}
              </h3>
            </div>
            <div class="text-right shrink-0">
              <p class="text-xs uppercase tracking-wider" style="color: #a09485;">Fleet</p>
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

// === List Page ===

async function renderListPage(context, baseUrl) {
  const { env } = context;

  // Get airlines with fleet counts
  const { results: airlines } = await env.DB.prepare(`
    SELECT a.*,
           COUNT(f.aircraft_slug) as aircraft_types,
           SUM(f.count) as total_aircraft
    FROM airlines a
    LEFT JOIN airline_fleet f ON a.slug = f.airline_slug
    GROUP BY a.slug
    ORDER BY a.fleet_size DESC
  `).all();

  const airlineCards = airlines.map(airline => renderAirlineCard(airline, baseUrl)).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Airlines Fleet Guide | AirlinePlanes',
    description: 'Explore the aircraft fleets of major airlines worldwide. Learn what planes Emirates, British Airways, Lufthansa, Singapore Airlines, and more fly.',
    url: `${baseUrl}/airlines`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "US Airlines",
      "description": "Major US airline fleets",
      "numberOfItems": airlines.length,
      "itemListElement": airlines.map((a, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "Airline",
          "name": a.name,
          "iataCode": a.iata_code,
          "url": `${baseUrl}/airlines/${a.slug}`
        }
      }))
    }
  })}
  <style>
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  </style>
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
  ${renderHeader('airlines')}

  <!-- Hero -->
  <div class="text-white">
    <div class="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h1 class="font-display text-3xl md:text-4xl font-semibold mb-3 drop-shadow-lg">Airlines</h1>
      <p class="text-white/80 text-lg max-w-2xl drop-shadow">
        Explore the aircraft fleets of major carriers worldwide. Find out what planes fly your favorite routes.
      </p>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      ${airlineCards}
    </div>
  </main>

  ${renderFooter()}
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
    }
  });
}

// === Detail Page ===

async function renderDetailPage(context, slug, baseUrl) {
  const { env } = context;

  // Get airline
  const airline = await env.DB.prepare(
    'SELECT * FROM airlines WHERE slug = ?'
  ).bind(slug).first();

  if (!airline) {
    return new Response(renderErrorPage(baseUrl, 'Airline not found'), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // Get fleet with aircraft details
  const { results: fleet } = await env.DB.prepare(`
    SELECT f.*, a.name, a.manufacturer, a.passengers, a.range_km, a.image_url, a.status
    FROM airline_fleet f
    JOIN aircraft a ON f.aircraft_slug = a.slug
    WHERE f.airline_slug = ?
    ORDER BY f.count DESC
  `).bind(slug).all();

  // Calculate totals
  const totalAircraft = fleet.reduce((sum, f) => sum + (f.count || 0), 0);
  const manufacturers = [...new Set(fleet.map(f => f.manufacturer))];

  const fleetCards = fleet.map(f => `
    <div class="pixel-clip p-1 transition-transform duration-300 hover:scale-[1.02]" style="background-color: #8b7355;">
      <a href="/aircraft/${escapeHtml(f.aircraft_slug)}"
         class="group block pixel-clip p-3" style="background-color: #ffffff;">
        <div class="mb-3">
          <div class="aspect-[16/10] overflow-hidden" style="background-color: #f0f0f0;">
            <img src="${baseUrl}/images/airlines/${escapeHtml(slug)}/${escapeHtml(f.aircraft_slug)}.jpg"
                 alt="${escapeHtml(airline.name)} ${escapeHtml(f.name)}"
                 class="w-full h-full object-cover"
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${baseUrl}/images/aircraft-styled/${escapeHtml(f.aircraft_slug)}.webp'; this.onerror=function(){this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center\\' style=\\'background-color:#e8e0d0\\'><span class=\\'text-4xl opacity-30\\'>&#9992;</span></div>';}">
          </div>
        </div>
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="font-display font-semibold" style="color: #4a3f2f;">${escapeHtml(f.name)}</h3>
          <span class="shrink-0 pixel-text px-2 py-1" style="font-size: 9px; background-color: #8b7355; color: #f5f0e6;">${f.count}</span>
        </div>
        <p class="text-sm italic mb-2" style="color: #7a6b55; font-family: Georgia, serif;">${escapeHtml(f.manufacturer)}</p>
        ${f.notes ? `<p class="text-xs mb-2" style="color: #9a8b75;">${escapeHtml(f.notes)}</p>` : ''}
        <div class="flex items-center gap-4 pt-2 text-xs" style="border-top: 1px solid #e5e5e5; color: #9a8b75;">
          <span class="pixel-text" style="font-size: 8px;">${escapeHtml(f.passengers)} PAX</span>
          <span class="pixel-text" style="font-size: 8px;">${formatNumber(Math.round(f.range_km * 0.621371))} MI</span>
        </div>
      </a>
    </div>
  `).join('');

  // Build multiple JSON-LD schemas
  const airlineSchema = {
    "@context": "https://schema.org",
    "@type": "Airline",
    "name": airline.name,
    "iataCode": airline.iata_code,
    "icaoCode": airline.icao_code,
    "url": airline.website,
    "foundingDate": airline.founded?.toString(),
    "location": {
      "@type": "Place",
      "name": airline.headquarters
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Airlines",
        "item": `${baseUrl}/airlines`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": airline.name,
        "item": `${baseUrl}/airlines/${slug}`
      }
    ]
  };

  const multipleJsonLd = `
  <script type="application/ld+json">${JSON.stringify(airlineSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: `${airline.name} Fleet | AirlinePlanes`,
    description: `Explore ${airline.name}'s fleet of ${totalAircraft} aircraft. See what planes ${airline.iata_code} flies and learn about each aircraft type.`,
    url: `${baseUrl}/airlines/${slug}`,
    jsonLd: null
  })}
  ${multipleJsonLd}
  <style>
    .pixel-clip {
      clip-path: polygon(
        0 8px, 4px 8px, 4px 4px, 8px 4px, 8px 0,
        calc(100% - 8px) 0, calc(100% - 8px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 8px, 100% 8px,
        100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%,
        8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 0 calc(100% - 8px)
      );
    }
    .pixel-text {
      font-family: 'Press Start 2P', monospace;
      line-height: 1.6;
    }
  </style>
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
  ${renderHeader('airlines')}

  <!-- Hero -->
  <div class="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10">
    <a href="/airlines" class="inline-flex items-center text-white/70 hover:text-white text-sm mb-5 transition-colors">
      <span class="pixel-text mr-2" style="font-size: 10px;">&lt;</span>
      All Airlines
    </a>

    <div class="pixel-clip p-1" style="background-color: #8b7355;">
      <div class="pixel-clip" style="background-color: #ffffff;">
        <div class="p-5 md:p-8">
          <div class="md:flex md:items-start md:justify-between md:gap-8">
            <!-- Left: Identity -->
            <div class="mb-6 md:mb-0 md:flex-1">
              <div class="flex items-center gap-4 mb-4">
                <img src="${baseUrl}/images/airline-icons/${escapeHtml(slug)}.png?v=5"
                     alt="${escapeHtml(airline.name)} logo"
                     class="w-14 h-14 object-contain shrink-0"
                     onerror="this.src='${baseUrl}/images/airline-icons/${escapeHtml(slug)}.svg?v=5'; this.onerror=function(){this.style.display='none';};">
                <div>
                  <h1 class="font-display text-3xl md:text-4xl font-semibold" style="color: #4a3f2f;">${escapeHtml(airline.name)}</h1>
                  <p class="text-sm mt-1" style="color: #8b7355;">${escapeHtml(airline.headquarters)} · Founded ${airline.founded} · ${escapeHtml(airline.iata_code)}/${escapeHtml(airline.icao_code || '')}</p>
                </div>
              </div>

              <p class="leading-relaxed" style="color: #6b5d4d;">${escapeHtml(airline.description)}</p>

              ${airline.website ? `
              <a href="${escapeHtml(airline.website)}" target="_blank" rel="noopener"
                 class="inline-flex items-center gap-2 mt-4 hover:opacity-70 transition-opacity text-sm font-medium" style="color: #8b7355;">
                Visit website
                <span class="pixel-text" style="font-size: 8px;">&gt;</span>
              </a>
              ` : ''}
            </div>

            <!-- Right: Stats -->
            <div class="shrink-0 flex gap-6 md:gap-8 md:pt-1">
              <div class="text-center">
                <span class="pixel-text uppercase block mb-1" style="font-size: 7px; color: #8b7355;">Fleet Types</span>
                <span class="text-3xl font-semibold" style="color: #4a3f2f; font-family: 'Georgia', serif;">${fleet.length}</span>
              </div>
              <div class="text-center">
                <span class="pixel-text uppercase block mb-1" style="font-size: 7px; color: #8b7355;">Aircraft</span>
                <span class="text-3xl font-semibold" style="color: #4a3f2f; font-family: 'Georgia', serif;">${totalAircraft.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <main class="max-w-6xl mx-auto px-6 md:px-8 py-8">

    <!-- Fleet Header -->
    <div class="flex items-center gap-3 mb-6">
      <h2 class="font-display text-2xl font-semibold text-white" style="font-style: italic;">Fleet</h2>
    </div>

    <!-- Fleet Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${fleetCards}
    </div>

    <!-- Back Link -->
    <div class="text-center mt-12">
      <a href="/airlines" class="inline-flex items-center gap-2 pixel-text uppercase hover:opacity-70 transition-opacity" style="font-size: 8px; color: rgba(255,255,255,0.7);">
        <span>&lt;</span>
        View All Airlines
      </a>
    </div>
  </main>

  ${renderFooter()}
  </div>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
    }
  });
}

function renderErrorPage(baseUrl, message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Not Found | AirlinePlanes',
    description: message,
    url: baseUrl
  })}
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
  ${renderHeader('airlines')}

  <div class="max-w-6xl mx-auto px-4 py-20 text-center">
    <div class="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-full mb-6">
      <span class="text-4xl">&#9992;</span>
    </div>
    <h1 class="font-display text-3xl font-bold text-slate-800 mb-3">${escapeHtml(message)}</h1>
    <p class="text-muted text-lg mb-8">The airline you're looking for may have been removed or the link is incorrect.</p>
    <a href="/airlines" class="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-hover transition-all">
      View All Airlines
    </a>
  </div>

  ${renderFooter()}
  </div>
</body>
</html>`;
}
