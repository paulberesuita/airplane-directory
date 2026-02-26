// GET /feed.xml — RSS feed of recently added aircraft
import { escapeHtml } from './_shared/utils.js';
import { SITE_NAME, PROD_BASE } from './_shared/config.js';

export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results: aircraft } = await env.DB.prepare(
      'SELECT slug, name, manufacturer, description, created_at FROM aircraft ORDER BY created_at DESC LIMIT 20'
    ).all();

    const buildDate = new Date().toUTCString();
    const lastBuildDate = aircraft.length > 0 && aircraft[0].created_at
      ? new Date(aircraft[0].created_at).toUTCString()
      : buildDate;

    const itemsXml = aircraft.map(a => {
      const pubDate = a.created_at
        ? new Date(a.created_at).toUTCString()
        : buildDate;

      return `
    <item>
      <title>${escapeXml(a.name)}</title>
      <link>${PROD_BASE}/aircraft/${escapeXml(a.slug)}</link>
      <description>${escapeXml(a.description || '')}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${PROD_BASE}/aircraft/${escapeXml(a.slug)}</guid>
      ${a.manufacturer ? `<category>${escapeXml(a.manufacturer)}</category>` : ''}
    </item>`;
    }).join('\n');

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${PROD_BASE}</link>
    <description>Latest aircraft additions to ${escapeXml(SITE_NAME)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${PROD_BASE}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`;

    return new Response(feed, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Feed error:', error);

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${PROD_BASE}</link>
    <description>Latest aircraft additions to ${escapeXml(SITE_NAME)}</description>
  </channel>
</rss>`;

    return new Response(feed, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    });
  }
}

function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
