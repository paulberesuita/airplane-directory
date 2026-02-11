// GET /about - About page (SSR)
import { renderHead, renderHeader, renderFooter } from './_shared/layout.js';

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
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200'
      }
    });
  } catch (error) {
    console.error('Error loading about page:', error);
    return new Response('Error loading page', { status: 500 });
  }
}

function renderAboutPage(baseUrl, stats) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "About", "item": `${baseUrl}/about` }
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
  }, {
    extraHead: `
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(aboutPageSchema)}</script>`
  })}
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">

  ${renderHeader('about')}

  <!-- Hero -->
  <div class="text-white">
    <div class="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <h1 class="font-display text-4xl md:text-5xl font-semibold mb-4 drop-shadow-lg">About AirlinePlanes</h1>
      <p class="text-white/90 text-xl drop-shadow">Know what you're flying on.</p>
    </div>
  </div>

  <!-- Content -->
  <main class="max-w-4xl mx-auto px-4 py-8">
    <div class="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12">

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
          <div class="bg-blue-50 rounded-xl p-6 text-center">
            <p class="text-3xl font-bold text-blue-600 mb-1">${stats.aircraft}+</p>
            <p class="text-sm text-slate-600">Aircraft Models</p>
          </div>
          <div class="bg-blue-50 rounded-xl p-6 text-center">
            <p class="text-3xl font-bold text-blue-600 mb-1">${stats.airlines}+</p>
            <p class="text-sm text-slate-600">Airlines</p>
          </div>
          <div class="bg-blue-50 rounded-xl p-6 text-center">
            <p class="text-3xl font-bold text-blue-600 mb-1">${stats.manufacturers}</p>
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

  ${renderFooter()}

  </div>
</body>
</html>`;
}
