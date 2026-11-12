// Cloudinary serves the original upload unless the URL asks for something
// else — and an original product photo can be a 2MB+ PNG even where it's shown
// at 100px. These helpers add a delivery transformation: f_auto (WebP/AVIF
// where the browser supports it), q_auto, and a size matched to where the
// image is shown, which is usually 90%+ lighter. Each size is generated once
// and cached by Cloudinary. Non-Cloudinary URLs (local previews, /public
// images) pass through untouched.

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

/**
 * A srcset of widths for images whose display size varies a lot by screen
 * (e.g. a full-width hero), so phones don't download the desktop size.
 */
export function cloudinarySrcSet(url, widths) {
  if (!isCloudinary(url)) return undefined;
  return widths.map((w) => `${cloudinaryUrl(url, { width: w })} ${w}w`).join(', ');
}
