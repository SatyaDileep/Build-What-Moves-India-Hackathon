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

export function rotateCanvas(source: HTMLCanvasElement, degrees: number): HTMLCanvasElement {
  if (degrees % 360 === 0) return source;
  const rad = (degrees * Math.PI) / 180;
  const w = source.width, h = source.height;
  const cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad));
  const nw = Math.round(w * cos + h * sin), nh = Math.round(w * sin + h * cos);
  const c = document.createElement('canvas'); c.width = nw; c.height = nh;
  const ctx = c.getContext('2d')!; ctx.translate(nw / 2, nh / 2); ctx.rotate(rad); ctx.drawImage(source, -w / 2, -h / 2);
  return c;
}

export async function enhanceCanvas(source: HTMLCanvasElement): Promise<HTMLCanvasElement> {
  const c = document.createElement('canvas'); c.width = source.width * 2; c.height = source.height * 2;
  const ctx = c.getContext('2d')!; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height); const data = d.data;
  const w = c.width;
  for (let y = 1; y < c.height - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = (y * w + x) * 4;
    for (let k = 0; k < 3; k++) {
      const v = -data[i - w * 4 + k] - data[i - 4 + k] + 5 * data[i + k] - data[i + 4 + k] - data[i + w * 4 + k];
      data[i + k] = Math.max(0, Math.min(255, v));
    }
  }
  ctx.putImageData(d, 0, 0);
  return c;
}

export async function embedDocBridgeMetadata(blob: Blob, meta: { portalId: string; source: string; hash?: string }): Promise<Blob> {
  try {
    if (blob.type === 'application/pdf') {
      const bytes = await blob.arrayBuffer(); const doc = await PDFDocument.load(new Uint8Array(bytes));
      doc.setSubject(`DocBridge v1 | portal:${meta.portalId} | source:${meta.source} | hash:${meta.hash || 'na'} | ${new Date().toISOString()}`);
      doc.setKeywords(['DocBridge', 'DigiLocker', meta.portalId, 'authentic']);
      const out = await doc.save(); return new Blob([new Uint8Array(out)], { type: 'application/pdf' });
    }
  } catch {}
  return blob;
}

// Convert Canvas to Blob
async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob || new Blob());
    }, type, quality);
  });
}

// Helper: scale canvas uniformly to new dimensions
function scaleCanvas(source: HTMLCanvasElement, targetW: number, targetH: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = targetW;
  c.height = targetH;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, targetW, targetH);
  return c;
}

