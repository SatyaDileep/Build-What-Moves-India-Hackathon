'use client';

import { useState } from 'react';
import { ProcessingResult } from '@/types';
import { COLORS } from '@/lib/constants';

interface PreviewPanelProps {
  result: ProcessingResult;
  portalId: 'epfo' | 'upsc' | 'vahan';
  source: 'digilocker' | 'device';
  onSubmit: (saveToDigiLocker: boolean) => void;
  onCancel: () => void;
  onRequestSaveAuth?: () => void;
  isSaveAuthed?: boolean;
}

export default function PreviewPanel({ 
  result, 
  portalId, 
  source,
  onSubmit, 
  onCancel,
  onRequestSaveAuth,
  isSaveAuthed = false,
}: PreviewPanelProps) {
  const [saveToDigiLocker, setSaveToDigiLocker] = useState(true);

  const originalSizeKB = result.original.size_mb * 1024;
  const processedSizeKB = result.processed.size_kb;
  const reduction = originalSizeKB > 0
    ? Math.round((1 - processedSizeKB / originalSizeKB) * 100)
    : 0;

  const portalName = portalId === 'epfo' ? 'EPFO' : portalId === 'vahan' ? 'Sarathi' : 'UPSC';

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

      {/* Before / After Size Comparison */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="rounded-lg border p-4 text-center" style={{ borderColor: COLORS.gray[200], backgroundColor: COLORS.gray[50] }}>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.gray[500] }}>Original</p>
          <p className="mt-2 text-2xl font-bold" style={{ color: COLORS.gray[500], textDecoration: 'line-through' }}>
            {formatSize(originalSizeKB)}
          </p>
          <p className="mt-1 text-xs" style={{ color: COLORS.gray[400] }}>
            {result.original.assetName || 'From DigiLocker'}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <svg className="h-6 w-6" fill="none" stroke={COLORS.success} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          {reduction > 0 && (
            <span className="mt-1 text-xs font-bold" style={{ color: COLORS.success }}>
              {reduction}% smaller
            </span>
          )}
        </div>

        <div className="relative rounded-lg border-2 p-4 text-center" style={{ borderColor: COLORS.success, backgroundColor: COLORS.successLight }}>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.success }}>Optimized ✓</p>
          <p className="mt-2 text-2xl font-bold" style={{ color: COLORS.success }}>
            {formatSize(processedSizeKB)}
          </p>
          <p className="mt-1 text-xs" style={{ color: COLORS.success }}>
            Meets {portalName} rules
          </p>
          <button
            type="button"
            onClick={handleDownload}
            aria-label="Download optimized file"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow"
            style={{ borderColor: COLORS.success, color: COLORS.success }}
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Requirements Met */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.successLight }}>
        <h4 className="font-semibold mb-2" style={{ color: COLORS.success }}>
          ✓ Requirements Met
        </h4>
        <ul className="text-sm space-y-1" style={{ color: COLORS.gray[700] }}>
          {result.constraint.format && (
            <li>• Format: {result.constraint.format.toUpperCase()}</li>
          )}
          {result.constraint.max_kb && (
            <li>• Max size: {result.constraint.max_kb}KB (yours: {Math.round(processedSizeKB)}KB)</li>
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

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-lg font-semibold border transition-colors"
          style={{ 
            borderColor: COLORS.gray[300],
            color: COLORS.gray[700]
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.gray[100];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
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

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}
