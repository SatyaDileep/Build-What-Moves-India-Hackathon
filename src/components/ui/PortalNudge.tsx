'use client';

import { COLORS } from '@/lib/constants';

interface PortalNudgeProps {
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  onAction: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  tone?: 'amber' | 'blue' | 'green';
}

export default function PortalNudge({
  eyebrow,
  title,
  description,
  ctaLabel,
  onAction,
  onDismiss,
  dismissible = true,
  tone = 'amber',
}: PortalNudgeProps) {
  const palette =
    tone === 'blue'
      ? { bg: '#EFF6FF', border: '#BFDBFE', accent: COLORS.primary, text: '#1E3A8A' }
      : tone === 'green'
        ? { bg: '#ECFDF5', border: '#A7F3D0', accent: '#059669', text: '#065F46' }
        : { bg: '#FFFBEB', border: '#FDE68A', accent: '#D97706', text: '#92400E' };

  return (
    <div
      className="relative overflow-hidden rounded-xl border px-4 py-4 shadow-sm sm:px-5"
      style={{ backgroundColor: palette.bg, borderColor: palette.border }}
      role="status"
      aria-live="polite"
    >
      <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: palette.accent }} aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {eyebrow && (
            <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: palette.accent }}>
              {eyebrow}
            </p>
          )}
          <h3 className="mt-1 text-sm font-bold leading-6 sm:text-base" style={{ color: palette.text }}>
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
          <button
            type="button"
            onClick={onAction}
            className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: palette.accent }}
          >
            {ctaLabel}
            <span aria-hidden="true">→</span>
          </button>
        </div>
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-black/5 hover:text-slate-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
