import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';

const addressSchema = z.object({
  label: z.string().optional(),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit phone number'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
});

export function AddressForm({ defaultValues, onSubmit, submitLabel = 'Save address', submitting = false }) {
  const [pincodeStatus, setPincodeStatus] = useState('idle'); // idle | loading | success | error

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: 'Home',
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false,
      ...defaultValues,
    },
  });

  const postalCode = watch('postalCode');

  useEffect(() => {
    if (!postalCode || postalCode.length !== 6) {
      setPincodeStatus('idle');
      clearErrors(['postalCode', 'city', 'state']);
      return undefined;
    }

    let cancelled = false;
    setPincodeStatus('loading');

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`);
        const data = await res.json();
        const result = data?.[0];

        if (cancelled) return;

        if (result?.Status === 'Success' && result.PostOffice?.length) {
          const office = result.PostOffice[0];
          setValue('city', office.District, { shouldValidate: true });
          setValue('state', office.State, { shouldValidate: true });
          setValue('country', office.Country || 'India', { shouldValidate: true });
          clearErrors('postalCode');
          setPincodeStatus('success');
        } else {
          setValue('city', '', { shouldValidate: true });
          setValue('state', '', { shouldValidate: true });
          setError('postalCode', { message: 'No address found for this pincode' });
          setPincodeStatus('error');
        }
      } catch {
        if (!cancelled) {
          setError('postalCode', { message: 'Could not verify pincode, check your connection' });
          setPincodeStatus('error');
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [postalCode, setValue, setError, clearErrors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" {...register('fullName')} />
          {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            {...register('phone', {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
              },
            })}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="addressLine1">Address line 1</Label>
        <Input id="addressLine1" {...register('addressLine1')} />
        {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="addressLine2">Address line 2 (optional)</Label>
        <Input id="addressLine2" {...register('addressLine2')} />
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="postalCode">Pincode</Label>
          <Input
            id="postalCode"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit pincode"
            {...register('postalCode', {
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
              },
            })}
          />
          {pincodeStatus === 'loading' && (
            <p className="text-xs text-muted-foreground">Looking up pincode…</p>
          )}
          {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" disabled placeholder="Auto-filled from pincode" {...register('city')} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="state">State</Label>
          <Input id="state" disabled placeholder="Auto-filled from pincode" {...register('state')} />
          {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">Country</Label>
          <Input id="country" disabled placeholder="Auto-filled from pincode" {...register('country')} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={watch('isDefault')} onCheckedChange={(v) => setValue('isDefault', !!v)} />
        Set as default address
      </label>

      <Button
        type="submit"
        disabled={submitting || pincodeStatus === 'loading'}
        className="w-full sm:w-auto"
      >
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
