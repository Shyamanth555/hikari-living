const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'logo.png');
const OUT = path.join(__dirname, '..', 'pwa-icon-source.png');

// Pads the full logo (mark + "Hikari Living" wordmark + tagline) onto a square
// cream canvas, unscaled/uncropped, so the app icon shows the whole logo.
async function run() {
  await sharp(SRC)
    .resize(800, 800, {
      fit: 'contain',
      background: { r: 253, g: 253, b: 244, alpha: 1 },
    })
    .png()
    .toFile(OUT);

  console.log('Wrote', OUT);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
