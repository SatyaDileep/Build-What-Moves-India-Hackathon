'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import PrivacyBadge from '@/components/ui/PrivacyBadge';
import { COLORS } from '@/lib/constants';
import { useLang, voiceLang } from '@/lib/i18n';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { isVoiceOn } from '@/lib/voice';

export interface GuideStep {
  /** Unique key, e.g. 'photo' | 'signature' | 'passbook' */
  id: string;
  /** Human label shown in the checklist ("Photo", "Signature", …) */
  label: string;
  /** Raw constraint sentence passed straight into DocBridgeWidget.requirements */
  requirements: string;
  /** DOM id of the portal's hidden native <input type="file"> for this slot */
  deviceInputId: string;
  /** Capture modes offered for this slot (camera for photos, draw for signatures) */
  captureModes?: ReadonlyArray<'digilocker' | 'device' | 'camera' | 'draw'>;
  /** Optional portal-voice helper line shown under the step title */
  assistantNote?: string;
}

export interface DocBridgeGuideProps {
  portalId: 'epfo' | 'upsc' | 'vahan' | 'passport' | 'ssc' | 'nsp';
  /** Ordered journey steps. Single-step portals pass one entry. */
  steps: GuideStep[];
  /** Completion flags per step id; the guide auto-advances past done steps. */
  done: Record<string, boolean>;
  /** Fired when a step's optimized document is accepted by the legacy endpoint. */
  onStepDone: (id: string) => void;
  /** Fired when every step is complete — portal shows its submitted receipt. */
  onAllDone?: () => void;
  /** Files chosen through each slot's hidden native input (keyed by step id). */
  deviceFiles?: Record<string, File | null>;
  onDeviceFileChange?: (id: string, file: File | null) => void;
}

const ACCENT = '#F59E0B';
const NAVY = '#0A2540';

/**
 * DocBridge Guide — the "interference layer".
 *
 * The portal page keeps its native upload UI untouched; this overlay anchors a
 * floating companion to the current upload slot, dims everything except the
 * live target, and walks the user step-by-step. Detection is the step array +
 * the DOM ids of the portal's real file inputs — the same contract the Chrome
 * extension's content/detector.js fulfils on real gov.in pages.
 */
