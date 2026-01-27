// GET /images/* - Serve images from R2
export async function onRequestGet(context) {
  const { env, params } = context;
  const key = 'images/' + params.path.join('/'); // e.g., "images/aircraft/boeing-737.jpg"

  try {
    const object = await env.IMAGES.get(key);

    if (!object) {
      return new Response('Not found', { status: 404 });
    }

    // Determine content type from extension
    const ext = key.split('.').pop().toLowerCase();
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif',
      'svg': 'image/svg+xml'
    };
    const contentType = object.httpMetadata?.contentType || contentTypes[ext] || 'application/octet-stream';

    return new Response(object.body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new Response('Error serving image', { status: 500 });
  }
}
