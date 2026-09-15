import { SEO } from '../components/common/SEO';
import { formatCurrency } from '../lib/formatCurrency';

export default function ShippingPolicy() {
  return (
    <div className="container-page py-14">
      <SEO title="Shipping Policy" />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl text-foreground">Shipping Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Shipping Rates</h2>
            <p>
              We offer free shipping on all orders over {formatCurrency(1999)}. Orders below this amount are
              charged a flat shipping fee of {formatCurrency(99)}, calculated at checkout.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Processing Time</h2>
            <p>
              Orders are typically processed and handed to our courier partner within 2–4 business days of
              payment confirmation. Made-to-order or large furniture items may take longer — this will be
              noted on the product page.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Delivery Time</h2>
            <p>
              Once shipped, most orders arrive within 4–8 business days depending on your location. You can
              track your shipment at any time from the <span className="text-foreground">Track Your Order</span>{' '}
              page once tracking details are added.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Delivery Issues</h2>
            <p>
              If your order arrives damaged or a package appears to be missing items, please contact us within
              48 hours of delivery so we can resolve it quickly.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
