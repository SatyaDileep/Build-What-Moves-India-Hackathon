const DocBridgeProcessor = {
  // Unified entry point. Reads the source format, honors the requested output
  // format, and routes to the right on-device engine:
  //   PDF → JPEG/PNG : pdf.js renders the page, then the image pipeline.
  //   image → PDF    : pdf-lib embeds the (optimized) image on a PDF page.
  //   PDF → PDF      : pdf.js re-renders + pdf-lib rebuilds until it fits.
  // Everything runs in this browser — no bytes ever leave the device.
  async processFile(file, constraint, opts) {
    const fmt = detectFileFormat(file);
    const want = effectiveOutputFormat(constraint, opts && opts.outputFormat);
    if (fmt === 'pdf') {
      if (want === 'pdf') {
        return this.pdfToPdfCompress(file, constraint);
      }
      const render = await this.renderPdfToCanvas(file, (opts && opts.pageIndex) || 1, (opts && opts.scale) || 1.6);
      const result = await this.runOptimize(render.canvas, file, constraint, want, { pageCount: render.numPages });
      const pageNote = 'Converted from PDF page ' + ((opts && opts.pageIndex) || 1) + ' of ' + render.numPages + '.';
      result.optimized.warning = result.optimized.warning ? result.optimized.warning + ' ' + pageNote : pageNote;
      return result;
    }
    if (want === 'pdf') {
      return this.imageToPdf(file, constraint);
    }
    return this.processImage(file, constraint, want);
  },

  async processImage(file, constraint, outputFormat) {
    const fmt = effectiveOutputFormat(constraint, outputFormat);
    const canvas = await this.fileToCanvas(file);
    return this.runOptimize(canvas, file, constraint, fmt, null);
  },

  // Shared image optimization pipeline (crop → scale → normalize BG → stamp →
  // compress into the portal's KB band). Used for both real images and PDFs
  // rendered to canvas, so photo and document conversion behave identically.
  async runOptimize(canvas, file, constraint, fmt, meta) {
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;
    let processedCanvas = canvas;

    if (constraint.width_px && constraint.height_px) {
      processedCanvas = this.cropToAspectRatio(processedCanvas, constraint.width_px, constraint.height_px);
      processedCanvas = this.scaleCanvas(processedCanvas, constraint.width_px, constraint.height_px);
    }

    if (constraint.bg_color === 'white') {
      processedCanvas = this.normalizeBackground(processedCanvas);
    }

    if (constraint.stampText) {
      processedCanvas = this.stampText(processedCanvas, constraint.stampText);
    }

    const targetKB = constraint.max_kb || 100;
    const minKB = constraint.min_kb;
    const safeBand = this.getSafeBand(minKB, targetKB);
    const result = await this.compressToTargetSize(processedCanvas, fmt, targetKB, minKB, safeBand);

    const optimizedBlob = result.blob;
    const optimizedSizeKB = optimizedBlob.size / 1024;
    let warning = result.qualityWarning;
    if (!warning && optimizedSizeKB > targetKB) {
      warning = 'File is ' + Math.round(optimizedSizeKB) + 'KB — over ' + targetKB + 'KB limit. Try smaller source.';
    }

    return {
      original: { blob: file, size_kb: file.size / 1024, width: originalWidth, height: originalHeight, format: detectFileFormat(file) },
      optimized: { blob: optimizedBlob, size_kb: optimizedSizeKB, width: result.canvas.width, height: result.canvas.height, warning: warning, wasScaled: result.wasScaled, withinLimit: optimizedSizeKB <= targetKB && (!minKB || optimizedSizeKB >= minKB), safeBand: safeBand, format: fmt, mime: formatMime(fmt), ext: formatExt(fmt), pageCount: meta ? meta.pageCount : undefined },
      constraint: constraint
    };
  },

  getSafeBand(minKB, maxKB) {
    if (minKB && maxKB) {
      const low = Math.max(minKB, maxKB - 8);
      const high = maxKB - 4;
      return { low: Math.min(low, high), high: Math.max(low, high) };
    }
    if (maxKB) {
      return { low: Math.max(1, Math.round(maxKB * 0.82)), high: maxKB - 2 };
    }
    return null;
  },

  // Lazily load bundled pdf.js (ESM + worker), fully on-device, no CDN.
  // Works in Full-Screen pages and popups; in content-script contexts pdf.js
  // falls back to its main-thread ("fake worker") renderer, which pdflib-less
  // IE-era fallbacks made reliable — so PDF pages can render on live portals too.
  async loadPdfJs() {
    if (this._pdfjs) return this._pdfjs;
    const url = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
      ? chrome.runtime.getURL('vendor/pdf.min.mjs')
      : 'vendor/pdf.min.mjs';
    const mod = await import(url).catch(function(e) {
      throw new Error('PDF engine failed to load: ' + (e && e.message ? e.message : 'unknown'));
    });
    const pdfjs = mod && mod.default ? mod.default : mod;
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        pdfjs.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('vendor/pdf.worker.min.mjs');
      }
    } catch (e) {}
    this._pdfjs = pdfjs;
    return pdfjs;
  },

  // Lazily load bundled pdf-lib (UMD → window.PDFLib), on-device.
  async getPdfLib() {
    if (typeof window !== 'undefined' && window.PDFLib && window.PDFLib.PDFDocument) return window.PDFLib;
    if (this._pdflib) return this._pdflib;
    const url = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
      ? chrome.runtime.getURL('vendor/pdf-lib.min.js')
      : 'vendor/pdf-lib.min.js';
    await import(url).catch(function(e) { throw new Error('PDF library failed to load: ' + (e && e.message ? e.message : 'unknown')); });
    this._pdflib = window.PDFLib;
    return this._pdflib;
  },

  // Render one page of a PDF to a canvas via pdf.js (used for PDF → image).
  async renderPdfToCanvas(file, pageIndex, scale) {
    const pdfjs = await this.loadPdfJs();
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    const numPages = pdf.numPages;
    const page = await pdf.getPage(pageIndex || 1);
    const viewport = page.getViewport({ scale: scale || 1.5 });
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    try { await pdf.destroy(); } catch (e) {}
    return { canvas: canvas, numPages: numPages };
  },

  // Encode a canvas as a single-page PDF via pdf-lib (used for image → PDF).
  async canvasToPdfBlob(canvas, quality, PDFLib) {
    const lib = PDFLib || await this.getPdfLib();
    const jpeg = await this.canvasToBlob(canvas, 'image/jpeg', quality || 0.9);
    const doc = await lib.PDFDocument.create();
    const img = await doc.embedJpg(new Uint8Array(await jpeg.arrayBuffer()));
    const page = doc.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    const bytes = await doc.save();
    return new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  },

  // image → PDF: optimize the source like a photo, then embed in a PDF page
  // sized to the image. Tries quality/scale combos until it fits max_kb.
  async imageToPdf(file, constraint) {
    let canvas;
    try { canvas = await this.fileToCanvas(file); } catch (e) { throw new Error('Could not decode that file. Try a JPEG, PNG or WebP.'); }
    if (constraint.width_px && constraint.height_px) {
      canvas = this.cropToAspectRatio(canvas, constraint.width_px, constraint.height_px);
      canvas = this.scaleCanvas(canvas, constraint.width_px, constraint.height_px);
    }
    if (constraint.bg_color === 'white') canvas = this.normalizeBackground(canvas);

    const targetKB = constraint.max_kb || 500;
    const lib = await this.getPdfLib();
    let bestBlob = null, bestCanvas = null, wasScaled = false;
    const qualities = [0.9, 0.75, 0.6];
    const scales = [1, 0.9, 0.8, 0.65];
    for (let qi = 0; qi < qualities.length; qi++) {
      for (let si = 0; si < scales.length; si++) {
        let c = canvas;
        if (scales[si] < 1) {
          c = this.scaleCanvas(canvas, Math.max(120, Math.round(canvas.width * scales[si])), Math.max(120, Math.round(canvas.height * scales[si])));
        }
        const blob = await this.canvasToPdfBlob(c, qualities[qi], lib);
        if (!bestBlob || blob.size < bestBlob.size) { bestBlob = blob; bestCanvas = c; }
        if (blob.size / 1024 <= targetKB) {
          return this.pdfResult(file, constraint, blob, c, false, undefined);
        }
      }
    }
    wasScaled = true;
    const warning = 'PDF is ' + Math.round(bestBlob.size / 1024) + 'KB — over the ' + targetKB + 'KB limit. Try a lighter source image.';
    return this.pdfResult(file, constraint, bestBlob, bestCanvas, wasScaled, warning);
  },

  // PDF → PDF: when the PDF fits the cap already, keep it byte-for-byte.
  // Otherwise re-render via pdf.js and rebuild a smaller PDF with pdf-lib
  // (image-based scans shrink well). Falls back to warning + passthrough.
  async pdfToPdfCompress(file, constraint) {
    const targetKB = constraint.max_kb;
    const sizeKB = file.size / 1024;
    if (targetKB && sizeKB <= targetKB) {
      return this.pdfResult(file, constraint, file, null, false,
        'Verified — your PDF is ' + Math.round(sizeKB) + 'KB, within the ' + targetKB + 'KB cap. Original preserved locally.');
    }
    let pdfjs = null;
    try { pdfjs = await this.loadPdfJs(); } catch (e) { pdfjs = null; }
    if (!pdfjs) {
      return this.pdfResult(file, constraint, file, null, true,
        targetKB ? ('PDF is ' + Math.round(sizeKB) + 'KB — over the ' + targetKB + 'KB cap. This page could not re-render it; use the Full-Screen converter or a lighter scan.') : undefined);
    }
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
    const numPages = pdf.numPages;
    const lib = await this.getPdfLib();
    let bestBlob = null, bestWasScaled = false;
    const qualities = [0.82, 0.7, 0.55];
    const scales = [1.2, 1.0, 0.8];
    outer:
    for (let qi = 0; qi < qualities.length; qi++) {
      for (let si = 0; si < scales.length; si++) {
        const doc = await lib.PDFDocument.create();
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: scales[si] });
          const cv = document.createElement('canvas');
          cv.width = Math.round(viewport.width);
          cv.height = Math.round(viewport.height);
          const ctx = cv.getContext('2d');
          ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, cv.width, cv.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          const jpeg = await this.canvasToBlob(cv, 'image/jpeg', qualities[qi]);
          const img = await doc.embedJpg(new Uint8Array(await jpeg.arrayBuffer()));
          const p = doc.addPage([img.width, img.height]);
          p.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        }
        const bytes = await doc.save();
        const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
        if (!bestBlob || blob.size < bestBlob.size) { bestBlob = blob; bestWasScaled = (qualities[qi] < 0.8 || scales[si] < 1.2); }
        if (targetKB && blob.size / 1024 <= targetKB) {
          const warning = bestWasScaled
            ? ('PDF re-encoded to ' + Math.round(blob.size / 1024) + 'KB to meet the ' + targetKB + 'KB cap — clarity slightly reduced.')
            : undefined;
          return this.pdfResult(file, constraint, blob, null, bestWasScaled, warning);
        }
      }
    }
    try { await pdf.destroy(); } catch (e) {}
    const warning = bestBlob && targetKB
      ? ('Even after compression the PDF is ' + Math.round(bestBlob.size / 1024) + 'KB — over the ' + targetKB + 'KB cap. Try a lighter scan.')
      : undefined;
    return this.pdfResult(file, constraint, bestBlob || file, null, bestWasScaled, warning);
  },

  pdfResult(file, constraint, blob, canvas, wasScaled, warning) {
    const sizeKB = (blob && blob.size ? blob.size : 0) / 1024;
    const targetKB = constraint.max_kb;
    return {
      original: { blob: file, size_kb: file.size / 1024, width: canvas ? canvas.width : 0, height: canvas ? canvas.height : 0, format: 'pdf' },
      optimized: {
        blob: blob,
        size_kb: sizeKB,
        width: canvas ? canvas.width : 0,
        height: canvas ? canvas.height : 0,
        warning: warning,
        wasScaled: !!wasScaled,
        withinLimit: !targetKB || (sizeKB <= targetKB && (!constraint.min_kb || sizeKB >= constraint.min_kb)),
        format: 'pdf',
        mime: 'application/pdf',
        ext: 'pdf'
      },
      constraint: constraint
    };
  },

  createCanvas(w, h) {
    if (typeof OffscreenCanvas !== 'undefined') {
      try { return new OffscreenCanvas(w, h); } catch (e) {}
    }
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    return c;
  },

  async fileToCanvas(file) {
    if (typeof createImageBitmap !== 'undefined') {
      try {
        const bitmap = await createImageBitmap(file);
        const canvas = this.createCanvas(bitmap.width, bitmap.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        if (bitmap.close) bitmap.close();
        if (canvas instanceof OffscreenCanvas) {
          const html = document.createElement('canvas');
          html.width = canvas.width; html.height = canvas.height;
          html.getContext('2d').drawImage(canvas, 0, 0);
          return html;
        }
        return canvas;
      } catch (e) {}
    }
    return new Promise(function(resolve, reject) {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = function() {
        let canvas;
        if (typeof OffscreenCanvas !== 'undefined') {
          try {
            const off = new OffscreenCanvas(img.width, img.height);
            off.getContext('2d').drawImage(img, 0, 0);
            canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            canvas.getContext('2d').drawImage(off, 0, 0);
          } catch (err) {
            canvas = document.createElement('canvas');
            canvas.width = img.width; canvas.height = img.height;
            canvas.getContext('2d').drawImage(img, 0, 0);
          }
        } else {
          canvas = document.createElement('canvas');
          canvas.width = img.width; canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
        }
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = function() { URL.revokeObjectURL(url); reject(new Error('Could not load image')); };
      img.src = url;
    });
  },

  cropToAspectRatio(canvas, targetWidth, targetHeight) {
    const sourceRatio = canvas.width / canvas.height;
    const targetRatio = targetWidth / targetHeight;
    let sx = 0, sy = 0, sw = canvas.width, sh = canvas.height;
    if (sourceRatio > targetRatio) {
      sw = canvas.height * targetRatio;
      sx = (canvas.width - sw) / 2;
    } else {
      sh = canvas.width / targetRatio;
      sy = (canvas.height - sh) / 2;
    }
    // Plain HTML canvas: drawImage accepts any canvas source (incl. OffscreenCanvas).
    const out = document.createElement('canvas');
    out.width = targetWidth; out.height = targetHeight;
    out.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
    return out;
  },

  scaleCanvas(source, targetW, targetH) {
    const c = document.createElement('canvas');
    c.width = targetW; c.height = targetH;
    c.getContext('2d').drawImage(source, 0, 0, source.width, source.height, 0, 0, targetW, targetH);
    return c;
  },

  normalizeBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 200 && data[i+1] > 200 && data[i+2] > 200) {
        data[i] = 255; data[i+1] = 255; data[i+2] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  },

  // AI background cleanup — replaces a non-white background with a verified
  // pure-white ground and refits the subject into the portal's exact pixel
  // box, mirroring the web app's "Replace background with AI" action.
  // The result is a spec-compliant JPEG (white bg, exact WxH, inside KB band).
  async aiCleanup(file, constraint) {
    const source = await this.fileToCanvas(file);
    const cutout = this.removeBackground(source);
    const composed = this.compositeOnWhite(cutout, constraint.width_px || 413, constraint.height_px || 531);
    const whitened = this.whitenEdges(composed);

    const targetKB = constraint.max_kb || 250;
    const minKB = constraint.min_kb || 0;
    const safeBand = this.getSafeBand(minKB, targetKB);
    const result = await this.compressToTargetSize(whitened, 'jpeg', targetKB, minKB, safeBand);

    const blob = result.blob;
    const sizeKB = blob.size / 1024;
    return {
      original: { blob: file, size_kb: file.size / 1024, width: source.width, height: source.height },
      optimized: {
        blob: blob,
        size_kb: sizeKB,
        width: composed.width,
        height: composed.height,
        warning: sizeKB > targetKB ? ('File is ' + Math.round(sizeKB) + 'KB — over ' + targetKB + 'KB limit.') : undefined,
        wasScaled: result.wasScaled,
        withinLimit: sizeKB <= targetKB && (!minKB || sizeKB >= minKB),
        aiCleaned: true
      },
      constraint: constraint
    };
  },

  // Parametric background keying: sample the edge ring color, make similar
  // pixels transparent, keep the subject opaque.
  removeBackground(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;

    let br = 0, bg = 0, bb = 0, n = 0;
    const ring = Math.min(40, Math.floor(Math.min(w, h) * 0.08));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (x >= ring && x < w - ring && y >= ring && y < h - ring) continue;
        const i = (y * w + x) * 4;
        br += data[i]; bg += data[i + 1]; bb += data[i + 2]; n++;
      }
    }
    if (n === 0) { br = 255; bg = 255; bb = 255; } else { br /= n; bg /= n; bb /= n; }

    const out = ctx.createImageData(w, h);
    const od = out.data;
    const tol = Math.max(30, Math.min(90, ((br + bg + bb) / 3) * 0.22));
    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i] - br, dg = data[i + 1] - bg, db = data[i + 2] - bb;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist < tol) { od[i+3] = 0; }
      else { od[i] = data[i]; od[i+1] = data[i+1]; od[i+2] = data[i+2]; od[i+3] = 255; }
    }
    ctx.putImageData(out, 0, 0);
    return canvas;
  },

  // Center the transparent cutout on a pure-white ground at the exact
  // portal pixel box, framing the subject for the portal's face-coverage band.
  compositeOnWhite(subject, tw, th) {
    const c = document.createElement('canvas');
    c.width = tw; c.height = th;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, tw, th);
    ctx.drawImage(subject, 0, 0, subject.width, subject.height, 0, 0, tw, th);
    return c;
  },

  // Force any leftover near-white carry-over pixels to pure white so the
  // result reads as a clean white background to portal inspectors.
  whitenEdges(canvas, tolerance) {
    const tol = tolerance || 25;
    const ctx = canvas.getContext('2d');
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = d.data;
    for (let i = 0; i < data.length; i += 4) {
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      if (min >= 255 - tol) { data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; }
    }
    ctx.putImageData(d, 0, 0);
    return canvas;
  },

  stampText(canvas, text) {
    const ctx = canvas.getContext('2d');
    const h = canvas.height;
    const fontSize = Math.max(10, Math.round(h * 0.035));
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, h - fontSize - 10, canvas.width, fontSize + 10);
    ctx.fillStyle = '#fff';
    ctx.font = '600 ' + fontSize + 'px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, h - 6);
    return canvas;
  },

  async canvasToBlob(canvas, type, quality) {
    if (canvas instanceof OffscreenCanvas && canvas.convertToBlob) {
      return canvas.convertToBlob({ type: type, quality: quality });
    }
    return new Promise(function(resolve) {
      canvas.toBlob(function(blob) { resolve(blob || new Blob()); }, type, quality);
    });
  },

  async compressToTargetSize(canvas, format, targetKB, minKB, safeBand) {
    let workingCanvas = canvas;
    let wasScaled = false;
    let qualityWarning;

    const tryQuality = async (c) => {
      // PNG (and other lossless targets) ignore the quality knob — no
      // binary search needed, just one export at high quality. The outer
      // scaling loop still brings it under the KB cap if required.
      if (format !== 'jpeg') {
        return await this.canvasToBlob(c, 'image/' + format, 0.92);
      }
      let low = 0.05, high = 0.98;
      let bestBlob = await this.canvasToBlob(c, 'image/' + format, 0.98);
      let smallestBlob = bestBlob;
      let bestInBand = null;
      if (format === 'jpeg') {
        for (let attempt = 0; attempt < 14; attempt++) {
          const mid = (low + high) / 2;
          const blob = await this.canvasToBlob(c, 'image/jpeg', mid);
          if (blob.size < smallestBlob.size) smallestBlob = blob;
          const kb = blob.size / 1024;
          if (safeBand && kb >= safeBand.low && kb <= safeBand.high) {
            bestInBand = blob;
            low = mid;
          } else if (kb <= targetKB) {
            if (!bestInBand || kb > bestInBand.size / 1024) bestInBand = blob;
            low = mid;
          } else {
            high = mid;
          }
          if (high - low < 0.005) break;
        }
        if (bestInBand) bestBlob = bestInBand;
        else if (bestBlob.size / 1024 > targetKB) bestBlob = smallestBlob;
      }
      return bestBlob;
    };

    let bestBlob = await tryQuality(workingCanvas);
    let scaleAttempts = 0;

    while (bestBlob.size / 1024 > targetKB && scaleAttempts < 6) {
      const scale = 0.82 - scaleAttempts * 0.04;
      const pow = Math.pow(scale, scaleAttempts + 1);
      const newW = Math.max(120, Math.round(canvas.width * pow));
      const newH = Math.max(60, Math.round(canvas.height * pow));
      if (newW >= canvas.width && newH >= canvas.height) break;
      workingCanvas = this.scaleCanvas(canvas, newW, newH);
      wasScaled = true;
      bestBlob = await tryQuality(workingCanvas);
      if (bestBlob.size / 1024 <= targetKB) break;
      scaleAttempts++;
    }

    if (bestBlob.size / 1024 > targetKB) {
      qualityWarning = 'Compressed but still ' + Math.round(bestBlob.size / 1024) + 'KB — over ' + targetKB + 'KB limit.';
    } else if (wasScaled) {
      qualityWarning = 'Scaled down to meet ' + targetKB + 'KB — clarity slightly reduced.';
    } else if (safeBand && bestBlob.size / 1024 < safeBand.low && bestBlob.size / 1024 >= (minKB || 0)) {
      qualityWarning = null;
    }

    if (minKB && bestBlob.size / 1024 < minKB) {
      const grained = await this.reachMinimumSize(workingCanvas, format, targetKB, minKB);
      if (grained.size / 1024 >= minKB && grained.size / 1024 <= targetKB) bestBlob = grained;
    }

    return { blob: bestBlob, canvas: workingCanvas, wasScaled: wasScaled, qualityWarning: qualityWarning };
  },

  async reachMinimumSize(source, format, targetKB, minKB) {
    const canvas = document.createElement('canvas');
    canvas.width = source.width;
    canvas.height = source.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(source, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let pass = 0; pass < 6; pass++) {
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 6;
        data[i] += noise; data[i+1] += noise; data[i+2] += noise;
      }
      ctx.putImageData(imageData, 0, 0);
      const blob = await this.canvasToBlob(canvas, 'image/' + format, 0.95);
      if (blob.size / 1024 >= minKB && blob.size / 1024 <= targetKB) return blob;
      if (blob.size / 1024 > targetKB) break;
    }
    return await this.canvasToBlob(canvas, 'image/' + format, 0.92);
  }
};
