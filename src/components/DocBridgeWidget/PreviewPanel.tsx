'use client';

import { useState, useEffect } from 'react';
import { ProcessingResult } from '@/types';
import { COLORS } from '@/lib/constants';
import PrivacyBadge from '@/components/ui/PrivacyBadge';

interface PreviewPanelProps {
  result: ProcessingResult;
  portalId: 'epfo' | 'upsc' | 'vahan' | 'passport' | 'ssc' | 'nsp';
  source: 'digilocker' | 'device';
  onSubmit: (saveToDigiLocker: boolean) => void;
  onCancel: () => void;
  onRequestSaveAuth?: () => void;
  isSaveAuthed?: boolean;
  onRecompress?: () => void;
  isRecompressing?: boolean;
  onAdjust?: (rotation: number) => void;
  onEnhance?: () => void;
}

export default function PreviewPanel({ 
  result, 
  portalId, 
  source,
  onSubmit, 
  onCancel,
  onRequestSaveAuth,
  isSaveAuthed = false,
  onRecompress,
  isRecompressing = false,
  onAdjust,
  onEnhance,
}: PreviewPanelProps) {
  const [saveToDigiLocker, setSaveToDigiLocker] = useState(true);
  const [previewUrls, setPreviewUrls] = useState<{ original?: string; processed?: string }>({});
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const [showAdjust, setShowAdjust] = useState(false);
  useEffect(() => {
    const oType = result.original.blob.type;
    const pType = result.processed.blob.type;
    const o = URL.createObjectURL(result.original.blob);
    const p = URL.createObjectURL(result.processed.blob);
    setPreviewUrls({ original: o, processed: p });
    const isPdf = pType === 'application/pdf';
    let thumb: string | undefined;
    if (isPdf && result.processed.dimensions) {
      // For PDF we keep object URL — iframe will render it
    }
    return () => { URL.revokeObjectURL(o); URL.revokeObjectURL(p); if (thumb) URL.revokeObjectURL(thumb); };
  }, [result]);

  const originalSizeKB = result.original.size_mb * 1024;
  const processedSizeKB = result.processed.size_kb;
  const reduction = originalSizeKB > 0
    ? Math.round((1 - processedSizeKB / originalSizeKB) * 100)
    : 0;

  const portalName = portalId === 'epfo' ? 'EPFO' : portalId === 'vahan' ? 'Sarathi' : portalId === 'passport' ? 'Passport Seva' : portalId === 'ssc' ? 'SSC' : portalId === 'nsp' ? 'NSP' : 'UPSC';
  const isOverLimit = !!result.constraint.max_kb && processedSizeKB > result.constraint.max_kb + 0.5;
  const warningText = result.processed.warning || (isOverLimit ? `This file is ${Math.round(processedSizeKB)}KB — over the ${result.constraint.max_kb}KB limit for ${portalName}.` : undefined);

  const handleDownload = () => {
    const ext = result.constraint.format === 'pdf' ? 'pdf' : result.constraint.format === 'png' ? 'png' : 'jpg';
    const mime = ext === 'pdf' ? 'application/pdf' : ext === 'png' ? 'image/png' : 'image/jpeg';
    const blob = result.processed.blob.slice(0, result.processed.blob.size, mime);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `docbridge-${portalId}-optimized.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.gray[800] }}>
          Ready to submit
        </h3>
        <p className="text-sm" style={{ color: COLORS.gray[500] }}>
          The optimized copy is sized to meet {portalName}&apos;s upload rules
        </p>
      </div>

      {/* Visual Before / After Preview */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: COLORS.gray[200] }}>
          <div className="px-3 py-2 text-center text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.gray[500], backgroundColor: COLORS.gray[50] }}>Before — Original</div>
          <div className="relative bg-white p-3">
            {previewUrls.original ? (
              result.original.blob.type === 'application/pdf' ? (
                <div className="overflow-hidden rounded-lg border" style={{ borderColor: COLORS.gray[200] }}>
                  <iframe src={previewUrls.original} title="Original PDF" className="h-48 w-full" />
                </div>
              ) : (
                <button type="button" onClick={() => setZoomSrc(previewUrls.original!)} className="group relative block w-full overflow-hidden rounded-lg border" style={{ borderColor: COLORS.gray[200] }}>
                  <img src={previewUrls.original} alt="Original" className="max-h-48 w-full object-contain transition group-hover:scale-[1.02]" />
                  <span className="absolute bottom-1 right-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">Click to zoom 2×</span>
                </button>
              )
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-xs" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[500] }}>Loading preview…</div>
            )}
            <div className="mt-2 text-center">
              <span className="text-lg font-bold line-through" style={{ color: COLORS.gray[500] }}>{formatSize(originalSizeKB)}</span>
              {result.original.dimensions && <span className="ml-2 text-xs" style={{ color: COLORS.gray[500] }}>{result.original.dimensions.width}×{result.original.dimensions.height}px</span>}
              <p className="text-xs truncate" style={{ color: COLORS.gray[400] }}>{result.original.assetName || 'From DigiLocker'}</p>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border-2" style={{ borderColor: COLORS.success }}>
          <div className="px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-white" style={{ backgroundColor: COLORS.success }}>After — Optimized ✓</div>
          <div className="relative p-3" style={{ backgroundColor: COLORS.successLight }}>
            {previewUrls.processed ? (
              result.processed.blob.type === 'application/pdf' ? (
                <div className="overflow-hidden rounded-lg border bg-white" style={{ borderColor: COLORS.success }}>
                  <iframe src={previewUrls.processed} title="Optimized PDF" className="h-48 w-full" />
                  <div className="flex justify-center gap-2 bg-white px-2 py-1.5">
                    <a href={previewUrls.processed} target="_blank" rel="noreferrer" className="text-xs font-bold underline" style={{ color: COLORS.success }}>Open PDF</a>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => setZoomSrc(previewUrls.processed!)} className="group relative block w-full overflow-hidden rounded-lg border bg-white" style={{ borderColor: COLORS.success }}>
                  <img src={previewUrls.processed} alt="Optimized" className="max-h-48 w-full object-contain transition group-hover:scale-[1.02]" />
                  <span className="absolute bottom-1 right-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">Zoom 2×</span>
                </button>
              )
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border bg-white text-xs" style={{ borderColor: COLORS.success, color: COLORS.gray[700] }}>Preparing preview…</div>
            )}
            <div className="mt-2 text-center">
              <span className="text-lg font-bold" style={{ color: COLORS.success }}>{formatSize(processedSizeKB)}</span>
              {result.processed.dimensions && <span className="ml-2 text-xs" style={{ color: COLORS.success }}>{result.processed.dimensions.width}×{result.processed.dimensions.height}px</span>}
              {reduction > 0 && <span className="ml-2 text-xs font-bold" style={{ color: COLORS.success }}>{reduction}% smaller</span>}
              <p className="text-xs" style={{ color: COLORS.success }}>Meets {portalName} rules</p>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-bold shadow-sm hover:-translate-y-0.5" style={{ borderColor: COLORS.success, color: COLORS.success }}><svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" /></svg>Download</button>
              {previewUrls.processed && <button type="button" onClick={() => setShowAdjust(true)} className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-bold shadow-sm hover:-translate-y-0.5" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>Adjust ↻</button>}
            </div>
            {result.original.dimensions && result.processed.dimensions && result.original.dimensions.width < result.processed.dimensions.width * 0.7 && onEnhance && (
              <button type="button" onClick={onEnhance} className="mx-auto mt-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-sm" style={{ backgroundColor: COLORS.warning }}>✦ Enhance clarity (up-scale)</button>
            )}
          </div>
        </div>
      </div>
      {zoomSrc && (
        <button type="button" onClick={() => setZoomSrc(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" aria-label="Close zoom">
          <img src={zoomSrc} alt="Zoomed" className="max-h-[85vh] max-w-[90vw] rounded-xl border-4 border-white object-contain shadow-2xl" style={{ transform: 'scale(1.15)' }} />
        </button>
      )}
      {showAdjust && previewUrls.processed && (
        <CropAdjustWrap imageUrl={previewUrls.processed} onClose={() => setShowAdjust(false)} onApply={(r) => { setShowAdjust(false); onAdjust?.(r); }} />
      )}

      {/* Requirements Met */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: isOverLimit ? '#FEF2F2' : COLORS.successLight, border: isOverLimit ? `1px solid #FECACA` : 'none' }}>
        <h4 className="font-semibold mb-2" style={{ color: isOverLimit ? '#DC2626' : COLORS.success }}>
          {isOverLimit ? '⚠ Size still over limit' : '✓ Requirements Met'}
        </h4>
        <ul className="text-sm space-y-1" style={{ color: COLORS.gray[700] }}>
          {result.constraint.format && (
            <li>• Format: {result.constraint.format.toUpperCase()}</li>
          )}
          {result.constraint.max_kb && (
            <li>• Max size: {result.constraint.max_kb}KB (yours: {Math.round(processedSizeKB)}KB) {isOverLimit && <span className="font-bold text-red-600">— over</span>}</li>
          )}
          {result.constraint.min_kb && (
            <li>• Min size: {result.constraint.min_kb}KB (yours: {Math.round(processedSizeKB)}KB)</li>
          )}
          {result.constraint.width_cm && result.constraint.height_cm && (
            <li>• Dimensions: {result.constraint.width_cm}cm × {result.constraint.height_cm}cm</li>
          )}
          {result.constraint.bg_color && (
            <li>• Background: {result.constraint.bg_color}</li>
          )}
        </ul>
      </div>

      {warningText && (
        <div className="rounded-lg border p-4" style={{ backgroundColor: isOverLimit ? '#FEF2F2' : '#FFFBEB', borderColor: isOverLimit ? '#FECACA' : '#FDE68A' }}>
          <div className="flex gap-3">
            <span className="mt-0.5 text-lg" aria-hidden="true">{isOverLimit ? '⚠️' : 'ℹ️'}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: isOverLimit ? '#991B1B' : '#92400E' }}>{isOverLimit ? 'Needs attention before upload' : 'Heads up'}</p>
              <p className="mt-1 text-sm leading-6" style={{ color: isOverLimit ? '#7F1D1D' : '#78350F' }}>{warningText}</p>
              {!isOverLimit && result.processed.wasScaled && (
                <p className="mt-2 text-xs" style={{ color: COLORS.gray[500] }}>We scaled the image slightly to fit the limit — still portal-compliant.</p>
              )}
            </div>
          </div>
          {isOverLimit && onRecompress && (
            <button
              type="button"
              onClick={onRecompress}
              disabled={isRecompressing}
              className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 disabled:opacity-50"
              style={{ backgroundColor: COLORS.primary }}
            >
              {isRecompressing ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : null}
              {isRecompressing ? 'Compressing…' : 'Try stronger compression'}
              <span className="text-xs font-normal opacity-80">(quality will drop slightly)</span>
            </button>
          )}
          {isOverLimit && !onRecompress && (
            <p className="mt-3 text-xs" style={{ color: COLORS.gray[600] }}>Tip: try a smaller source photo for best clarity, or use “Upload from device” with a lighter file.</p>
          )}
        </div>
      )}

      {/* Save to DigiLocker — DigiLocker source shows checkbox, device source shows sign-in button flow */}
      {source === 'device' ? (
        isSaveAuthed ? (
          <div className="flex items-center gap-3 rounded-lg border p-4" style={{ borderColor: COLORS.success, backgroundColor: COLORS.successLight }}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full text-white" style={{ backgroundColor: COLORS.success }}>✓</span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: COLORS.success }}>Signed in — will save to DigiLocker</p>
              <p className="text-xs" style={{ color: COLORS.gray[600] }}>This optimized file will be linked to your DigiLocker for reuse.</p>
            </div>
            <button type="button" onClick={() => onRequestSaveAuth?.()} className="text-xs font-semibold underline" style={{ color: COLORS.success }}>Change</button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onRequestSaveAuth?.()}
            className="flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(30,58,138,0.08)]"
            style={{ borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white" style={{ color: COLORS.primary }}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>Sign in and save to DigiLocker</p>
              <p className="text-xs leading-5" style={{ color: COLORS.gray[600] }}>Connect your DigiLocker — this optimized file will be ready for reuse on other portals.</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold" style={{ color: COLORS.primary }}>Sign in →</span>
          </button>
        )
      ) : (
        <label
          className="flex cursor-pointer items-center gap-3 rounded-lg border p-4"
          style={{ borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight }}
        >
          <input
            type="checkbox"
            checked={saveToDigiLocker}
            onChange={(e) => setSaveToDigiLocker(e.target.checked)}
            className="h-5 w-5 accent-[#1E3A8A]"
          />
          <div>
            <p className="text-sm font-semibold" style={{ color: COLORS.primary }}>
              Save the optimized copy back to DigiLocker
            </p>
            <p className="text-xs" style={{ color: COLORS.gray[600] }}>
              Next time you need this document for another portal, it&apos;s already correctly sized.
            </p>
          </div>
        </label>
      )}

      <button type="button" onClick={onCancel} className="w-full rounded-xl border-2 border-dashed py-2.5 text-sm font-bold transition hover:-translate-y-0.5" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[700], backgroundColor: '#fff' }}>
        ↺ Choose different document — {source === 'digilocker' ? 'pick another from DigiLocker' : 'upload another file'} 
      </button>
      <PrivacyBadge compact />
      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-xl font-semibold border transition-colors"
          style={{ 
            borderColor: COLORS.gray[300],
            color: COLORS.gray[700]
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.gray[100]; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          Cancel
        </button>
        <button
          onClick={() => onSubmit(source === 'device' ? isSaveAuthed : saveToDigiLocker)}
          className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors"
          style={{ backgroundColor: COLORS.success }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.successHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.success;
          }}
        >
          Submit to {portalName}
        </button>
      </div>
    </div>
  );
}

function CropAdjustWrap({ imageUrl, onClose, onApply }: { imageUrl: string; onClose: () => void; onApply: (r: number) => void }) {
  const [Mod, setMod] = useState<any>(null);
  useEffect(() => { import('./CropAdjust').then(m => setMod(() => m.default)); }, []);
  if (!Mod) return null;
  return <Mod imageUrl={imageUrl} onClose={onClose} onApply={onApply} />;
}

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}