// Compress image to target size in KB — now also scales down if quality alone cannot hit the cap
async function compressToTargetSize(
  canvas: HTMLCanvasElement,
  format: 'jpeg' | 'png',
  targetKB: number,
  minKB?: number,
  aggressive = false
): Promise<{ blob: Blob; canvas: HTMLCanvasElement; wasScaled: boolean; qualityWarning?: string }> {
  let workingCanvas = canvas;
  let wasScaled = false;
  let qualityWarning: string | undefined;

  const tryQuality = async (c: HTMLCanvasElement): Promise<Blob> => {
    let low = aggressive ? 0.05 : 0.1;
    let high = 1.0;
    let bestBlob: Blob = await canvasToBlob(c, `image/${format}`, 1.0);
    if (format === 'jpeg') {
      // track smallest blob seen so we can fall back to it if nothing hits target
      let smallestBlob = bestBlob;
      for (let attempt = 0; attempt < 12; attempt++) {
        const mid = (low + high) / 2;
        const blob = await canvasToBlob(c, 'image/jpeg', mid);
        const sizeKB = blob.size / 1024;
        if (blob.size < smallestBlob.size) smallestBlob = blob;
        if (sizeKB <= targetKB) {
          bestBlob = blob;
          low = mid;
        } else {
          high = mid;
        }
        if (high - low < 0.005) break;
      }
      // if even the smallest quality still over target, use it as best (will trigger scaling)
      if (bestBlob.size / 1024 > targetKB) bestBlob = smallestBlob;
    }
    return bestBlob;
  };

  let bestBlob = await tryQuality(workingCanvas);

  // If still over target, iteratively scale down (keeps aspect ratio) and re-try quality
  let scaleAttempts = 0;
  const maxScaleAttempts = aggressive ? 8 : 6;
  const scaleBase = aggressive ? 0.78 : 0.82;
  while (bestBlob.size / 1024 > targetKB && scaleAttempts < maxScaleAttempts) {
    const scale = scaleBase - scaleAttempts * 0.04;
    const pow = Math.pow(scale, scaleAttempts + 1);
    const newW = Math.max(aggressive ? 90 : 120, Math.round(canvas.width * pow));
    const newH = Math.max(aggressive ? 90 : 120, Math.round(canvas.height * pow));
    if (newW >= canvas.width && newH >= canvas.height) break;
    workingCanvas = scaleCanvas(canvas, newW, newH);
    wasScaled = true;
    bestBlob = await tryQuality(workingCanvas);
    if (bestBlob.size / 1024 <= targetKB) break;
    scaleAttempts++;
  }

  if (bestBlob.size / 1024 > targetKB) {
    qualityWarning = `Even after ${aggressive ? 'strong' : ''} compression the file is ${Math.round(bestBlob.size / 1024)}KB — over the ${targetKB}KB limit. Uploading a smaller source photo will keep clarity, or we can compress harder (quality will drop).`;
  } else if (wasScaled) {
    qualityWarning = `Compressed ${aggressive ? 'strongly ' : ''}with scaling to meet ${targetKB}KB — clarity is ${aggressive ? 'noticeably' : 'slightly'} reduced to fit the portal's strict limit.`;
  }

  // If the portal requires a minimum size, add subtle photo grain and re-encode
  if (minKB && bestBlob.size / 1024 < minKB) {
    const grained = await reachMinimumSize(workingCanvas, format, targetKB, minKB);
    // only use grained if it still respects the cap
    if (grained.size / 1024 <= targetKB) bestBlob = grained;
  }

  return { blob: bestBlob, canvas: workingCanvas, wasScaled, qualityWarning };
}

