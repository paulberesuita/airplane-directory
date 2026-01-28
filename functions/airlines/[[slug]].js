// GET /airlines and GET /airlines/[slug] - Airlines list and detail pages (SSR)
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
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
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
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: white;
      padding: 0.75rem;
      min-height: 100vh;
    }
    .window-frame {
      background-image: url('/images/sky-bg.png');
      background-size: 100% 100vh;
      background-position: top center;
      background-attachment: fixed;
      background-repeat: no-repeat;
      border-radius: 24px;
      min-height: calc(100vh - 1.5rem);
      overflow: hidden;
    }
  </style>`;
}

function renderHeader(baseUrl) {
  return `
  <header class="sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
      <a href="/" class="text-2xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRPLANE DIRECTORY</a>
      <nav class="flex gap-6 text-sm">
        <a href="/airlines" class="text-white font-medium">Airlines</a>
        <a href="/aircraft" class="text-white/70 hover:text-white transition-colors">Aircraft</a>
      </nav>
    </div>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="/" class="text-xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRPLANE DIRECTORY</a>
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

  const airlineCards = airlines.map(airline => `
    <a href="/airlines/${escapeHtml(airline.slug)}"
       class="group block bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/30 hover:-translate-y-1 transition-all duration-300 border border-white/30">
      <div class="p-6">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 class="font-display text-xl font-bold text-white group-hover:text-white transition-colors">
              ${escapeHtml(airline.name)}
            </h3>
            <p class="text-sm text-white/90">${escapeHtml(airline.headquarters)}</p>
          </div>
          <span class="shrink-0 bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-lg">
            ${escapeHtml(airline.iata_code)}
          </span>
        </div>

        <p class="text-white/90 text-sm line-clamp-2 mb-4">${escapeHtml(airline.description?.substring(0, 150))}...</p>

        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div class="text-center">
            <p class="text-2xl font-bold text-white">${formatNumber(airline.fleet_size)}</p>
            <p class="text-xs text-white/90">Aircraft</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">${airline.aircraft_types || 0}</p>
            <p class="text-xs text-white/90">Types</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">${airline.destinations || 0}</p>
            <p class="text-xs text-white/90">Destinations</p>
          </div>
        </div>
      </div>
    </a>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Airlines Fleet Guide | Airplane Directory',
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
  <div class="window-frame">
  ${renderHeader(baseUrl)}

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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      'Cache-Control': 'public, max-age=300'
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
    <a href="/aircraft/${escapeHtml(f.aircraft_slug)}"
       class="group block bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all">
      <div class="aspect-[16/10] overflow-hidden bg-slate-100">
        <img src="${baseUrl}/images/airlines/${escapeHtml(slug)}/${escapeHtml(f.aircraft_slug)}.jpg"
             alt="${escapeHtml(airline.name)} ${escapeHtml(f.name)}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             loading="lazy"
             onerror="this.onerror=null; this.src='${baseUrl}/images/aircraft-styled/${escapeHtml(f.aircraft_slug)}.jpg'; this.onerror=function(){this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-slate-100\\'><span class=\\'text-4xl opacity-30\\'>&#9992;</span></div>';}">
      </div>
      <div class="p-4">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-display font-semibold text-slate-800 group-hover:text-primary transition-colors">
            ${escapeHtml(f.name)}
          </h3>
          <span class="shrink-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            ${f.count}
          </span>
        </div>
        <p class="text-sm text-muted mb-3">${escapeHtml(f.manufacturer)}</p>
        ${f.notes ? `<p class="text-xs text-muted">${escapeHtml(f.notes)}</p>` : ''}

        <div class="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-muted">
          <span>${escapeHtml(f.passengers)} pax</span>
          <span>${formatNumber(Math.round(f.range_km * 0.621371))} mi range</span>
        </div>
      </div>
    </a>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: `${airline.name} Fleet | Airplane Directory`,
    description: `Explore ${airline.name}'s fleet of ${totalAircraft} aircraft. See what planes ${airline.iata_code} flies and learn about each aircraft type.`,
    url: `${baseUrl}/airlines/${slug}`,
    jsonLd: {
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
    }
  })}
</head>
<body class="font-sans">
  <div class="window-frame">
  ${renderHeader(baseUrl)}

  <!-- Hero -->
  <div class="text-white">
    <div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <a href="/airlines" class="inline-flex items-center text-white/70 hover:text-white text-sm mb-4 transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        All Airlines
      </a>

      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="bg-white/20 text-white text-lg font-bold px-3 py-1 rounded-lg">${escapeHtml(airline.iata_code)}</span>
          </div>
          <h1 class="font-display text-3xl md:text-4xl font-semibold drop-shadow-lg">${escapeHtml(airline.name)}</h1>
          <p class="text-white/80 mt-2 drop-shadow">${escapeHtml(airline.headquarters)} · Founded ${airline.founded}</p>
          <p class="text-white/90 mt-4 drop-shadow">${escapeHtml(airline.description)}</p>
          ${airline.website ? `
            <a href="${escapeHtml(airline.website)}" target="_blank" rel="noopener"
               class="inline-flex items-center gap-1 text-white/80 hover:text-white mt-3 text-sm font-medium drop-shadow">
              Visit ${escapeHtml(airline.name)}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 py-8">

    <!-- Fleet Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="font-display text-2xl font-semibold text-white drop-shadow">Fleet</h2>
      <p class="text-white/70">
        ${manufacturers.join(', ')} aircraft
      </p>
    </div>

    <!-- Fleet Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      ${fleetCards}
    </div>

    <!-- Back Link -->
    <div class="text-center mt-12">
      <a href="/airlines" class="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium drop-shadow">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
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
      'Cache-Control': 'public, max-age=300'
    }
  });
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
<body class="font-sans">
  <div class="window-frame">
  ${renderHeader(baseUrl)}

  <div class="max-w-5xl mx-auto px-4 py-20 text-center">
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
