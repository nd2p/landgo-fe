"use client";

import { useRef, useMemo, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  images: File[];
  setImages: (files: File[]) => void;
  max?: number;
}

export default function ImageUploader({ images, setImages, max = 10 }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (images.length + files.length > max) {
      alert(`Chỉ tối đa ${max} ảnh`);
      return;
    }

    setImages([...images, ...files]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const openFile = () => {
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
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  return (
    <div className="space-y-4">
      {/* Upload box */}
      <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-4 bg-muted/20">
        <Upload className="w-8 h-8 text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
          Kéo vào tối đa <b>{max}</b> ảnh
        </p>

        <Button type="button" variant="outline" onClick={openFile}>
          + Tải ảnh từ thiết bị
        </Button>

        <Input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previews.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img.url}
                className="w-24 h-24 object-cover rounded-lg border"
              />

              <Button
              variant={"destructive"}
                onClick={() => removeImage(i)}
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
