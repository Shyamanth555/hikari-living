import { useState } from 'react';
import { ImageLightbox } from '../common/ImageLightbox';
import { cn } from '../../lib/cn';

const SIZES = {
  xs: { box: 'h-10 w-10', px: 80 },
  sm: { box: 'h-14 w-14', px: 112 },
  md: { box: 'h-20 w-20', px: 160 },
};

// Asks Cloudinary for a small square crop instead of the full upload, so a
// row of thumbnails stays light. Non-Cloudinary URLs pass through untouched.
const thumbnailUrl = (url, px) =>
  url.includes('/upload/') ? url.replace('/upload/', `/upload/c_fill,w_${px},h_${px},q_auto,f_auto/`) : url;

// A customer's review photos as thumbnails; tapping one opens it full screen.
export function ReviewPhotos({ images, size = 'md', alt = 'Customer photo', className }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!images?.length) return null;
  const { box, px } = SIZES[size];

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
            <img src={thumbnailUrl(img.url, px)} alt="" loading="lazy" className="h-full w-full object-cover" />
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
