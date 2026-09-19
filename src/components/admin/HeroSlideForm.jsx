import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { ImageUploader } from './ImageUploader';

const heroSlideSchema = z.object({
  product: z.string().min(1, 'A linked product is required'),
  heading: z.string().optional(),
  subheading: z.string().optional(),
  buttonLabel: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

export function HeroSlideForm({ defaultValues, products = [], onSubmit, submitting = false, submitLabel = 'Save slide' }) {
  const [image, setImage] = useState(defaultValues?.image?.url ? [defaultValues.image] : []);
  const [mobileImage, setMobileImage] = useState(defaultValues?.mobileImage?.url ? [defaultValues.mobileImage] : []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      heading: '',
      subheading: '',
      buttonLabel: 'Buy Now',
      sortOrder: 0,
      isActive: true,
      ...defaultValues,
      product: defaultValues?.product?._id || defaultValues?.product || '',
    },
  });

  const submit = (values) => {
    if (image.length === 0) return;
    onSubmit({
      ...values,
      image: image[0],
      mobileImage: mobileImage[0] || { url: '', publicId: '' },
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="space-y-1.5">
        <Label>Desktop image</Label>
        <p className="text-xs text-muted-foreground">Recommended 1920×1080 (16:9)</p>
        <ImageUploader images={image} onChange={setImage} max={1} />
        {image.length === 0 && <p className="text-xs text-destructive">A desktop image is required</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Mobile image (optional)</Label>
        <p className="text-xs text-muted-foreground">
          Same 16:9 landscape ratio, e.g. 1200×675 — a smaller file that loads faster on mobile. Falls back to the
          desktop image if left empty.
        </p>
        <ImageUploader images={mobileImage} onChange={setMobileImage} max={1} />
      </div>

      <div className="space-y-1.5">
        <Label>Linked product</Label>
        <Controller
          control={control}
          name="product"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select the product this slide links to" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.product && <p className="text-xs text-destructive">{errors.product.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="heading">Heading (optional)</Label>
        <Input id="heading" placeholder="e.g. The Divine Series" {...register('heading')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subheading">Subheading (optional)</Label>
        <Input id="subheading" placeholder="A short supporting line" {...register('subheading')} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="buttonLabel">Button label</Label>
          <Input id="buttonLabel" {...register('buttonLabel')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input id="sortOrder" type="number" {...register('sortOrder')} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', !!v)} />
        Active (visible on homepage)
      </label>

      <Button type="submit" disabled={submitting} size="lg">
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
