// Colours in URLs: a product page opened with ?color=antique-gold shows that
// colour, so links from the cart, orders or a share keep the customer's pick.

// "Antique Gold" → "antique-gold"
export const colorSlug = (name = '') =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Link to a product page, opened on the given colour when there is one.
export const productUrl = (slug, colorName) => `/product/${slug}${colorName ? `?color=${colorSlug(colorName)}` : ''}`;
