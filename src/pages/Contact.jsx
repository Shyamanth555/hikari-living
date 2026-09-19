import { Mail, MapPin, Phone } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { EnquiryForm } from '../components/common/EnquiryForm';

export default function Contact() {
  return (
    <div className="container-page py-14">
      <SEO title="Contact" description="Get in touch with the Hikari Living team." />

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl text-foreground">Get in Touch</h1>
          <p className="mt-3 text-muted-foreground">
            Questions about an order, a product, or a bulk enquiry? We usually respond within one business day.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4.5 w-4.5 text-primary" />
              <span>hello@hikariliving.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4.5 w-4.5 text-primary" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4.5 w-4.5 text-primary" />
              <span>Bengaluru, India</span>
            </div>
          </div>
        </div>

        <div>
          <EnquiryForm type="general" submitLabel="Send Message" />
        </div>
      </div>
    </div>
  );
}
