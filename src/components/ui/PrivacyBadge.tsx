'use client';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';
import { useState } from 'react';
export default function PrivacyBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  const [showDetail, setShowDetail] = useState(false);
  const fullText = t('privacy.title');
  const shortText = '100% browser-private';
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${compact ? 'text-xs' : 'text-xs'}`}
      style={{ borderColor: COLORS.gray[200], backgroundColor: '#F8FAFC' }}
      role="note"
      aria-label="Privacy assurance"
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.successLight, color: COLORS.success }}>🔒</span>
      <div className="flex-1 leading-4 relative">
        <span className="font-bold" style={{ color: COLORS.gray[800] }}>{shortText}</span>
        <span
          className="ml-1 cursor-help text-xs"
          style={{ color: COLORS.primary }}
          title={fullText}
        >
          ⓘ
        </span>
        {showDetail && (
          <div
            className="absolute left-0 top-full mt-1 z-10 px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap"
            style={{
              backgroundColor: COLORS.gray[800],
              color: COLORS.gray[50],
              border: `1px solid ${COLORS.gray[600]}`,
              minWidth: '300px'
            }}
          >
            {fullText}
          </div>
        )}
      </div>
    </div>
  );
}
