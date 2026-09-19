import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD_PX = 40;

export function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  const goTo = useCallback((i) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  if (slides.length === 0) return null;

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD_PX) {
      goTo(index + (diff > 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative aspect-video w-full touch-pan-y overflow-hidden bg-cream-200"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
          )}
          aria-hidden={i !== index}
        >
          <img
            src={slide.image?.url}
            alt={slide.heading || slide.product?.name || ''}
            className="h-full w-full object-cover"
            loading={i === 0 ? 'eager' : 'lazy'}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 px-6 pt-6 pb-12 text-center text-cream-50 md:px-10 md:pt-10 md:pb-14">
            {slide.heading && <h2 className="font-display text-2xl md:text-4xl">{slide.heading}</h2>}
            {slide.subheading && (
              <p className="mx-auto mt-2 max-w-sm text-sm text-cream-100/90 md:text-base">{slide.subheading}</p>
            )}
            {slide.product && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to={`/product/${slide.product.slug}`}
                  className="inline-flex h-11 items-center rounded-md bg-cream-50 px-6 text-sm font-medium text-ink-900 transition-colors hover:bg-cream-200"
                >
                  {slide.buttonLabel || 'Buy Now'}
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2">
          {slides.map((slide, i) => (
            <button
              key={slide._id}
              type="button"
              onClick={() => goTo(i)}
              className="flex h-9 w-8 cursor-pointer items-center justify-center"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === index ? 'w-6 bg-cream-50' : 'w-1.5 bg-cream-50/50'
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
