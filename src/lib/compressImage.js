const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 0.85;
const SERVER_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Shrinks a photo to at most 2000px on its longest side and re-encodes it as
 * JPEG before upload — a phone photo usually ends up well under 1MB, so it
 * fits the server's 5MB limit and uploads quickly on mobile data. Formats the
 * server can't take (e.g. HEIC) come out as JPEG too, wherever the browser can
 * decode them. Falls back to the original file if it can't.
 *
 * @param {File} file
 * @returns {Promise<File>}
 */
export async function compressImage(file) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; // JPEG has no transparency — keep PNG cut-outs on white, not black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY));
    if (!blob) return file;
    // Already small and in a format the server accepts — the original is better.
    if (blob.size >= file.size && SERVER_FORMATS.includes(file.type)) return file;

    return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'photo'}.jpg`, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}
