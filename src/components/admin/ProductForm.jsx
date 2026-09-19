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
import { Plus, Trash2 } from 'lucide-react';

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
  tags: z.string().optional(),
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
      ...defaultValues,
      category: defaultValues?.category?._id || defaultValues?.category || '',
      tags: (defaultValues?.tags || []).join(', '),
    },
  });

  const submit = (values) => {
    if (images.length === 0) {
      return;
    }
    onSubmit({
      ...values,
      compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : null,
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
        <Label>Images</Label>
        <ImageUploader images={images} onChange={setImages} />
        {images.length === 0 && <p className="text-xs text-destructive">At least one image is required</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Product name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="shortDescription">Short description</Label>
        <Input id="shortDescription" {...register('shortDescription')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={5} {...register('description')} />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (₹)</Label>
          <Input id="price" type="number" step="0.01" {...register('price')} />
          {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="compareAtPrice">Compare-at price (₹)</Label>
          <Input id="compareAtPrice" type="number" step="0.01" {...register('compareAtPrice')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">Stock</Label>
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Category</Label>
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

      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={watch('featured')} onCheckedChange={(v) => setValue('featured', !!v)} />
        Feature on home page
      </label>

      <Button type="submit" disabled={submitting} size="lg">
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
