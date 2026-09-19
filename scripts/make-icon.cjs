const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '..', 'public', 'logo.png');
const OUT = path.join(__dirname, '..', 'pwa-icon-source.png');

// Crop just the house/roof mark from the top-center of the wide logo, then pad
// it onto a square cream canvas so it works as a home-screen / maskable icon.
async function run() {
  const cropped = await sharp(SRC)
    .extract({ left: 1040, top: 0, width: 580, height: 290 })
    .toBuffer();

  await sharp(cropped)
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
