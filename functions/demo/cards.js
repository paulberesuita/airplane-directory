// GET /demo/cards - Card Style Demo Page
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Get 6 sample airlines for the demo
    const { results: airlines } = await env.DB.prepare(`
      SELECT * FROM airlines ORDER BY fleet_size DESC LIMIT 6
    `).all();

    const html = renderDemoPage(airlines, baseUrl);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    console.error('Error loading demo page:', error);
    return new Response('Error loading demo page', { status: 500 });
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
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// === Style 1: Logo Mosaic / Icon Grid ===
function renderLogoMosaic(airlines, baseUrl) {
  return `
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-1">
      ${airlines.map(a => `
        <a href="/airlines/${escapeHtml(a.slug)}"
           class="group relative aspect-square bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center p-4">
          <img src="${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.svg?v=4"
               alt="${escapeHtml(a.name)}"
               class="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
               onerror="this.src='${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.png?v=4';">
          <span class="absolute inset-x-0 bottom-0 bg-black/70 text-white text-xs text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            ${escapeHtml(a.name)}
          </span>
        </a>
      `).join('')}
    </div>`;
}

// === Style 2: Pixel-Border Cards ===
function renderPixelCards(airlines, baseUrl) {
  return `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
      ${airlines.map(a => `
        <a href="/airlines/${escapeHtml(a.slug)}"
           class="group block bg-white p-4 transition-transform hover:-translate-y-1"
           style="clip-path: polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px));">
          <div class="flex items-center gap-3 mb-3">
            <img src="${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.svg?v=4"
                 alt="${escapeHtml(a.name)} logo"
                 class="w-10 h-10 object-contain"
                 onerror="this.style.display='none';">
            <span class="font-mono text-sm font-bold text-slate-400">${escapeHtml(a.iata_code)}</span>
          </div>
          <h3 class="font-display font-semibold text-slate-800 group-hover:text-primary transition-colors">
            ${escapeHtml(a.name)}
          </h3>
          <p class="text-sm text-slate-500 mt-1">${formatNumber(a.fleet_size)} aircraft</p>
        </a>
      `).join('')}
    </div>`;
}

// === Style 3: Floating Cards ===
function renderFloatingCards(airlines, baseUrl) {
  return `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-6">
      ${airlines.map((a, i) => `
        <a href="/airlines/${escapeHtml(a.slug)}"
           class="group block bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow floating-card"
           style="animation-delay: ${i * 0.2}s;">
          <div class="flex items-center gap-3 mb-3">
            <img src="${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.svg?v=4"
                 alt="${escapeHtml(a.name)} logo"
                 class="w-12 h-12 object-contain"
                 onerror="this.style.display='none';">
          </div>
          <h3 class="font-display font-semibold text-slate-800 group-hover:text-primary transition-colors">
            ${escapeHtml(a.name)}
          </h3>
          <p class="text-sm text-slate-500 mt-1">${escapeHtml(a.headquarters)}</p>
          <p class="text-xs text-slate-400 mt-2">${formatNumber(a.fleet_size)} aircraft</p>
        </a>
      `).join('')}
    </div>`;
}

// === Style 4: Stamp Collection ===
function renderStampCollection(airlines, baseUrl) {
  const rotations = [-3, 2, -1, 3, -2, 1];
  return `
    <div class="flex flex-wrap justify-center gap-6 py-4">
      ${airlines.map((a, i) => `
        <a href="/airlines/${escapeHtml(a.slug)}"
           class="group block bg-[#f5f0e6] border-4 border-double border-[#8b7355] p-4 w-36 text-center transition-transform hover:scale-105"
           style="transform: rotate(${rotations[i]}deg);">
          <div class="border-2 border-dashed border-[#8b7355]/50 p-3 mb-2">
            <img src="${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.svg?v=4"
                 alt="${escapeHtml(a.name)} logo"
                 class="w-16 h-16 mx-auto object-contain opacity-90 sepia"
                 onerror="this.style.display='none';">
          </div>
          <p class="font-mono text-xs font-bold text-[#5c4a32] uppercase tracking-wider">
            ${escapeHtml(a.iata_code)}
          </p>
          <p class="text-[10px] text-[#8b7355] mt-1 font-serif italic">
            ${escapeHtml(a.name)}
          </p>
        </a>
      `).join('')}
    </div>`;
}

