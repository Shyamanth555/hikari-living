import { SEO } from '../components/common/SEO';
import { BRAND_NAME } from '../lib/constants';

export default function TermsOfService() {
  return (
    <div className="container-page py-14">
      <SEO title="Terms of Service" />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl text-foreground">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Use of This Site</h2>
            <p>
              By using {BRAND_NAME}, you agree to provide accurate information when creating an account or
              placing an order, and to use this site only for lawful purposes.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Orders & Pricing</h2>
            <p>
              All prices are listed in Indian Rupees (INR) and are subject to change without notice. We
              reserve the right to refuse or cancel any order, including in cases of pricing errors or
              suspected fraud, in which case any payment already made will be refunded in full.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Product Availability</h2>
            <p>
              Stock levels are updated regularly, but availability is not guaranteed until an order is
              confirmed and paid for.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Intellectual Property</h2>
            <p>
              All content on this site — including product photography, descriptions, and branding — is the
              property of {BRAND_NAME} and may not be reproduced without permission.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Limitation of Liability</h2>
            <p>
              {BRAND_NAME} is not liable for indirect or consequential damages arising from the use of this
              site or its products, to the fullest extent permitted by law.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
