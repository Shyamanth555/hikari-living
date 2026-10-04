import { useState } from 'react';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';

export function TrackingForm({ tracking, onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    carrier: tracking?.carrier || '',
    trackingId: tracking?.trackingId || '',
    trackingUrl: tracking?.trackingUrl || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="carrier">
          Carrier <span className="text-destructive">*</span>
        </Label>
        <Input
          id="carrier"
          placeholder="e.g. Delhivery, Bluedart"
          value={form.carrier}
          onChange={(e) => setForm((f) => ({ ...f, carrier: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="trackingId">
          Tracking ID <span className="text-destructive">*</span>
        </Label>
        <Input
          id="trackingId"
          value={form.trackingId}
          onChange={(e) => setForm((f) => ({ ...f, trackingId: e.target.value }))}
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="trackingUrl">Tracking URL (optional)</Label>
        <Input
          id="trackingUrl"
          type="url"
          placeholder="https://…"
          value={form.trackingUrl}
          onChange={(e) => setForm((f) => ({ ...f, trackingUrl: e.target.value }))}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : tracking?.trackingId ? 'Update tracking' : 'Add tracking'}
        </Button>
      </div>
    </form>
  );
}
