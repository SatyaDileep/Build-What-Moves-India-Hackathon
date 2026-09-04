'use client';
import { useMemo, useState } from 'react';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

export interface AdjustChoice {
  targetKB: number;
  aggressive: boolean;
}

function buildPresets(minKB: number | undefined, maxKB: number, currentKB: number, t: (k: string) => string): { id: string; label: string; hint: string; choice: AdjustChoice }[] {
  const max = Math.round(maxKB || 100);
  const min = minKB && minKB > 0 ? Math.round(minKB) : undefined;
  const mid = min ? Math.round((min + max) / 2) : Math.round(max * 0.7);
  const small = min ? Math.round(min + (max - min) * 0.15) : Math.round(max * 0.5);
  const sharp = Math.max(mid + 1, max);
  const uniq = (v: number) => Math.min(Math.max(1, Math.round(v)), max);
  return [
    { id: 'smallest', label: `${t('adj.smallest')} ~${uniq(small)}KB`, hint: t('adj.safe'), choice: { targetKB: uniq(small), aggressive: true } },
    { id: 'balanced', label: `${t('adj.balanced')} ~${uniq(mid)}KB`, hint: t('adj.mix'), choice: { targetKB: uniq(mid), aggressive: false } },
    { id: 'sharpest', label: `${t('adj.sharpest')} ~${uniq(sharp)}KB`, hint: t('adj.best'), choice: { targetKB: uniq(sharp), aggressive: false } },
  ];
}

export default function CropAdjust({ imageUrl, minKB, maxKB, currentKB, onClose, onApply }: { imageUrl: string; minKB?: number; maxKB: number; currentKB: number; onClose: () => void; onApply: (choice: AdjustChoice) => void }) {
  const { t } = useLang();
  const presets = useMemo(() => buildPresets(minKB, maxKB, currentKB, t), [minKB, maxKB, currentKB, t]);
  const [sel, setSel] = useState(presets[1]?.id ?? 'balanced');
  const active = presets.find(p => p.id === sel) ?? presets[1];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close adjust" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-white shadow-2xl" style={{ borderColor: COLORS.gray[200] }}>
        <div className="p-5">
          <h3 className="text-base font-bold" style={{ color: COLORS.gray[800] }}>{t('adj.title')}</h3>
          <p className="mt-1 text-xs" style={{ color: COLORS.gray[600] }}>{t('adj.sub')}{minKB ? ` (${minKB}–${Math.round(maxKB)}KB)` : ` (max ${Math.round(maxKB)}KB)`}.</p>
          <div className="mt-4 flex justify-center overflow-hidden rounded-xl border bg-gray-50 p-4" style={{ borderColor: COLORS.gray[200] }}>
            <img src={imageUrl} alt="Adjust preview" className="max-h-64 object-contain" />
          </div>
          <div className="mt-4 grid gap-2">
            {presets.map(p => (
              <button key={p.id} type="button" onClick={() => setSel(p.id)} aria-pressed={sel === p.id} className="flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm shadow-sm" style={{ borderColor: sel === p.id ? COLORS.primary : COLORS.gray[300], backgroundColor: sel === p.id ? COLORS.primaryLight : '#fff' }}>
                <span className="flex h-4 w-4 items-center justify-center rounded-full border" style={{ borderColor: sel === p.id ? COLORS.primary : COLORS.gray[400] }}>{sel === p.id ? <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.primary }} /> : null}</span>
                <span className="font-bold" style={{ color: COLORS.gray[800] }}>{p.label}</span>
                <span className="ml-auto text-xs" style={{ color: COLORS.gray[500] }}>{p.hint}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 border-t bg-gray-50 p-4" style={{ borderColor: COLORS.gray[200] }}>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border bg-white py-2.5 text-sm font-semibold" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[700] }}>{t('w.cancel')}</button>
          <button type="button" onClick={() => onApply(active.choice)} className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white" style={{ backgroundColor: COLORS.primary }}>{t('adj.apply')}</button>
        </div>
      </div>
    </div>
  );
}
