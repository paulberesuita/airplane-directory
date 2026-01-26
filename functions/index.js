// GET / - Homepage with aircraft grid (SSR)
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Fetch all aircraft
    const { results: aircraft } = await env.DB.prepare(
      'SELECT * FROM aircraft ORDER BY CASE WHEN image_url IS NOT NULL AND image_url != \'\' THEN 0 ELSE 1 END, manufacturer, name'
    ).all();

    // Get unique manufacturers
    const manufacturers = [...new Set(aircraft.map(a => a.manufacturer))].sort();

    const html = renderHomepage({ aircraft, manufacturers, baseUrl });

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
            'background': '#F8FAFC',
            'card': '#FFFFFF',
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
  </script>`;
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
         <img src="${baseUrl}/images/aircraft/${escapeHtml(aircraft.slug)}.jpg"
              alt="${escapeHtml(aircraft.name)}"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center bg-slate-100\\'><span class=\\'text-4xl opacity-30\\'>&#9992;</span></div>'">
       </div>`
    : `<div class="aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
         <span class="text-4xl opacity-30">&#9992;</span>
       </div>`;

  return `
    <a href="/aircraft/${escapeHtml(aircraft.slug)}"
       class="aircraft-card group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
       data-manufacturer="${escapeHtml(aircraft.manufacturer)}"
       data-name="${escapeHtml(aircraft.name.toLowerCase())}"
       data-description="${escapeHtml((aircraft.description || '').toLowerCase())}">
      ${imageHtml}
      <div class="p-4">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="font-semibold font-display text-slate-800 group-hover:text-primary transition-colors">
            ${escapeHtml(aircraft.name)}
          </h3>
          <span class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${statusClass}">
            ${escapeHtml(aircraft.status)}
          </span>
        </div>
        <p class="text-sm text-primary font-medium mb-2">${escapeHtml(aircraft.manufacturer)}</p>
        <p class="text-sm text-muted line-clamp-2 mb-4">${escapeHtml(aircraft.description)}</p>

        <div class="flex items-center gap-1 pt-3 border-t border-border">
          <div class="flex-1 text-center py-1.5 rounded bg-background">
            <p class="text-xs text-muted mb-0.5">Pax</p>
            <p class="text-sm font-semibold text-slate-700">${aircraft.passengers}</p>
          </div>
          <div class="flex-1 text-center py-1.5 rounded bg-background">
            <p class="text-xs text-muted mb-0.5">Range</p>
            <p class="text-sm font-semibold text-slate-700">${formatNumber(rangeInMiles)} mi</p>
          </div>
          <div class="flex-1 text-center py-1.5 rounded bg-background">
            <p class="text-xs text-muted mb-0.5">Speed</p>
            <p class="text-sm font-semibold text-slate-700">${formatNumber(speedInMph)} mph</p>
          </div>
        </div>
      </div>
      <div class="px-4 py-3 bg-background border-t border-border flex items-center justify-between">
        <span class="text-xs text-muted">First flight: ${year}</span>
        <span class="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
          View Details
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </span>
      </div>
    </a>`;
}

