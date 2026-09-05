'use client';
import { useMemo, useState } from 'react';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

export interface AdjustChoice {
  targetKB: number;
  aggressive: boolean;
  targetWidth?: number;
  targetHeight?: number;
}

function buildPresets(minKB: number | undefined, maxKB: number, currentKB: number, t: (k: string) => string): { id: string; label: string; hint: string; choice: AdjustChoice }[] {
  const max = Math.round(maxKB || 50);
  const cur = Math.min(Math.max(1, Math.round(currentKB || max * 0.3)), max);
  const good = Math.min(max, Math.max(cur + 1, Math.round(cur + (max - cur) * 0.5)));
  const best = max;
  return [
    { id: 'current', label: `${t('adj.current')} (~${cur}KB)`, hint: t('adj.safe'), choice: { targetKB: cur, aggressive: false } },
    { id: 'good', label: `${t('adj.balanced')} (~${good}KB)`, hint: t('adj.mix'), choice: { targetKB: good, aggressive: false } },
    { id: 'best', label: `${t('adj.sharpest')} (~${best}KB)`, hint: t('adj.best'), choice: { targetKB: best, aggressive: false } },
  ];
}

export default function CropAdjust({ imageUrl, minKB, maxKB, currentKB, onClose, onApply }: { imageUrl: string; minKB?: number; maxKB: number; currentKB: number; onClose: () => void; onApply: (choice: AdjustChoice) => void }) {
  const { t } = useLang();
  const presets = useMemo(() => buildPresets(minKB, maxKB, currentKB, t), [minKB, maxKB, currentKB, t]);
  const [tab, setTab] = useState<'quality' | 'size'>('quality');
  const [sel, setSel] = useState(presets[0]?.id ?? 'current');
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const active = presets.find(p => p.id === sel) ?? presets[0];

  const W = parseInt(w, 10);
  const H = parseInt(h, 10);
  const sizeValid = !Number.isNaN(W) && !Number.isNaN(H) && W > 0 && H > 0;
  const maxKBPreset = presets[presets.length - 1]?.choice.targetKB ?? Math.round(maxKB);

  const apply = () => {
    if (tab === 'size') {
      if (!sizeValid) return;
      onApply({ targetKB: maxKBPreset, aggressive: false, targetWidth: W, targetHeight: H });
    } else {
      onApply(active.choice);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close adjust" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border bg-white shadow-2xl" style={{ borderColor: COLORS.gray[200] }}>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-lg font-bold leading-none text-slate-400 transition hover:bg-black/5 hover:text-slate-700">✕</button>
        <div className="p-5">
          <h3 className="text-base font-bold" style={{ color: COLORS.gray[800] }}>{t('adj.title')}</h3>
          <p className="mt-1 text-sm" style={{ color: COLORS.gray[600] }}>{t('adj.sub')}</p>
          <div className="mt-4 flex justify-center overflow-hidden rounded-xl border bg-gray-50 p-4" style={{ borderColor: COLORS.gray[200] }}>
            <img src={imageUrl} alt="Adjust preview" className="max-h-64 object-contain" />
          </div>

          {/* Quality / Crop size tabs */}
          <div className="mt-4 flex gap-1 rounded-xl p-1" style={{ backgroundColor: COLORS.gray[100] }} role="tablist">
            {(['quality', 'size'] as const).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                className="flex-1 cursor-pointer rounded-lg py-2 text-sm font-bold transition" 
                style={{ backgroundColor: tab === k ? '#fff' : 'transparent', color: tab === k ? COLORS.primary : COLORS.gray[600], boxShadow: tab === k ? '0 1px 3px rgba(0,0,0,0.12)' : 'none' }}>
                {k === 'quality' ? t('adj.quality') : t('adj.size')}
              </button>
            ))}
          </div>

          {tab === 'quality' ? (
            <div className="mt-4 grid gap-2">
              {presets.map(p => (
                <button key={p.id} type="button" onClick={() => setSel(p.id)} aria-pressed={sel === p.id} className="flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm shadow-sm" style={{ borderColor: sel === p.id ? COLORS.primary : COLORS.gray[300], backgroundColor: sel === p.id ? COLORS.primaryLight : '#fff' }}>
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border" style={{ borderColor: sel === p.id ? COLORS.primary : COLORS.gray[400] }}>{sel === p.id ? <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS.primary }} /> : null}</span>
                  <span className="font-bold" style={{ color: COLORS.gray[800] }}>{p.label}</span>
                  <span className="ml-auto text-xs" style={{ color: COLORS.gray[500] }}>{p.hint}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-xs leading-5" style={{ color: COLORS.gray[600] }}>{t('adj.sizeSub')}</p>
              <div className="mt-3 flex items-end justify-center gap-3">
                <label className="block text-xs font-bold" style={{ color: COLORS.gray[700] }}>
                  {t('adj.width')}
                  <span className="mt-1 flex items-center overflow-hidden rounded-xl border" style={{ borderColor: COLORS.gray[300] }}>
                    <input type="number" min={1} value={w} onChange={(e) => setW(e.target.value)} placeholder="630" inputMode="numeric"
                      className="w-24 border-0 bg-white px-3 py-2.5 text-center text-sm font-bold outline-none" style={{ color: COLORS.gray[800] }} />
                    <span className="px-2 text-xs font-semibold" style={{ color: COLORS.gray[400] }}>{t('adj.px')}</span>
                  </span>
                </label>
                <span className="pb-2.5 text-lg font-bold" style={{ color: COLORS.gray[400] }}>×</span>
                <label className="block text-xs font-bold" style={{ color: COLORS.gray[700] }}>
                  {t('adj.height')}
                  <span className="mt-1 flex items-center overflow-hidden rounded-xl border" style={{ borderColor: COLORS.gray[300] }}>
                    <input type="number" min={1} value={h} onChange={(e) => setH(e.target.value)} placeholder="810" inputMode="numeric"
                      className="w-24 border-0 bg-white px-3 py-2.5 text-center text-sm font-bold outline-none" style={{ color: COLORS.gray[800] }} />
                    <span className="px-2 text-xs font-semibold" style={{ color: COLORS.gray[400] }}>{t('adj.px')}</span>
                  </span>
                </label>
              </div>
              {!sizeValid && <p className="mt-2 text-center text-[11px]" style={{ color: COLORS.error }}>{t('adj.sizeValid')}</p>}
            </div>
          )}
        </div>
        <div className="flex gap-3 border-t bg-gray-50 p-4" style={{ borderColor: COLORS.gray[200] }}>
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border bg-white py-2.5 text-sm font-semibold" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[700] }}>{t('w.cancel')}</button>
          <button type="button" onClick={apply} disabled={tab === 'size' && !sizeValid} className="flex-1 rounded-xl py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40" style={{ backgroundColor: COLORS.primary }}>{t('adj.apply')}</button>
        </div>
      </div>
    </div>
  );
}