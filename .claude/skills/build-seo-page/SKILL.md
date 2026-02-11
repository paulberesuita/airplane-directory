---
name: build-seo-page
description: Build programmatic SEO pages from data. Usage: /build-seo-page
user_invokable: true
agent: seo
---

# Build SEO Page

You've been invoked to **build a programmatic SEO page** that captures search traffic.

**Workflow:** Build SEO Page (from SEO agent)

---

## Page Types

| Type | URL Pattern | Minimum Data |
|------|-------------|--------------|
| **Manufacturer page** | `/manufacturer/[slug]` | Existing manufacturer data |
| **Category page** | `/[category]/[slug]` | 5+ aircraft in category |
| **Top-10 list** | `/best/[topic]` | Curated selection |
| **Comparison page** | `/compare/[aircraft1]-vs-[aircraft2]` | Two aircraft |

---

## Workflow

### 1. Identify Opportunity

**If no specific page requested, find opportunities:**

```bash
# Manufacturers with aircraft (for manufacturer pages)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as count FROM aircraft GROUP BY manufacturer ORDER BY count DESC;"

# Aircraft status distribution (for category pages)
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT status, COUNT(*) as items FROM aircraft GROUP BY status ORDER BY items DESC;"

# Popular search terms to target
# - "Boeing aircraft list"
# - "Airbus planes comparison"
# - "wide-body vs narrow-body aircraft"
```

Present findings and get user approval before proceeding.

### 2. Check Data Availability

Before building, verify we have the data:

```bash
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, image_url FROM aircraft WHERE manufacturer = 'Boeing';"
```

**If data gaps exist:**
- Run research operations to fill gaps
- Don't build pages with incomplete data

### 3. Write Spec

Create `specs/[page-type]-[name].md`:

```markdown
# [Page Name]

## URL
`/[path]`

## Purpose
[What search queries this captures, why it matters]

## Data Source
[SQL query or data requirements]

## SEO
- Title: [title tag]
- Description: [meta description]
- Structured data: [Schema.org type]

## Layout
[Description of the page layout, components to use]
```

### 4. Load Design Standards

**Read before building:**
- `/tasty-design` — Colors, components, typography
- `/project-architecture` — DB schema, SSR patterns, D1/R2 usage

### 5. Build Cloudflare Pages Function

Create `functions/[path]/[[slug]].js` following patterns from existing functions:

```javascript
export async function onRequestGet(context) {
  const { env, params } = context;
  const slug = params.slug?.[0];

  if (!slug) {
    return renderIndexPage(context);
  }
  return renderDetailPage(context, slug);
}

function renderPage(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${/* SEO title */}</title>
  <meta name="description" content="${/* SEO description */}">

  <!-- Open Graph -->
  <meta property="og:title" content="${/* title */}">
  <meta property="og:description" content="${/* description */}">
  <meta property="og:type" content="website">

  <!-- Structured Data -->
  <script type="application/ld+json">
  ${/* Schema.org JSON-LD */}
  </script>

  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${/* page content */}
</body>
</html>`;
}
```

### 6. Add SEO Elements

**Required for every page:**

- [ ] Title tag (unique, keyword-rich, <60 chars)
- [ ] Meta description (compelling, <160 chars)
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter card tags
- [ ] Canonical URL
- [ ] Structured data (Schema.org JSON-LD)
- [ ] Internal links to related aircraft
- [ ] Semantic HTML (h1, article, nav)

**Structured Data Types:**
- Manufacturer pages → `ItemList` with aircraft
- Individual aircraft → `Product` or custom type
- Comparison pages → `ItemList` with `ListItem`

### 7. Deploy

```bash
wrangler pages deploy ./public --project-name=airplane-directory
```

### 8. Verify

- [ ] Page loads at production URL
- [ ] Mobile-friendly
- [ ] No JavaScript errors
- [ ] Images load (if applicable)
- [ ] Internal links work

### 9. Update Documentation

- **CHANGELOG.md** — "Added: [page type] for [name]"
- **CONTEXT.md** — SEO rationale, data requirements, lessons learned

---

## Remember

- Read `/tasty-design` before building any UI
- Don't build pages without sufficient data
- All pages need proper SEO elements
- Test on mobile before deploying
- Update CHANGELOG.md and CONTEXT.md when done
