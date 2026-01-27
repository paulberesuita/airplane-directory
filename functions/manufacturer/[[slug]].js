// GET /manufacturer and GET /manufacturer/[slug] - Manufacturer list and detail pages (SSR)
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

// === Manufacturer Data ===
// Since manufacturers don't have their own table, we define metadata here
const MANUFACTURER_DATA = {
  'boeing': {
    slug: 'boeing',
    name: 'Boeing',
    founded: 1916,
    headquarters: 'Arlington, Virginia, USA',
    description: 'Boeing is one of the world\'s largest aerospace companies and a leading manufacturer of commercial jetliners, defense, space, and security systems. Founded by William Boeing in Seattle, the company has grown to become a global aviation icon, producing legendary aircraft like the 747 "Jumbo Jet" and the modern 787 Dreamliner.',
    website: 'https://www.boeing.com',
    logoColor: '#0033A0' // Boeing blue
  },
  'airbus': {
    slug: 'airbus',
    name: 'Airbus',
    founded: 1970,
    headquarters: 'Leiden, Netherlands / Toulouse, France',
    description: 'Airbus is a European multinational aerospace corporation and the world\'s largest airliner manufacturer by revenue. Born from a consortium of European aviation companies, Airbus has revolutionized air travel with innovations like fly-by-wire controls and the double-deck A380, the world\'s largest passenger aircraft.',
    website: 'https://www.airbus.com',
    logoColor: '#00205B' // Airbus blue
  },
  'embraer': {
    slug: 'embraer',
    name: 'Embraer',
    founded: 1969,
    headquarters: 'Sao Jose dos Campos, Brazil',
    description: 'Embraer is a Brazilian aerospace conglomerate that produces commercial, military, executive, and agricultural aircraft. The company is the world\'s third-largest producer of civil aircraft, behind Boeing and Airbus, and is particularly known for its regional jets that connect smaller cities to major hubs.',
    website: 'https://www.embraer.com',
    logoColor: '#003366' // Embraer blue
  },
  'bombardier': {
    slug: 'bombardier',
    name: 'Bombardier',
    founded: 1942,
    headquarters: 'Montreal, Quebec, Canada',
    description: 'Bombardier is a Canadian multinational aerospace and transportation company. While they sold their commercial aviation division (including the CRJ series) to Mitsubishi in 2020, their regional jets remain popular with airlines worldwide. The company now focuses on business aviation with its Learjet, Challenger, and Global jet families.',
    website: 'https://www.bombardier.com',
    logoColor: '#C8102E' // Bombardier red
  }
};

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

function kmToMiles(km) {
  return Math.round(km * 0.621371);
}

function kmhToMph(kmh) {
  return Math.round(kmh * 0.621371);
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
            'success': '#16a34a',
            'success-bg': '#f0fdf4',
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-image: url('/images/sky-bg.png');
      background-size: 100% 100vh;
      background-position: top center;
      background-attachment: fixed;
      background-repeat: no-repeat;
    }
  </style>`;
}

function renderHeader(baseUrl, activeManufacturer = false) {
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
        <a href="/aircraft" class="text-white/70 hover:text-white transition-colors">Aircraft</a>
        <a href="/manufacturer" class="${activeManufacturer ? 'text-white font-medium' : 'text-white/70 hover:text-white transition-colors'}">Manufacturers</a>
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
          Know what you're flying on. Airline fleets and aircraft information.
        </p>
      </div>
    </div>
  </footer>`;
}

// === List Page ===

