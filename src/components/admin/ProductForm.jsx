import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { ImageUploader } from './ImageUploader';
import { Plus, Trash2, Zap } from 'lucide-react';
import { formatCurrency } from '../../lib/formatCurrency';
import { getSaleStatus, salePriceOf } from '../../lib/pricing';

// <input type="datetime-local"> holds a zone-less local time; the API stores
// ISO instants. new Date('YYYY-MM-DDTHH:mm') parses as local time, which
// covers the other direction.
const toDateTimeLocal = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const SALE_STATUS_LABELS = {
  upcoming: 'Scheduled',
  live: 'Live now',
  ended: 'Ended — clear it or pick new dates',
};

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  compareAtPrice: z.union([z.coerce.number().min(0), z.literal('')]).optional(),
  category: z.string().min(1, 'Category is required'),
  stock: z.coerce.number().min(0, 'Stock must be 0 or more'),
  weight: z.coerce.number().min(0, 'Weight must be 0 or more').optional(),
  sku: z.string().optional(),
  status: z.enum(['active', 'draft']),
  featured: z.boolean().optional(),
  isNewLaunch: z.boolean().optional(),
  tags: z.string().optional(),
  salePercentOff: z.string().optional(),
  saleStartsAt: z.string().optional(),
  saleEndsAt: z.string().optional(),
}).superRefine(({ salePercentOff, saleStartsAt, saleEndsAt }, ctx) => {
  // The flash sale is optional, but once any of its fields is filled, all three must be valid.
  if (!salePercentOff && !saleStartsAt && !saleEndsAt) return;

  const percentOff = Number(salePercentOff);
  if (!Number.isInteger(percentOff) || percentOff < 1 || percentOff > 90) {
    ctx.addIssue({ code: 'custom', path: ['salePercentOff'], message: 'Enter a whole number from 1 to 90' });
  }
  if (!saleStartsAt) ctx.addIssue({ code: 'custom', path: ['saleStartsAt'], message: 'Pick a start time' });
  if (!saleEndsAt) ctx.addIssue({ code: 'custom', path: ['saleEndsAt'], message: 'Pick an end time' });
  if (saleStartsAt && saleEndsAt && new Date(saleEndsAt) <= new Date(saleStartsAt)) {
    ctx.addIssue({ code: 'custom', path: ['saleEndsAt'], message: 'Must be after the start time' });
  }
});

