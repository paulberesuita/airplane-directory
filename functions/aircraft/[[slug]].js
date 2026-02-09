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

function kgToLbs(kg) {
  return Math.round(kg * 2.20462);
}

function litersToGallons(liters) {
  return Math.round(liters * 0.264172);
}

function formatPrice(usd) {
  if (!usd) return null;
  if (usd >= 1000000000) {
    return '$' + (usd / 1000000000).toFixed(1) + 'B';
  }
  if (usd >= 1000000) {
    return '$' + (usd / 1000000).toFixed(1) + 'M';
  }
  return '$' + formatNumber(usd);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Airline brand colors for accent lines
const airlineBrandColors = {
  'united-airlines': '#002244',
  'american-airlines': '#0078D2',
  'delta-air-lines': '#003366',
  'southwest-airlines': '#304CB2',
  'jetblue-airways': '#003876',
  'alaska-airlines': '#01426A',
  'spirit-airlines': '#FFE302',
  'frontier-airlines': '#00A651',
  'british-airways': '#075AAA',
  'lufthansa': '#05164D',
  'air-france': '#002157',
  'klm': '#00A1E4',
  'emirates': '#D71921',
  'qatar-airways': '#5C0632',
  'singapore-airlines': '#F59E0B',
  'cathay-pacific': '#005A3C',
  'qantas': '#E0112B',
  'air-new-zealand': '#0D0D0D',
  'ana': '#00467F',
  'japan-airlines': '#C8102E',
  'korean-air': '#00256C',
  'china-airlines': '#003366',
  'eva-air': '#00654B',
  'etihad-airways': '#BD8B13',
  'el-al': '#0033A0',
  'air-canada': '#F01428',
  'westjet': '#00263A',
  'aeromexico': '#00295B',
  'avianca': '#E31937',
  'copa-airlines': '#005DAA',
  'latam': '#ED1651',
  'virgin-atlantic': '#E10A0A',
  'iberia': '#D71921',
  'tap-portugal': '#00965E',
  'aer-lingus': '#006272',
  'turkish-airlines': '#C8102E',
  'finnair': '#0B1560',
  'swiss': '#E2001A',
  'sas': '#00205B',
  'norwegian': '#D81939',
  'icelandair': '#003893',
};

// === Shared Components ===

function renderHead({ title, description, url, image, jsonLd }) {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(url)}">

  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Preconnect to external origins -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://plausible.io">
  <link rel="preconnect" href="https://cdn.tailwindcss.com" crossorigin>

  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="AirlinePlanes">
  ${image ? `<meta property="og:image" content="${escapeHtml(image)}">` : ''}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}">` : ''}

  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}

  <!-- Privacy-friendly analytics by Plausible -->
  <script async src="https://plausible.io/js/pa-r_sufjC9BuCQ2pwIVqJc-.js"></script>
  <script>
    window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
    plausible.init()
  </script>

  <!-- Fonts & Tailwind -->
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&family=Press+Start+2P&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            pixel: ['"Press Start 2P"', 'monospace'],
          },
          colors: {
            'primary': '#3B82F6',
            'primary-hover': '#2563EB',
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
    #sky-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .window-frame {
      border-radius: 24px;
      min-height: calc(100vh - 1.5rem);
      overflow: hidden;
    }
  </style>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const canvas = document.getElementById('sky-canvas');
      if (!canvas) return;
      const gl = canvas.getContext('webgl');
      if (!gl) return;

      const vertexShader = \`
        attribute vec2 a_position;
        void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
      \`;

      const fragmentShader = \`
        precision mediump float;
        uniform float u_time;
        uniform vec2 u_resolution;

        // Draw a single Mario-style cloud (3 bumps)
        float cloud(vec2 uv, vec2 pos, float size) {
          vec2 p = uv - pos;
          p.x /= 1.5;

          float d1 = length(p - vec2(-0.04, 0.0) * size) - 0.025 * size;
          float d2 = length(p - vec2(0.0, 0.012) * size) - 0.032 * size;
          float d3 = length(p - vec2(0.04, 0.0) * size) - 0.025 * size;
          float d4 = length(p - vec2(0.0, -0.008) * size) - 0.04 * size;

          float d = min(min(d1, d2), min(d3, d4));
          return 1.0 - step(0.0, d);
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          float aspect = u_resolution.x / u_resolution.y;

          // Pixelate
          float pixelCount = 100.0;
          vec2 pixelUV = floor(uv * pixelCount) / pixelCount;

          vec2 p = pixelUV;
          p.x *= aspect;

          // Very slow movement
          float t = u_time * 0.008;

          // Clouds spread across the sky
          float c = 0.0;
          // Top clouds
          c = max(c, cloud(p, vec2(mod(t * 0.6, 4.0) - 0.5, 0.93), 1.0));
          c = max(c, cloud(p, vec2(mod(t * 0.4 + 2.0, 4.5) - 0.3, 0.86), 0.8));
          c = max(c, cloud(p, vec2(mod(t * 0.5 + 1.2, 3.8) - 0.4, 0.90), 0.9));
          c = max(c, cloud(p, vec2(mod(t * 0.44 + 0.3, 4.1) - 0.7, 0.88), 0.75));
          // Middle clouds
          c = max(c, cloud(p, vec2(mod(t * 0.45 + 3.0, 4.8) - 0.6, 0.70), 0.75));
          c = max(c, cloud(p, vec2(mod(t * 0.38 + 0.8, 4.2) - 0.3, 0.55), 0.85));
          c = max(c, cloud(p, vec2(mod(t * 0.52 + 2.2, 5.0) - 0.9, 0.45), 0.7));
          c = max(c, cloud(p, vec2(mod(t * 0.42 + 1.5, 3.9) - 0.5, 0.62), 0.8));
          c = max(c, cloud(p, vec2(mod(t * 0.48 + 3.8, 4.4) - 0.7, 0.38), 0.9));
          c = max(c, cloud(p, vec2(mod(t * 0.36 + 2.8, 4.6) - 0.2, 0.50), 0.72));
          c = max(c, cloud(p, vec2(mod(t * 0.41 + 3.6, 4.0) - 3.6, 0.58), 0.82));
          // Bottom clouds
          c = max(c, cloud(p, vec2(mod(t * 0.5 + 3.5, 5.0) - 1.0, 0.08), 0.9));
          c = max(c, cloud(p, vec2(mod(t * 0.35 + 1.0, 4.2) - 0.2, 0.15), 0.7));
          c = max(c, cloud(p, vec2(mod(t * 0.55 + 2.5, 4.0) - 0.8, 0.04), 0.85));
          c = max(c, cloud(p, vec2(mod(t * 0.4 + 0.5, 3.6) - 0.1, 0.22), 0.65));
          c = max(c, cloud(p, vec2(mod(t * 0.46 + 1.8, 4.3) - 0.4, 0.12), 0.78));

          // Sky gradient
          vec3 skyTop = vec3(0.051, 0.157, 1.0);
          vec3 skyBottom = vec3(0.15, 0.3, 1.0);
          vec3 sky = mix(skyBottom, skyTop, uv.y);

          // Cloud color - very subtle, light blue-white tint
          vec3 cloudColor = vec3(0.6, 0.7, 1.0);

          // Subtle blend
          vec3 color = mix(sky, cloudColor, c * 0.25);

          // Pixel airplane
          float planeX = mod(t * 8.0, 1.4) - 0.15;
          float planeY = 0.65;
          float bx = floor((pixelUV.x - planeX) * pixelCount);
          float by = floor((pixelUV.y - planeY) * pixelCount);
          float pl = 0.0;
          if (abs(by - 3.0) < 0.5 && bx > -4.5 && bx < -3.5) pl = 1.0;
          if (abs(by - 2.0) < 0.5 && bx > -4.5 && bx < -2.5) pl = 1.0;
          if (abs(by - 1.0) < 0.5 && bx > -4.5 && bx < 4.5) pl = 1.0;
          if (abs(by) < 0.5 && bx > -5.5 && bx < 5.5) pl = 1.0;
          if (abs(by + 1.0) < 0.5 && bx > -4.5 && bx < 4.5) pl = 1.0;
          if (abs(by + 2.0) < 0.5 && bx > -2.5 && bx < 1.5) pl = 1.0;
          if (abs(by + 3.0) < 0.5 && bx > -1.5 && bx < 0.5) pl = 1.0;
          color = mix(color, vec3(0.8, 0.85, 1.0), pl * 0.6);

          gl_FragColor = vec4(color, 1.0);
        }
      \`;

      function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      }

      const vs = createShader(gl, gl.VERTEX_SHADER, vertexShader);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      const uTime = gl.getUniformLocation(program, 'u_time');
      const uResolution = gl.getUniformLocation(program, 'u_resolution');

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      window.addEventListener('resize', resize);
      resize();

      function render(time) {
        gl.uniform1f(uTime, time * 0.001);
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(render);
      }
      render(0);
    });
  </script>`;
}

