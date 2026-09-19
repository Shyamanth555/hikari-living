import { useState } from 'react';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { contactApi } from '../../api/contactApi';

export function EnquiryForm({ type = 'general', subject, messagePlaceholder, submitLabel = 'Send Enquiry' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await contactApi.submit({ ...form, type, subject });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong, please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-sage-500/30 bg-sage-50 p-6 text-sage-600">
        Thanks for reaching out — our team will get back to you soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="enquiry-name">Name</Label>
        <Input id="enquiry-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="enquiry-email">Email</Label>
        <Input
          id="enquiry-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="enquiry-phone">Phone (optional)</Label>
        <Input id="enquiry-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="enquiry-message">Message</Label>
        <Textarea
          id="enquiry-message"
          rows={5}
          placeholder={messagePlaceholder}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          required
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? 'Sending…' : submitLabel}
      </Button>
    </form>
  );
}
