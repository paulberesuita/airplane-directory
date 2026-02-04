// GET /sitemap.xml - Dynamic XML sitemap
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    // Fetch all aircraft, airline, and manufacturer slugs with dates
    const [{ results: aircraft }, { results: airlines }, { results: manufacturers }] = await Promise.all([
      env.DB.prepare('SELECT slug, created_at FROM aircraft ORDER BY slug').all(),
      env.DB.prepare('SELECT slug, created_at FROM airlines ORDER BY slug').all(),
      env.DB.prepare('SELECT DISTINCT LOWER(manufacturer) as slug FROM aircraft ORDER BY manufacturer').all()
    ]);

    const today = new Date().toISOString().split('T')[0];

    // Helper to format date
    const formatDate = (dateStr) => {
      if (!dateStr) return today;
      try {
        return new Date(dateStr).toISOString().split('T')[0];
      } catch {
        return today;
      }
    };

    // Build URL entries
    const urls = [
      // Static pages
      { loc: baseUrl, priority: '1.0', changefreq: 'daily', lastmod: today },
      { loc: `${baseUrl}/airlines`, priority: '0.9', changefreq: 'daily', lastmod: today },
      { loc: `${baseUrl}/aircraft`, priority: '0.9', changefreq: 'daily', lastmod: today },
      { loc: `${baseUrl}/manufacturer`, priority: '0.9', changefreq: 'daily', lastmod: today },

      // Airline detail pages
      ...airlines.map(a => ({
        loc: `${baseUrl}/airlines/${a.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: formatDate(a.created_at)
      })),

      // Aircraft detail pages
      ...aircraft.map(a => ({
        loc: `${baseUrl}/aircraft/${a.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: formatDate(a.created_at)
      })),

      // Manufacturer detail pages
      ...manufacturers.map(m => ({
        loc: `${baseUrl}/manufacturer/${m.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: today
      }))
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response('Error generating sitemap', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
