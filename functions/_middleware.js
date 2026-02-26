// Global middleware — runs on every request
// 1. Serves custom 404 page for unmatched routes
// 2. Prevents preview/branch deploy domains from being indexed
import { DOMAIN } from './_shared/config.js';
import { onRequestGet as render404 } from './404.js';

export async function onRequest(context) {
  let response = await context.next();

  // Serve custom 404 page for unmatched routes
  if (response.status === 404) {
    response = await render404(context);
  }

  // Block non-production domains from indexing
  const url = new URL(context.request.url);
  const host = url.hostname;
  const isProduction = host === DOMAIN || host === `www.${DOMAIN}`;

  if (!isProduction) {
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return newResponse;
  }

  return response;
}
