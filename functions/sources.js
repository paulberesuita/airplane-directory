// GET /sources - Sources page styled as a pilot's flight logbook (SSR)

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    const [{ results: sources }, { results: aircraftCount }] = await Promise.all([
      env.DB.prepare(`
        SELECT source_name, source_type, source_url,
               COUNT(*) as times_used
        FROM aircraft_sources
        GROUP BY source_name, source_url
        ORDER BY source_type, times_used DESC
      `).all(),
      env.DB.prepare('SELECT COUNT(DISTINCT slug) as count FROM aircraft').all()
    ]);

    const html = renderSourcesPage(baseUrl, sources, aircraftCount[0]?.count || 0);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    console.error('Error loading sources page:', error);
    return new Response('Error loading page', { status: 500 });
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

function renderHead({ title, description, url, jsonLd }) {
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

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">

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
          },
          colors: {
            'primary': '#3B82F6',
            'primary-hover': '#2563EB',
            'background': 'rgba(248, 250, 252, 0.85)',
            'card': 'rgba(255, 255, 255, 0.95)',
            'border': '#E2E8F0',
            'muted': '#64748B',
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
    .logbook-page {
      background-color: #f5f0e6;
      border-left: 3px solid #8b7355;
    }
    .logbook-row {
      border-bottom: 1px solid #c9b896;
    }
    .logbook-row:hover {
      background-color: #eee8d8;
    }
    .logbook-col {
      border-right: 1px solid #d4c8b8;
    }
    .logbook-header {
      border-bottom: 2px solid #8b7355;
      background-color: #ece5d5;
    }
    @media (max-width: 767px) {
      .hide-mobile { display: none; }
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
          float pixelCount = 100.0;
          vec2 pixelUV = floor(uv * pixelCount) / pixelCount;
          vec2 p = pixelUV;
          p.x *= aspect;
          float t = u_time * 0.008;

          float c = 0.0;
          c = max(c, cloud(p, vec2(mod(t * 0.6, 4.0) - 0.5, 0.93), 1.0));
          c = max(c, cloud(p, vec2(mod(t * 0.4 + 2.0, 4.5) - 0.3, 0.86), 0.8));
          c = max(c, cloud(p, vec2(mod(t * 0.5 + 1.2, 3.8) - 0.4, 0.90), 0.9));
          c = max(c, cloud(p, vec2(mod(t * 0.45 + 3.0, 4.8) - 0.6, 0.70), 0.75));
          c = max(c, cloud(p, vec2(mod(t * 0.38 + 0.8, 4.2) - 0.3, 0.55), 0.85));
          c = max(c, cloud(p, vec2(mod(t * 0.52 + 2.2, 5.0) - 0.9, 0.45), 0.7));
          c = max(c, cloud(p, vec2(mod(t * 0.5 + 3.5, 5.0) - 1.0, 0.08), 0.9));
          c = max(c, cloud(p, vec2(mod(t * 0.35 + 1.0, 4.2) - 0.2, 0.15), 0.7));

          vec3 skyTop = vec3(0.051, 0.157, 1.0);
          vec3 skyBottom = vec3(0.15, 0.3, 1.0);
          vec3 sky = mix(skyBottom, skyTop, uv.y);
          vec3 cloudColor = vec3(0.6, 0.7, 1.0);
          vec3 color = mix(sky, cloudColor, c * 0.25);

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

function renderSourcesPage(baseUrl, sources, aircraftVerified) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Sources", "item": `${baseUrl}/sources` }
    ]
  };

  // Group sources by type
  const typeMap = {
    manufacturer: { label: 'Manufacturers', code: 'M' },
    aviation_db: { label: 'Aviation Databases', code: 'D' },
    news: { label: 'News & Publications', code: 'N' }
  };

  const grouped = {};
  for (const type of Object.keys(typeMap)) {
    grouped[type] = sources.filter(s => s.source_type === type);
  }

  const totalRefs = sources.reduce((sum, s) => sum + s.times_used, 0);
  const totalEntries = sources.length;

  // Build logbook pages
  let logNumber = 1;
  let logbookPages = '';

  for (const [type, entries] of Object.entries(grouped)) {
    if (entries.length === 0) continue;
    const { label, code } = typeMap[type];
    const subtotal = entries.reduce((sum, s) => sum + s.times_used, 0);

    const rows = entries.map(s => {
      const num = String(logNumber++).padStart(3, '0');

      return `
              <tr class="logbook-row">
                <td class="logbook-col hide-mobile px-3 py-2 font-mono text-center" style="color: #9a8b75; width: 60px;">${num}</td>
                <td class="logbook-col px-2 py-2 text-center" style="width: 36px;">
                  <span class="pixel-text inline-flex items-center justify-center" style="font-size: 8px; color: #8b7355; width: 22px; height: 22px; border: 1px solid #c9b896;">${code}</span>
                </td>
                <td class="logbook-col px-3 py-2" style="color: #4a3f2f;">
                  <a href="${escapeHtml(s.source_url)}" target="_blank" rel="noopener" class="hover:underline" style="font-family: Inter, system-ui, sans-serif;">${escapeHtml(s.source_name)}</a>
                </td>
                <td class="px-3 py-2 font-mono text-center" style="color: #4a3f2f; width: 60px;">${s.times_used}</td>
              </tr>`;
    }).join('');

    logbookPages += `
      <div class="mb-8">
        <h3 class="mb-3" style="color: #ffffff; font-family: Georgia, serif; font-style: italic; font-size: 1.1rem;">${escapeHtml(label)}</h3>
        <div class="logbook-page overflow-x-auto">
          <table class="w-full text-sm" style="border-collapse: collapse;">
            <thead>
              <tr class="logbook-header">
                <th class="logbook-col hide-mobile px-3 py-2 text-left"><span class="text-xs font-semibold uppercase tracking-wider" style="color: #8b7355;">#</span></th>
                <th class="logbook-col px-2 py-2 text-center" style="width: 36px;"><span class="text-xs font-semibold uppercase tracking-wider" style="color: #8b7355;">Type</span></th>
                <th class="logbook-col px-3 py-2 text-left"><span class="text-xs font-semibold uppercase tracking-wider" style="color: #8b7355;">Source</span></th>
                <th class="px-3 py-2 text-center"><span class="text-xs font-semibold uppercase tracking-wider" style="color: #8b7355;">Citations</span></th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="text-right px-3 py-2" style="border-top: 1px dashed #c9b896;">
            <span class="font-mono text-sm" style="color: #7a6b55;">SUBTOTAL: <strong style="color: #4a3f2f;">${subtotal}</strong></span>
          </div>
        </div>
      </div>`;
  }

  const now = new Date();
  const lastUpdated = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Sources — Pilot\'s Research Log | AirlinePlanes',
    description: 'Every aircraft specification on AirlinePlanes is verified against manufacturer data, aviation databases, and industry publications. See all our sources.',
    url: `${baseUrl}/sources`,
    jsonLd: null
  })}
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
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
        <a href="/sources" class="text-white hover:text-white/80 transition-colors">Sources</a>
      </div>
    </div>
  </nav>

  <!-- Content -->
  <main class="max-w-4xl mx-auto px-4 py-8">

    <!-- Cover Header -->
    <div class="pixel-clip p-1 mb-8" style="background-color: #8b7355;">
      <div class="pixel-clip px-6 py-5 md:px-8 md:py-6 text-center" style="background-color: #4a3f2f;">
        <p class="pixel-text uppercase tracking-widest mb-2" style="font-size: 10px; color: #c9b896;">Pilot's Research Log</p>
        <p class="text-sm" style="color: #c9b896; font-family: Georgia, serif; font-style: italic;">AirlinePlanes &middot; Est. 2026</p>
      </div>
    </div>

    <!-- Intro -->
    <p class="text-sm mb-8 leading-relaxed" style="color: #f5f0e6;">
      Every aircraft specification is cross-referenced against manufacturer publications, aviation databases, and industry news. This log documents every source consulted.
    </p>

    <!-- Logbook Pages -->
    ${logbookPages}

    <!-- Summary Footer -->
    <div class="logbook-page px-4 py-4 md:px-6 md:py-5 mt-8" style="border-top: 2px dashed #8b7355;">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <span class="pixel-text uppercase block mb-1" style="font-size: 7px; color: #8b7355;">Total Entries</span>
          <span class="font-mono text-lg font-bold" style="color: #4a3f2f;">${totalEntries}</span>
        </div>
        <div>
          <span class="pixel-text uppercase block mb-1" style="font-size: 7px; color: #8b7355;">Total References</span>
          <span class="font-mono text-lg font-bold" style="color: #4a3f2f;">${totalRefs}</span>
        </div>
        <div>
          <span class="pixel-text uppercase block mb-1" style="font-size: 7px; color: #8b7355;">Aircraft Verified</span>
          <span class="font-mono text-lg font-bold" style="color: #4a3f2f;">${aircraftVerified}</span>
        </div>
        <div>
          <span class="pixel-text uppercase block mb-1" style="font-size: 7px; color: #8b7355;">Last Updated</span>
          <span class="font-mono text-lg font-bold" style="color: #4a3f2f;">${lastUpdated}</span>
        </div>
      </div>
    </div>

  </main>

  <!-- Footer -->
  <footer class="mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="/" class="text-xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRLINEPLANES</a>
        <nav class="flex items-center gap-6">
          <a href="/airlines" class="text-white/90 hover:text-white text-sm transition-colors">Airlines</a>
          <a href="/aircraft" class="text-white/90 hover:text-white text-sm transition-colors">Aircraft</a>
          <a href="/sources" class="text-white/90 hover:text-white text-sm transition-colors">Sources</a>
          <a href="/about" class="text-white/90 hover:text-white text-sm transition-colors">About</a>
        </nav>
      </div>
    </div>
  </footer>

  </div>
</body>
</html>`;
}
