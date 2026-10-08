// Flash-sale pricing on the storefront. The server decides what is actually
// charged (backend utils/pricing.js); this decides what to show, using the
// visitor's clock so prices and countdowns tick over at the exact second.

// Same rounding as the server, for previews before a product is saved.
export const salePriceOf = (price, percentOff) => Math.round((price * (100 - percentOff)) / 100);

/** @returns {'none' | 'upcoming' | 'live' | 'ended'} */
export function getSaleStatus(product, now = Date.now()) {
  const sale = product?.sale;
  if (!sale?.startsAt || !sale?.endsAt) return 'none';
  if (now < Date.parse(sale.startsAt)) return 'upcoming';
  if (now < Date.parse(sale.endsAt)) return 'live';
  return 'ended';
}

// The price to show and charge right now. During a live sale the regular price
// becomes the struck-through one, so the "% off" shown matches the sale.
export function getProductPricing(product, now = Date.now()) {
  if (getSaleStatus(product, now) === 'live') {
    return { price: product.salePrice, compareAtPrice: product.price, onSale: true };
  }
  return { price: product.price, compareAtPrice: product.compareAtPrice, onSale: false };
}

// Splits a duration into countdown units, clamped at zero.
export function getCountdownParts(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const saleTimeFormatter = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
});

// e.g. "10 Jul, 5:00 pm"
export function formatSaleTime(iso) {
  return saleTimeFormatter.format(new Date(iso));
}
