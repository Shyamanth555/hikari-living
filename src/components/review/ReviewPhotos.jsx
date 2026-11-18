import { useState } from 'react';
import { ImageLightbox } from '../common/ImageLightbox';
import { cn } from '../../lib/cn';
import { imageUrl } from '../../lib/cloudinaryImage';

// Display sizes only — every size loads the same 'thumb' image, so a photo
// seen in a review card is already cached when the review dialog or product
// page shows it again.
const SIZES = {
  xs: 'h-10 w-10',
  sm: 'h-14 w-14',
  md: 'h-20 w-20',
};

// A customer's review photos as thumbnails; tapping one opens it full screen.
export function ReviewPhotos({ images, size = 'md', alt = 'Customer photo', className }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!images?.length) return null;
  const box = SIZES[size];

  return (
    <>
      <div className={cn('flex flex-wrap gap-2', className)}>
        {images.map((img, i) => (
          <button
            key={img.publicId || img.url}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={cn(
              'shrink-0 overflow-hidden rounded-md bg-cream-200 ring-1 ring-border transition-opacity hover:opacity-85 cursor-zoom-in',
              box
            )}
            aria-label={`View photo ${i + 1} of ${images.length} full screen`}
          >
            <img src={imageUrl(img.url, 'thumb')} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <ImageLightbox
        images={images}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
        alt={alt}
      />
    </>
  );
}