export function ProductForm({ defaultValues, categories = [], onSubmit, submitting = false, submitLabel = 'Save product' }) {
  const [images, setImages] = useState(defaultValues?.images || []);
  const [specifications, setSpecifications] = useState(defaultValues?.specifications || []);

  const addSpec = () => setSpecifications((s) => [...s, { key: '', value: '' }]);
  const updateSpec = (i, field, val) =>
    setSpecifications((s) => s.map((spec, idx) => (idx === i ? { ...spec, [field]: val } : spec)));
  const removeSpec = (i) => setSpecifications((s) => s.filter((_, idx) => idx !== i));

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      compareAtPrice: '',
      stock: 0,
      weight: 0.5,
      sku: '',
      status: 'draft',
      featured: false,
      isNewLaunch: false,
      ...defaultValues,
      category: defaultValues?.category?._id || defaultValues?.category || '',
      tags: (defaultValues?.tags || []).join(', '),
      salePercentOff: defaultValues?.sale ? String(defaultValues.sale.percentOff) : '',
      saleStartsAt: toDateTimeLocal(defaultValues?.sale?.startsAt),
      saleEndsAt: toDateTimeLocal(defaultValues?.sale?.endsAt),
    },
  });

  const [watchedPrice, salePercentOff, saleStartsAt, saleEndsAt] = watch([
    'price',
    'salePercentOff',
    'saleStartsAt',
    'saleEndsAt',
  ]);
  const hasSale = Boolean(salePercentOff || saleStartsAt || saleEndsAt);
  const percentOff = Number(salePercentOff);
  const salePreviewPrice =
    Number(watchedPrice) > 0 && Number.isInteger(percentOff) && percentOff >= 1 && percentOff <= 90
      ? salePriceOf(Number(watchedPrice), percentOff)
      : null;
  // datetime-local strings parse as local time, same as on submit.
  const saleStatus = getSaleStatus({ sale: { startsAt: saleStartsAt, endsAt: saleEndsAt } });
  const saleStatusLabel = SALE_STATUS_LABELS[saleStatus];

  const clearSale = () => {
    setValue('salePercentOff', '');
    setValue('saleStartsAt', '');
    setValue('saleEndsAt', '');
  };

  const submit = ({ salePercentOff, saleStartsAt, saleEndsAt, ...values }) => {
    if (images.length === 0) {
      return;
    }
    onSubmit({
      ...values,
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : null,
      sale: salePercentOff
        ? {
            percentOff: Number(salePercentOff),
            startsAt: new Date(saleStartsAt).toISOString(),
            endsAt: new Date(saleEndsAt).toISOString(),
          }
        : null,
      images,
      tags: values.tags
        ? values.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      specifications: specifications.filter((s) => s.key.trim() && s.value.trim()),
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="space-y-1.5">
        <Label>
          Images <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          Recommended 1200×1200px or larger (square, ratio 1:1) — the first image is used as the main photo and
          product card thumbnail everywhere on the site.
        </p>
        <ImageUploader images={images} onChange={setImages} />
        {images.length === 0 && <p className="text-xs text-destructive">At least one image is required</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">
          Product name <span className="text-destructive">*</span>
        </Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shortDescription">Short description</Label>
        <Input id="shortDescription" {...register('shortDescription')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea id="description" rows={5} {...register('description')} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">
            Price (₹) <span className="text-destructive">*</span>
          </Label>
          <Input id="price" type="number" step="0.01" {...register('price')} />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="compareAtPrice">Compare-at price (₹)</Label>
          <Input id="compareAtPrice" type="number" step="0.01" {...register('compareAtPrice')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">
            Stock <span className="text-destructive">*</span>
          </Label>
          <Input id="stock" type="number" {...register('stock')} />
          {errors.stock && <p className="text-xs text-destructive">{errors.stock.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input id="weight" type="number" step="0.01" {...register('weight')} />
          {errors.weight && <p className="text-xs text-destructive">{errors.weight.message}</p>}
          <p className="text-xs text-muted-foreground">Per unit — used for shipping calculations</p>
        </div>
      </div>

      <div className="space-y-4 rounded-lg border border-border p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Zap className="h-4 w-4 text-sale" /> Flash sale (optional)
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Takes the discount off the price between the start and end time, and promotes the product in the home
              page hero from 24 hours before it starts. Times are in this device&apos;s time zone.
            </p>
          </div>
          {hasSale && (
            <Button type="button" variant="ghost" size="sm" onClick={clearSale}>
              Remove sale
            </Button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-1.5">
            <Label htmlFor="salePercentOff">Discount (%)</Label>
            <Input id="salePercentOff" type="number" min="1" max="90" step="1" placeholder="e.g. 50" {...register('salePercentOff')} />
            {errors.salePercentOff && <p className="text-xs text-destructive">{errors.salePercentOff.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="saleStartsAt">Starts</Label>
            <Input id="saleStartsAt" type="datetime-local" {...register('saleStartsAt')} />
            {errors.saleStartsAt && <p className="text-xs text-destructive">{errors.saleStartsAt.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="saleEndsAt">Ends</Label>
            <Input id="saleEndsAt" type="datetime-local" {...register('saleEndsAt')} />
            {errors.saleEndsAt && <p className="text-xs text-destructive">{errors.saleEndsAt.message}</p>}
          </div>
        </div>

        {(salePreviewPrice !== null || saleStatusLabel) && (
          <p className="text-sm text-muted-foreground">
            {salePreviewPrice !== null && (
              <>
                Sale price <span className="font-medium text-foreground">{formatCurrency(salePreviewPrice)}</span>{' '}
                <span className="line-through">{formatCurrency(watchedPrice)}</span>
              </>
            )}
            {salePreviewPrice !== null && saleStatusLabel && ' · '}
            {saleStatusLabel && (
              <span className={saleStatus === 'live' ? 'font-medium text-sale' : undefined}>{saleStatusLabel}</span>
            )}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>
            Category <span className="text-destructive">*</span>
          </Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sku">SKU (optional)</Label>
          <Input id="sku" {...register('sku')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" placeholder="e.g. ganesha, brass, divine series" {...register('tags')} />
      </div>

      <div className="space-y-2">
        <Label>Specifications (optional)</Label>
        {specifications.map((spec, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="e.g. Material"
              value={spec.key}
              onChange={(e) => updateSpec(i, 'key', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="e.g. Brass"
              value={spec.value}
              onChange={(e) => updateSpec(i, 'value', e.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeSpec(i)}
              className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground hover:text-destructive cursor-pointer"
              aria-label="Remove specification"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addSpec}>
          <Plus className="h-3.5 w-3.5" /> Add specification
        </Button>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={watch('featured')} onCheckedChange={(v) => setValue('featured', !!v)} />
          Feature on home page
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={watch('isNewLaunch')} onCheckedChange={(v) => setValue('isNewLaunch', !!v)} />
          Show in New Launches
        </label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} size="lg">
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
