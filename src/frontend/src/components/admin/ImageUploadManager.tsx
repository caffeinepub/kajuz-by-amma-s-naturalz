import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useStorageUpload } from "../../hooks/useStorageUpload";

interface ImageUploadManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export function ImageUploadManager({
  images,
  onChange,
  onUploadingChange,
}: ImageUploadManagerProps) {
  const { uploadImage } = useStorageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (images.length >= 3) return;

    const previewUrl = URL.createObjectURL(file);
    const newImages = [...images, previewUrl];
    const idx = newImages.length - 1;
    onChange(newImages);
    setUploadingIdx(idx);
    setProgress(0);
    onUploadingChange?.(true);

    try {
      const url = await uploadImage(file, (pct) => setProgress(pct));
      URL.revokeObjectURL(previewUrl);
      const updated = [...newImages];
      updated[idx] = url;
      onChange(updated);
    } catch (err) {
      console.error("Upload failed", err);
      onChange(images);
    } finally {
      setUploadingIdx(null);
      setProgress(0);
      onUploadingChange?.(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (idx: number) => {
    if (images.length <= 1) return;
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((src, idx) => (
          <div
            key={src}
            className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-muted"
          >
            <img
              src={src}
              alt={`Product view ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            {uploadingIdx === idx && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span className="text-white text-xs">{progress}%</span>
              </div>
            )}
            {uploadingIdx !== idx && images.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-destructive transition-colors"
                data-ocid={`image_manager.remove_button.${idx + 1}`}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}

        {images.length < 3 && uploadingIdx === null && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 rounded-lg border-2 border-dashed border-border hover:border-accent flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-accent transition-colors bg-muted/30"
            data-ocid="image_manager.upload_button"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-xs">Add</span>
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {images.length}/3 photos · Minimum 1 required
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
