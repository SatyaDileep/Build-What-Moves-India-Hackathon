'use client';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';
export default function PrivacyBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useLang();
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 ${compact ? 'text-xs' : 'text-xs'}`}
      style={{ borderColor: COLORS.gray[200], backgroundColor: '#F8FAFC' }}
      role="note"
      aria-label="Privacy assurance"
    >
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: COLORS.successLight, color: COLORS.success }}>🔒</span>
      <div className="flex-1 leading-4">
        <span className="font-bold" style={{ color: COLORS.gray[800] }}>{t('privacy.title')}</span>
        <span className="mx-1.5 opacity-40">·</span>
        <span style={{ color: COLORS.gray[600] }}>{t('privacy.sub')}</span>
        {!compact && <span className="mx-1.5 opacity-40">·</span>}
        {!compact && <span className="inline-flex items-center gap-1 font-semibold" style={{ color: COLORS.success }}><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS.success }} /> {t('privacy.calls')}</span>}
      </div>
    </div>
  );
}
