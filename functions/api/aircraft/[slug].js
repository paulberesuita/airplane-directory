// GET /api/aircraft/[slug] - Get single aircraft by slug
export async function onRequestGet(context) {
  const { env, params } = context;
  const { slug } = params;

  try {
    const aircraft = await env.DB.prepare(
      'SELECT * FROM aircraft WHERE slug = ?'
    ).bind(slug).first();

    if (!aircraft) {
      return new Response(JSON.stringify({ error: 'Aircraft not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(aircraft), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch aircraft' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
