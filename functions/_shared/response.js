// Shared response helpers: renderPage, htmlResponse, jsonResponse, errorResponse

/**
 * Wrap head + body content into a full HTML page with sky canvas and window frame.
 *
 * @param {string} head - Content returned by renderHead()
 * @param {string} body - Inner body HTML (header, main, footer)
 */
export function renderPage(head, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  ${head}
</head>
<body class="font-sans">
  <canvas id="sky-canvas"></canvas>
  <div class="window-frame">
  ${body}
  </div>
</body>
</html>`;
}

/**
 * Create an HTML response with cache headers.
 *
 * @param {string} html - Full HTML string
 * @param {number} [status=200]
 * @param {number} [cacheMaxAge=3600] - Cache-Control max-age in seconds
 */
export function htmlResponse(html, status = 200, cacheMaxAge = 3600) {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': `public, max-age=${cacheMaxAge}, stale-while-revalidate=86400`
    }
  });
}

/**
 * Create a JSON response with CORS and cache headers.
 *
 * @param {*} data - JSON-serializable data
 * @param {number} [status=200]
 * @param {number} [cacheMaxAge=300]
 */
export function jsonResponse(data, status = 200, cacheMaxAge = 300) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${cacheMaxAge}`,
      'Access-Control-Allow-Origin': '*'
    }
  });
}

/**
 * Create a plain-text error response.
 *
 * @param {string} message
 * @param {number} [status=500]
 */
export function errorResponse(message, status = 500) {
  return new Response(message, {
    status,
    headers: { 'Content-Type': 'text/plain' }
  });
}
