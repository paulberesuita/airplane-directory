---
name: query-data
description: Query the database to answer questions. Usage: /query-data [question]
user_invokable: false
agent: seo
---

# Query Data

You've been invoked to **query data** and answer questions.

**Operation:** Query Data (from SEO agent)

## Your Task

Answer this question: **{{args}}**

If no question was provided, ask the user what they want to know.

---

## Common Queries

```bash
# Total count
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT COUNT(*) as total FROM aircraft;"

# Count by manufacturer
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as count FROM aircraft GROUP BY manufacturer ORDER BY count DESC;"

# All aircraft from a manufacturer
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE manufacturer = 'Boeing' ORDER BY name;"

# Aircraft with images
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT COUNT(*) as with_images FROM aircraft WHERE image_url IS NOT NULL AND image_url != '';"

# Aircraft without images
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT COUNT(*) as without_images FROM aircraft WHERE image_url IS NULL OR image_url = '';"

# Image coverage by manufacturer
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT manufacturer, COUNT(*) as total, SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as with_images FROM aircraft GROUP BY manufacturer ORDER BY total DESC;"

# Recent additions
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name, created_at FROM aircraft ORDER BY created_at DESC LIMIT 10;"

# Search by name
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT slug, name FROM aircraft WHERE name LIKE '%737%';"

# Aircraft by status
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT status, COUNT(*) as count FROM aircraft GROUP BY status;"

# Aircraft with history entries
npx wrangler d1 execute airplane-directory-db --remote --command "SELECT a.slug, a.name, COUNT(h.id) as history_count FROM aircraft a LEFT JOIN aircraft_history h ON a.slug = h.aircraft_slug GROUP BY a.slug ORDER BY history_count DESC;"
```

---

## Process

1. Understand the question
2. Write appropriate SQL query
3. Run query against D1
4. Present results clearly
5. Offer follow-up queries if relevant

---

## Remember

- Read-only operation — don't modify data
- Use `--remote` flag for production database
- Format results for easy reading
