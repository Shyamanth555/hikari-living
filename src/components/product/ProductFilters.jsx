import { useState } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Label } from '../ui/Label';
import { Separator } from '../ui/Separator';

// Filter facets are config-driven so new ones (brand, material, rating, ...) can be
// added later without restructuring this component — currently: category + price.
export function ProductFilters({ categories = [], value, onChange, onClear }) {
  const [priceDraft, setPriceDraft] = useState({ minPrice: value.minPrice || '', maxPrice: value.maxPrice || '' });

  const applyPriceRange = () => {
    onChange({ ...value, minPrice: priceDraft.minPrice, maxPrice: priceDraft.maxPrice });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat._id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={value.category === cat._id}
                onCheckedChange={(checked) => onChange({ ...value, category: checked ? cat._id : undefined })}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Price</h3>
        <div className="flex items-center gap-2">
          <div className="space-y-1">
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
              Min
            </Label>
            <Input
              id="minPrice"
              type="number"
              min={0}
              value={priceDraft.minPrice}
              onChange={(e) => setPriceDraft((p) => ({ ...p, minPrice: e.target.value }))}
              className="h-9"
            />
          </div>
          <span className="mt-5 text-muted-foreground">–</span>
          <div className="space-y-1">
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
              Max
            </Label>
            <Input
              id="maxPrice"
              type="number"
              min={0}
              value={priceDraft.maxPrice}
              onChange={(e) => setPriceDraft((p) => ({ ...p, maxPrice: e.target.value }))}
              className="h-9"
            />
          </div>
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={applyPriceRange}>
          Apply
        </Button>
      </div>

      <Separator />

      <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
        Clear all filters
      </Button>
    </div>
  );
}