async function renderListPage(context, baseUrl) {
  const { env } = context;

  // Get manufacturer stats from aircraft table
  const { results: manufacturerStats } = await env.DB.prepare(`
    SELECT
      manufacturer,
      COUNT(*) as aircraft_count,
      SUM(CASE WHEN status = 'In Production' THEN 1 ELSE 0 END) as in_production,
      MIN(first_flight) as earliest_flight,
      MAX(passengers) as max_passengers,
      MAX(range_km) as max_range
    FROM aircraft
    GROUP BY manufacturer
    ORDER BY aircraft_count DESC
  `).all();

  const manufacturerCards = manufacturerStats.map(m => {
    const data = MANUFACTURER_DATA[m.manufacturer.toLowerCase()] || {
      slug: m.manufacturer.toLowerCase().replace(/\s+/g, '-'),
      name: m.manufacturer,
      description: `Manufacturer of commercial aircraft.`,
      founded: null,
      headquarters: ''
    };

    return `
    <a href="/manufacturer/${escapeHtml(data.slug)}"
       class="group block bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/30 hover:-translate-y-1 transition-all duration-300 border border-white/30">
      <div class="p-6">
        <div class="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 class="font-display text-2xl font-bold text-white group-hover:text-white transition-colors">
              ${escapeHtml(data.name)}
            </h3>
            ${data.headquarters ? `<p class="text-sm text-white/80">${escapeHtml(data.headquarters)}</p>` : ''}
          </div>
          ${data.founded ? `
          <span class="shrink-0 bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-lg">
            Est. ${data.founded}
          </span>
          ` : ''}
        </div>

        <p class="text-white/90 text-sm line-clamp-2 mb-4">${escapeHtml(data.description?.substring(0, 150))}...</p>

        <div class="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
          <div class="text-center">
            <p class="text-2xl font-bold text-white">${m.aircraft_count}</p>
            <p class="text-xs text-white/80">Aircraft Types</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">${m.in_production}</p>
            <p class="text-xs text-white/80">In Production</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-white">${formatNumber(kmToMiles(m.max_range))}</p>
            <p class="text-xs text-white/80">Max Range (mi)</p>
          </div>
        </div>
      </div>
    </a>
  `;
  }).join('');

  const totalAircraft = manufacturerStats.reduce((sum, m) => sum + m.aircraft_count, 0);
  const totalInProduction = manufacturerStats.reduce((sum, m) => sum + m.in_production, 0);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Aircraft Manufacturers | Airplane Directory',
    description: `Browse ${manufacturerStats.length} major aircraft manufacturers including Boeing, Airbus, Embraer, and Bombardier. See their complete aircraft lineups and specs.`,
    url: `${baseUrl}/manufacturer`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Aircraft Manufacturers",
      "description": "Major commercial aircraft manufacturers",
      "numberOfItems": manufacturerStats.length,
      "itemListElement": manufacturerStats.map((m, i) => {
        const data = MANUFACTURER_DATA[m.manufacturer.toLowerCase()];
        return {
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "Organization",
            "name": m.manufacturer,
            "url": `${baseUrl}/manufacturer/${data?.slug || m.manufacturer.toLowerCase()}`
          }
        };
      })
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
<body class="bg-background text-slate-800 min-h-screen font-sans">
  ${renderHeader(baseUrl, true)}

  <!-- Hero -->
  <div class="text-white">
    <div class="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <h1 class="font-display text-3xl md:text-4xl font-semibold mb-3 drop-shadow-lg">Aircraft Manufacturers</h1>
      <p class="text-white/80 text-lg max-w-2xl drop-shadow">
        The companies that build the planes you fly on. Explore ${totalAircraft} aircraft types from ${manufacturerStats.length} major manufacturers.
      </p>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <!-- Stats Banner -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
        <p class="text-3xl font-bold text-white">${manufacturerStats.length}</p>
        <p class="text-sm text-white/70">Manufacturers</p>
      </div>
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
        <p class="text-3xl font-bold text-white">${totalAircraft}</p>
        <p class="text-sm text-white/70">Aircraft Types</p>
      </div>
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
        <p class="text-3xl font-bold text-white">${totalInProduction}</p>
        <p class="text-sm text-white/70">In Production</p>
      </div>
    </div>

    <!-- Manufacturer Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      ${manufacturerCards}
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

// === Detail Page ===

