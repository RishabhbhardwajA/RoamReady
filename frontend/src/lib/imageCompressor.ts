/**
 * RoamReady Image Compressor & Optimizer
 * 
 * Compresses high-resolution device photos into optimized WebP/JPEG data URIs
 * for efficient database storage and fast rendering, reducing payload sizes by 80-95%
 * while preserving natural visual fidelity.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  originalSizeFormatted: string;
  compressedSizeFormatted: string;
  savedPercent: number;
  width: number;
  height: number;
  format: 'image/webp' | 'image/jpeg';
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function compressImage(
  file: File,
  options: {
    maxDimension?: number;
    quality?: number;
  } = {}
): Promise<CompressionResult> {
  const { maxDimension = 1200, quality = 0.82 } = options;
  const originalSizeBytes = file.size;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file from disk.'));
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image into memory.'));
      img.onload = () => {
        let { width, height } = img;

        // Proportional resize if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to acquire 2D canvas context.'));
        }

        // Enable high-quality interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let format: 'image/webp' | 'image/jpeg' = 'image/webp';
        let compressedDataUrl = canvas.toDataURL(format, quality);

        // Verify WebP support
        if (!compressedDataUrl.startsWith('data:image/webp')) {
          format = 'image/jpeg';
          compressedDataUrl = canvas.toDataURL(format, quality);
        }

        // Calculate approximate size in bytes from base64 string
        const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1);
        const compressedSizeBytes = Math.round((base64Length * 3) / 4);

        const savedBytes = Math.max(0, originalSizeBytes - compressedSizeBytes);
        const savedPercent = originalSizeBytes > 0
          ? Math.round((savedBytes / originalSizeBytes) * 100)
          : 0;

        resolve({
          dataUrl: compressedDataUrl,
          originalSizeBytes,
          compressedSizeBytes,
          originalSizeFormatted: formatFileSize(originalSizeBytes),
          compressedSizeFormatted: formatFileSize(compressedSizeBytes),
          savedPercent,
          width,
          height,
          format
        });
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}
