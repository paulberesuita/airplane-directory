// Shared utility functions

export function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatNumber(num) {
  if (!num) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function kmToMiles(km) {
  return Math.round(km * 0.621371);
}

export function kmhToMph(kmh) {
  return Math.round(kmh * 0.621371);
}

export function metersToFeet(m) {
  return Math.round(m * 3.28084);
}

export function kgToLbs(kg) {
  return Math.round(kg * 2.20462);
}

export function litersToGallons(liters) {
  return Math.round(liters * 0.264172);
}

export function formatPrice(usd) {
  if (!usd) return null;
  if (usd >= 1000000000) {
    return '$' + (usd / 1000000000).toFixed(1) + 'B';
  }
  if (usd >= 1000000) {
    return '$' + (usd / 1000000).toFixed(1) + 'M';
  }
  return '$' + formatNumber(usd);
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
