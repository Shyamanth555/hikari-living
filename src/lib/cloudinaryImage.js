// Cloudinary serves the original upload unless the URL asks for something
// else — and an original product photo can be a 2MB+ PNG even where it's shown
// at 100px. These helpers add a delivery transformation: f_auto (WebP/AVIF
// where the browser supports it), q_auto, and a size. Non-Cloudinary URLs
// (local previews, /public images) pass through untouched.

const isCloudinary = (url) => typeof url === 'string' && url.includes('res.cloudinary.com') && url.includes('/upload/');

/**
 * @param {string} url - a Cloudinary delivery URL as stored on upload
 * @param {{ width?: number, height?: number, crop?: 'limit' | 'fill' }} [opts]
 *   'limit' (default) shrinks to fit and never upscales; 'fill' crops to the box.
 */
export function cloudinaryUrl(url, { width, height, crop = 'limit' } = {}) {
  if (!isCloudinary(url)) return url;
  const parts = ['f_auto', 'q_auto'];
  if (width || height) parts.push(`c_${crop}`);
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  return url.replace('/upload/', `/upload/${parts.join(',')}/`);
}

// Every image is served in at most these three sizes, whatever page shows it.
// The browser caches by URL, so a photo downloaded once — say a product card on
// the home page — is reused from cache everywhere else that shows the same
// size, instead of each spot fetching its own slightly different size. It also
// keeps Cloudinary to three transformations per image.
const IMAGE_PRESETS = {
  thumb: { width: 200, height: 200, crop: 'fill' }, // shown at ~100px or less: cart, orders, admin lists, thumbnails
  card: { width: 600 }, // product, category and blog cards
  large: { width: 1200 }, // product page, flash-sale hero, full-screen viewer, blog post, link previews
};

/** @param {'thumb' | 'card' | 'large'} preset */
export const imageUrl = (url, preset) => cloudinaryUrl(url, IMAGE_PRESETS[preset]);

/**
 * A srcset of widths for images whose display size varies a lot by screen
 * (the full-width hero), so phones don't download the desktop size.
 */
export function cloudinarySrcSet(url, widths) {
  if (!isCloudinary(url)) return undefined;
  return widths.map((w) => `${cloudinaryUrl(url, { width: w })} ${w}w`).join(', ');
}
