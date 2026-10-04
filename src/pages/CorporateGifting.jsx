import { Gift, Percent, Truck } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { EnquiryForm } from '../components/common/EnquiryForm';

const HIGHLIGHTS = [
  { icon: Gift, title: 'Bulk orders', description: 'From 10 pieces for a team to hundreds for an event' },
  { icon: Percent, title: 'Volume pricing', description: 'Better rates as your order quantity grows' },
  { icon: Truck, title: 'Pan-India delivery', description: 'Shipped directly to your office or event venue' },
];

export default function CorporateGifting() {
  return (
    <div className="container-page py-14">
      <SEO title="Corporate Gifting" description="Bulk and corporate gifting orders from Hikari Living." />

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl text-foreground">Corporate Gifting</h1>
          <p className="mt-3 text-muted-foreground">
            Sculptures and idols make thoughtful, lasting gifts for clients, employees, and events. Tell us about
            your occasion and quantity, and our team will put together a proposal for you.
          </p>

          <div className="mt-8 space-y-5">
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="flex items-start gap-3">
                <h.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium text-foreground">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <EnquiryForm
            type="corporate-gifting"
            subject="Corporate Gifting Enquiry"
            submitLabel="Submit Enquiry"
            messagePlaceholder="Company name, estimated quantity, occasion/event date, and any product preferences."
          />
        </div>
      </div>
    </div>
  );
}
