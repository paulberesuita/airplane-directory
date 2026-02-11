// GET /sources - Sources page styled as a pilot's flight logbook (SSR)
import { escapeHtml } from './_shared/utils.js';
import { renderHead, renderHeader, renderFooter } from './_shared/layout.js';

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

  const extraStyles = `
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
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${renderHead({
    title: 'Sources — Pilot\'s Research Log | AirlinePlanes',
    description: 'Every aircraft specification on AirlinePlanes is verified against manufacturer data, aviation databases, and industry publications. See all our sources.',
    url: `${baseUrl}/sources`,
    jsonLd: null
  }, {
    extraStyles,
    extraHead: `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`
  })}
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">

  ${renderHeader('sources')}

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

  ${renderFooter()}

  </div>
</body>
</html>`;
}
