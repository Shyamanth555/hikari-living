import { useState } from 'react';
import { Truck } from 'lucide-react';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';

// Couriers on Shiprocket bill on the higher of actual and volumetric weight,
// where volumetric weight is L × B × H (cm) ÷ 5000.
const VOLUMETRIC_DIVISOR = 5000;

const DIMENSIONS = [
  { key: 'length', label: 'Length' },
  { key: 'breadth', label: 'Breadth' },
  { key: 'height', label: 'Height' },
];

const formatKg = (kg) => `${kg.toFixed(2)} kg`;

export function ParcelForm({ parcel, suggestedWeight, onSubmit, submitting = false }) {
  const [form, setForm] = useState({
    weight: parcel?.weight ?? suggestedWeight ?? '',
    length: parcel?.length ?? '',
    breadth: parcel?.breadth ?? '',
    height: parcel?.height ?? '',
  });

  const volumetricWeight =
    form.length && form.breadth && form.height
      ? (Number(form.length) * Number(form.breadth) * Number(form.height)) / VOLUMETRIC_DIVISOR
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      weight: Number(form.weight),
      length: Number(form.length),
      breadth: Number(form.breadth),
      height: Number(form.height),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="parcel-weight">
          Weight (kg) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="parcel-weight"
          type="number"
          inputMode="decimal"
          min="0.01"
          step="any"
          placeholder="e.g. 1.2"
          value={form.weight}
          onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
          required
        />
        {suggestedWeight > 0 && !parcel?.weight && (
          <p className="text-xs text-muted-foreground">
            Pre-filled from product weights — check it against the packed parcel.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">
          Dimensions (cm) <span className="text-destructive">*</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DIMENSIONS.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={`parcel-${key}`} className="text-xs text-muted-foreground">
                {label}
              </Label>
              <Input
                id={`parcel-${key}`}
                type="number"
                inputMode="decimal"
                min="1"
                step="any"
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                required
              />
            </div>
          ))}
        </div>
      </div>

      {volumetricWeight !== null && (
        <div className="rounded-md bg-cream-100 p-3 text-xs text-muted-foreground">
          <p>Volumetric weight: {formatKg(volumetricWeight)}</p>
          <p className="mt-0.5 font-medium text-foreground">
            Chargeable weight: {formatKg(Math.max(Number(form.weight) || 0, volumetricWeight))}
          </p>
          <p className="mt-1">Shiprocket charges on whichever is higher, actual or volumetric weight.</p>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        <Truck className="h-4 w-4" />
        {submitting ? 'Creating shipment…' : 'Ship Now'}
      </Button>
    </form>
  );
}
