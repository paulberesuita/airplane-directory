// GET /api/aircraft/[slug] - Get single aircraft by slug
import { jsonResponse } from '../../_shared/response.js';

export async function onRequestGet(context) {
  const { env, params } = context;
  const { slug } = params;

  try {
    const aircraft = await env.DB.prepare(
      'SELECT * FROM aircraft WHERE slug = ?'
    ).bind(slug).first();

    if (!aircraft) {
      return jsonResponse({ error: 'Aircraft not found' }, 404);
    }

    return jsonResponse(aircraft, 200, 3600);
  } catch (error) {
    return jsonResponse({ error: 'Failed to fetch aircraft' }, 500);
  }
}
