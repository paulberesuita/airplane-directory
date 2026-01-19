# Coding Standards

Technical patterns for Cloudflare Pages.

## Project Structure

```
/
├── public/             # Static assets (HTML, CSS, JS)
├── functions/          # Cloudflare Pages Functions
│   └── api/            # API endpoints
├── migrations/         # SQL migrations
├── scripts/            # Seed scripts
└── wrangler.toml       # Cloudflare config
```

## API Route Pattern

```javascript
// functions/api/items.js
export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM items ORDER BY created_at DESC'
    ).all();

    return Response.json(results, {
      headers: { 'Cache-Control': 'public, max-age=300' }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Request failed' }, { status: 500 });
  }
}
```

## D1 Database Pattern

```javascript
// Single record
const item = await env.DB.prepare(
  'SELECT * FROM items WHERE slug = ?'
).bind(slug).first();

// Multiple records
const { results } = await env.DB.prepare(
  'SELECT * FROM items WHERE category = ?'
).bind(category).all();
```

## R2 Storage Pattern

```javascript
// functions/api/images/[key].js
export async function onRequestGet(context) {
  const { env, params } = context;

  const object = await env.BUCKET.get(`items/${params.key}`);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'image/png',
      'Cache-Control': 'public, max-age=31536000',
    }
  });
}
```

## Security Rules

1. **API keys in env vars** — Never in code
2. **Validate server-side** — Don't trust client input
3. **Use prepared statements** — Prevent SQL injection
4. **Escape HTML** — Prevent XSS
5. **Log errors** — `console.error` before returning error response
