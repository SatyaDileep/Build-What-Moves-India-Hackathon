'use client';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';
import { useRef, useState } from 'react';

export default function PrivacyBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  const [showDetail, setShowDetail] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fullText = t('privacy.title');
  const shortText = '100% browser-private';
  const show = showDetail && !hideTimer.current;

  // Defer hide by 120ms so moving between the badge and the tooltip doesn't
  // flicker it out; only the badge's own leave (plus a timer) actually closes.
  return (
    <div
      // pointerEvents lets the tooltip exist without stealing mouse events that
      // would trigger leave on the parent badge prematurely.
      className={`items-center gap-2 rounded-xl border px-3 py-2.5 ${compact ? 'text-xs' : 'text-xs'}`}
      style={{ borderColor: COLORS.gray[200], backgroundColor: '#F8FAFC', pointerEvents: 'auto' }}
      role="note"
      aria-label="Privacy assurance"
      // Use a hit-area behind the tooltip so cursor over the gap/edge keeps the
      // tooltip visible; the tooltip itself lives outside this hit area.
      onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); setShowDetail(true); }}
      onMouseLeave={() => {
        // Brief grace period: if the cursor quickly returns, keep showing.
        hideTimer.current = setTimeout(() => setShowDetail(false), 120);
      }}
    >
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: COLORS.successLight, color: COLORS.success }}>🔒</span>
      <div className="flex-1 leading-4 relative">
        <span className="font-bold" style={{ color: COLORS.gray[800] }}>{shortText}</span>
        <span className="ml-1 cursor-help text-xs" style={{ color: COLORS.primary }} title={fullText}>
          ⓘ
        </span>
      </div>
      {/* Tooltip lives OUTSIDE the badge's event-hit area so it never triggers
          parent mouseleave when the cursor rests on the tooltip itself.
          Constrain width + word-break so long translations don't overflow the
          parent container; flip to the left edge when there's more space there. */}
      {show && (
        <div
          className="pointer-events-none absolute top-full z-10 px-3 py-2 rounded-lg shadow-lg text-xs"
          style={{
            backgroundColor: COLORS.gray[800],
            color: COLORS.gray[50],
            border: `1px solid ${COLORS.gray[600]}`,
            maxWidth: 'min(280px, 90vw)',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            left: 0,
            right: 'auto',
          }}
        >
          {fullText}
        </div>
      )}
    </div>
  );
}
