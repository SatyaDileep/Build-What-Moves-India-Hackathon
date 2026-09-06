'use client';

import { useEffect, useRef, useState } from 'react';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

interface SignaturePadProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export default function SignaturePad({ onCapture, onClose }: SignaturePadProps) {
  const { t } = useLang();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const paintWhite = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.round(160 * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, 160);
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  useEffect(() => {
    paintWhite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const useSignature = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      onCapture(new File([blob], 'signature.png', { type: 'image/png' }));
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" role="dialog" aria-modal="true" aria-label={t('w.drawSign')}>
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: COLORS.primaryLight }}>
          <p className="text-sm font-bold" style={{ color: COLORS.primary }}>{t('w.drawSign')}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full px-2 py-0.5 text-lg leading-none" style={{ color: COLORS.gray[500] }}>×</button>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-xs" style={{ color: COLORS.gray[500] }}>{t('w.drawHere')}</p>
          <canvas
            ref={canvasRef}
            className="h-40 w-full touch-none rounded-lg border"
            style={{ borderColor: COLORS.gray[300], cursor: 'crosshair' }}
            onPointerDown={(e) => {
              drawingRef.current = true;
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
              const ctx = canvasRef.current?.getContext('2d');
              const p = pos(e);
              ctx?.beginPath();
              ctx?.moveTo(p.x, p.y);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current) return;
              const ctx = canvasRef.current?.getContext('2d');
              const p = pos(e);
              ctx?.lineTo(p.x, p.y);
              ctx?.stroke();
              setHasDrawn(true);
            }}
            onPointerUp={() => { drawingRef.current = false; }}
            onPointerCancel={() => { drawingRef.current = false; }}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { paintWhite(); setHasDrawn(false); }}
              className="flex-1 rounded-lg border px-4 py-2 text-sm font-bold"
              style={{ borderColor: COLORS.gray[300], color: COLORS.gray[700] }}
            >
              {t('w.clearPad')}
            </button>
            <button
              type="button"
              onClick={useSignature}
              disabled={!hasDrawn}
              className="flex-1 rounded-lg px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              style={{ backgroundColor: COLORS.success }}
            >
              {t('w.useSignature')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
