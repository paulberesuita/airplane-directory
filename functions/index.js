// GET / - Homepage with airlines and aircraft grid (SSR)
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Fetch all airlines with fleet counts
    const { results: airlines } = await env.DB.prepare(`
      SELECT a.*, COUNT(DISTINCT af.aircraft_slug) as aircraft_types,
             SUM(af.count) as total_aircraft
      FROM airlines a
      LEFT JOIN airline_fleet af ON a.slug = af.airline_slug
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
        'Cache-Control': 'public, max-age=300'
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

function renderHead({ title, description, url, image }) {
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

function renderAirlineCard(airline, baseUrl) {
  return `
    <a href="/airlines/${escapeHtml(airline.slug)}"
       class="group block bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/30 hover:-translate-y-1 transition-all duration-300 border border-white/30">
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
            <img src="${baseUrl}/images/logos/${escapeHtml(airline.slug)}.png"
                 alt="${escapeHtml(airline.name)} logo"
                 class="w-10 h-10 object-contain"
                 onerror="this.style.display='none'; this.parentElement.innerHTML='<span class=\\'font-display font-bold text-primary text-xl\\'>${escapeHtml(airline.iata_code)}</span>';">
          </div>
          <div class="min-w-0">
            <h3 class="font-display font-medium text-white group-hover:text-white transition-colors truncate">
              ${escapeHtml(airline.name)}
            </h3>
            <p class="text-sm text-white/90">${escapeHtml(airline.headquarters)}</p>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-2 mb-4">
          <div class="text-center py-2 rounded-lg bg-white/10">
            <p class="text-lg font-bold text-white">${formatNumber(airline.fleet_size)}</p>
            <p class="text-xs text-white/90">Aircraft</p>
          </div>
          <div class="text-center py-2 rounded-lg bg-white/10">
            <p class="text-lg font-bold text-white">${airline.aircraft_types || 0}</p>
            <p class="text-xs text-white/90">Types</p>
          </div>
          <div class="text-center py-2 rounded-lg bg-white/10">
            <p class="text-lg font-bold text-white">${formatNumber(airline.destinations)}</p>
            <p class="text-xs text-white/90">Routes</p>
          </div>
        </div>

        <p class="text-sm text-white line-clamp-2">${escapeHtml(airline.description)}</p>
      </div>
    </a>`;
}

function renderAircraftCard(aircraft, baseUrl) {
  const rangeInMiles = kmToMiles(aircraft.range_km);
  const speedInMph = kmhToMph(aircraft.cruise_speed_kmh);
  const year = aircraft.first_flight ? aircraft.first_flight.split('-')[0] : '';

  const statusClass = aircraft.status === 'In Production'
    ? 'bg-success-bg text-success'
    : aircraft.status === 'In Service'
      ? 'bg-primary/10 text-primary'
      : 'bg-slate-100 text-muted';

  const imageHtml = aircraft.image_url
    ? `<div class="aspect-[16/9] bg-slate-100 overflow-hidden">
         <img src="${baseUrl}/images/aircraft-styled/${escapeHtml(aircraft.slug)}.jpg"
              alt="${escapeHtml(aircraft.name)}"
              class="w-full h-full object-cover transition-transform duration-300"
              loading="lazy"
              onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-slate-100\\'><span class=\\'text-4xl opacity-30\\'>&#9992;</span></div>'">
       </div>`
    : `<div class="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
         <span class="text-4xl opacity-30">&#9992;</span>
       </div>`;

  return `
    <a href="/aircraft/${escapeHtml(aircraft.slug)}"
       class="aircraft-card group block bg-white/20 backdrop-blur-xl rounded-2xl overflow-hidden hover:bg-white/30 transition-all duration-300 border border-white/30"
       data-manufacturer="${escapeHtml(aircraft.manufacturer)}"
       data-name="${escapeHtml(aircraft.name.toLowerCase())}"
       data-description="${escapeHtml((aircraft.description || '').toLowerCase())}">
      ${imageHtml}
      <div class="p-4">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-semibold font-display text-white group-hover:text-white transition-colors">
            ${escapeHtml(aircraft.name)}
          </h3>
          <span class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-white/20 text-white">
            ${escapeHtml(aircraft.status)}
          </span>
        </div>
        <p class="text-sm text-white font-medium mb-2">${escapeHtml(aircraft.manufacturer)}</p>
        <p class="text-sm text-white/90 line-clamp-2 mb-4">${escapeHtml(aircraft.description)}</p>

        <div class="flex items-center gap-1 pt-3 border-t border-white/20">
          <div class="flex-1 text-center py-1.5 rounded bg-white/10">
            <p class="text-xs text-white/90 mb-0.5">Pax</p>
            <p class="text-sm font-semibold text-white">${aircraft.passengers}</p>
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
      <div class="px-4 py-3 bg-white/10 border-t border-white/20 flex items-center justify-between">
        <span class="text-xs text-white/90">First flight: ${year}</span>
        <span class="text-sm font-medium text-white flex items-center gap-1 group-hover:gap-2 transition-all">
          View Details
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </span>
      </div>
    </a>`;
}

function renderHomepage({ airlines, aircraft, manufacturers, baseUrl }) {
  const airlineCards = airlines.map(a => renderAirlineCard(a, baseUrl)).join('');
  // Show only first 6 aircraft as preview
  const aircraftPreview = aircraft.slice(0, 6).map(a => renderAircraftCard(a, baseUrl)).join('');

  const totalAircraft = airlines.reduce((sum, a) => sum + (a.fleet_size || 0), 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Airplane Directory — Know What Airlines Fly',
    description: `Explore the fleets of ${airlines.length} major airlines with ${formatNumber(totalAircraft)}+ aircraft. See which planes Emirates, British Airways, Lufthansa, Singapore Airlines and more operate.`,
    url: baseUrl,
    image: aircraft[0]?.image_url ? `${baseUrl}/images/aircraft/${aircraft[0].slug}.jpg` : null
  })}
  <style>
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
  </style>
</head>
<body class="font-sans">
  <div class="window-frame">
  <!-- Hero Section -->
  <header class="relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative text-center">
      <div class="max-w-3xl mx-auto">
        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 leading-tight">
          Every aircraft. Every airline.
        </h1>
        <p class="text-white text-lg md:text-xl leading-relaxed">
          Discover what planes fly your favorite routes. Explore fleet details, specs, and history for 41 airlines worldwide.
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <a href="/aircraft" class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl hover:bg-white/30 transition-all border border-white/30">
          Browse all ${aircraft.length} aircraft
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </a>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <span class="font-display font-bold text-white text-lg">Airplane Directory</span>
        </div>
        <nav class="flex items-center gap-6">
          <a href="/airlines" class="text-white/90 hover:text-white text-sm transition-colors">Airlines</a>
          <a href="/aircraft" class="text-white/90 hover:text-white text-sm transition-colors">Aircraft</a>
          <a href="/manufacturer" class="text-white/90 hover:text-white text-sm transition-colors">Manufacturers</a>
        </nav>
      </div>
      <div class="border-t border-white/20 mt-8 pt-8 text-center">
        <p class="text-white/80 text-sm">
          Fleet data sourced from airline newsrooms, Airfleets.net, and manufacturer specifications.
        </p>
      </div>
    </div>
  </footer>

  </div>
</body>
</html>`;
}

function renderErrorPage(baseUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Error — Airplane Directory',
    description: 'Something went wrong loading the page.',
    url: baseUrl
  })}
</head>
<body class="font-sans">
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
