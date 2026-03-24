"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  images: File[];
  setImages: (files: File[]) => void;
  max?: number;
  accept?: string;
  disabled?: boolean;
  onFilesSelected?: (files: File[]) => Promise<string | null> | string | null;
}

export default function ImageUploader({
  images,
  setImages,
  max = 10,
  accept = "image/*",
  disabled = false,
  onFilesSelected,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);

    if (images.length + files.length > max) {
      setLocalError(`Chỉ được chọn tối đa ${max} ảnh`);
      event.target.value = "";
      return;
    }

    if (onFilesSelected) {
      setIsProcessing(true);
      const validationError = await onFilesSelected(files);
      setIsProcessing(false);

      if (validationError) {
        setLocalError(validationError);
        event.target.value = "";
        return;
      }
    }

    setLocalError(null);
    setImages([...images, ...files]);
    event.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setLocalError(null);
  };

  const openFile = () => {
    if (disabled || isProcessing) return;
    fileRef.current?.click();
  };

  const previews = useMemo(() => {
    return images.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [images]);

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-4 bg-muted/20">
        <Upload className="w-8 h-8 text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
         Kéo vào tối đa <b>{max}</b> ảnh
        </p>

        <Button type="button" variant="outline" onClick={openFile} disabled={disabled || isProcessing}>
          {isProcessing ? "Đang kiểm tra ảnh..." : "+ Tải ảnh từ thiết bị"}
        </Button>

        <Input
          ref={fileRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={handleUpload}
          disabled={disabled || isProcessing}
        />
      </div>

      {localError && <p className="text-sm text-red-500">{localError}</p>}

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.url}
                alt="Uploaded preview"
                className="w-24 h-24 object-cover rounded-lg border"
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-black text-white rounded-full"
              >
                <X size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