// === Style 5: Boarding Pass Style ===
function renderBoardingPass(airlines, baseUrl) {
  return `
    <div class="space-y-4">
      ${airlines.slice(0, 3).map(a => `
        <a href="/airlines/${escapeHtml(a.slug)}"
           class="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div class="flex">
            <!-- Left stub -->
            <div class="w-24 bg-slate-100 p-3 flex flex-col items-center justify-center border-r-2 border-dashed border-slate-300">
              <img src="${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.svg?v=4"
                   alt="${escapeHtml(a.name)} logo"
                   class="w-12 h-12 object-contain mb-2"
                   onerror="this.style.display='none';">
              <span class="font-mono text-lg font-bold text-slate-700">${escapeHtml(a.iata_code)}</span>
            </div>
            <!-- Main ticket -->
            <div class="flex-1 p-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="text-xs text-slate-400 uppercase tracking-wider">Airline</p>
                  <h3 class="font-display font-semibold text-slate-800 group-hover:text-primary transition-colors">
                    ${escapeHtml(a.name)}
                  </h3>
                </div>
                <div class="text-right">
                  <p class="text-xs text-slate-400 uppercase tracking-wider">Fleet</p>
                  <p class="font-mono text-lg font-bold text-slate-700">${formatNumber(a.fleet_size)}</p>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                <span>${escapeHtml(a.headquarters)}</span>
                <span>Founded ${a.founded}</span>
              </div>
            </div>
            <!-- Barcode stub -->
            <div class="w-16 bg-slate-50 p-2 flex items-center justify-center border-l border-slate-200">
              <div class="space-y-0.5">
                ${[...Array(12)].map(() => `<div class="h-1 bg-slate-800" style="width: ${Math.random() * 8 + 4}px;"></div>`).join('')}
              </div>
            </div>
          </div>
        </a>
      `).join('')}
    </div>`;
}

// === Style 6: Airplane Window Frames ===
function renderWindowFrames(airlines, baseUrl) {
  return `
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-8">
      ${airlines.map(a => `
        <a href="/airlines/${escapeHtml(a.slug)}"
           class="group block text-center">
          <!-- Window frame -->
          <div class="relative mx-auto w-28 h-36 bg-gradient-to-b from-sky-200 to-sky-400 rounded-[40%_40%_45%_45%] border-[6px] border-slate-400 shadow-inner overflow-hidden mb-3">
            <div class="absolute inset-2 bg-white/30 rounded-[35%_35%_40%_40%] flex items-center justify-center p-3">
              <img src="${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.svg?v=4"
                   alt="${escapeHtml(a.name)} logo"
                   class="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform"
                   onerror="this.style.display='none';">
            </div>
            <!-- Window shade line -->
            <div class="absolute top-0 left-2 right-2 h-3 bg-slate-300/50 rounded-b-full"></div>
          </div>
          <h3 class="font-display font-semibold text-white group-hover:text-yellow-300 transition-colors drop-shadow">
            ${escapeHtml(a.name)}
          </h3>
          <p class="text-sm text-white/80">${escapeHtml(a.iata_code)}</p>
        </a>
      `).join('')}
    </div>`;
}

// === Style 7: Compact Pills/Chips ===
function renderPillChips(airlines, baseUrl) {
  return `
    <div class="flex flex-wrap gap-3 justify-center">
      ${airlines.map(a => `
        <a href="/airlines/${escapeHtml(a.slug)}"
           class="group inline-flex items-center gap-2 bg-white/90 backdrop-blur pl-1 pr-4 py-1 rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all">
          <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            <img src="${baseUrl}/images/airline-icons/${escapeHtml(a.slug)}.svg?v=4"
                 alt="${escapeHtml(a.name)} logo"
                 class="w-6 h-6 object-contain"
                 onerror="this.textContent='${escapeHtml(a.iata_code)}';">
          </div>
          <span class="font-medium text-sm text-slate-700 group-hover:text-primary transition-colors">
            ${escapeHtml(a.name)}
          </span>
        </a>
      `).join('')}
    </div>`;
}

