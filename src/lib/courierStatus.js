// Customer-friendly wording for Shiprocket's raw courier statuses
// ("MANIFEST GENERATED" means nothing to a shopper).
const LABELS = [
  [
    [
      'awb assigned',
      'label generated',
      'manifest generated',
      'pickup scheduled',
      'pickup generated',
      'pickup queued',
      'pickup rescheduled',
      'out for pickup',
      'pickup exception',
      'pickup error',
    ],
    'Packed — waiting for courier pickup',
  ],
  [['picked up'], 'Picked up by courier'],
  [['shipped', 'in transit', 'in flight', 'handover to courier', 'misrouted', 'delayed'], 'In transit'],
  [['reached at destination hub'], 'Reached the nearest delivery hub'],
  [['out for delivery'], 'Out for delivery'],
  [['delivered'], 'Delivered'],
  [['undelivered'], 'Delivery attempt unsuccessful'],
  [['canceled', 'cancelled'], 'Shipment cancelled'],
  [['rto delivered'], 'Returned to seller'],
];

const titleCase = (s) => s.replace(/\b\w/g, (c) => c.toUpperCase());

export function courierStatusLabel(raw) {
  const status = String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/_/g, ' ');
  if (!status) return '';

  const match = LABELS.find(([keys]) => keys.includes(status));
  if (match) return match[1];
  if (status.startsWith('rto')) return 'Returning to seller';
  return titleCase(status);
}
