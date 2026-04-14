const MAX_WIDTH = 2400;
const WEBP_QUALITY = 0.82;
const JPEG_QUALITY = 0.85;

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let targetW = width;
  let targetH = height;
  if (width > MAX_WIDTH) {
    targetW = MAX_WIDTH;
    targetH = Math.round(height * (MAX_WIDTH / width));
  }

  const canvas = new OffscreenCanvas(targetW, targetH);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  // Try WebP first
  let blob = await canvas.convertToBlob({ type: "image/webp", quality: WEBP_QUALITY });

  // Fallback to JPEG if WebP produced nothing useful
  if (!blob || blob.size === 0) {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality: JPEG_QUALITY });
  }

  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.${ext}`, { type: blob.type });
}
