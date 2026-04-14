import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, ImagePlus } from "lucide-react";
import { compressImage } from "@/lib/compressImage";

interface MultiImageUploadProps {
  onUploaded: (urls: string[]) => void;
  folder?: string;
  maxFiles?: number;
}

export default function MultiImageUpload({ onUploaded, folder = "listings", maxFiles = 30 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(async (files: File[]) => {
    const images = files.filter(f => f.type.startsWith("image/"));
    if (images.length === 0) {
      toast.error("No image files selected");
      return;
    }

    const oversized = images.filter(f => f.size > 50 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`${oversized.length} file(s) exceed 50MB limit`);
      return;
    }

    const batch = images.slice(0, maxFiles);
    if (images.length > maxFiles) {
      toast.warning(`Only uploading first ${maxFiles} images`);
    }

    setUploading(true);
    setProgress({ done: 0, total: batch.length });

    const urls: string[] = [];
    for (let i = 0; i < batch.length; i++) {
      const file = batch[i];
      const compressed = await compressImage(file);
      const ext = compressed.name.split(".").pop();
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage.from("listing-images").upload(path, file);
      if (error) {
        console.error(`Failed to upload ${file.name}:`, error.message);
        setProgress(p => ({ ...p, done: p.done + 1 }));
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from("listing-images").getPublicUrl(path);
      urls.push(publicUrl);
      setProgress(p => ({ ...p, done: p.done + 1 }));
    }

    if (urls.length > 0) {
      onUploaded(urls);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    }
    if (urls.length < batch.length) {
      toast.error(`${batch.length - urls.length} image(s) failed`);
    }

    setUploading(false);
    setProgress({ done: 0, total: 0 });
  }, [folder, maxFiles, onUploaded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      uploadFiles(Array.from(e.dataTransfer.files));
    }
  }, [uploadFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "w-[100px] h-[100px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
          dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-muted/50",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-1 px-2 w-full">
            <Upload className="h-4 w-4 text-muted-foreground animate-pulse" />
            <span className="text-[10px] text-muted-foreground font-medium">{progress.done}/{progress.total}</span>
            <Progress value={(progress.done / progress.total) * 100} className="h-1.5 w-full" />
          </div>
        ) : (
          <>
            <ImagePlus className="h-5 w-5 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground mt-1">Add photos</span>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