function renderHomepage({ aircraft, manufacturers, baseUrl }) {
  const aircraftCards = aircraft.map(a => renderAircraftCard(a, baseUrl)).join('');
  const filterButtons = manufacturers.map(m => `
    <button onclick="filterByManufacturer('${escapeHtml(m)}')"
            class="filter-btn px-4 py-2 rounded-lg text-sm font-medium bg-card text-muted border border-border hover:border-primary hover:text-primary transition-all"
            data-manufacturer="${escapeHtml(m)}">
      ${escapeHtml(m)}
    </button>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Airplane Directory — Know Your Aircraft',
    description: `Explore ${aircraft.length} commercial aircraft from ${manufacturers.join(', ')}. Specs, history, and fun facts about the planes you fly on.`,
    url: baseUrl,
    image: aircraft[0]?.image_url ? `${baseUrl}/images/aircraft/${aircraft[0].slug}.jpg` : null
  })}
  <style>
    .hero-pattern {
      background-color: #0EA5E9;
      background-image:
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%),
        radial-gradient(circle at 40% 80%, rgba(255,255,255,0.06) 0%, transparent 30%);
    }
    .aircraft-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .aircraft-card:hover { transform: translateY(-4px); }
    .filter-btn.active { background: #0EA5E9; color: white; border-color: #0EA5E9; }
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
<body class="bg-background text-slate-800 min-h-screen font-sans">
  <!-- Hero Section -->
  <header class="hero-pattern relative overflow-hidden">
    <div class="absolute top-10 right-10 opacity-20">
      <svg class="w-32 h-32 text-white float-animation" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
      <div class="max-w-3xl">
        <h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
          Know the plane you are flying on
        </h1>
        <p class="text-sky-100 text-lg md:text-xl mb-8 leading-relaxed">
          Curious about that aircraft outside your window? Explore specs, history, and fun facts about commercial planes.
        </p>

        <div class="relative max-w-2xl">
          <input type="text" id="search-input"
            class="w-full px-5 py-4 pl-14 bg-card border-0 rounded-2xl shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-slate-800 placeholder-muted text-lg"
            placeholder="Search aircraft...">
          <svg class="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0">
      <svg class="w-full h-12 md:h-16" viewBox="0 0 1440 64" preserveAspectRatio="none" fill="#F8FAFC">
        <path d="M0,32 C480,64 960,0 1440,32 L1440,64 L0,64 Z"></path>
      </svg>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[60vh]">
    <!-- Manufacturer Filters -->
    <div class="mb-8">
      <p class="text-muted text-sm font-medium mb-3 uppercase tracking-wide">Filter by manufacturer</p>
      <div id="manufacturer-filters" class="flex flex-wrap gap-2">
        <button onclick="filterByManufacturer('')"
                class="filter-btn active px-4 py-2 rounded-lg text-sm font-medium transition-all"
                data-manufacturer="">
          All Aircraft
        </button>
        ${filterButtons}
      </div>
    </div>

    <!-- Results Count -->
    <div class="flex items-center justify-between mb-6">
      <p id="results-count" class="text-muted font-medium">${aircraft.length} aircraft</p>
      <button id="clear-filters-btn" onclick="clearFilters()" class="hidden text-primary hover:text-primary-hover text-sm font-medium transition-colors">
        Clear filters
      </button>
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="hidden text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-6">
        <span class="text-4xl opacity-30">&#9992;</span>
      </div>
      <h3 class="font-display text-2xl font-semibold text-slate-700 mb-2">No aircraft found</h3>
      <p class="text-muted mb-6 max-w-md mx-auto">We could not find any aircraft matching your search. Try adjusting your filters.</p>
      <button onclick="clearFilters()" class="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-xl hover:bg-primary-hover transition-all">
        Clear all filters
      </button>
    </div>

    <!-- Aircraft Grid -->
    <div id="aircraft-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${aircraftCards}
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-gray-800 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
            </svg>
          </div>
          <span class="font-display font-bold text-white text-lg">Airplane Directory</span>
        </div>
        <p class="text-slate-400 text-sm text-center md:text-left">
          For curious travelers who want to know what they are flying on.
        </p>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-8 text-center">
        <p class="text-gray-500 text-sm">
          Data sourced from manufacturer specifications and aviation databases.
        </p>
      </div>
    </div>
  </footer>

  <script>
    const searchInput = document.getElementById('search-input');
    const aircraftGrid = document.getElementById('aircraft-grid');
    const emptyState = document.getElementById('empty-state');
    const resultsCount = document.getElementById('results-count');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let selectedManufacturer = '';
    let searchQuery = '';
    let debounceTimer;

    function filterAircraft() {
      const cards = aircraftGrid.querySelectorAll('.aircraft-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const manufacturer = card.dataset.manufacturer;
        const name = card.dataset.name;
        const description = card.dataset.description;

        const matchesManufacturer = !selectedManufacturer || manufacturer === selectedManufacturer;
        const matchesSearch = !searchQuery ||
          name.includes(searchQuery) ||
          manufacturer.toLowerCase().includes(searchQuery) ||
          description.includes(searchQuery);

        if (matchesManufacturer && matchesSearch) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      resultsCount.textContent = visibleCount === 1 ? '1 aircraft' : visibleCount + ' aircraft';
      emptyState.classList.toggle('hidden', visibleCount > 0);
      aircraftGrid.classList.toggle('hidden', visibleCount === 0);
      clearFiltersBtn.classList.toggle('hidden', !selectedManufacturer && !searchQuery);
    }

    function filterByManufacturer(manufacturer) {
      selectedManufacturer = manufacturer;
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.manufacturer === manufacturer);
      });
      filterAircraft();
    }

    function clearFilters() {
      searchInput.value = '';
      searchQuery = '';
      selectedManufacturer = '';
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.manufacturer === '');
      });
      filterAircraft();
    }

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase();
        filterAircraft();
      }, 200);
    });
  </script>
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
<body class="bg-background text-slate-800 min-h-screen font-sans flex items-center justify-center">
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
</body>
</html>`;
}
