---
name: seo-audit
description: Audit and fix technical SEO and on-page optimization. Usage: /seo-audit
user_invokable: true
agent: seo
---

# SEO Audit

You've been invoked to **audit and fix SEO** — improving technical SEO and on-page elements.

**Workflow:** SEO Audit (from SEO agent)

---

## What This Covers

| Area | Elements |
|------|----------|
| **Meta tags** | Title, description, Open Graph, Twitter cards |
| **Structured data** | Schema.org JSON-LD |
| **Sitemap** | XML sitemap generation |
| **Internal linking** | Links between related aircraft |
| **Canonical URLs** | Preventing duplicate content |
| **Page speed** | Performance optimization |

---

## Workflow

### 1. Audit Current State

**Check meta tags:**
```bash
curl -s https://airplane-directory.pages.dev/ | grep -E '<title>|<meta name="description"|<meta property="og:'
curl -s https://airplane-directory.pages.dev/aircraft | grep -E '<title>|<meta name="description"|<meta property="og:'
```

**Check structured data:**
```bash
curl -s https://airplane-directory.pages.dev/aircraft/boeing-737 | grep -o '<script type="application/ld+json">.*</script>'
```

**Check sitemap:**
```bash
curl -s https://airplane-directory.pages.dev/sitemap.xml
```

**Check robots.txt:**
```bash
curl -s https://airplane-directory.pages.dev/robots.txt
```

### 2. Identify Gaps

Create a checklist:

```markdown
## SEO Audit Results

### Meta Tags
- [ ] Homepage title — [status]
- [ ] Homepage description — [status]
- [ ] Aircraft list page title — [status]
- [ ] Aircraft detail pages title — [status]

### Open Graph
- [ ] og:title — [status]
- [ ] og:description — [status]
- [ ] og:image — [status]

### Structured Data
- [ ] Homepage — [WebSite?]
- [ ] Aircraft list — [ItemList?]
- [ ] Aircraft detail — [Product?]

### Technical
- [ ] sitemap.xml — [exists? complete?]
- [ ] robots.txt — [exists? correct?]
- [ ] Canonical URLs — [set?]
```

### 3. Prioritize Fixes

**High priority:**
- Missing or duplicate title tags
- Missing meta descriptions
- Missing structured data
- No sitemap

**Medium priority:**
- Open Graph / Twitter cards
- Internal linking improvements
- Canonical URLs

**Low priority:**
- Minor page speed improvements
- Schema.org enhancements

### 4. Implement Fixes

**For meta tags (in Cloudflare Functions):**
```javascript
function renderHead({ title, description, url, image }) {
  return `
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">

    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${image}">
    <meta property="og:type" content="website">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
  `;
}
```

**For sitemap (create function):**
```javascript
// functions/sitemap.xml.js
export async function onRequestGet(context) {
  const { env } = context;

  const { results: aircraft } = await env.DB.prepare(
    'SELECT slug FROM aircraft'
  ).all();

  const urls = [
    'https://airplane-directory.pages.dev/',
    'https://airplane-directory.pages.dev/aircraft',
    ...aircraft.map(a => `https://airplane-directory.pages.dev/aircraft/${a.slug}`)
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
```

**For robots.txt:**
```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://airplane-directory.pages.dev/sitemap.xml
```

### 5. Deploy

```bash
wrangler pages deploy ./public --project-name=airplane-directory
```

### 6. Verify

**Test structured data:**
- https://search.google.com/test/rich-results

**Test sitemap:**
```bash
curl -s https://airplane-directory.pages.dev/sitemap.xml | head -20
```

### 7. Update Documentation

- **CHANGELOG.md** — "Fixed: [SEO element] on [pages]"
- **CONTEXT.md** — SEO strategy decisions

---

## SEO Checklists by Page Type

### Homepage
- [ ] Title: "Airplane Directory — Explore Commercial Aircraft"
- [ ] Description: Compelling, <160 chars
- [ ] Structured data: WebSite or Organization
- [ ] Internal links to manufacturers and aircraft

### Aircraft List Page
- [ ] Title: "All Aircraft | Airplane Directory"
- [ ] Description: "[Number] commercial aircraft from Boeing, Airbus, and more..."
- [ ] Structured data: ItemList
- [ ] Internal links to detail pages

### Aircraft Detail Pages
- [ ] Title: "[Aircraft Name] — Specs & History | Airplane Directory"
- [ ] Description: First ~150 chars of description
- [ ] Structured data: Product or custom type
- [ ] Image with alt text
- [ ] Internal links to related aircraft (same manufacturer)

---

## Remember

- Verify changes with Google's testing tools
- Submit sitemap to Google Search Console
- Read `/project-architecture` before modifying functions
- Update CHANGELOG.md and CONTEXT.md when done
