// GET /api/aircraft/[slug]/history - Get history entries for an aircraft
export async function onRequestGet(context) {
  const { env, params, request } = context;
  const { slug } = params;
  const url = new URL(request.url);
  const contentType = url.searchParams.get('type'); // Optional filter by content_type

  try {
    // First verify aircraft exists
    const aircraft = await env.DB.prepare(
      'SELECT slug FROM aircraft WHERE slug = ?'
    ).bind(slug).first();

    if (!aircraft) {
      return new Response(JSON.stringify({ error: 'Aircraft not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build query with optional content_type filter
    let query = 'SELECT * FROM aircraft_history WHERE aircraft_slug = ?';
    const bindings = [slug];

    if (contentType) {
      query += ' AND content_type = ?';
      bindings.push(contentType);
    }

    // Order by year (nulls last), then by id for consistent ordering
    query += ' ORDER BY CASE WHEN year IS NULL THEN 1 ELSE 0 END, year ASC, id ASC';

    const stmt = env.DB.prepare(query);
    const history = await stmt.bind(...bindings).all();

    return new Response(JSON.stringify({
      aircraft_slug: slug,
      count: history.results.length,
      entries: history.results
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch aircraft history' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
