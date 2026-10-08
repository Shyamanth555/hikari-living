import { useState } from 'react';
import { Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { productApi } from '../../api/productApi';
import { useToast } from '../../context/ToastContext';
import { formatSaleTime } from '../../lib/pricing';

const EMPTY = { percentOff: '', startsAt: '', endsAt: '' };

// Same rules as the server's checkSale, so mistakes show next to the field.
const validate = ({ percentOff, startsAt, endsAt }) => {
  const errors = {};
  const pct = Number(percentOff);
  if (!Number.isInteger(pct) || pct < 1 || pct > 90) errors.percentOff = 'Enter a whole number from 1 to 90';
  if (!startsAt) errors.startsAt = 'Pick a start time';
  if (!endsAt) errors.endsAt = 'Pick an end time';
  else if (startsAt && new Date(endsAt) <= new Date(startsAt)) errors.endsAt = 'Must be after the start time';
  return errors;
};

/**
 * Puts one flash sale on every product at once (or removes every sale). It
 * writes the same per-product `sale` a single product edit does, so pricing,
 * badges and the home page hero all behave exactly as for a one-product sale.
 */
export function AllProductsSaleDialog({ open, onOpenChange, onDone }) {
  const { toast } = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleOpenChange = (next) => {
    if (!next) {
      setValues(EMPTY);
      setErrors({});
      setConfirmRemove(false);
    }
    onOpenChange(next);
  };

  const update = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  const save = async (sale) => {
    setSaving(true);
    try {
      const { updated, total } = await productApi.adminSetSaleForAll(sale);
      toast({
        title: sale ? 'Sale applied to all products' : 'All sales removed',
        description: sale
          ? `${total} product${total === 1 ? '' : 's'} on sale`
          : `Removed from ${updated} product${updated === 1 ? '' : 's'}`,
        variant: 'success',
      });
      handleOpenChange(false);
      onDone();
    } catch (err) {
      toast({ title: 'Could not update products', description: err?.response?.data?.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleApply = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    save({
      percentOff: Number(values.percentOff),
      startsAt: new Date(values.startsAt).toISOString(),
      endsAt: new Date(values.endsAt).toISOString(),
    });
  };

  const handleRemove = () => {
    if (confirmRemove) save(null);
    else setConfirmRemove(true);
  };

  const summaryReady = Object.keys(validate(values)).length === 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <form onSubmit={handleApply} noValidate>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-sale" /> Sale on all products
            </DialogTitle>
            <DialogDescription>
              Puts the same flash sale on every product, replacing any sale already set on a single product. You
              can still change any one product afterwards. Times are in this device&apos;s time zone.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="allSalePercentOff">Discount (%)</Label>
              <Input
                id="allSalePercentOff"
                type="number"
                min="1"
                max="90"
                step="1"
                placeholder="e.g. 50"
                value={values.percentOff}
                onChange={update('percentOff')}
                className="sm:max-w-40"
              />
              {errors.percentOff && <p className="text-xs text-destructive">{errors.percentOff}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="allSaleStartsAt">Starts</Label>
              <Input id="allSaleStartsAt" type="datetime-local" value={values.startsAt} onChange={update('startsAt')} />
              {errors.startsAt && <p className="text-xs text-destructive">{errors.startsAt}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="allSaleEndsAt">Ends</Label>
              <Input id="allSaleEndsAt" type="datetime-local" value={values.endsAt} onChange={update('endsAt')} />
              {errors.endsAt && <p className="text-xs text-destructive">{errors.endsAt}</p>}
            </div>
          </div>

          {summaryReady && (
            <p className="mt-4 rounded-md bg-background-soft px-3 py-2 text-sm text-foreground">
              <span className="font-medium text-sale">{values.percentOff}% off</span> every product from{' '}
              {formatSaleTime(values.startsAt)} to {formatSaleTime(values.endsAt)}
            </p>
          )}

          <DialogFooter className="flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              onClick={handleRemove}
              disabled={saving}
              className="text-destructive sm:mr-auto"
            >
              {confirmRemove ? 'Yes, remove all sales' : 'Remove all sales'}
            </Button>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Apply to all products'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