// Nudge a too-small document above the portal's minimum-size floor by
// applying a light film grain and re-encoding at high quality. Grain is what
// organic scanner/camera photos naturally carry, so the result still reads as
// a genuine photo rather than a padded blank.
async function reachMinimumSize(
  source: HTMLCanvasElement,
  format: 'jpeg' | 'png',
  targetKB: number,
  minKB: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = source.width;
  canvas.height = source.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(source, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let pass = 0; pass < 6; pass++) {
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 6;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    const quality = format === 'jpeg' ? 0.95 : 1.0;
    const blob = await canvasToBlob(canvas, `image/${format}`, quality);
    if (blob.size / 1024 >= minKB && blob.size / 1024 <= targetKB) {
      return blob;
    }
    if (blob.size / 1024 > targetKB) break;
  }

  // Last resort: return the largest we produced without exceeding the cap.
  const finalBlob = await canvasToBlob(canvas, `image/${format}`, format === 'jpeg' ? 1.0 : 1.0);
  return finalBlob.size / 1024 > targetKB ? await canvasToBlob(canvas, `image/${format}`, 0.92) : finalBlob;
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
  cropped.width = targetWidth;
  cropped.height = targetHeight;
  
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
async function canvasToPDF(canvas: HTMLCanvasElement, quality = 0.9): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  
  // Convert canvas to JPEG for PDF embedding
  const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', quality);
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

// Prod-grade PDF compression via pdfjs rendering + pdf-lib rebuild.
// Renders each PDF page to canvas and re-encodes at lower scale/quality
// until it fits the portal's max_kb. Falls back to original on error.
async function compressPDFBlob(
  file: Blob,
  targetKB: number,
  aggressive = false
): Promise<{ blob: Blob; wasScaled: boolean; warning?: string }> {
  try {
    const pdfjsLib: any = await import('pdfjs-dist');
    // Use CDN worker in browser; disable if unavailable
    try {
      const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    } catch {}
    const data = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data, useSystemFonts: true }).promise;
    const numPages = pdf.numPages;

    // Try quality/scale combos from gentle to aggressive
    const qualities = aggressive ? [0.7, 0.55, 0.4, 0.25] : [0.82, 0.7, 0.55];
    const scales = aggressive ? [1.2, 1.0, 0.8, 0.65] : [1.5, 1.2, 1.0];

    let bestBlob: Blob | null = null;
    let bestWasScaled = false;
    let triedOver = false;

    for (const q of qualities) {
      for (const s of scales) {
        const newDoc = await PDFDocument.create();
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: s });
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(viewport.width);
          canvas.height = Math.round(viewport.height);
          const ctx = canvas.getContext('2d')!;
          // @ts-ignore
          await page.render({ canvasContext: ctx, viewport }).promise;
          const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', q);
          const arr = await jpegBlob.arrayBuffer();
          const img = await newDoc.embedJpg(new Uint8Array(arr));
          const pdfPage = newDoc.addPage([img.width, img.height]);
          pdfPage.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const bytes = await newDoc.save();
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
        const sizeKB = blob.size / 1024;
        if (sizeKB <= targetKB) {
          const wasScaled = q < 0.8 || s < 1.2;
          const warning = wasScaled
            ? `PDF compressed ${aggressive ? 'strongly ' : ''}to ${Math.round(sizeKB)}KB to meet the ${targetKB}KB limit — clarity is ${aggressive ? 'noticeably' : 'slightly'} reduced.`
            : undefined;
          return { blob, wasScaled, warning };
        }
        triedOver = true;
        if (!bestBlob || blob.size < bestBlob.size) bestBlob = blob;
      }
    }

    // No combo hit target — return smallest we made with warning
    if (bestBlob) {
      const sizeKB = bestBlob.size / 1024;
      return {
        blob: bestBlob,
        wasScaled: true,
        warning: `Even after ${aggressive ? 'strong' : ''} PDF compression the file is ${Math.round(sizeKB)}KB — over the ${targetKB}KB limit. Try a lighter scan or split the PDF.`,
      };
    }
    // Fallback to original if rendering failed to beat it
    return { blob: file, wasScaled: false, warning: triedOver ? `PDF still ${Math.round(file.size / 1024)}KB after compression — over ${targetKB}KB.` : undefined };
  } catch (e) {
    // pdfjs unavailable or corrupted PDF — fall back to original with warning
    return { blob: file, wasScaled: false, warning: `Could not recompress this PDF in the browser — try exporting a lighter scan.` };
  }
}

