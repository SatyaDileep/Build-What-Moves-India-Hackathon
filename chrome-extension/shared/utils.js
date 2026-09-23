/**
 * DocBridge — Shared Utilities
 */

function formatFileSize(kb) {
  if (kb >= 1024) {
    return (kb / 1024).toFixed(1) + ' MB';
  }
  return Math.round(kb) + ' KB';
}

function formatDimensions(w, h) {
  if (!w || !h) return '';
  return w + '×' + h + 'px';
}

function getConstraintSummary(constraint) {
  const parts = [];
  if (constraint.format) parts.push(formatLabel(constraint.format));
  if (constraint.width_px && constraint.height_px) {
    parts.push(formatDimensions(constraint.width_px, constraint.height_px));
  } else if (constraint.width_cm && constraint.height_cm) {
    parts.push(constraint.width_cm + '×' + constraint.height_cm + 'cm');
  }
  if (constraint.min_kb && constraint.max_kb) {
    parts.push(formatFileSize(constraint.min_kb) + '–' + formatFileSize(constraint.max_kb));
  } else if (constraint.max_kb) {
    parts.push('<' + formatFileSize(constraint.max_kb));
  }
  if (constraint.bg_color) {
    parts.push(capitalize(constraint.bg_color) + ' background');
  }
  return parts.join(' · ');
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function matchDomain(hostname, domains) {
  return domains.some(d => hostname === d || hostname.endsWith('.' + d));
}

function matchUrlPatterns(pathname, patterns) {
  if (!patterns || patterns.length === 0) return true; // no pattern = match all
  return patterns.some(p => pathname.includes(p));
}

function isImageFile(file) {
  if (file.type && file.type.startsWith('image/')) return true;
  const name = file.name || '';
  return /\.(jpe?g|png|gif|bmp|webp)$/i.test(name);
}

function isPdfFile(file) {
  if (file.type === 'application/pdf') return true;
  const name = file.name || '';
  return /\.pdf$/i.test(name);
}

/* ===== Format support (v2: type conversion, 100% on-device) ===== */

var DOCBRIDGE_FORMATS = {
  jpeg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPEG' },
  png:  { mime: 'image/png',  ext: 'png', label: 'PNG' },
  pdf:  { mime: 'application/pdf', ext: 'pdf', label: 'PDF' },
  webp: { mime: 'image/webp', ext: 'webp', label: 'WebP' },
  gif:  { mime: 'image/gif',  ext: 'gif',  label: 'GIF' },
  bmp:  { mime: 'image/bmp',  ext: 'bmp',  label: 'BMP' }
};

function detectFileFormat(file) {
  if (!file) return null;
  var mime = (file.type || '').toLowerCase();
  var name = (file.name || '').toLowerCase();
  if (mime === 'application/pdf' || /\.pdf$/.test(name)) return 'pdf';
  if (mime.indexOf('jpeg') >= 0 || /\.jpe?g$/.test(name)) return 'jpeg';
  if (mime.indexOf('png') >= 0 || /\.png$/.test(name)) return 'png';
  if (mime.indexOf('webp') >= 0 || /\.webp$/.test(name)) return 'webp';
  if (mime.indexOf('gif') >= 0 || /\.gif$/.test(name)) return 'gif';
  if (mime.indexOf('bmp') >= 0 || /\.bmp$/.test(name)) return 'bmp';
  if (mime.indexOf('image') === 0) return 'image';
  return null;
}

// Anything we can decode or convert on-device without leaving the browser.
function isSupportedInput(file) {
  var f = detectFileFormat(file);
  if (!f) return false;
  return f === 'pdf' || f === 'jpeg' || f === 'png' || f === 'webp' || f === 'gif' || f === 'bmp' || f === 'image';
}

// Normalize any format identifier — short name ('jpeg'), extension ('jpg')
// or MIME ('image/jpeg') — to the canonical short name, or null.
function shortFormat(f) {
  if (!f) return null;
  var s = String(f).toLowerCase().trim();
  if (s.indexOf('/') >= 0) s = s.split('/')[1] || '';
  if (s === 'jpg') s = 'jpeg';
  if (s === 'tif' || s === 'tiff') return null;
  return DOCBRIDGE_FORMATS[s] ? s : null;
}

function formatLabel(f) {
  var s = shortFormat(f);
  return (s && DOCBRIDGE_FORMATS[s].label) || (f || '').toUpperCase();
}

function formatMime(f) {
  var s = shortFormat(f) || 'jpeg';
  return DOCBRIDGE_FORMATS[s].mime;
}

function formatExt(f) {
  var s = shortFormat(f) || 'jpeg';
  return DOCBRIDGE_FORMATS[s].ext;
}

// Which output formats a slot offers given our on-device engines. A portal may
// pin outputs via constraint.output_formats (short names or MIMEs). Default:
// every converter engine we ship (JPEG, PNG, PDF).
function outputFormatsFor(constraint) {
  if (constraint && Array.isArray(constraint.output_formats)) {
    var out = [];
    constraint.output_formats.forEach(function(f) {
      var s = shortFormat(f);
      if (s && (s === 'jpeg' || s === 'png' || s === 'pdf') && out.indexOf(s) < 0) out.push(s);
    });
    if (out.length) return out;
  }
  return ['jpeg', 'png', 'pdf'];
}

// Current document's final output format derived from constraint + overrides.
function effectiveOutputFormat(constraint, override) {
  var o = shortFormat(override);
  if (o && DOCBRIDGE_FORMATS[o]) return o;
  var c = constraint && shortFormat(constraint.format);
  if (c && DOCBRIDGE_FORMATS[c]) return c;
  return 'jpeg';
}

function inputAcceptAttr(constraint) {
  var base = 'image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp,application/pdf';
  if (constraint && Array.isArray(constraint.input_formats)) {
    return constraint.input_formats.join(',') || base;
  }
  return base;
}
