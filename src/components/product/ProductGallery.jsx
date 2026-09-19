import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/cn';

const SWIPE_THRESHOLD_PX = 40;

export function ProductGallery({ images = [], productName, onAddToCart, addToCartDisabled = false }) {
  const [active, setActive] = useState(0);
  const activeImage = images[active] || images[0];
  const touchStartX = useRef(null);

  const goTo = (i) => setActive((i + images.length) % images.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD_PX) {
      goTo(active + (diff > 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <div>
      <div
        className="relative aspect-square touch-pan-y overflow-hidden rounded-lg bg-cream-200"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeImage && (
          <img src={activeImage.url} alt={productName} className="h-full w-full object-cover" />
        )}
        {onAddToCart && (
          <button
            type="button"
            onClick={onAddToCart}
            disabled={addToCartDisabled}
            className="absolute bottom-3 right-3 md:bottom-auto md:top-3 flex h-12 w-12 items-center justify-center rounded-full bg-cream-50/95 text-foreground shadow-md transition-colors hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        )}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/95 text-foreground shadow-md transition-colors hover:bg-cream-100 cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/95 text-foreground shadow-md transition-colors hover:bg-cream-100 cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
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
