'use client';
import { useState } from 'react';
import { COLORS } from '@/lib/constants';
export default function CropAdjust({ imageUrl, onClose, onApply }: { imageUrl: string; onClose: () => void; onApply: (rotation: number) => void }) {
  const [rot, setRot] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close adjust" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-white shadow-2xl" style={{ borderColor: COLORS.gray[200] }}>
        <div className="p-5">
          <h3 className="text-base font-bold" style={{ color: COLORS.gray[800] }}>Adjust crop & rotation</h3>
          <p className="mt-1 text-xs" style={{ color: COLORS.gray[600] }}>Tweak rotation if AI crop looks off. Aspect stays locked to portal rules.</p>
          <div className="mt-4 flex justify-center overflow-hidden rounded-xl border bg-gray-50 p-4" style={{ borderColor: COLORS.gray[200] }}>
            <img src={imageUrl} alt="Adjust preview" className="max-h-64 object-contain transition" style={{ transform: `rotate(${rot}deg)` }} />
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button type="button" onClick={() => setRot(r => (r - 90 + 360) % 360)} className="rounded-full border bg-white px-4 py-2 text-sm font-bold shadow-sm hover:-translate-y-0.5" style={{ borderColor: COLORS.gray[300] }}>↺ 90°</button>
            <span className="text-sm font-semibold" style={{ color: COLORS.gray[700] }}>{rot}°</span>
            <button type="button" onClick={() => setRot(r => (r + 90) % 360)} className="rounded-full border bg-white px-4 py-2 text-sm font-bold shadow-sm hover:-translate-y-0.5" style={{ borderColor: COLORS.gray[300] }}>↻ 90°</button>
          </div>
        </div>
        <div className="flex gap-3 border-t bg-gray-50 p-4" style={{ borderColor: COLORS.gray[200] }}>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border bg-white py-2.5 text-sm font-semibold" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[700] }}>Cancel</button>
          <button type="button" onClick={() => onApply(rot)} className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white" style={{ backgroundColor: COLORS.primary }}>Apply & re-optimize</button>
        </div>
      </div>
    </div>
  );
}