function renderHeader(baseUrl) {
  return `
  <header class="sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
      <a href="/" class="text-2xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRLINEPLANES</a>
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
        <a href="/" class="text-xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRLINEPLANES</a>
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
            class="filter-btn px-3 py-1.5 text-sm font-medium transition-all"
            style="border: 1px solid #8b7355; color: #8b7355;"
            data-manufacturer="${escapeHtml(m)}">
      ${escapeHtml(m)}
    </button>
  `).join('');

  const cards = aircraft.map(a => {
    const rangeInMiles = kmToMiles(a.range_km);
    const speedInMph = kmhToMph(a.cruise_speed_kmh);
    const year = a.first_flight ? a.first_flight.split('-')[0] : '';

    const imageHtml = a.image_url
      ? `<img src="${baseUrl}/images/aircraft/${escapeHtml(a.slug)}.webp?v=5" alt="${escapeHtml(a.name)}"
             class="w-full h-full object-cover" loading="lazy"
             onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center\\'><span class=\\'text-5xl\\'>✈</span></div>'">`
      : `<div class="w-full h-full flex items-center justify-center"><span class="text-5xl">✈</span></div>`;

    // Stamp collection style card with pixel-clip frame
    return `
      <div class="aircraft-card pixel-clip p-1 transition-transform duration-300 hover:scale-[1.02]"
           style="background-color: #8b7355;"
           data-manufacturer="${escapeHtml(a.manufacturer)}">
        <a href="/aircraft/${escapeHtml(a.slug)}"
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
              ${escapeHtml(a.name)}
            </h3>
            <p class="text-sm italic" style="color: #7a6b55; font-family: Georgia, serif;">
              ${escapeHtml(a.manufacturer)} · ${year}
            </p>
          </div>

          <!-- Specs in vintage style -->
          <div class="flex justify-center gap-4 text-center pt-3" style="border-top: 1px solid #c9b896;">
            <div>
              <p class="text-xs uppercase tracking-wider mb-0.5" style="color: #9a8b75;">Passengers</p>
              <p class="font-mono font-bold" style="color: #4a3f2f;">${a.passengers}</p>
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
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Aircraft | AirlinePlanes',
    description: `Browse ${aircraft.length} commercial aircraft from ${manufacturers.join(', ')}. Every plane type flown by major airlines.`,
    url: `${baseUrl}/aircraft`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Commercial Aircraft",
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
    .filter-btn:hover { background-color: #f5f0e6; }
    .filter-btn.active { background-color: #8b7355 !important; color: #ffffff !important; border-color: #8b7355 !important; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .pixel-clip {
      clip-path: polygon(
        0 8px, 4px 8px, 4px 4px, 8px 4px, 8px 0,
        calc(100% - 8px) 0, calc(100% - 8px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 8px, 100% 8px,
        100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%,
        8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 0 calc(100% - 8px)
      );
    }
  </style>
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
  ${renderHeader(baseUrl)}

  <!-- Hero -->
  <div class="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10">
    <div class="pixel-clip p-1" style="background-color: #8b7355;">
      <div class="pixel-clip p-5 md:p-8" style="background-color: #ffffff;">
        <div class="md:flex md:items-start md:justify-between md:gap-8 mb-6">
          <div>
            <h1 class="font-display text-3xl md:text-4xl font-semibold mb-2" style="color: #4a3f2f;">Aircraft</h1>
            <p class="leading-relaxed" style="color: #6b5d4d;">
              Every plane type flown by major airlines. Browse specs, history, and details.
            </p>
          </div>
          <div class="shrink-0 mt-3 md:mt-0 text-center">
            <span class="pixel-text uppercase block mb-1" style="font-size: 7px; color: #8b7355;">Total</span>
            <span class="text-3xl font-semibold" style="color: #4a3f2f; font-family: 'Georgia', serif;">${aircraft.length}</span>
          </div>
        </div>

        <!-- Filters -->
        <div style="border-top: 1px solid #e5e5e5; padding-top: 16px;">
          <p class="pixel-text uppercase mb-3" style="font-size: 7px; color: #8b7355; letter-spacing: 0.1em;">Filter by manufacturer</p>
          <div id="manufacturer-filters" class="flex flex-wrap gap-2">
            <button onclick="filterByManufacturer('')"
                    class="filter-btn active px-3 py-1.5 text-sm font-medium transition-all"
                    style="border: 1px solid #8b7355; color: #8b7355;"
                    data-manufacturer="">
              All
            </button>
            ${filterButtons}
          </div>
        </div>
      </div>
    </div>
  </div>

  <main class="max-w-6xl mx-auto px-6 md:px-8 py-4">
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

  const aircraft = await env.DB.prepare(
    `SELECT slug, name, manufacturer, description, passengers, range_km, cruise_speed_kmh,
            engines, length_m, wingspan_m, first_flight, status, image_url, fun_fact, source_url,
            max_takeoff_weight_kg, fuel_capacity_liters, service_ceiling_m, takeoff_distance_m,
            landing_distance_m, climb_rate_fpm, cargo_capacity_m3, max_payload_kg,
            engine_thrust_kn, engine_manufacturer, total_orders, total_delivered, list_price_usd,
            family_slug, variant_order
     FROM aircraft WHERE slug = ?`
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

  // Fetch family variants (same family_slug, different aircraft)
  let familyVariants = [];
  if (aircraft.family_slug) {
    const { results } = await env.DB.prepare(
      `SELECT slug, name, passengers, range_km, image_url
       FROM aircraft
       WHERE family_slug = ? AND slug != ?
       ORDER BY variant_order ASC, name ASC`
    ).bind(aircraft.family_slug, slug).all();
    familyVariants = results;
  }

  // Fetch sources for this aircraft
  const { results: sources } = await env.DB.prepare(
    `SELECT field_name, source_url, source_name, source_type, accessed_at, notes
     FROM aircraft_sources
     WHERE aircraft_slug = ?
     ORDER BY source_type, field_name`
  ).bind(slug).all();

  // Fetch airlines that operate this aircraft
  const { results: airlines } = await env.DB.prepare(`
    SELECT a.slug, a.name, a.iata_code, f.count, f.notes
    FROM airline_fleet f
    JOIN airlines a ON f.airline_slug = a.slug
    WHERE f.aircraft_slug = ?
    ORDER BY f.count DESC
  `).bind(slug).all();

  const imageUrl = aircraft.image_url ? `${baseUrl}/images/aircraft-styled/${aircraft.slug}.webp` : null;
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

  // Build multiple JSON-LD schemas
  const productSchema = {
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
        "name": "Aircraft",
        "item": `${baseUrl}/aircraft`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": aircraft.name,
        "item": `${baseUrl}/aircraft/${slug}`
      }
    ]
  };

  const multipleJsonLd = `
  <script type="application/ld+json">${JSON.stringify(productSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: `${aircraft.name} — Specs & History | AirlinePlanes`,
    description: aircraft.description?.substring(0, 155) || `Learn about the ${aircraft.name} from ${aircraft.manufacturer}. Specs, history, and fun facts.`,
    url: `${baseUrl}/aircraft/${slug}`,
    image: imageUrl,
    jsonLd: null
  })}
  ${multipleJsonLd}
  <style>
    .pixel-border {
      border: none;
      box-shadow:
        0 0 0 2px #8b7355,
        0 0 0 3px #f5f0e6,
        0 0 0 5px #8b7355;
    }
    .pixel-text {
      font-family: 'Press Start 2P', monospace;
      line-height: 1.6;
    }
    .pixel-clip {
      clip-path: polygon(
        0 8px, 4px 8px, 4px 4px, 8px 4px, 8px 0,
        calc(100% - 8px) 0, calc(100% - 8px) 4px, calc(100% - 4px) 4px, calc(100% - 4px) 8px, 100% 8px,
        100% calc(100% - 8px), calc(100% - 4px) calc(100% - 8px), calc(100% - 4px) calc(100% - 4px), calc(100% - 8px) calc(100% - 4px), calc(100% - 8px) 100%,
        8px 100%, 8px calc(100% - 4px), 4px calc(100% - 4px), 4px calc(100% - 8px), 0 calc(100% - 8px)
      );
    }
  </style>
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
  <!-- Hero Header -->
  <header class="relative">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
      <a href="/aircraft" class="inline-flex items-center font-medium mb-8 text-sm transition-colors text-white/70 hover:text-white">
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
        <span class="shrink-0 inline-flex items-center px-4 py-2 pixel-text self-start sm:self-auto" style="font-size: 9px; background-color: #f5f2ed; border: 1px solid #c9b896; color: #4a3f2f;">
          ${escapeHtml(statusLabel)}
        </span>
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Aircraft Image -->
    ${imageUrl ? `
    <div class="mb-10 pixel-clip p-1" style="background-color: #8b7355;">
      <div class="pixel-clip p-3" style="background-color: #f5f0e6;">
        <div style="background-color: #e8e0d0;">
          <img src="${imageUrl}" alt="${escapeHtml(aircraft.name)}" class="w-full h-64 sm:h-80 md:h-96 object-contain">
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Description -->
    <div class="mb-10 p-6" style="background-color: #faf8f5; border: 1px solid #c9b896;">
      <p class="text-lg leading-relaxed italic" style="color: #4a3f2f; font-family: Georgia, serif;">${escapeHtml(aircraft.description)}</p>
    </div>

    <!-- Aircraft Data Plate -->
    <div class="mb-10 p-1 pixel-border" style="background-color: #f5f0e6;">
      <div class="border-2 border-dashed p-6" style="border-color: #c9b896;">
        <p class="pixel-text uppercase tracking-widest text-center mb-5" style="font-size: 10px; color: #9a8b75;">AIRCRAFT DATA</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-0">
          <div class="text-center p-4">
            <p class="pixel-text uppercase tracking-wider mb-1" style="font-size: 8px; color: #9a8b75;">PASSENGERS</p>
            <p class="font-mono text-2xl font-bold" style="color: #4a3f2f;">${aircraft.passengers}</p>
          </div>
          <div class="text-center p-4" style="border-left: 1px solid #c9b896;">
            <p class="pixel-text uppercase tracking-wider mb-1" style="font-size: 8px; color: #9a8b75;">RANGE</p>
            <p class="font-mono text-2xl font-bold" style="color: #4a3f2f;">${formatNumber(rangeInMiles)} mi</p>
          </div>
          <div class="text-center p-4" style="border-left: 1px solid #c9b896;">
            <p class="pixel-text uppercase tracking-wider mb-1" style="font-size: 8px; color: #9a8b75;">SPEED</p>
            <p class="font-mono text-2xl font-bold" style="color: #4a3f2f;">${formatNumber(speedInMph)} mph</p>
          </div>
          <div class="text-center p-4" style="border-left: 1px solid #c9b896;">
            <p class="pixel-text uppercase tracking-wider mb-1" style="font-size: 8px; color: #9a8b75;">FIRST FLIGHT</p>
            <p class="font-mono text-2xl font-bold" style="color: #4a3f2f;">${year}</p>
          </div>
        </div>
      </div>
    </div>

    ${aircraft.fun_fact ? `
    <!-- Fun Fact Card -->
    <div class="p-6 mb-10" style="background-color: #faf8f5; border: 2px dashed #c9b896;">
      <div class="flex items-start gap-4">
        <span class="shrink-0 pixel-text" style="font-size: 16px; color: #8b7355;">?</span>
        <div>
          <h3 class="text-lg font-bold mb-2" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">Did You Know?</h3>
          <p class="leading-relaxed" style="color: #7a6b55;">${escapeHtml(aircraft.fun_fact)}</p>
        </div>
      </div>
    </div>
    ` : ''}

    ${history.length > 0 ? renderHistorySection(grouped) : ''}

    <!-- Technical Specifications -->
    <div class="mb-10">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">
        <span class="w-10 h-10 flex items-center justify-center pixel-border pixel-text" style="font-size: 14px; background-color: #f5f0e6; color: #8b7355;">#</span>
        Technical Specifications
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Performance -->
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          <h3 class="text-lg font-semibold mb-4" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">
            Performance
          </h3>
          <dl class="space-y-0">
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Range</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.range_km)} km (${formatNumber(rangeInMiles)} mi)</dd>
            </div>
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Cruise Speed</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.cruise_speed_kmh)} km/h (${formatNumber(speedInMph)} mph)</dd>
            </div>
            ${aircraft.service_ceiling_m ? `
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Service Ceiling</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.service_ceiling_m)} m (${formatNumber(metersToFeet(aircraft.service_ceiling_m))} ft)</dd>
            </div>
            ` : ''}
            ${aircraft.climb_rate_fpm ? `
            <div class="flex justify-between py-2">
              <dt style="color: #7a6b55;">Climb Rate</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.climb_rate_fpm)} ft/min</dd>
            </div>
            ` : ''}
          </dl>
        </div>

        <!-- Dimensions -->
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          <h3 class="text-lg font-semibold mb-4" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">
            Dimensions
          </h3>
          <dl class="space-y-0">
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Length</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${aircraft.length_m} m (${metersToFeet(aircraft.length_m)} ft)</dd>
            </div>
            <div class="flex justify-between py-2">
              <dt style="color: #7a6b55;">Wingspan</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${aircraft.wingspan_m} m (${metersToFeet(aircraft.wingspan_m)} ft)</dd>
            </div>
          </dl>
        </div>

        <!-- Capacity -->
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          <h3 class="text-lg font-semibold mb-4" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">
            Capacity
          </h3>
          <dl class="space-y-0">
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Passengers</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${aircraft.passengers}</dd>
            </div>
            ${aircraft.cargo_capacity_m3 ? `
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Cargo Volume</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${aircraft.cargo_capacity_m3} m&sup3;</dd>
            </div>
            ` : ''}
            ${aircraft.max_payload_kg ? `
            <div class="flex justify-between py-2">
              <dt style="color: #7a6b55;">Max Payload</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.max_payload_kg)} kg (${formatNumber(kgToLbs(aircraft.max_payload_kg))} lbs)</dd>
            </div>
            ` : ''}
          </dl>
        </div>

        <!-- Engines -->
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          <h3 class="text-lg font-semibold mb-4" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">
            Engines
          </h3>
          <dl class="space-y-0">
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Engine Count</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${aircraft.engines}</dd>
            </div>
            ${aircraft.engine_manufacturer ? `
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Manufacturer</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${escapeHtml(aircraft.engine_manufacturer)}</dd>
            </div>
            ` : ''}
            ${aircraft.engine_thrust_kn ? `
            <div class="flex justify-between py-2">
              <dt style="color: #7a6b55;">Thrust (each)</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${aircraft.engine_thrust_kn} kN</dd>
            </div>
            ` : ''}
          </dl>
        </div>

        <!-- Weights -->
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          <h3 class="text-lg font-semibold mb-4" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">
            Weights
          </h3>
          <dl class="space-y-0">
            ${aircraft.max_takeoff_weight_kg ? `
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Max Takeoff (MTOW)</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.max_takeoff_weight_kg)} kg (${formatNumber(kgToLbs(aircraft.max_takeoff_weight_kg))} lbs)</dd>
            </div>
            ` : ''}
            ${aircraft.fuel_capacity_liters ? `
            <div class="flex justify-between py-2">
              <dt style="color: #7a6b55;">Fuel Capacity</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.fuel_capacity_liters)} L (${formatNumber(litersToGallons(aircraft.fuel_capacity_liters))} gal)</dd>
            </div>
            ` : ''}
          </dl>
        </div>

        <!-- Takeoff/Landing -->
        ${(aircraft.takeoff_distance_m || aircraft.landing_distance_m) ? `
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          <h3 class="text-lg font-semibold mb-4" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">
            Takeoff / Landing
          </h3>
          <dl class="space-y-0">
            ${aircraft.takeoff_distance_m ? `
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Takeoff Distance</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.takeoff_distance_m)} m (${formatNumber(metersToFeet(aircraft.takeoff_distance_m))} ft)</dd>
            </div>
            ` : ''}
            ${aircraft.landing_distance_m ? `
            <div class="flex justify-between py-2">
              <dt style="color: #7a6b55;">Landing Distance</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.landing_distance_m)} m (${formatNumber(metersToFeet(aircraft.landing_distance_m))} ft)</dd>
            </div>
            ` : ''}
          </dl>
        </div>
        ` : ''}

        <!-- Commercial -->
        ${(aircraft.total_orders || aircraft.total_delivered || aircraft.list_price_usd) ? `
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          <h3 class="text-lg font-semibold mb-4" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">
            Commercial
          </h3>
          <dl class="space-y-0">
            ${aircraft.total_orders ? `
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Total Orders</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.total_orders)}</dd>
            </div>
            ` : ''}
            ${aircraft.total_delivered ? `
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">Delivered</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatNumber(aircraft.total_delivered)}</dd>
            </div>
            ` : ''}
            ${aircraft.list_price_usd ? `
            <div class="flex justify-between py-2">
              <dt style="color: #7a6b55;">List Price</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatPrice(aircraft.list_price_usd)}</dd>
            </div>
            ` : ''}
          </dl>
        </div>
        ` : ''}

        <!-- History -->
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          <h3 class="text-lg font-semibold mb-4" style="color: #4a3f2f; font-family: Georgia, serif; font-style: italic;">
            History
          </h3>
          <dl class="space-y-0">
            <div class="flex justify-between py-2" style="border-bottom: 1px dashed #c9b896;">
              <dt style="color: #7a6b55;">First Flight</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${formatDate(aircraft.first_flight)}</dd>
            </div>
            <div class="flex justify-between py-2">
              <dt style="color: #7a6b55;">Status</dt>
              <dd class="font-mono font-semibold" style="color: #4a3f2f;">${escapeHtml(aircraft.status)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    ${familyVariants.length > 0 ? `
    <!-- Related Variants -->
    <div class="mb-10">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">
        <span class="w-10 h-10 flex items-center justify-center pixel-border pixel-text" style="font-size: 14px; background-color: #f5f0e6; color: #8b7355;">~</span>
        Related Variants
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${familyVariants.map(v => `
          <a href="/aircraft/${escapeHtml(v.slug)}" class="group block p-2 overflow-hidden transition-all hover:scale-[1.02] pixel-border" style="background-color: #f5f0e6;">
            <div class="border-2 border-dashed p-1 mb-2" style="border-color: #c9b896;">
            ${v.image_url
              ? `<div class="aspect-[4/3] overflow-hidden" style="background-color: #e8e0d0;">
                   <img src="${baseUrl}/images/aircraft-styled/${escapeHtml(v.slug)}.webp" alt="${escapeHtml(v.name)}"
                        class="w-full h-full object-contain transition-transform duration-300" loading="lazy">
                 </div>`
              : `<div class="aspect-[4/3] flex items-center justify-center" style="background-color: #e8e0d0;">
                   <span class="text-2xl opacity-30">&#9992;</span>
                 </div>`
            }
            </div>
            <div class="px-1 pb-1">
              <p class="font-medium text-sm" style="color: #4a3f2f;">${escapeHtml(v.name)}</p>
              <p class="text-xs mt-1 font-mono" style="color: #9a8b75;">${v.passengers} pax | ${formatNumber(kmToMiles(v.range_km))} mi</p>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${airlines.length > 0 ? `
    <!-- Airlines Operating This Aircraft -->
    <div class="mb-10">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">
        <span class="w-10 h-10 flex items-center justify-center pixel-border pixel-text" style="font-size: 14px; background-color: #f5f0e6; color: #8b7355;">+</span>
        Airlines Operating This Aircraft
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${airlines.map(a => {
          const brandColor = airlineBrandColors[a.slug] || '#8b7355';
          return `
          <a href="/airlines/${escapeHtml(a.slug)}" class="group block p-4 transition-all hover:shadow-md" style="background-color: #faf8f5; border: 1px solid #d4c8b8; border-left: 4px solid ${brandColor};">
            <div class="flex items-center gap-3 mb-3">
              <img src="${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.png?v=5"
                   alt="${escapeHtml(a.name)} logo"
                   class="w-8 h-8 object-contain"
                   onerror="this.src='${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.svg?v=5'; this.onerror=function(){this.style.display='none'; this.nextElementSibling.style.display='flex';};">
              <span class="hidden w-8 h-8 items-center justify-center pixel-text" style="font-size: 8px; background-color: #f5f0e6; border: 1px solid #c9b896; color: #4a3f2f;">${escapeHtml(a.iata_code)}</span>
            </div>
            <h3 class="font-semibold text-sm mb-1" style="color: #4a3f2f;">${escapeHtml(a.name)}</h3>
            <div class="flex items-center gap-2">
              <span class="pixel-text px-1.5 py-0.5" style="font-size: 8px; background-color: #f5f0e6; border: 1px solid #c9b896; color: #4a3f2f;">${escapeHtml(a.iata_code)}</span>
              <span class="font-mono text-xs" style="color: #9a8b75;">${a.count} in fleet</span>
            </div>
            ${a.notes ? `<p class="text-xs mt-1" style="color: #9a8b75;">${escapeHtml(a.notes)}</p>` : ''}
          </a>`;
        }).join('')}
      </div>
    </div>
    ` : ''}

    ${related.length > 0 ? `
    <!-- Related Aircraft -->
    <div class="mb-10">
      <h2 class="text-2xl font-bold mb-6 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">More from ${escapeHtml(aircraft.manufacturer)}</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${related.map(r => `
          <a href="/aircraft/${escapeHtml(r.slug)}" class="group block p-2 overflow-hidden transition-all hover:scale-[1.02] pixel-border" style="background-color: #f5f0e6;">
            <div class="border-2 border-dashed p-1 mb-2" style="border-color: #c9b896;">
            ${r.image_url
              ? `<div class="aspect-[4/3] overflow-hidden" style="background-color: #e8e0d0;">
                   <img src="${baseUrl}/images/aircraft-styled/${escapeHtml(r.slug)}.webp" alt="${escapeHtml(r.name)}"
                        class="w-full h-full object-contain transition-transform duration-300" loading="lazy">
                 </div>`
              : `<div class="aspect-[4/3] flex items-center justify-center" style="background-color: #e8e0d0;">
                   <span class="text-2xl opacity-30">&#9992;</span>
                 </div>`
            }
            </div>
            <div class="px-1 pb-1">
              <p class="font-medium text-sm" style="color: #4a3f2f;">${escapeHtml(r.name)}</p>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
    ` : ''}

    ${sources.length > 0 ? `
    <!-- Sources -->
    <div class="mb-10">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">
        <span class="w-10 h-10 flex items-center justify-center pixel-border pixel-text" style="font-size: 14px; background-color: #f5f0e6; color: #8b7355;">@</span>
        Sources
      </h2>
      <div class="p-6" style="background-color: #faf8f5; border: 1px solid #d4c8b8;">
        <p class="text-sm mb-4" style="color: #7a6b55;">Data compiled from the following sources:</p>
        <ul class="space-y-3">
          ${[...new Map(sources.map(s => [s.source_url, s])).values()].map(s => `
            <li class="flex items-start gap-3">
              <span class="shrink-0 w-6 h-6 flex items-center justify-center pixel-text" style="font-size: 10px; border: 1px solid #c9b896; color: #8b7355; background-color: #f5f0e6;">
                ${s.source_type === 'manufacturer' ? 'M' : s.source_type === 'aviation_db' ? 'D' : 'N'}
              </span>
              <div>
                <a href="${escapeHtml(s.source_url)}" target="_blank" rel="noopener" class="font-medium underline underline-offset-2 transition-colors" style="color: #8b7355;">
                  ${escapeHtml(s.source_name)}
                </a>
                ${s.notes ? `<p class="text-xs mt-0.5" style="color: #9a8b75;">${escapeHtml(s.notes)}</p>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
        <p class="text-xs mt-4 pt-4" style="color: #9a8b75; border-top: 1px dashed #c9b896;">
          <span class="inline-flex items-center gap-1"><span class="w-4 h-4 flex items-center justify-center pixel-text" style="font-size: 10px; border: 1px solid #c9b896; color: #8b7355; background-color: #f5f0e6;">M</span> Manufacturer</span>
          <span class="inline-flex items-center gap-1 ml-3"><span class="w-4 h-4 flex items-center justify-center pixel-text" style="font-size: 10px; border: 1px solid #c9b896; color: #8b7355; background-color: #f5f0e6;">D</span> Aviation Database</span>
          <span class="inline-flex items-center gap-1 ml-3"><span class="w-4 h-4 flex items-center justify-center pixel-text" style="font-size: 10px; border: 1px solid #c9b896; color: #8b7355; background-color: #f5f0e6;">N</span> News</span>
        </p>
      </div>
    </div>
    ` : aircraft.source_url ? `
    <!-- Source Attribution -->
    <div class="text-center py-6" style="border-top: 1px dashed #c9b896;">
      <p class="text-sm" style="color: #7a6b55;">
        Data sourced from
        <a href="${escapeHtml(aircraft.source_url)}" target="_blank" rel="noopener" class="font-medium underline underline-offset-2 transition-colors" style="color: #8b7355;">
          ${escapeHtml(new URL(aircraft.source_url).hostname)}
        </a>
      </p>
    </div>
    ` : ''}

    <!-- Back to Directory CTA -->
    <div class="text-center py-8">
      <a href="/" class="inline-flex items-center gap-2 font-semibold transition-colors text-white/80 hover:text-white" style="font-family: Georgia, serif;">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Explore More Aircraft
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

function renderHistorySection(grouped) {
  let html = `
    <div class="mb-10">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">
        <span class="w-10 h-10 flex items-center justify-center pixel-border pixel-text" style="font-size: 14px; background-color: #f5f0e6; color: #8b7355;">*</span>
        History & Timeline
      </h2>`;

  // Milestones timeline
  if (grouped.milestone.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">Key Milestones</h3>
        <div class="relative pl-6 ml-3 space-y-6" style="border-left: 2px solid #c9b896;">
          ${grouped.milestone.map(m => `
            <div class="relative">
              <div class="absolute -left-9 w-4 h-4 rounded-full" style="background-color: #8b7355; border: 2px solid #f5f0e6;"></div>
              <div class="p-4" style="background-color: #faf8f5; border: 1px solid #d4c8b8;">
                <span class="font-mono font-semibold text-sm" style="color: #8b7355;">${m.year || ''}</span>
                <h4 class="font-semibold mt-1" style="color: #4a3f2f;">${escapeHtml(m.title)}</h4>
                <p class="text-sm mt-2" style="color: #7a6b55;">${escapeHtml(m.content)}</p>
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
        <h3 class="text-lg font-semibold mb-4 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">Development Story</h3>
        <div class="space-y-4">
          ${grouped.development.map(d => `
            <div class="p-5" style="background-color: #faf8f5; border: 1px solid #d4c8b8;">
              <h4 class="font-semibold mb-2" style="color: #4a3f2f;">${escapeHtml(d.title)}</h4>
              <p class="leading-relaxed" style="color: #7a6b55;">${escapeHtml(d.content)}</p>
            </div>
          `).join('')}
          ${grouped.story.map(s => `
            <div class="p-5" style="background-color: #faf8f5; border: 1px solid #d4c8b8;">
              <h4 class="font-semibold mb-2" style="color: #4a3f2f;">${escapeHtml(s.title)}</h4>
              <p class="leading-relaxed" style="color: #7a6b55;">${escapeHtml(s.content)}</p>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // Facts
  if (grouped.fact.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">Interesting Facts</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${grouped.fact.map(f => `
            <div class="p-4" style="background-color: #faf8f5; border: 1px solid #d4c8b8;">
              <h4 class="font-semibold text-sm" style="color: #4a3f2f;">${escapeHtml(f.title)}</h4>
              <p class="text-sm mt-1" style="color: #7a6b55;">${escapeHtml(f.content)}</p>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // Records
  if (grouped.record.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">Records & Achievements</h3>
        <div class="space-y-4">
          ${grouped.record.map(r => `
            <div class="p-5" style="background-color: #faf8f5; border: 1px solid #d4c8b8;">
              <h4 class="font-semibold" style="color: #4a3f2f;">${escapeHtml(r.title)}</h4>
              <p class="mt-1" style="color: #7a6b55;">${escapeHtml(r.content)}</p>
              ${r.year ? `<span class="inline-block mt-2 text-xs font-mono font-medium" style="color: #8b7355;">${r.year}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // Legacy
  if (grouped.legacy.length > 0) {
    html += `
      <div class="mb-8">
        <h3 class="text-lg font-semibold mb-4 text-white drop-shadow" style="font-family: Georgia, serif; font-style: italic;">Legacy & Impact</h3>
        <div class="p-6 pixel-border" style="background-color: #f5f0e6;">
          ${grouped.legacy.map(l => `
            <div class="mb-4 last:mb-0">
              <h4 class="font-semibold mb-2" style="color: #4a3f2f;">${escapeHtml(l.title)}</h4>
              <p class="leading-relaxed" style="color: #7a6b55;">${escapeHtml(l.content)}</p>
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
    title: 'Not Found | AirlinePlanes',
    description: message,
    url: baseUrl
  })}
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
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
  </div>
</body>
</html>`;
}
