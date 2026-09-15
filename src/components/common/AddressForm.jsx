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
  phone: z.string().min(6, 'A valid phone number is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
});

export function AddressForm({ defaultValues, onSubmit, submitLabel = 'Save address', submitting = false }) {
  const {
    register,
    handleSubmit,
    setValue,
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
          <Input id="phone" {...register('phone')} />
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" {...register('city')} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="state">State</Label>
          <Input id="state" {...register('state')} />
          {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="postalCode">Postal code</Label>
          <Input id="postalCode" {...register('postalCode')} />
          {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="country">Country</Label>
        <Input id="country" {...register('country')} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={watch('isDefault')} onCheckedChange={(v) => setValue('isDefault', !!v)} />
        Set as default address
      </label>

      <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
