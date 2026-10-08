import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { compressImage } from '../../lib/compressImage';
import { useToast } from '../../context/ToastContext';

/**
 * Lets a customer attach up to `max` photos to their review. Files stay local
 * (shrunk by compressImage) and are only uploaded when the review is submitted.
 *
 * @param {{ file: File, preview: string }[]} photos
 * @param {(photos: { file: File, preview: string }[]) => void} onChange
 */
export function ReviewPhotoPicker({ photos, onChange, max = 4, disabled = false }) {
  const inputRef = useRef(null);
  const [preparing, setPreparing] = useState(false);
  const { toast } = useToast();

  // Preview URLs hold the image in memory until revoked. A ref tracks the
  // latest list so unmount revokes what's actually still shown.
  const photosRef = useRef(photos);
  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((p) => URL.revokeObjectURL(p.preview)), []);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) return;

    const room = max - photos.length;
    if (files.length > room) {
      toast({ title: `You can add up to ${max} photos`, description: `Only the first ${room} were added.`, variant: 'destructive' });
    }

    setPreparing(true);
    try {
      const added = await Promise.all(
        files.slice(0, room).map(async (f) => {
          const file = await compressImage(f);
          return { file, preview: URL.createObjectURL(file) };
        })
      );
      onChange([...photos, ...added]);
    } finally {
      setPreparing(false);
    }
  };

  const remove = (photo) => {
    URL.revokeObjectURL(photo.preview);
    onChange(photos.filter((p) => p !== photo));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {photos.map((photo, i) => (
          <div key={photo.preview} className="relative h-20 w-20 overflow-hidden rounded-md ring-1 ring-border">
            <img src={photo.preview} alt={`Your photo ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(photo)}
              disabled={disabled}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-900/70 text-cream-50 cursor-pointer disabled:opacity-40"
              aria-label={`Remove photo ${i + 1}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {photos.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || preparing}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:bg-cream-100 cursor-pointer disabled:opacity-50"
          >
            {preparing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span className="text-[11px]">{preparing ? 'Adding…' : 'Add photo'}</span>
          </button>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        {photos.length}/{max} photos · JPG, PNG or WEBP
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
