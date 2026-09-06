'use client';

import { useEffect, useRef, useState } from 'react';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  onClose: () => void;
  onFallback: () => void;
}

export default function CameraCapture({ onCapture, onClose, onFallback }: CameraCaptureProps) {
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const blobRef = useRef<Blob | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
      if (preview) URL.revokeObjectURL(preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takeShot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      blobRef.current = blob;
      setPreview(URL.createObjectURL(blob));
    }, 'image/jpeg', 0.92);
  };

  const useShot = () => {
    if (!blobRef.current) return;
    onCapture(new File([blobRef.current], 'live-photo.jpg', { type: 'image/jpeg' }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4" role="dialog" aria-modal="true" aria-label={t('w.takePhoto')}>
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: COLORS.primaryLight }}>
          <p className="text-sm font-bold" style={{ color: COLORS.primary }}>{t('w.takePhoto')}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full px-2 py-0.5 text-lg leading-none" style={{ color: COLORS.gray[500] }}>×</button>
        </div>
        <div className="p-4">
          {error ? (
            <div className="space-y-3 text-center">
              <p className="text-sm" style={{ color: COLORS.gray[600] }}>{t('w.cameraNeed')}</p>
              <button
                type="button"
                onClick={() => { onClose(); onFallback(); }}
                className="rounded-lg px-4 py-2 text-sm font-bold text-white"
                style={{ backgroundColor: COLORS.primary }}
              >
                {t('w.uploadInstead')}
              </button>
            </div>
          ) : preview ? (
            <div className="space-y-3">
              <img src={preview} alt={t('w.takePhoto')} className="max-h-72 w-full rounded-lg object-contain" style={{ backgroundColor: '#000' }} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { if (preview) URL.revokeObjectURL(preview); setPreview(null); blobRef.current = null; }}
                  className="flex-1 rounded-lg border px-4 py-2 text-sm font-bold"
                  style={{ borderColor: COLORS.gray[300], color: COLORS.gray[700] }}
                >
                  {t('w.retake')}
                </button>
                <button
                  type="button"
                  onClick={useShot}
                  className="flex-1 rounded-lg px-4 py-2 text-sm font-bold text-white"
                  style={{ backgroundColor: COLORS.success }}
                >
                  {t('w.usePhoto')}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <video ref={videoRef} playsInline muted className="max-h-72 w-full rounded-lg object-cover" style={{ backgroundColor: '#000' }} />
              <button
                type="button"
                onClick={takeShot}
                className="w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white"
                style={{ backgroundColor: COLORS.primary }}
              >
                {t('w.capture')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
