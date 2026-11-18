import { Plus, Trash2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { ImageUploader } from './ImageUploader';

const MAX_COLOR_PHOTOS = 6;

let nextKey = 0;

// A colour as edited in the form. `key` is only for React; `_id` is kept for
// an existing colour so carts already holding it stay valid after a save.
export const newColorRow = (c = {}) => ({
  key: `color-${nextKey++}`,
  _id: c._id,
  name: c.name || '',
  hex: c.hex || '#b08f42',
  price: c.price ?? '',
  compareAtPrice: c.compareAtPrice ?? '',
  stock: c.stock ?? 0,
  sku: c.sku || '',
  images: c.images || [],
});

// Same rules as the server's checkColors, so a mistake shows before saving.
// Returns the first problem, or null.
export function validateColors(colors) {
  const seen = new Set();
  for (const [i, c] of colors.entries()) {
    const name = c.name.trim();
    if (!name) return `Colour ${i + 1} needs a name`;
    if (c.price === '' || !(Number(c.price) >= 0)) return `"${name}" needs a price`;
    if (c.compareAtPrice !== '' && c.compareAtPrice !== null && !(Number(c.compareAtPrice) >= 0)) {
      return `"${name}" MRP must be 0 or more`;
    }
    if (!Number.isInteger(Number(c.stock)) || Number(c.stock) < 0) return `"${name}" stock must be 0 or more`;
    if (c.images.length === 0) return `"${name}" needs at least one photo`;
    if (seen.has(name.toLowerCase())) return `Two colours are both named "${name}"`;
    seen.add(name.toLowerCase());
  }
  return null;
}

// Rows → the API's colours.
export const toColorPayload = (colors) =>
  colors.map((c) => ({
    ...(c._id && { _id: c._id }),
    name: c.name.trim(),
    hex: c.hex,
    price: Number(c.price),
    compareAtPrice: c.compareAtPrice === '' || c.compareAtPrice === null ? null : Number(c.compareAtPrice),
    stock: Number(c.stock),
    sku: c.sku.trim(),
    images: c.images,
  }));

/**
 * The product form's colours. `onChange` must accept an updater function
 * (a useState setter does), so a photo upload finishing late can't undo edits
 * made to other colours meanwhile.
 */
export function ColorsEditor({ colors, onChange, error }) {
  const update = (key, field, value) =>
    onChange((prev) => prev.map((c) => (c.key === key ? { ...c, [field]: value } : c)));
  const remove = (key) => onChange((prev) => prev.filter((c) => c.key !== key));
  const add = () => onChange((prev) => [...prev, newColorRow()]);

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div>
        <p className="text-sm font-medium text-foreground">Colours (optional)</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add one for each colour the product comes in — each has its own price, stock and photos, and customers pick
          one on the product page. Leave this empty for a product that comes in one colour only.
        </p>
      </div>

      {colors.map((c, i) => (
        <div key={c.key} className="space-y-3 rounded-md border border-border bg-cream-100/40 p-3">
          <div className="flex items-end gap-3">
            <div className="space-y-1.5">
              <Label htmlFor={`${c.key}-hex`}>Colour</Label>
              <input
                id={`${c.key}-hex`}
                type="color"
                value={c.hex}
                onChange={(e) => update(c.key, 'hex', e.target.value)}
                className="block h-11 w-14 cursor-pointer rounded-md border border-border bg-cream-50 p-1"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-1.5">
              <Label htmlFor={`${c.key}-name`}>
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`${c.key}-name`}
                placeholder="e.g. Antique Gold"
                value={c.name}
                onChange={(e) => update(c.key, 'name', e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(c.key)}
              className="flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground hover:text-destructive cursor-pointer"
              aria-label={`Remove colour ${c.name || i + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="space-y-1.5">
              <Label htmlFor={`${c.key}-price`}>
                Price (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`${c.key}-price`}
                type="number"
                min="0"
                step="0.01"
                value={c.price}
                onChange={(e) => update(c.key, 'price', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${c.key}-mrp`}>MRP (₹)</Label>
              <Input
                id={`${c.key}-mrp`}
                type="number"
                min="0"
                step="0.01"
                value={c.compareAtPrice ?? ''}
                onChange={(e) => update(c.key, 'compareAtPrice', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${c.key}-stock`}>
                Stock <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`${c.key}-stock`}
                type="number"
                min="0"
                step="1"
                value={c.stock}
                onChange={(e) => update(c.key, 'stock', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`${c.key}-sku`}>SKU</Label>
              <Input id={`${c.key}-sku`} value={c.sku} onChange={(e) => update(c.key, 'sku', e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>
              Photos <span className="text-destructive">*</span>
            </Label>
            <ImageUploader
              images={c.images}
              onChange={(images) => update(c.key, 'images', images)}
              max={MAX_COLOR_PHOTOS}
            />
          </div>
        </div>
      ))}

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="h-3.5 w-3.5" /> Add colour
      </Button>
    </div>
  );
}
