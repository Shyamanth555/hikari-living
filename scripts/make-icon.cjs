const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'logo.png');
const OUT = path.join(__dirname, '..', 'pwa-icon-source.png');

// Pads the full logo (mark + "Hikari Living" wordmark + tagline) onto a square
// TRANSPARENT canvas, unscaled/uncropped, so the app icon shows the whole logo
// with no visible background box on the home screen. The PWA asset generator
// adds its own solid background just for the maskable variant, which requires one.
async function run() {
  await sharp(SRC)
    .resize(800, 800, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(OUT);

  console.log('Wrote', OUT);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
