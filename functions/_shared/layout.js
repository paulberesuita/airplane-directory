// Shared layout components: renderHead, renderHeader, renderFooter
import { escapeHtml } from './utils.js';

/**
 * Render <head> contents with all shared meta, fonts, Tailwind config, styles, and WebGL sky.
 *
 * @param {Object} meta - Page metadata
 * @param {string} meta.title
 * @param {string} meta.description
 * @param {string} meta.url
 * @param {string} [meta.image]
 * @param {Object} [meta.jsonLd]
 * @param {Object} [options]
 * @param {string} [options.extraStyles] - Additional CSS to inject
 * @param {string} [options.extraHead] - Additional HTML to inject at end of <head>
 */
export function renderHead({ title, description, url, image, jsonLd }, options = {}) {
  const { extraStyles = '', extraHead = '' } = options;

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
  <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">
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
    ${extraStyles}
  </style>
  ${renderSkyShader()}
  ${extraHead}`;
}

/**
 * Render the WebGL Mario-style pixel cloud sky shader script.
 */
function renderSkyShader() {
  return `
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
          c = max(c, cloud(p, vec2(mod(t * 0.44 + 0.3, 4.1) - 0.7, 0.88), 0.75));
          c = max(c, cloud(p, vec2(mod(t * 0.45 + 3.0, 4.8) - 0.6, 0.70), 0.75));
          c = max(c, cloud(p, vec2(mod(t * 0.38 + 0.8, 4.2) - 0.3, 0.55), 0.85));
          c = max(c, cloud(p, vec2(mod(t * 0.52 + 2.2, 5.0) - 0.9, 0.45), 0.7));
          c = max(c, cloud(p, vec2(mod(t * 0.42 + 1.5, 3.9) - 0.5, 0.62), 0.8));
          c = max(c, cloud(p, vec2(mod(t * 0.48 + 3.8, 4.4) - 0.7, 0.38), 0.9));
          c = max(c, cloud(p, vec2(mod(t * 0.36 + 2.8, 4.6) - 0.2, 0.50), 0.72));
          c = max(c, cloud(p, vec2(mod(t * 0.41 + 3.6, 4.0) - 3.6, 0.58), 0.82));
          c = max(c, cloud(p, vec2(mod(t * 0.5 + 3.5, 5.0) - 1.0, 0.08), 0.9));
          c = max(c, cloud(p, vec2(mod(t * 0.35 + 1.0, 4.2) - 0.2, 0.15), 0.7));
          c = max(c, cloud(p, vec2(mod(t * 0.55 + 2.5, 4.0) - 0.8, 0.04), 0.85));
          c = max(c, cloud(p, vec2(mod(t * 0.4 + 0.5, 3.6) - 0.1, 0.22), 0.65));
          c = max(c, cloud(p, vec2(mod(t * 0.46 + 1.8, 4.3) - 0.4, 0.12), 0.78));

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

/**
 * Render the site header/nav.
 *
 * @param {string} [activePage] - Which nav item to highlight: 'airlines', 'aircraft', 'manufacturers', 'sources', 'about'
 */
export function renderHeader(activePage) {
  const navItems = [
    { href: '/airlines', label: 'Airlines', key: 'airlines' },
    { href: '/aircraft', label: 'Aircraft', key: 'aircraft' },
    { href: '/manufacturer', label: 'Manufacturers', key: 'manufacturers' },
  ];

  const navHtml = navItems.map(item => {
    const isActive = activePage === item.key;
    const classes = isActive
      ? 'text-white font-medium'
      : 'text-white/70 hover:text-white transition-colors';
    return `<a href="${item.href}" class="${classes}">${item.label}</a>`;
  }).join('\n        ');

  return `
  <header class="sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
      <a href="/" class="text-2xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRLINEPLANES</a>
      <nav class="flex gap-6 text-sm">
        ${navHtml}
      </nav>
    </div>
  </header>`;
}

/**
 * Render the site footer.
 */
export function renderFooter() {
  return `
  <footer class="mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <a href="/" class="text-xl tracking-widest text-white hover:text-white/80 transition-colors" style="font-family: 'Bebas Neue', sans-serif;">AIRLINEPLANES</a>
        <nav class="flex items-center gap-6">
          <a href="/airlines" class="text-white/90 hover:text-white text-sm transition-colors">Airlines</a>
          <a href="/aircraft" class="text-white/90 hover:text-white text-sm transition-colors">Aircraft</a>
          <a href="/manufacturer" class="text-white/90 hover:text-white text-sm transition-colors">Manufacturers</a>
          <a href="/sources" class="text-white/90 hover:text-white text-sm transition-colors">Sources</a>
          <a href="/about" class="text-white/90 hover:text-white text-sm transition-colors">About</a>
        </nav>
      </div>
    </div>
  </footer>`;
}
