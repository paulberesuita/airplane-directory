---
name: coding-standards
description: Load API patterns, D1/R2 usage, SSR patterns. Usage: /coding-standards
user_invokable: true
---

# Coding Standards

Technical patterns for the Airplane Directory on Cloudflare Pages.

---

## Project Structure

```
/
├── public/             # Static assets (JS, CSS, icons — NOT HTML pages)
├── functions/          # Cloudflare Pages Functions (SSR + API)
│   ├── index.js        # GET / (homepage)
│   ├── aircraft/
│   │   └── [[slug]].js # GET /aircraft AND /aircraft/[slug]
│   ├── images/
│   │   └── [[path]].js # GET /images/* (R2 proxy)
│   └── api/            # JSON API endpoints
├── migrations/         # SQL migrations (numbered)
├── scripts/            # Seed SQL scripts
├── specs/              # Feature specifications
└── wrangler.toml       # Cloudflare config
```

---

## Bindings

| Binding | Type | Name | Usage |
|---------|------|------|-------|
| `env.DB` | D1 | `airplane-directory-db` | SQLite database |
| `env.IMAGES` | R2 | `airplane-directory-assets` | Aircraft images |

---

## SSR Page Pattern

All pages are **server-side rendered**. Functions return full HTML responses with data from D1. No static HTML files for routes.

```javascript
// functions/my-page.js

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderPage(data, baseUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(data.title)} | Airplane Directory</title>

  <!-- Fonts & Tailwind (from /design-system) -->
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'system-ui', 'sans-serif'],
            display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif']
          },
          colors: {
            'primary': '#0EA5E9',
            'primary-hover': '#0284C7',
            'background': '#F8FAFC',
            'card': '#FFFFFF',
            'border': '#E2E8F0',
            'muted': '#64748B',
            'accent': '#F87171',
          }
        }
      }
    }
  </script>
</head>
<body class="bg-background text-slate-800 min-h-screen font-sans">
  <!-- Content here -->
</body>
</html>`;
}

export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM aircraft WHERE manufacturer = ? ORDER BY name'
    ).bind('Boeing').all();

    const html = renderPage({ title: 'My Page' }, baseUrl);

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response('Error loading page', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
```

---

## Routing Gotcha: [[slug]].js Priority

**CRITICAL:** When `[[slug]].js` exists in a directory, it handles ALL requests — including the bare path. An `index.js` in the same directory is NEVER called.

```
functions/aircraft/
├── index.js        # DEAD — never invoked
└── [[slug]].js     # Handles /aircraft AND /aircraft/some-slug
```

In `[[slug]].js`, check for the bare path:
```javascript
export async function onRequestGet(context) {
  const { params } = context;
  const slug = params.slug?.[0]; // undefined for /aircraft, "boeing-737" for /aircraft/boeing-737

  if (!slug) {
    return renderIndexPage(context);
  }
  return renderDetailPage(context, slug);
}
```

---

## API Route Pattern

```javascript
// functions/api/aircraft.js
export async function onRequestOptions() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET' }
  });
}

export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM aircraft ORDER BY name LIMIT ?'
    ).bind(50).all();

    return Response.json(results, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Request failed' }, { status: 500 });
  }
}
```

---

## D1 Database Patterns

```javascript
// Single record
const aircraft = await env.DB.prepare(
  'SELECT * FROM aircraft WHERE slug = ?'
).bind(slug).first();

// Multiple records
const { results } = await env.DB.prepare(
  'SELECT * FROM aircraft WHERE manufacturer = ? ORDER BY name'
).bind('Airbus').all();

// Aggregation
const { results: counts } = await env.DB.prepare(
  'SELECT manufacturer, COUNT(*) as count FROM aircraft GROUP BY manufacturer ORDER BY count DESC'
).all();
```

---

## R2 Image Serving

Images are served through a Pages Function proxy, not directly from R2:

```javascript
// functions/images/[[path]].js
export async function onRequestGet(context) {
  const { env, params } = context;
  const key = params.path.join('/'); // e.g., "aircraft/boeing-737.jpg"

  const object = await env.IMAGES.get(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    }
  });
}
```

**Image URL pattern:** `/images/aircraft/[slug].jpg`

---

## Cache-Control

| Content | Cache | Why |
|---------|-------|-----|
| HTML pages | `public, max-age=300` | 5 min, keeps content fresh |
| Images (R2) | `public, max-age=31536000, immutable` | 1 year, images don't change |
| API JSON | `public, max-age=300` | 5 min, same as pages |

---

## Security Rules

1. **Always escape HTML** — Use `escapeHtml()` for any database content rendered in templates
2. **Use prepared statements** — `env.DB.prepare('...').bind(value)` — never string concatenation
3. **Log errors** — `console.error()` before returning error responses
4. **Cache public pages** — `Cache-Control: public, max-age=300` for HTML
5. **CORS on API only** — Add `Access-Control-Allow-Origin: *` to `/api/` endpoints only
6. **API keys in env vars** — Never in code, use `wrangler pages secret put`