export default function DocBridgeGuide({
  portalId,
  steps,
  done,
  onStepDone,
  onAllDone,
  deviceFiles = {},
  onDeviceFileChange,
}: DocBridgeGuideProps) {
  const { t, lang } = useLang();
  const [collapsed, setCollapsed] = useState(false);
  const [spotlightOn, setSpotlightOn] = useState(true);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const allDoneRef = useRef(false);

  const current = useMemo(() => steps.find((s) => !done[s.id]) ?? null, [steps, done]);
  const completedCount = steps.filter((s) => done[s.id]).length;
  const total = steps.length;

  // Track the active slot's native "Choose File" row so the spotlight can
  // cut a hole around the real portal UI.
  useEffect(() => {
    if (!current || !spotlightOn) {
      setTargetRect(null);
      return;
    }
    const el = document.getElementById(current.deviceInputId);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const update = () => {
      const r = el.getBoundingClientRect();
      // Hidden inputs get zero rects — fall back to their closest visible container.
      if (r.width === 0 || r.height === 0) {
        const host = el.parentElement?.getBoundingClientRect();
        setTargetRect(host ?? null);
      } else {
        setTargetRect(r);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [current, spotlightOn]);

  useEffect(() => {
    if (completedCount === total && total > 0 && !allDoneRef.current) {
      allDoneRef.current = true;
      onAllDone?.();
    }
  }, [completedCount, total, onAllDone]);

  useVoiceGuide(
    isVoiceOn() && !!current,
    current ? `${t('guide.step')} ${completedCount + 1} ${t('guide.of')} ${total}: ${current.label}` : '',
    voiceLang(lang),
  );

  const spotlightStyle = useMemo(() => {
    if (!targetRect) return undefined;
    const pad = 10;
    return {
      left: targetRect.left - pad,
      top: targetRect.top - pad,
      width: targetRect.width + pad * 2,
      height: targetRect.height + pad * 2,
    } as React.CSSProperties;
  }, [targetRect]);

  if (!current && collapsed) return null;

  return (
    <>
      {/* Spotlight mask — dims the page, cuts a hole around the live upload row */}
      {current && spotlightOn && targetRect && (
        <div
          className="pointer-events-none fixed inset-0 z-[9990]"
          role="presentation"
          aria-hidden="true"
        >
          <div
            className="absolute rounded-xl border-2"
            style={{
              ...spotlightStyle,
              boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.55)',
              borderColor: ACCENT,
              transition: 'all 240ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <span
            className="absolute -top-7 rounded-md px-2 py-0.5 text-[11px] font-bold text-slate-900"
            style={{ left: spotlightStyle?.left, backgroundColor: ACCENT }}
          >
            📍 {t('guide.uploadHere')}
          </span>
        </div>
      )}

      {/* Floating companion panel — bottom-right, above the spotlight mask */}
      <div
        ref={anchorRef}
        className="fixed bottom-4 right-4 z-[9995] w-[min(380px,calc(100vw-2rem))]"
        role="dialog"
        aria-label="DocBridge guide"
      >
        <div
          className="overflow-hidden rounded-2xl border shadow-2xl"
          style={{ borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: NAVY }}>
            <span className="flex h-7 w-7 items-center justify-center rounded-full text-[13px]" style={{ backgroundColor: ACCENT }}>
              🌉
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold leading-tight text-white">DocBridge {t('guide.companion')}</p>
              <p className="text-[11px] leading-tight text-white/70">
                {current ? `${t('guide.step')} ${completedCount + 1} ${t('guide.of')} ${total}` : t('guide.allDone')}
              </p>
            </div>
            {current && (
              <button
                type="button"
                onClick={() => setSpotlightOn((v) => !v)}
                title={t('guide.spotlight')}
                aria-label={t('guide.spotlight')}
                aria-pressed={spotlightOn}
                className="rounded-md px-1.5 py-1 text-[13px] text-white/80 transition hover:bg-white/10"
              >
                {spotlightOn ? '👁' : '🚫'}
              </button>
            )}
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              aria-label={t('guide.collapse')}
              className="rounded-md px-1.5 py-1 text-white/80 transition hover:bg-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          {!collapsed && (
            <div className="p-4">
              {/* Checklist — one row per portal upload slot */}
              <ul className="mb-3 space-y-1.5">
                {steps.map((s, i) => {
                  const isDone = !!done[s.id];
                  const isCurrent = current?.id === s.id;
                  return (
                    <li
                      key={s.id}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] transition"
                      style={{
                        backgroundColor: isCurrent ? '#FFFBEB' : 'transparent',
                        border: isCurrent ? `1px solid ${ACCENT}55` : '1px solid transparent',
                      }}
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: isDone ? '#059669' : isCurrent ? ACCENT : '#CBD5E1' }}
                      >
                        {isDone ? '✓' : i + 1}
                      </span>
                      <span className={isDone ? 'text-slate-400 line-through' : isCurrent ? 'font-bold text-slate-900' : 'text-slate-600'}>
                        {s.label}
                      </span>
                      {isCurrent && <span className="ml-auto text-[10px] font-bold uppercase tracking-wider" style={{ color: '#B45309' }}>{t('guide.now')}</span>}
                    </li>
                  );
                })}
              </ul>

              {/* Active step — the DocBridge widget rendered inside the overlay */}
              {current && (
                <div className="rounded-xl border bg-white p-3" style={{ borderColor: '#E2E8F0' }}>
                  <p className="mb-2 text-[12px] font-bold" style={{ color: NAVY }}>
                    {t('guide.doNow').replace('{label}', current.label)}
                  </p>
                  <p className="mb-3 text-[11.5px] leading-5 text-slate-500">{current.assistantNote ?? current.requirements}</p>
                  <DocBridgeWidget
                    portalId={portalId}
                    docType={current.id}
                    requirements={current.requirements}
                    onSuccess={() => onStepDone(current.id)}
                    deviceInputId={current.deviceInputId}
                    deviceFile={deviceFiles[current.id] ?? null}
                    onDeviceFileChange={(f) => onDeviceFileChange?.(current.id, f)}
                    captureModes={current.captureModes ? [...current.captureModes] : undefined}
                    assistantNote={current.assistantNote}
                  />
                </div>
              )}

              {/* All-steps-complete nudge */}
              {!current && (
                <div className="rounded-xl p-3" style={{ backgroundColor: '#ECFDF5' }}>
                  <p className="text-[13px] font-bold" style={{ color: '#065F46' }}>✓ {t('guide.allDoneMsg')}</p>
                  <p className="mt-1 text-[12px]" style={{ color: '#047857' }}>{t('guide.allDoneSub')}</p>
                </div>
              )}

              <div className="mt-3">
                <PrivacyBadge />
              </div>
            </div>
          )}
        </div>

        {/* Collapsed pill — reopens the companion */}
        {collapsed && current && (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold text-white shadow-xl"
            style={{ backgroundColor: NAVY }}
          >
            <span aria-hidden="true">🌉</span>
            {t('guide.resume')} ({completedCount}/{total})
            <span
              className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
              style={{ backgroundColor: ACCENT, color: '#1a1a1a' }}
            >
              {completedCount + 1}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
