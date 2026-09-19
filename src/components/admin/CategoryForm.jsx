import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { ImageUploader } from './ImageUploader';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

export function CategoryForm({ defaultValues, onSubmit, submitting = false, submitLabel = 'Save category' }) {
  const [image, setImage] = useState(defaultValues?.image?.url ? [defaultValues.image] : []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      sortOrder: 0,
      isActive: true,
      ...defaultValues,
    },
  });

  const submit = (values) => {
    onSubmit({ ...values, image: image[0] || { url: '', publicId: '' } });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="space-y-1.5">
        <Label>Image</Label>
        <ImageUploader images={image} onChange={setImage} max={1} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">
          Category name <span className="text-destructive">*</span>
        </Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
      </div>

      <div className="space-y-1.5 max-w-40">
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input id="sortOrder" type="number" {...register('sortOrder')} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={watch('isActive')} onCheckedChange={(v) => setValue('isActive', !!v)} />
        Active (visible on storefront)
      </label>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} size="lg">
          {submitting ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
