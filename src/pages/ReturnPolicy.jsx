import { SEO } from '../components/common/SEO';

export default function ReturnPolicy() {
  return (
    <div className="container-page py-14">
      <SEO title="Return & Exchange Policy" />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl text-foreground">Return & Exchange Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Return Window</h2>
            <p>
              We accept returns and exchanges within 7 days of delivery, provided the item is unused, in its
              original packaging, and accompanied by proof of purchase.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Non-Returnable Items</h2>
            <p>
              Made-to-order custom sculptures, items marked as final sale, and gift cards are not eligible for return
              or exchange unless received damaged or defective.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">How to Start a Return</h2>
            <p>
              Contact us via the Contact page with your order number and reason for return. Once approved,
              we&apos;ll arrange a pickup or share return shipping instructions.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Refunds</h2>
            <p>
              Once your return is received and inspected, refunds are issued to your original payment method
              within 5–7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
