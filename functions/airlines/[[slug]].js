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

// Airline brand colors
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
            'primary': '#3B82F6',
            'primary-hover': '#2563EB',
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
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
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
