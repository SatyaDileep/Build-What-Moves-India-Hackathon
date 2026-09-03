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
  if (constraint.format) parts.push(constraint.format.toUpperCase());
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
