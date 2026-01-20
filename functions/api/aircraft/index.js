// GET /api/aircraft - List all aircraft with optional search/filter
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);

  // Query parameters
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const manufacturer = url.searchParams.get('manufacturer') || '';

  try {
    let query = 'SELECT * FROM aircraft';
    const params = [];
    const conditions = [];

    if (search) {
      conditions.push('(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(manufacturer) LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (manufacturer) {
      conditions.push('manufacturer = ?');
      params.push(manufacturer);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY manufacturer, name';

    const { results } = await env.DB.prepare(query).bind(...params).all();

    // Get unique manufacturers for filter options
    const { results: manufacturers } = await env.DB.prepare(
      'SELECT DISTINCT manufacturer FROM aircraft ORDER BY manufacturer'
    ).all();

    return new Response(JSON.stringify({
      aircraft: results,
      manufacturers: manufacturers.map(m => m.manufacturer),
      count: results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch aircraft' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
