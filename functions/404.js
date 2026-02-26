// 404 Error Page — handles all unmatched routes
import { renderHead, renderHeader, renderFooter, renderPage, htmlResponse, PROD_BASE } from './_shared.js';

export async function onRequestGet(context) {
  const head = renderHead({
    title: 'Page Not Found | AirlinePlanes',
    description: 'The page you\'re looking for doesn\'t exist.',
    url: `${PROD_BASE}/`
  }, { noindex: true });

  const body = `
  ${renderHeader()}

  <main class="max-w-xl mx-auto px-6 py-24">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-6">
        <span class="text-5xl text-white/50">&#9992;</span>
      </div>
      <p class="pixel-text uppercase tracking-widest mb-3" style="font-size: 10px; color: rgba(255,255,255,0.5);">404</p>
      <h1 class="font-display text-3xl md:text-4xl font-semibold text-white mb-3">Page not found</h1>
      <p class="text-white/70 leading-relaxed mb-8">
        This page doesn't exist or has been moved. Try browsing from the homepage.
      </p>
      <div class="flex justify-center gap-3">
        <a href="/" class="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl transition-all border border-white/30">
          Go home
        </a>
        <a href="/aircraft" class="text-white/70 hover:text-white font-medium px-6 py-3 transition-colors">
          Browse aircraft &rarr;
        </a>
      </div>
    </div>
  </main>

  ${renderFooter()}`;

  return htmlResponse(renderPage(head, body), 404);
}

export const onRequestPost = onRequestGet;
export const onRequestPut = onRequestGet;
export const onRequestDelete = onRequestGet;
