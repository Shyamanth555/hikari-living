import { useRef, useState } from 'react';
import { ImagePlus, Loader2, RefreshCw, X } from 'lucide-react';
import { uploadApi } from '../../api/uploadApi';
import { useToast } from '../../context/ToastContext';
import { cn } from '../../lib/cn';

export function ImageUploader({ images = [], onChange, max = 8 }) {
  const inputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replaceIndexRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    if (images.length + files.length > max) {
      toast({ title: `You can upload up to ${max} images`, variant: 'destructive' });
      return;
    }

    setUploading(true);
    try {
      const uploaded = await uploadApi.upload(files);
      onChange([...images, ...uploaded]);
    } catch (err) {
      toast({
        title: 'Upload failed',
        description: err?.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (image) => {
    onChange(images.filter((img) => img.publicId !== image.publicId));
    uploadApi.remove(image.publicId).catch(() => {});
  };

  const startReplace = (index) => {
    replaceIndexRef.current = index;
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = async (files) => {
    const index = replaceIndexRef.current;
    const file = files?.[0];
    if (!file || index === null || index === undefined) return;

    const oldImage = images[index];
    setUploading(true);
    try {
      const [uploaded] = await uploadApi.upload([file]);
      const next = [...images];
      next[index] = uploaded;
      onChange(next);
      if (oldImage) uploadApi.remove(oldImage.publicId).catch(() => {});
    } catch (err) {
      toast({
        title: 'Replace failed',
        description: err?.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((img, index) => (
          <div key={img.publicId} className="group relative aspect-square overflow-hidden rounded-md border border-border">
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-1.5">
              <button
                type="button"
                onClick={() => startReplace(index)}
                disabled={uploading}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-900/70 text-cream-50 cursor-pointer disabled:opacity-40"
                aria-label="Replace image"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(img)}
                disabled={uploading}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-900/70 text-cream-50 cursor-pointer disabled:opacity-40"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {index === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded bg-ink-900/70 px-1.5 py-0.5 text-[10px] font-medium text-cream-50">
                Main photo
              </span>
            )}
          </div>
        ))}

        {images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            disabled={uploading}
            className={cn(
              'flex aspect-square flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed text-muted-foreground transition-colors cursor-pointer',
              dragOver ? 'border-primary bg-gold-50' : 'border-border hover:bg-cream-100'
            )}
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
            <span className="text-xs">{uploading ? 'Uploading…' : 'Add image'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleReplaceFile(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
