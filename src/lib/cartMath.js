// Total saved across cart items whose product has a compareAtPrice (MRP) above
// its selling price — used to show a "You save ₹X" line in the cart summary.
export function calculateSavings(items) {
  return items.reduce((total, { product, quantity }) => {
    const discount = product.compareAtPrice > product.price ? product.compareAtPrice - product.price : 0;
    return total + discount * quantity;
  }, 0);
}
