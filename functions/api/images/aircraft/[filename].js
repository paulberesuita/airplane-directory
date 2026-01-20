// GET /api/images/aircraft/[filename] - Serve aircraft image from R2
export async function onRequestGet(context) {
  const { env, params } = context;
  const { filename } = params;

  try {
    const object = await env.BUCKET.get(`aircraft/${filename}`);

    if (!object) {
      return new Response('Image not found', { status: 404 });
    }

    // Determine content type from extension
    const ext = filename.split('.').pop().toLowerCase();
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'webp': 'image/webp',
      'gif': 'image/gif'
    };
    const contentType = contentTypes[ext] || 'application/octet-stream';

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
