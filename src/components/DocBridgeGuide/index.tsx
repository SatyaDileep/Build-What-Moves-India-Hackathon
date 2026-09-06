'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
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
 * Sequencing matters: the user first sees the portal's own upload screen
 * untouched (1.1s), the spotlight then fades in over the active "Choose File"
 * row (600ms), and only after that does the guide modal rise into place.
 * The modal keeps a compact, balanced footprint (max-w-2xl, capped height)
 * so the page behind it stays visible. Detection is the step array + the DOM
 * ids of the portal's real file inputs — the same contract the Chrome
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
  // Phases: 'page' (portal alone) → 'spotlight' (area highlighted) → 'modal' (guide up)
  // 'dismissed' = modal closed: NO dim/spotlight, just a small pill anchored
  // above the upload area so the page returns to normal.
  const [phase, setPhase] = useState<'page' | 'spotlight' | 'modal' | 'dismissed'>('page');
  const [spotlightOn, setSpotlightOn] = useState(true);
  const [narrating, setNarrating] = useState(true);
  const setPlayWelcomeOnce = (v: boolean) => {};
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [modalRect, setModalRect] = useState<DOMRect | null>(null);
  const modalCardRef = useRef<HTMLDivElement | null>(null);
  const allDoneRef = useRef(false);
  const open = phase === 'modal';

  const current = useMemo(() => steps.find((s) => !done[s.id]) ?? null, [steps, done]);
  const completedCount = steps.filter((s) => done[s.id]).length;
  const total = steps.length;

  // Let the upload screen breathe first, then spotlight the row, then open.
  useEffect(() => {
    if (!current) return;
    setPhase('page');
    const t1 = setTimeout(() => setPhase('spotlight'), 1100);
    const t2 = setTimeout(() => setPhase('modal'), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep tracking the upload row even while dismissed so the anchor pill can
  // float just above it.
  useEffect(() => {
    if (phase !== 'dismissed' || !current) return;
    const el = document.getElementById(current.deviceInputId);
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      const rect = r.width === 0 || r.height === 0 ? el.parentElement?.getBoundingClientRect() ?? null : r;
      setTargetRect(rect);
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
  }, [phase, current]);

  // Track the active slot's native "Choose File" row so the spotlight can
  // cut a hole around the real portal UI behind the modal.
  useEffect(() => {
    if (!current || !spotlightOn || phase === 'page') {
      if (phase !== 'page') setTargetRect(null);
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
  }, [current, spotlightOn, phase]);

  useEffect(() => {
    if (completedCount === total && total > 0 && !allDoneRef.current) {
      allDoneRef.current = true;
      onAllDone?.();
    }
  }, [completedCount, total, onAllDone]);

  // Track the modal card's own rect so the dotted connector can reach from
  // the modal edge to the spotlighted upload area.
  useEffect(() => {
    if (phase !== 'modal' || !current) {
      setModalRect(null);
      return;
    }
    const update = () => setModalRect(modalCardRef.current?.getBoundingClientRect() ?? null);
    // One frame after render so the card has laid out.
    const raf = requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    if (modalCardRef.current) ro.observe(modalCardRef.current);
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [phase, current]);

  // Welcome line plays once when the modal opens (subtle, one sentence);
  // step details only when the user taps the 🔈 toggle.
  useVoiceGuide(
    open && !!current,
    t('guide.welcome'),
    voiceLang(lang),
  );
  useVoiceGuide(
    narrating && !!current && open,
    current ? `${t('guide.step')} ${completedCount + 1} ${t('guide.of')} ${total}: ${current.label}. ${current.assistantNote ?? current.requirements}` : '',
    voiceLang(lang),
  );
  useEffect(() => {
    if (!narrating) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [narrating]);

  // Closing the modal (or leaving the upload step entirely) must silence any
  // running narration — the user walked away, the guide stops talking.
  useEffect(() => {
    if (phase === 'modal') return;
    setNarrating(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      window.speechSynthesis.cancel();
    }
  }, [phase]);

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

  // Fully complete and dismissed — nothing left to show.
  if (!current && phase === 'page') return null;

  const spotlightVisible = current && phase !== 'page' && spotlightOn && targetRect;

  return (
    <>
      {/* Spotlight mask — fades in over the live upload row before the modal */}
      {spotlightVisible && (
        <div
          className="pointer-events-none fixed inset-0 z-[9990]"
          role="presentation"
          aria-hidden="true"
          style={{
            opacity: phase === 'modal' ? 0.85 : 1,
            transition: 'opacity 600ms ease',
          }}
        >
          <div
            className="absolute rounded-xl"
            style={{
              ...spotlightStyle,
              boxShadow: `0 0 0 9999px rgba(2, 6, 23, ${phase === 'modal' ? '0.45' : '0.3'}), 0 0 0 2px ${ACCENT}`,
              border: `2px solid ${ACCENT}`,
              transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <span
            className="absolute rounded-md px-2 py-0.5 text-[11px] font-bold text-slate-900"
            style={{
              left: spotlightStyle?.left,
              top: `calc(${spotlightStyle?.top ?? 0}px - 26px)`,
              backgroundColor: ACCENT,
              opacity: phase === 'spotlight' ? 1 : 0,
              transition: 'opacity 400ms ease 300ms',
            }}
          >
            📍 {t('guide.uploadHere')}
          </span>
        </div>
      )}

      {/* Dotted connector — a subtle dotted line linking the modal to
          the spotlighted upload row, so the eye travels modal → target. */}
      {phase === 'modal' && targetRect && modalRect && (() => {
        const startX = modalRect.left + modalRect.width / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top;
        const goingDown = endY < modalRect.top; // target above modal
        const p1 = goingDown ? { x: startX, y: modalRect.top } : { x: startX, y: modalRect.bottom };
        const p2 = goingDown ? { x: endX, y: endY + 14 } : { x: endX, y: endY - 6 };
        const ctrlX = (p1.x + p2.x) / 2 + (p2.x > p1.x ? 60 : -60);
        const ctrlY = (p1.y + p2.y) / 2;
        return (
          <svg
            className="pointer-events-none fixed inset-0 z-[9992]"
            width="100%"
            height="100%"
            aria-hidden="true"
          >
            <path
              d={`M ${p1.x} ${p1.y} Q ${ctrlX} ${ctrlY} ${p2.x} ${p2.y}`}
              fill="none"
              stroke={ACCENT}
              strokeWidth={2.5}
              strokeDasharray="7 7"
              strokeLinecap="round"
            />
            {/* Arrowhead at the target end */}
            <polygon
              points={
                goingDown
                  ? `${p2.x - 7},${p2.y - 12} ${p2.x + 7},${p2.y - 12} ${p2.x},${p2.y + 2}`
                  : `${p2.x - 7},${p2.y + 12} ${p2.x + 7},${p2.y + 12} ${p2.x},${p2.y - 2}`
              }
              fill={ACCENT}
            />
          </svg>
        );
      })()}

      {/* Centered guide modal — compact, balanced footprint */}
      {phase === 'modal' && (
        <div
          className="fixed inset-0 z-[9995] flex items-center justify-center overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
          aria-label="DocBridge guide"
          onClick={(e) => e.target === e.currentTarget && setPhase('dismissed')}
        >
          <div
            ref={modalCardRef}
            className="relative flex max-h-[min(86vh,780px)] w-full max-w-2xl flex-col animate-[modalIn_560ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-2xl border border-white/50 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.3)]"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-2.5 px-5 py-3" style={{ backgroundColor: NAVY }}>
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
              {current && (
                <button
                  type="button"
                  onClick={() => setNarrating((v) => !v)}
                  title={t('guide.narrate')}
                  aria-label={t('guide.narrate')}
                  aria-pressed={narrating}
                  className="rounded-md px-1.5 py-1 text-[13px] text-white/80 transition hover:bg-white/10"
                >
                  {narrating ? '🔊' : '🔈'}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSpotlightOn((v) => !v)}
                title={t('guide.toggleHighlight')}
                aria-label={t('guide.toggleHighlight')}
                aria-pressed={spotlightOn}
                className="rounded-md px-1.5 py-1 text-[13px] text-white/80 transition hover:bg-white/10"
              >
                {spotlightOn ? '👁' : '🚫'}
              </button>
            </div>

            {/* Scrollable body — checklist as a horizontal strip, widget below */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {/* Compact checklist strip — horizontal on wide screens */}
              <ul className="mb-3 flex gap-2 overflow-x-auto sm:flex-nowrap">
                {steps.map((s, i) => {
                  const isDone = !!done[s.id];
                  const isCurrent = current?.id === s.id;
                  return (
                    <li
                      key={s.id}
                      className="flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] transition"
                      style={{
                        backgroundColor: isCurrent ? '#FFFBEB' : '#F8FAFC',
                        border: isCurrent ? `1px solid ${ACCENT}55` : '1px solid #E2E8F0',
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
                    </li>
                  );
                })}
              </ul>

              {/* Active step — the DocBridge widget rendered inside the modal */}
              {current && (
                <div className="rounded-xl border bg-white p-3.5" style={{ borderColor: '#E2E8F0' }}>
                  <p className="mb-1.5 text-[13px] font-bold" style={{ color: NAVY }}>
                    {t('guide.doNow').replace('{label}', current.label)}
                  </p>
                  <p className="mb-3 text-xs leading-5 text-slate-500">{current.assistantNote ?? current.requirements}</p>
                  <DocBridgeWidget
                    portalId={portalId}
                    docType={current.id}
                    requirements={current.requirements}
                    onSuccess={() => onStepDone(current.id)}
                    deviceFile={deviceFiles[current.id] ?? null}
                    onDeviceFileChange={(f) => onDeviceFileChange?.(current.id, f)}
                    captureModes={current.captureModes ? [...current.captureModes] : undefined}
                    assistantNote={current.assistantNote}
                  />
                </div>
              )}

              {/* All-steps-complete state */}
              {!current && (
                <div className="rounded-xl p-4" style={{ backgroundColor: '#ECFDF5' }}>
                  <p className="text-sm font-bold" style={{ color: '#065F46' }}>✓ {t('guide.allDoneMsg')}</p>
                  <p className="mt-1 text-[13px]" style={{ color: '#047857' }}>{t('guide.allDoneSub')}</p>
                  <button
                    type="button"
                    onClick={() => setPhase('page')}
                    className="mt-3 rounded-full px-4 py-1.5 text-xs font-bold text-white"
                    style={{ backgroundColor: '#059669' }}
                  >
                    {t('guide.closeDone')}
                  </button>
                </div>
              )}

              {/* PrivacyBadge: the DocBridgeWidget idle state already renders one,
                  so no second badge here — it was duplicating. */}
            </div>
          </div>
        </div>
      )}      {/* Dismissed anchor — label above says "DocBridge Assist", sits top-right
          of the upload area so it's clearly guiding/clickable on the page. */}
      {phase === 'dismissed' && current && targetRect && (
        <button
          type="button"
          onClick={() => setPhase('modal')}
          className="fixed z-[9995] flex items-center gap-2 rounded-xl border px-4 py-2 text-[13px] font-bold text-white shadow-xl"
          style={{
            right: targetRect.right - (window.innerWidth - targetRect.right) > 60 ? 16 : targetRect.right,
            top: Math.min(targetRect.top, window.innerHeight - 72),
            backgroundColor: NAVY,
          }}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px]" style={{ backgroundColor: ACCENT }}>
            🌉
          </span>
          <span className="min-w-0">
            <span className="block leading-tight text-white">DocBridge Assist — {completedCount}/{total}</span>
            <span className="block text-[10px] leading-tight text-white/70">{current.label}</span>
          </span>
          <span
            className="ml-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold"
            style={{ backgroundColor: ACCENT, color: '#1a1a1a' }}
          >
            {completedCount + 1}
          </span>
        </button>
      )}</>
  );
}
