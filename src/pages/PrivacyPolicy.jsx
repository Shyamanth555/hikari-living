import { SEO } from '../components/common/SEO';
import { BRAND_NAME } from '../lib/constants';

export default function PrivacyPolicy() {
  return (
    <div className="container-page py-14">
      <SEO title="Privacy Policy" />
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

        <div className="prose-policy mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Information We Collect</h2>
            <p>
              When you create an account, place an order, or contact us, we collect information such as your
              name, email address, phone number, shipping address, and order history. We do not store your
              payment card details — all payments are processed securely by our payment partner, Razorpay.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">How We Use Your Information</h2>
            <p>
              We use your information to process and fulfil orders, communicate order and shipping updates,
              respond to enquiries, and improve our products and services. We do not sell your personal
              information to third parties.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Data Security</h2>
            <p>
              We use industry-standard measures — including encrypted password storage and secure, cookie-based
              authentication — to protect your account information from unauthorised access.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Your Rights</h2>
            <p>
              You can review and update your account details at any time from{' '}
              <span className="text-foreground">My Account</span>, or contact us to request deletion of your
              account and associated personal data, subject to any records we are legally required to retain.
            </p>
          </section>
          <section>
            <h2 className="mb-2 font-display text-lg text-foreground">Contact Us</h2>
            <p>For any privacy-related questions, please reach us via the {BRAND_NAME} Contact page.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