function renderDemoPage(airlines, baseUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Card Styles Demo | AirlinePlanes</title>
  <meta name="robots" content="noindex, nofollow">

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
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .floating-card {
      animation: float 4s ease-in-out infinite;
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
          c = max(c, cloud(p, vec2(mod(t * 0.5 + 3.5, 5.0) - 1.0, 0.08), 0.9));
          vec3 skyTop = vec3(0.051, 0.157, 1.0);
          vec3 skyBottom = vec3(0.15, 0.3, 1.0);
          vec3 sky = mix(skyBottom, skyTop, uv.y);
          vec3 cloudColor = vec3(0.6, 0.7, 1.0);
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
  </script>
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
    <!-- Header -->
    <header class="sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
        <a href="/" class="text-2xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRLINEPLANES</a>
        <span class="text-white/70 text-sm">Card Style Demo</span>
      </div>
    </header>

    <!-- Page Title -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="font-display text-3xl md:text-4xl font-semibold text-white mb-2 drop-shadow-lg">Card Style Comparison</h1>
      <p class="text-white/80">7 playful card styles for airline display. Same 6 airlines shown in each style.</p>
    </div>

    <!-- Card Styles -->
    <main class="max-w-7xl mx-auto px-4 pb-16 space-y-16">

      <!-- Style 1: Logo Mosaic -->
      <section>
        <div class="mb-4">
          <h2 class="font-display text-xl font-semibold text-white drop-shadow">1. Logo Mosaic / Icon Grid</h2>
          <p class="text-white/70 text-sm">Tight grid of logos, names appear on hover</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          ${renderLogoMosaic(airlines, baseUrl)}
        </div>
      </section>

      <!-- Style 2: Pixel-Border Cards -->
      <section>
        <div class="mb-4">
          <h2 class="font-display text-xl font-semibold text-white drop-shadow">2. Pixel-Border Cards</h2>
          <p class="text-white/70 text-sm">Cards with stepped/pixelated edges using CSS clip-path</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          ${renderPixelCards(airlines, baseUrl)}
        </div>
      </section>

      <!-- Style 3: Floating Cards -->
      <section>
        <div class="mb-4">
          <h2 class="font-display text-xl font-semibold text-white drop-shadow">3. Floating Cards</h2>
          <p class="text-white/70 text-sm">Cards with subtle CSS bobbing animation</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          ${renderFloatingCards(airlines, baseUrl)}
        </div>
      </section>

      <!-- Style 4: Stamp Collection -->
      <section>
        <div class="mb-4">
          <h2 class="font-display text-xl font-semibold text-white drop-shadow">4. Stamp Collection</h2>
          <p class="text-white/70 text-sm">Passport stamp aesthetic with rotated cards, vintage feel</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          ${renderStampCollection(airlines, baseUrl)}
        </div>
      </section>

      <!-- Style 5: Boarding Pass -->
      <section>
        <div class="mb-4">
          <h2 class="font-display text-xl font-semibold text-white drop-shadow">5. Boarding Pass Style</h2>
          <p class="text-white/70 text-sm">Horizontal cards with torn edge feel, ticket layout (showing 3)</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          ${renderBoardingPass(airlines, baseUrl)}
        </div>
      </section>

      <!-- Style 6: Airplane Window Frames -->
      <section>
        <div class="mb-4">
          <h2 class="font-display text-xl font-semibold text-white drop-shadow">6. Airplane Window Frames</h2>
          <p class="text-white/70 text-sm">Rounded rectangle frames with thick borders, like looking out the window</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          ${renderWindowFrames(airlines, baseUrl)}
        </div>
      </section>

      <!-- Style 7: Compact Pills/Chips -->
      <section>
        <div class="mb-4">
          <h2 class="font-display text-xl font-semibold text-white drop-shadow">7. Compact Pills/Chips</h2>
          <p class="text-white/70 text-sm">Small rounded badges with logo + name</p>
        </div>
        <div class="bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/20">
          ${renderPillChips(airlines, baseUrl)}
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="mt-8">
      <div class="max-w-7xl mx-auto px-4 py-8 text-center">
        <a href="/" class="text-white/70 hover:text-white transition-colors text-sm">Back to Home</a>
      </div>
    </footer>
  </div>
</body>
</html>`;
}
