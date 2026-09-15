import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SEO } from '../components/common/SEO';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { contactApi } from '../api/contactApi';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await contactApi.submit(form);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
          {submitted ? (
            <div className="rounded-lg border border-sage-500/30 bg-sage-50 p-6 text-sage-600">
              Thanks for reaching out — we&apos;ll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
