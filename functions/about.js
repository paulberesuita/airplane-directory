// GET /about - About page (SSR)

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Get stats for the about page
    const [{ results: aircraftStats }, { results: airlineStats }] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as count, COUNT(DISTINCT manufacturer) as manufacturers FROM aircraft').all(),
      env.DB.prepare('SELECT COUNT(*) as count FROM airlines').all()
    ]);

    const stats = {
      aircraft: aircraftStats[0]?.count || 0,
      manufacturers: aircraftStats[0]?.manufacturers || 0,
      airlines: airlineStats[0]?.count || 0
    };

    const html = renderAboutPage(baseUrl, stats);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error loading about page:', error);
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

        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(p);
            p *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution.xy;
          uv.x *= u_resolution.x / u_resolution.y;
          vec2 movement = vec2(u_time * 0.02, u_time * 0.008);
          float clouds = fbm(uv * 2.0 + movement);
          clouds = smoothstep(0.4, 0.7, clouds);
          clouds *= 0.5;
          vec3 skyTop = vec3(0.0, 0.4, 0.85);
          vec3 skyBottom = vec3(0.35, 0.6, 0.9);
          vec3 sky = mix(skyBottom, skyTop, uv.y);
          vec3 cloudColor = vec3(0.85, 0.9, 1.0);
          vec3 color = mix(sky, cloudColor, clouds * 0.7);
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

function renderAboutPage(baseUrl, stats) {
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
        "name": "About",
        "item": `${baseUrl}/about`
      }
    ]
  };

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About AirlinePlanes",
    "description": "Learn about AirlinePlanes, a comprehensive directory of commercial aircraft and airlines.",
    "url": `${baseUrl}/about`,
    "mainEntity": {
      "@type": "WebSite",
      "name": "AirlinePlanes",
      "url": baseUrl
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'About | AirlinePlanes',
    description: 'AirlinePlanes is a comprehensive directory of commercial aircraft and the airlines that fly them. Learn about our mission to help travelers know what planes they fly on.',
    url: `${baseUrl}/about`,
    jsonLd: null
  })}
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(aboutPageSchema)}</script>
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
        <a href="/about" class="text-white hover:text-white/80 transition-colors">About</a>
      </div>
    </div>
  </nav>

  <!-- Hero -->
  <div class="text-white">
    <div class="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <h1 class="font-display text-4xl md:text-5xl font-semibold mb-4 drop-shadow-lg">About AirlinePlanes</h1>
      <p class="text-white/90 text-xl drop-shadow">Know what you're flying on.</p>
    </div>
  </div>

  <!-- Content -->
  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl">

      <!-- Mission -->
      <section class="mb-12">
        <h2 class="font-display text-2xl font-semibold text-slate-800 mb-4">Our Mission</h2>
        <p class="text-slate-600 leading-relaxed mb-4">
          AirlinePlanes helps travelers understand the aircraft they fly on. Whether you're curious about the Boeing 787 Dreamliner's range, want to compare the Airbus A350 to the 777, or simply want to know what planes your favorite airline operates, we've got you covered.
        </p>
        <p class="text-slate-600 leading-relaxed">
          We believe that informed travelers are confident travelers. Knowing your aircraft means understanding the passenger capacity, range capabilities, and comfort features before you book.
        </p>
      </section>

      <!-- Stats -->
      <section class="mb-12">
        <h2 class="font-display text-2xl font-semibold text-slate-800 mb-6">By the Numbers</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-sky-50 rounded-xl p-6 text-center">
            <p class="text-3xl font-bold text-sky-600 mb-1">${stats.aircraft}+</p>
            <p class="text-sm text-slate-600">Aircraft Models</p>
          </div>
          <div class="bg-sky-50 rounded-xl p-6 text-center">
            <p class="text-3xl font-bold text-sky-600 mb-1">${stats.airlines}+</p>
            <p class="text-sm text-slate-600">Airlines</p>
          </div>
          <div class="bg-sky-50 rounded-xl p-6 text-center">
            <p class="text-3xl font-bold text-sky-600 mb-1">${stats.manufacturers}</p>
            <p class="text-sm text-slate-600">Manufacturers</p>
          </div>
        </div>
      </section>

      <!-- What We Cover -->
      <section class="mb-12">
        <h2 class="font-display text-2xl font-semibold text-slate-800 mb-4">What We Cover</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-slate-800 mb-2">Aircraft Specifications</h3>
            <ul class="text-slate-600 space-y-1">
              <li>Passenger capacity and configurations</li>
              <li>Range and cruise speed</li>
              <li>Dimensions and engine details</li>
              <li>Production status and first flight dates</li>
              <li>Safety records and history</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-slate-800 mb-2">Airline Fleets</h3>
            <ul class="text-slate-600 space-y-1">
              <li>Complete fleet breakdowns</li>
              <li>Aircraft types operated</li>
              <li>Fleet sizes and destinations</li>
              <li>Headquarters and founding dates</li>
              <li>IATA and ICAO codes</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Data Sources -->
      <section class="mb-12">
        <h2 class="font-display text-2xl font-semibold text-slate-800 mb-4">Our Data</h2>
        <p class="text-slate-600 leading-relaxed">
          We compile data from manufacturer specifications, airline press releases, aviation databases, and industry publications. Each aircraft entry includes source citations so you can verify the information. We regularly update our database as new aircraft enter service and airline fleets evolve.
        </p>
      </section>

      <!-- Contact -->
      <section>
        <h2 class="font-display text-2xl font-semibold text-slate-800 mb-4">Get in Touch</h2>
        <p class="text-slate-600 leading-relaxed">
          Have a suggestion or found an error? We'd love to hear from you. AirlinePlanes is constantly improving, and your feedback helps us serve travelers better.
        </p>
      </section>

    </div>
  </main>

  <!-- Footer -->
  <footer class="max-w-4xl mx-auto px-4 py-8 text-center">
    <p class="text-white/70 text-sm">&copy; ${new Date().getFullYear()} AirlinePlanes. All rights reserved.</p>
  </footer>

  </div>
</body>
</html>`;
}