async function renderDetailPage(context, slug, baseUrl) {
  const { env } = context;

  // Get manufacturer data
  const manufacturerData = MANUFACTURER_DATA[slug];
  if (!manufacturerData) {
    return new Response(renderErrorPage(baseUrl, 'Manufacturer not found'), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // Get all aircraft for this manufacturer
  const { results: aircraft } = await env.DB.prepare(`
    SELECT * FROM aircraft
    WHERE LOWER(manufacturer) = ?
    ORDER BY CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 0 ELSE 1 END, name
  `).bind(slug).all();

  if (aircraft.length === 0) {
    return new Response(renderErrorPage(baseUrl, 'Manufacturer not found'), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }

  // Calculate stats
  const inProduction = aircraft.filter(a => a.status === 'In Production').length;
  const inService = aircraft.filter(a => a.status === 'In Service').length;
  const retired = aircraft.filter(a => a.status === 'Retired').length;
  const maxPassengers = Math.max(...aircraft.map(a => a.passengers || 0));
  const maxRange = Math.max(...aircraft.map(a => a.range_km || 0));
  const avgRange = Math.round(aircraft.reduce((sum, a) => sum + (a.range_km || 0), 0) / aircraft.length);

  const aircraftCards = aircraft.map(a => {
    const rangeInMiles = kmToMiles(a.range_km);
    const speedInMph = kmhToMph(a.cruise_speed_kmh);

    const imageHtml = a.image_url
      ? `<div class="aspect-[16/9] overflow-hidden bg-slate-100">
           <img src="${baseUrl}/images/aircraft/${escapeHtml(a.slug)}.jpg" alt="${escapeHtml(a.name)}"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
                onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-slate-100\\'><span class=\\'text-4xl opacity-30\\'>&#9992;</span></div>'">
         </div>`
      : `<div class="aspect-[16/9] bg-slate-100 flex items-center justify-center">
           <span class="text-4xl opacity-30">&#9992;</span>
         </div>`;

    return `
      <a href="/aircraft/${escapeHtml(a.slug)}"
         class="group block bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/30 transition-all duration-300 border border-white/30 hover:-translate-y-1">
        ${imageHtml}
        <div class="p-4">
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-semibold font-display text-white group-hover:text-white transition-colors">${escapeHtml(a.name)}</h3>
            <span class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white">${escapeHtml(a.status)}</span>
          </div>
          <p class="text-sm text-white/90 line-clamp-2 mb-4">${escapeHtml(a.description?.substring(0, 100))}...</p>
          <div class="flex items-center gap-1 pt-3 border-t border-white/20">
            <div class="flex-1 text-center py-1.5 rounded bg-white/10">
              <p class="text-xs text-white/80 mb-0.5">Pax</p>
              <p class="text-sm font-semibold text-white">${a.passengers}</p>
            </div>
            <div class="flex-1 text-center py-1.5 rounded bg-white/10">
              <p class="text-xs text-white/80 mb-0.5">Range</p>
              <p class="text-sm font-semibold text-white">${formatNumber(rangeInMiles)} mi</p>
            </div>
            <div class="flex-1 text-center py-1.5 rounded bg-white/10">
              <p class="text-xs text-white/80 mb-0.5">Speed</p>
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
    title: `${manufacturerData.name} Aircraft | Airplane Directory`,
    description: `Explore all ${aircraft.length} ${manufacturerData.name} aircraft. ${inProduction} in production, ${inService} in service. See specs, history, and details for each model.`,
    url: `${baseUrl}/manufacturer/${slug}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": manufacturerData.name,
      "description": manufacturerData.description,
      "foundingDate": manufacturerData.founded?.toString(),
      "url": manufacturerData.website,
      "location": {
        "@type": "Place",
        "name": manufacturerData.headquarters
      },
      "makesOffer": aircraft.map(a => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": a.name,
          "url": `${baseUrl}/aircraft/${a.slug}`
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
<body class="bg-background text-slate-800 min-h-screen font-sans">
  ${renderHeader(baseUrl, true)}

  <!-- Hero -->
  <div class="text-white">
    <div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <a href="/manufacturer" class="inline-flex items-center text-white/70 hover:text-white text-sm mb-4 transition-colors">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        All Manufacturers
      </a>

      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 class="font-display text-3xl md:text-4xl font-semibold drop-shadow-lg">${escapeHtml(manufacturerData.name)}</h1>
          <p class="text-white/80 mt-2 drop-shadow">${escapeHtml(manufacturerData.headquarters)} ${manufacturerData.founded ? `· Founded ${manufacturerData.founded}` : ''}</p>
        </div>
        ${manufacturerData.website ? `
        <a href="${escapeHtml(manufacturerData.website)}" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium px-4 py-2 rounded-lg transition-all border border-white/30">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
          Visit Website
        </a>
        ` : ''}
      </div>

      <p class="text-white/90 mt-6 max-w-3xl drop-shadow leading-relaxed">${escapeHtml(manufacturerData.description)}</p>
    </div>
  </div>

  <main class="max-w-7xl mx-auto px-4 py-8">
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
        <p class="text-3xl font-bold text-white">${aircraft.length}</p>
        <p class="text-sm text-white/70">Aircraft Types</p>
      </div>
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
        <p class="text-3xl font-bold text-white">${inProduction}</p>
        <p class="text-sm text-white/70">In Production</p>
      </div>
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
        <p class="text-3xl font-bold text-white">${maxPassengers}</p>
        <p class="text-sm text-white/70">Max Passengers</p>
      </div>
      <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
        <p class="text-3xl font-bold text-white">${formatNumber(kmToMiles(maxRange))}</p>
        <p class="text-sm text-white/70">Max Range (mi)</p>
      </div>
    </div>

    <!-- Aircraft Section Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="font-display text-2xl font-semibold text-white drop-shadow">All ${escapeHtml(manufacturerData.name)} Aircraft</h2>
      <p class="text-white/70">
        ${inProduction} in production · ${inService} in service ${retired > 0 ? `· ${retired} retired` : ''}
      </p>
    </div>

    <!-- Aircraft Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      ${aircraftCards}
    </div>

    <!-- Back Link -->
    <div class="text-center mt-12">
      <a href="/manufacturer" class="inline-flex items-center gap-2 text-white hover:text-white/80 font-medium drop-shadow">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        View All Manufacturers
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
  ${renderHeader(baseUrl, true)}

  <div class="max-w-5xl mx-auto px-4 py-20 text-center">
    <div class="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-6">
      <span class="text-4xl text-white/50">&#9992;</span>
    </div>
    <h1 class="font-display text-3xl font-bold text-white mb-3 drop-shadow">${escapeHtml(message)}</h1>
    <p class="text-white/70 text-lg mb-8">The manufacturer you're looking for may not exist in our database.</p>
    <a href="/manufacturer" class="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-all">
      View All Manufacturers
    </a>
  </div>

  ${renderFooter()}
</body>
</html>`;
}
