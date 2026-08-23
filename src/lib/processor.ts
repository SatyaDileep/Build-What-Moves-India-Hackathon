import { PDFDocument } from 'pdf-lib';
import { DocumentConstraint, ProcessingResult } from '@/types';

// Convert image file to Canvas
async function fileToCanvas(file: Blob): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    
    img.onerror = reject;
    img.src = url;
  });
}

// Convert Canvas to Blob
async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, type, quality);
  });
}

// Compress image to target size in KB
async function compressToTargetSize(
  canvas: HTMLCanvasElement,
  format: 'jpeg' | 'png',
  targetKB: number,
  tolerance: number = 0.1
): Promise<Blob> {
  let low = 0.1;
  let high = 1.0;
  let bestBlob: Blob | null = null;
  
  // For JPEG, iterate quality to hit target
  if (format === 'jpeg') {
    for (let attempt = 0; attempt < 10; attempt++) {
      const mid = (low + high) / 2;
      const blob = await canvasToBlob(canvas, 'image/jpeg', mid);
      const sizeKB = blob.size / 1024;
      
      if (Math.abs(sizeKB - targetKB) / targetKB <= tolerance) {
        return blob;
      }
      
      if (sizeKB > targetKB) {
        high = mid;
      } else {
        low = mid;
      }
      
      bestBlob = blob;
    }
  }
  
  // Fallback: return best attempt
  return bestBlob || await canvasToBlob(canvas, 'image/jpeg', 0.5);
}

// Crop canvas to aspect ratio
function cropToAspectRatio(
  canvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  const sourceRatio = canvas.width / canvas.height;
  const targetRatio = targetWidth / targetHeight;
  
  let sx = 0, sy = 0, sw = canvas.width, sh = canvas.height;
  
  if (sourceRatio > targetRatio) {
    // Source is wider - crop sides
    sw = canvas.height * targetRatio;
    sx = (canvas.width - sw) / 2;
  } else {
    // Source is taller - crop top/bottom
    sh = canvas.width / targetRatio;
    sy = (canvas.height - sh) / 2;
  }
  
  const cropped = document.createElement('canvas');
  cropped.width = targetWidth * 100; // Scale up for quality
  cropped.height = targetHeight * 100;
  
  const ctx = cropped.getContext('2d')!;
  ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, cropped.width, cropped.height);
  
  return cropped;
}

// Normalize background to white
function normalizeBackground(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Simple background normalization
  // Detect near-white pixels and make them pure white
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // If pixel is light (potential background)
    if (r > 200 && g > 200 && b > 200) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

// Convert Canvas to PDF using pdf-lib
async function canvasToPDF(canvas: HTMLCanvasElement): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  
  // Convert canvas to JPEG for PDF embedding
  const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', 0.9);
  const jpegArrayBuffer = await jpegBlob.arrayBuffer();
  const jpegImage = await pdfDoc.embedJpg(new Uint8Array(jpegArrayBuffer));
  
  // Create page with image dimensions
  const page = pdfDoc.addPage([
    jpegImage.width,
    jpegImage.height
  ]);
  
  page.drawImage(jpegImage, {
    x: 0,
    y: 0,
    width: jpegImage.width,
    height: jpegImage.height,
  });
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
}

// Main processing function
export async function processDocument(
  file: Blob,
  constraint: DocumentConstraint
): Promise<ProcessingResult> {
  const originalCanvas = await fileToCanvas(file);
  
  const originalDimensions = {
    width: originalCanvas.width,
    height: originalCanvas.height,
  };
  
  let processedCanvas = originalCanvas;
  
  // Apply transformations based on constraint
  if (constraint.width_cm && constraint.height_cm) {
    // Convert cm to pixels (assuming 96 DPI for screen)
    const targetWidthPx = Math.round(constraint.width_cm * 96 / 2.54);
    const targetHeightPx = Math.round(constraint.height_cm * 96 / 2.54);
    processedCanvas = cropToAspectRatio(processedCanvas, targetWidthPx, targetHeightPx);
  }
  
  if (constraint.bg_color === 'white') {
    processedCanvas = normalizeBackground(processedCanvas);
  }
  
  let processedBlob: Blob;
  
  if (constraint.format === 'pdf') {
    processedBlob = await canvasToPDF(processedCanvas);
  } else {
    const targetKB = constraint.max_kb || 100;
    processedBlob = await compressToTargetSize(
      processedCanvas,
      constraint.format === 'jpeg' ? 'jpeg' : 'png',
      targetKB
    );
  }
  
  return {
    success: true,
    original: {
      blob: file,
      size_mb: file.size / (1024 * 1024),
      dimensions: originalDimensions,
    },
    processed: {
      blob: processedBlob,
      size_kb: processedBlob.size / 1024,
      dimensions: {
        width: processedCanvas.width,
        height: processedCanvas.height,
      },
    },
    constraint,
  };
}
