const DocBridgeProcessor = {
  async processImage(file, constraint) {
    const canvas = await this.fileToCanvas(file);
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
    const result = await this.compressToTargetSize(processedCanvas, 'jpeg', targetKB, minKB, safeBand);

    const optimizedBlob = result.blob;
    const optimizedSizeKB = optimizedBlob.size / 1024;
    let warning = result.qualityWarning;
    if (!warning && optimizedSizeKB > targetKB) {
      warning = 'File is ' + Math.round(optimizedSizeKB) + 'KB — over ' + targetKB + 'KB limit. Try smaller source.';
    }

    return {
      original: { blob: file, size_kb: file.size / 1024, width: originalWidth, height: originalHeight },
      optimized: { blob: optimizedBlob, size_kb: optimizedSizeKB, width: result.canvas.width, height: result.canvas.height, warning: warning, wasScaled: result.wasScaled, withinLimit: optimizedSizeKB <= targetKB && (!minKB || optimizedSizeKB >= minKB), safeBand: safeBand },
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
    const cropped = this.createCanvas(targetWidth, targetHeight);
    const tmp = cropped instanceof OffscreenCanvas ? (() => { const h=document.createElement('canvas'); h.width=targetWidth; h.height=targetHeight; h.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight); return h; })() : (cropped.getContext('2d').drawImage(canvas, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight), cropped);
    if (tmp instanceof OffscreenCanvas) {
      const html=document.createElement('canvas'); html.width=targetWidth; html.height=targetHeight; html.getContext('2d').drawImage(tmp,0,0); return html;
    }
    if (cropped instanceof OffscreenCanvas) {
      const html=document.createElement('canvas'); html.width=targetWidth; html.height=targetHeight; html.getContext('2d').drawImage(cropped,0,0); return html;
    }
    return cropped;
  },

  scaleCanvas(source, targetW, targetH) {
    const c = this.createCanvas(targetW, targetH);
    if (c instanceof OffscreenCanvas) {
      const html=document.createElement('canvas'); html.width=targetW; html.height=targetH;
      html.getContext('2d').drawImage(source, 0, 0, source.width, source.height, 0, 0, targetW, targetH);
      return html;
    }
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
