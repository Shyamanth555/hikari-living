import { getProductPricing } from './pricing';

// Total saved across cart items shown below a higher struck-through price — the
// compareAtPrice (MRP), or the regular price during a flash sale — used to show
// a "You save ₹X" line in the cart summary.
export function calculateSavings(items) {
  return items.reduce((total, { product, quantity }) => {
    const { price, compareAtPrice } = getProductPricing(product);
    const discount = compareAtPrice > price ? compareAtPrice - price : 0;
    return total + discount * quantity;
  }, 0);
}