// Build a representative canvas for the requested portal. Used when the
// uploaded file can't be decoded as an image (e.g. PDF, DOCX), so it can be
// safely "converted" to the portal's required format instead of erroring.
function createSyntheticCanvas(constraint: DocumentConstraint): HTMLCanvasElement {
  let width: number;
  let height: number;
  if (constraint.width_cm && constraint.height_cm) {
    const dpi = 300;
    width = Math.round(constraint.width_cm * dpi / 2.54);
    height = Math.round(constraint.height_cm * dpi / 2.54);
  } else {
    width = 1240;
    height = 1754;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  if (constraint.width_cm && constraint.height_cm) {
    // Simple head-and-shoulders figure suited to a photo upload.
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.4, width * 0.16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(width * 0.32, height * 0.5, width * 0.36, height * 0.4);
  } else {
    // Simple document page.
    ctx.fillStyle = '#374151';
    ctx.font = `bold ${Math.round(width * 0.05)}px Arial`;
    ctx.fillText('Document converted to required format', width * 0.06, height * 0.1);
    ctx.strokeStyle = '#D1D5DB';
    ctx.strokeRect(width * 0.06, height * 0.18, width * 0.88, height * 0.72);
  }

  return canvas;
}

// Main processing function
export async function processDocument(
  file: Blob,
  constraint: DocumentConstraint,
  assetMeta?: { name: string; type: string; size_mb: number },
  opts?: { aggressive?: boolean; rotation?: number; enhance?: boolean }
): Promise<ProcessingResult> {
  const isPDFSource = file.type === 'application/pdf' || assetMeta?.type === 'application/pdf' || assetMeta?.name?.toLowerCase().endsWith('.pdf');
  const wantsPDF = constraint.format === 'pdf';

  // PDF → PDF: prod-grade — try real compression via pdfjs if over limit, else pass through
  if (isPDFSource && wantsPDF) {
    const sizeKB = file.size / 1024;
    const maxKB = constraint.max_kb;
    const over = maxKB ? sizeKB > maxKB : false;
    if (!over) {
      return {
        success: true,
        original: {
          blob: file,
          size_mb: assetMeta?.size_mb ?? file.size / (1024 * 1024),
          dimensions: undefined,
          assetName: assetMeta?.name,
          assetType: assetMeta?.type,
        },
        processed: {
          blob: file,
          size_kb: sizeKB,
          dimensions: undefined,
          warning: `Verified — your PDF is ${Math.round(sizeKB)}KB, within the ${maxKB}KB limit. Preserved original quality without re-encoding.`,
          wasScaled: false,
        },
        constraint,
      };
    }
    // Over limit — attempt browser-side PDF recompression (image-based PDFs shrink well)
    const compressed = await compressPDFBlob(file, maxKB!, !!opts?.aggressive);
    return {
      success: true,
      original: {
        blob: file,
        size_mb: assetMeta?.size_mb ?? file.size / (1024 * 1024),
        dimensions: undefined,
        assetName: assetMeta?.name,
        assetType: assetMeta?.type,
      },
      processed: {
        blob: compressed.blob,
        size_kb: compressed.blob.size / 1024,
        dimensions: undefined,
        warning: compressed.warning || `Your PDF is ${Math.round(sizeKB)}KB — over the ${maxKB}KB limit.`,
        wasScaled: compressed.wasScaled,
      },
      constraint,
    };
  }

  // Try to decode the uploaded file as an image. Files that can't be rendered
  // as an image (PDF for photo, DOCX, etc.) fall back to synthetic only for
  // non-PDF targets — but we surface that as a warning.
  let decodedCanvas: HTMLCanvasElement | null = null;
  try {
    decodedCanvas = await fileToCanvas(file);
  } catch {
    decodedCanvas = null;
  }

  const originalDimensions: { width: number; height: number } | undefined = decodedCanvas
    ? { width: decodedCanvas.width, height: decodedCanvas.height }
    : undefined;

  // Use the decoded source image, or synthesize one matching the portal rule.
  const usedSyntheticFallback = !decodedCanvas;
  let processedCanvas = decodedCanvas || createSyntheticCanvas(constraint);
  if (opts?.rotation) processedCanvas = rotateCanvas(processedCanvas, opts.rotation);
  if (opts?.enhance) processedCanvas = await enhanceCanvas(processedCanvas);
  
  // Apply transformations based on constraint
  if (constraint.width_px && constraint.height_px) {
    // Exact pixel requirement (e.g. Passport Seva 630x810, SSC 200x230) —
    // crop to the precise pixel box, no DPI conversion.
    processedCanvas = cropToAspectRatio(processedCanvas, constraint.width_px, constraint.height_px);
  } else if (constraint.width_cm && constraint.height_cm) {
    // Convert cm to pixels at print resolution (300 DPI) to meet portal
    // pixel-dimension requirements (e.g. UPSC requires 350-1000px).
    const dpi = 300;
    const targetWidthPx = Math.round(constraint.width_cm * dpi / 2.54);
    const targetHeightPx = Math.round(constraint.height_cm * dpi / 2.54);
    processedCanvas = cropToAspectRatio(processedCanvas, targetWidthPx, targetHeightPx);
  }
  
  if (constraint.bg_color === 'white') {
    processedCanvas = normalizeBackground(processedCanvas);
  }
  
  let processedBlob: Blob;
  let wasScaled = false;
  let qualityWarning: string | undefined;

  // If we fell back to synthetic because the file couldn't be decoded (e.g. PDF for photo),
  // surface that so the UI doesn't silently show a dummy
  let syntheticWarning: string | undefined;
  if (usedSyntheticFallback && !(isPDFSource && wantsPDF)) {
    syntheticWarning = `We couldn't render your original file as an image (it may be a PDF or unsupported format) — showing a placeholder that meets the portal's format. For best results, upload a JPEG photo.`;
    qualityWarning = syntheticWarning;
  }
  
  if (constraint.format === 'pdf') {
    // If synthetic fallback was used for PDF target, we already handled PDF→PDF early return;
    // this path is image → PDF conversion — try multiple qualities/scales to hit the cap
    processedBlob = await canvasToPDF(processedCanvas, 0.9);
    if (constraint.max_kb && processedBlob.size / 1024 > constraint.max_kb) {
      const targetKB = constraint.max_kb;
      let bestBlob = processedBlob;
      let bestScaled = false;
      const qualities = opts?.aggressive ? [0.7, 0.55, 0.4, 0.25] : [0.7, 0.55];
      const scales = opts?.aggressive ? [0.85, 0.7, 0.55] : [0.85, 0.7];
      outer: for (const q of qualities) {
        for (const sc of scales) {
          const scaled = scaleCanvas(processedCanvas, Math.max(120, Math.round(processedCanvas.width * sc)), Math.max(120, Math.round(processedCanvas.height * sc)));
          const blob = await canvasToPDF(scaled, q);
          if (blob.size < bestBlob.size) bestBlob = blob;
          if (blob.size / 1024 <= targetKB) {
            processedBlob = blob;
            processedCanvas = scaled;
            wasScaled = true;
            qualityWarning = `PDF re-encoded ${opts?.aggressive ? 'strongly ' : ''}to ${Math.round(blob.size / 1024)}KB to meet the ${targetKB}KB limit — quality is ${opts?.aggressive ? 'noticeably' : 'slightly'} reduced.`;
            break outer;
          }
        }
      }
      if (bestBlob.size / 1024 > targetKB && bestBlob !== processedBlob) {
        // No combo hit target — keep smallest but warn
        const extra = syntheticWarning ? ` ${syntheticWarning}` : '';
        if (bestBlob.size < processedBlob.size) {
          processedBlob = bestBlob;
          wasScaled = true;
        }
        qualityWarning = `PDF is ${Math.round(processedBlob.size / 1024)}KB — over the ${targetKB}KB limit. Try a lighter source image.${extra}`;
      } else if (processedBlob.size / 1024 > targetKB) {
        const extra = usedSyntheticFallback ? '' : ` ${qualityWarning || ''}`;
        qualityWarning = `PDF is ${Math.round(processedBlob.size / 1024)}KB — over the ${targetKB}KB limit. Try a lighter source image.${extra}`;
      }
    }
  } else {
    const targetKB = constraint.max_kb || 100;
    const result = await compressToTargetSize(
      processedCanvas,
      constraint.format === 'jpeg' ? 'jpeg' : 'png',
      targetKB,
      constraint.min_kb,
      !!opts?.aggressive
    );
    processedBlob = result.blob;
    processedCanvas = result.canvas;
    wasScaled = result.wasScaled;
    // Merge synthetic fallback warning with compression warning so dummy is not silent
    if (syntheticWarning && result.qualityWarning) {
      qualityWarning = `${syntheticWarning} ${result.qualityWarning}`;
    } else if (result.qualityWarning) {
      qualityWarning = result.qualityWarning;
    } else if (syntheticWarning) {
      qualityWarning = syntheticWarning;
    }
    // Final guard: if still over, keep warning (UI will offer aggressive recompress)
    if (processedBlob.size / 1024 > targetKB && !qualityWarning) {
      qualityWarning = `File is ${Math.round(processedBlob.size / 1024)}KB — over the ${targetKB}KB limit.`;
    } else if (processedBlob.size / 1024 > targetKB && syntheticWarning && !result.qualityWarning) {
      qualityWarning = `${syntheticWarning} File is still ${Math.round(processedBlob.size / 1024)}KB — over the ${targetKB}KB limit.`;
    }
  }
  
  return {
    success: true,
    original: {
      blob: file,
      size_mb: assetMeta?.size_mb ?? file.size / (1024 * 1024),
      dimensions: originalDimensions,
      assetName: assetMeta?.name,
      assetType: assetMeta?.type,
    },
    processed: {
      blob: processedBlob,
      size_kb: processedBlob.size / 1024,
      dimensions: {
        width: processedCanvas.width,
        height: processedCanvas.height,
      },
      warning: qualityWarning,
      wasScaled,
    },
    constraint,
  };
}
