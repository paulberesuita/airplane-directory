// Barrel re-export: single import point for all shared modules
export { SITE_NAME, DOMAIN, PROD_BASE } from './_shared/config.js';
export { renderHead, renderHeader, renderFooter, renderBreadcrumbs } from './_shared/layout.js';
export { renderPage, htmlResponse, jsonResponse, errorResponse } from './_shared/response.js';
