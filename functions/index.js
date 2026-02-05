// GET / - Homepage with airlines and aircraft grid (SSR)
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Fetch top 6 airlines with fleet counts for homepage
    const { results: airlines } = await env.DB.prepare(`
      SELECT a.*, COUNT(DISTINCT af.aircraft_slug) as aircraft_types,
             SUM(af.count) as total_aircraft
      FROM airlines a
      LEFT JOIN airline_fleet af ON a.slug = af.airline_slug
      GROUP BY a.id
      ORDER BY a.fleet_size DESC
      LIMIT 6
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

        // Draw a single Mario-style cloud (3 bumps) - smaller
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
  // For light colors like Spirit's yellow, we need dark text
  const needsDarkText = ['spirit-airlines'].includes(airline.slug);
  const textColor = needsDarkText ? 'text-slate-800' : 'text-white';
  const textMutedColor = needsDarkText ? 'text-slate-600' : 'text-white/80';

  // Boarding pass style card with header and cutouts
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

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'AirlinePlanes — Know What Airlines Fly',
    description: `Explore the fleets of ${airlines.length} major airlines with ${formatNumber(totalAircraft)}+ aircraft. See which planes Emirates, British Airways, Lufthansa, Singapore Airlines and more operate.`,
    url: baseUrl,
    image: aircraft[0]?.image_url ? `${baseUrl}/images/aircraft-styled/${aircraft[0].slug}.jpg` : null,
    jsonLd: null
  })}
  ${multipleJsonLd}
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
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
  <!-- Nav -->
  <nav class="sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
      <a href="/" class="text-2xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRLINEPLANES</a>
      <div class="flex gap-6 text-sm">
        <a href="/airlines" class="text-white/70 hover:text-white transition-colors">Airlines</a>
        <a href="/aircraft" class="text-white/70 hover:text-white transition-colors">Aircraft</a>
      </div>
    </div>
  </nav>

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
        <a href="/" class="text-xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRLINEPLANES</a>
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
