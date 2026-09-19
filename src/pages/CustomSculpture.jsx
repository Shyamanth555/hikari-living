import { Hammer, Palette, Ruler } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { EnquiryForm } from '../components/common/EnquiryForm';

const HIGHLIGHTS = [
  { icon: Ruler, title: 'Any size', description: 'From tabletop pieces to life-size installations' },
  { icon: Palette, title: 'Your choice of material', description: 'Brass, panchaloha, marble, wood, or resin' },
  { icon: Hammer, title: 'Made by hand', description: 'Crafted by experienced artisans, not mass-produced' },
];

export default function CustomSculpture() {
  return (
    <div className="container-page py-14">
      <SEO title="Custom Sculpture" description="Commission a handcrafted custom sculpture from Hikari Living." />

      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl text-foreground">Custom Sculpture</h1>
          <p className="mt-3 text-muted-foreground">
            Have a specific deity, size, material, or reference in mind? Our artisans take on custom commissions —
            share your requirements below and our team will get back to you with options and pricing.
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
            type="custom-sculpture"
            subject="Custom Sculpture Enquiry"
            submitLabel="Submit Enquiry"
            messagePlaceholder="Tell us about the deity/subject, approximate size, preferred material, and any reference images or links, plus your timeline."
          />
        </div>
      </div>
    </div>
  );
}
