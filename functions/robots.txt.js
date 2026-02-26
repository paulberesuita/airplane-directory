// GET /robots.txt - Dynamic robots.txt using production domain
import { PROD_BASE } from './_shared/config.js';

export async function onRequestGet() {
  const body = `# AirlinePlanes robots.txt
User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${PROD_BASE}/sitemap.xml

# LLM crawlers
User-agent: GPTBot
Allow: /llms.txt
Allow: /llms-full.txt

User-agent: Claude-Web
Allow: /llms.txt
Allow: /llms-full.txt

User-agent: ClaudeBot
Allow: /llms.txt
Allow: /llms-full.txt

User-agent: Anthropic-AI
Allow: /llms.txt
Allow: /llms-full.txt

User-agent: PerplexityBot
Allow: /llms.txt
Allow: /llms-full.txt

User-agent: Cohere-AI
Allow: /llms.txt
Allow: /llms-full.txt

User-agent: Google-Extended
Allow: /llms.txt
Allow: /llms-full.txt
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
