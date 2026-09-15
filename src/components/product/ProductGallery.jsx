import { useState } from 'react';
import { cn } from '../../lib/cn';

export function ProductGallery({ images = [], productName }) {
  const [active, setActive] = useState(0);
  const activeImage = images[active] || images[0];

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-lg bg-cream-200">
        {activeImage && (
          <img src={activeImage.url} alt={productName} className="h-full w-full object-cover" />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img.publicId || i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'aspect-square overflow-hidden rounded-md border-2 cursor-pointer',
                i === active ? 'border-primary' : 'border-transparent'
              )}
            >
              <img src={img.url} alt={`${productName} ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
