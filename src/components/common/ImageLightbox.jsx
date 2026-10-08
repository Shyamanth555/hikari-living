import { useRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const SWIPE_THRESHOLD_PX = 40;

/**
 * Full-screen photo viewer. Arrow keys, the side buttons or a swipe move
 * between photos; Esc, the close button or a tap on the dark backdrop exits.
 * Sits above other dialogs (z-60), so it can open from inside one.
 *
 * @param {{ url: string }[]} images
 * @param {number | null} index - the photo shown; null when closed
 */
export function ImageLightbox({ images, index, onIndexChange, onClose, alt = '' }) {
  const touchStartX = useRef(null);
  const open = index !== null && index !== undefined && images.length > 0;
  const count = images.length;
  const go = (delta) => onIndexChange((index + delta + count) % count);

  const handleKeyDown = (e) => {
    if (count <= 1) return;
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || count <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD_PX) go(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const navButton =
    'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream-50/10 text-cream-50 transition-colors hover:bg-cream-50/20 cursor-pointer';

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-60 bg-ink-900" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onKeyDown={handleKeyDown}
          onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
          onTouchEnd={handleTouchEnd}
          // The content fills the screen, so a tap on the backdrop around the photo lands here.
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 focus:outline-none sm:p-16"
        >
          <DialogPrimitive.Title className="sr-only">
            Photo {open ? index + 1 : 0} of {count}
          </DialogPrimitive.Title>

          {open && (
            <img
              src={images[index].url}
              alt={alt}
              className="max-h-full max-w-full select-none rounded-md object-contain"
              draggable={false}
            />
          )}

          {count > 1 && (
            <p className="absolute left-4 top-4 text-sm font-medium text-cream-50/80">
              {index + 1} / {count}
            </p>
          )}

          <DialogPrimitive.Close
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-cream-50 transition-colors hover:bg-cream-50/10 cursor-pointer"
            aria-label="Close photo"
          >
            <X className="h-6 w-6" />
          </DialogPrimitive.Close>

          {count > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className={`${navButton} left-2 sm:left-4`} aria-label="Previous photo">
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button type="button" onClick={() => go(1)} className={`${navButton} right-2 sm:right-4`} aria-label="Next photo">
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
