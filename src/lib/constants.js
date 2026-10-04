export const BRAND_NAME = 'Hikari Living';

export const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://www.instagram.com/hikari.living' },
  { label: 'Facebook', href: 'https://facebook.com/hikariliving' },
  { label: 'Pinterest', href: 'https://pinterest.com/hikariliving' },
];

export const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export const ORDER_STATUS_LABELS = {
  pending: 'Awaiting Payment',
  processing: 'Ready for Shipment',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const PAYMENT_METHODS = [
  {
    value: 'razorpay',
    label: 'Pay Online',
    description: 'Card, UPI, netbanking, or wallet via Razorpay',
  },
  {
    value: 'cod',
    label: 'Cash on Delivery',
    description: 'Pay in cash when your order arrives',
  },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

export const POLICY_LINKS = [
  { label: 'About / Our Story', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/policies/privacy' },
  { label: 'Terms of Service', href: '/policies/terms' },
  { label: 'Shipping Policy', href: '/policies/shipping' },
  { label: 'Return & Exchange Policy', href: '/policies/returns' },
];
