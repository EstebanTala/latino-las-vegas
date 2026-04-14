import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { compressImage } from "@/lib/compressImage";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  previewSize?: "logo" | "gallery" | "default";
}

export default function ImageUpload({ value, onChange, folder = "listings", previewSize = "default" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Image must be under 50MB");
      return;
    }

    setUploading(true);
    const compressed = await compressImage(file);
    const ext = compressed.name.split(".").pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("listing-images").upload(path, compressed);
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(path);
    onChange(publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  };

  return (
    <div className="space-y-2">
      {value && (
        <div className={cn(
          "relative inline-block overflow-hidden border border-border bg-muted",
          previewSize === "logo" ? "w-[120px] h-[120px] rounded-xl" :
          previewSize === "gallery" ? "w-[100px] h-[100px] rounded-lg" :
          "max-w-[300px] rounded-xl"
        )}>
          <img
            src={value}
            alt="Preview"
            className={cn(
              "w-full h-full",
              previewSize === "logo" ? "object-contain p-2" :
              previewSize === "gallery" ? "object-cover" :
              "object-cover aspect-video"
            )}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  );
}
