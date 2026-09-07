'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import { COLORS } from '@/lib/constants';
import { useLang, voiceLang } from '@/lib/i18n';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { isVoiceOn } from '@/lib/voice';
import { getGuideCopy, PortalId } from '@/lib/guideNarration';

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
  /**
   * Interaction mode.
   * 'passive' = anchored pill near upload only, no auto-scroll/launch (pros).
   * 'assistive' = auto spotlight + auto modal + gentle scroll (elderly / needy).
   * 'auto' resolves via userSegment; no segment = legacy auto-launch so untouched portals stay intact.
   */
  assistMode?: 'passive' | 'assistive' | 'auto';
  /**
   * Coarse non-PII demographics hint sent by the portal. Never name/phone/DOB —
   * only segment flags like { isElderly: true } so DocBridge can adapt.
   */
  userSegment?: { isElderly?: boolean; needsAssistance?: boolean; firstTime?: boolean };
}

const ACCENT = '#F59E0B';
const NAVY = '#0A2540';

export default function DocBridgeGuide({
  portalId,
  steps,
  done,
  onStepDone,
  onAllDone,
  deviceFiles = {},
  onDeviceFileChange,
  assistMode = 'auto',
  userSegment,
}: DocBridgeGuideProps) {
  const { t, lang } = useLang();
  const guidePortalId = portalId as PortalId;
  const guideCopy = useMemo(() => getGuideCopy(guidePortalId), [guidePortalId]);

  // Resolve passive vs assistive. Explicit prop wins; 'auto' adapts to the
  // portal's non-PII segment; no segment = legacy auto-launch (intact).
  const assistive =
    assistMode === 'assistive'
      ? true
      : assistMode === 'passive'
        ? false
        : userSegment
          ? !!(userSegment.isElderly || userSegment.needsAssistance || userSegment.firstTime)
          : true;

  const [phase, setPhase] = useState<'page' | 'spotlight' | 'modal' | 'dismissed'>(() =>
    assistMode === 'passive' ? 'dismissed' : 'page',
  );
  const [spotlightOn, setSpotlightOn] = useState(true);
  const [narrating, setNarrating] = useState(true);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [modalRect, setModalRect] = useState<DOMRect | null>(null);
  const modalCardRef = useRef<HTMLDivElement | null>(null);
  const allDoneRef = useRef(false);
  const widgetStateRef = useRef<string>('idle');
  const sourceRef = useRef<string>('');
  const stepIdlePrev = useRef<string>('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [welcomeFired, setWelcomeFired] = useState(false);
  const [readyText, setReadyText] = useState<string | null>(null);
  const [voiceOn, setVoiceOn] = useState(false);
  const [widgetPhase, setWidgetPhase] = useState<'idle' | 'parsing' | 'processing' | 'previewing' | 'success'>('idle');
  const onWidgetPhase = (phase: string) => {
    if (phase === widgetPhase) return;
    setWidgetPhase(phase as any);
  };
  const open = phase === 'modal';

  const current = useMemo(() => steps.find((s) => !done[s.id]) ?? null, [steps, done]);
  const completedCount = steps.filter((s) => done[s.id]).length;
  const total = steps.length;

  useEffect(() => {
    if (!current) return;
    // Passive: anchored pill near upload, no auto-scroll/launch. Active only on click.
    if (!assistive) {
      setPhase('dismissed');
      setSpotlightOn(false);
      return;
    }
    // Assistive: auto spotlight + auto modal; gentle scroll handled below.
    setPhase('page');
    const t1 = setTimeout(() => setPhase('spotlight'), 1100);
    const t2 = setTimeout(() => setPhase('modal'), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [current?.id, assistive]);

  useEffect(() => {
    if (!current || phase === 'page') {
      if (phase === 'page') setTargetRect(null);
      return;
    }
    const el = document.getElementById(current.deviceInputId);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const update = () => {
      const r = el.getBoundingClientRect();
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
    if (el.parentElement) ro.observe(el.parentElement);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [current, phase]);

  // Assistive only: gentle auto-scroll to the upload row on spotlight/modal.
  // Passive never scrolls — the pill waits near the upload instead.
  useEffect(() => {
    if (!assistive || !current || (phase !== 'spotlight' && phase !== 'modal')) return;
    const el = document.getElementById(current.deviceInputId);
    (el?.parentElement ?? el)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [phase, current?.id, assistive]);

  useEffect(() => {
    if (completedCount === total && total > 0 && !allDoneRef.current) {
      allDoneRef.current = true;
      onAllDone?.();
    }
  }, [completedCount, total, onAllDone]);

  useEffect(() => {
    if (phase !== 'modal' || !current) {
      setModalRect(null);
      return;
    }
    const update = () => setModalRect(modalCardRef.current?.getBoundingClientRect() ?? null);
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

  // Per-site welcome line plays once when the modal opens — only after the
  // citizen has interacted with the page, because browsers block
  // speechSynthesis autoplay before any user gesture. Only when voice is
  // opted in (shared switch with the widget).
  useVoiceGuide(
    voiceOn && userInteracted && open && !!current && !welcomeFired,
    guideCopy.welcome,
    voiceLang(lang),
  );

  // Step-level narration: live whenever the modal is open and the user hasn't
  // muted it. The copy is per-site (EPFO / UPSC / Passport / …).
  // Keep this separate from the welcome line so the welcome is not immediately
  // cut off: only re-speak when the idle line actually changes (new step,
  // mute toggle), not on every modal-open render.
  const stepNarration = useMemo(() => {
    if (!current || !narrating) return '';
    return guideCopy.stepIdle(current!, completedCount + 1, total);
  }, [current, narrating, completedCount, total, guideCopy]);

  useVoiceGuide(
    !!(voiceOn && userInteracted && open && current && stepNarration && stepNarration !== stepIdlePrev.current),
    stepNarration,
    voiceLang(lang),
  );

  // When the widget picks a source (idle→processing or previewing), read the
  // per-site 'source picked' line.
  useVoiceGuide(
    !!(voiceOn && userInteracted && current && open && widgetPhase !== 'idle' && widgetPhase !== 'success' && sourceRef.current),
    guideCopy.sourcePicked(current!, sourceRef.current),
    voiceLang(lang),
  );

  // After optimization finishes (widget enters previewing), narrate a delayed
  // 'ready to upload' line so the optimizing readout is not cut short.
  // The hook itself stays at component top-level; only the timing is deferred.
  useEffect(() => {
    if (!current || !open || widgetPhase !== 'previewing') return;
    const delayed = setTimeout(() => setReadyText(guideCopy.readyToUpload(current!)), 900);
    return () => clearTimeout(delayed);
  }, [current, open, widgetPhase, guideCopy]);

  useVoiceGuide(
    !!(voiceOn && userInteracted && readyText),
    readyText ?? '',
    voiceLang(lang),
  );

  // Keep stepIdlePrev in sync so the step idle hook only re-fires on real
  // content changes (and never on the initial modal-open render).
  useEffect(() => {
    stepIdlePrev.current = stepNarration;
  }, [stepNarration]);

  useEffect(() => {
    if (open && !!current) setWelcomeFired(true);
  }, [open, current]);

  // Voice opt-in is persisted under the same key the widget/overlay check, so
  // the guide and the widget share one switch. The modal header exposes this
  // for assistive launches (e.g. EPFO KYC) where the citizen otherwise has no
  // in-screen way to enable narration before the modal opens.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { setVoiceOn(localStorage.getItem('docbridge-voice') === '1'); } catch {}
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem('docbridge-voice', voiceOn ? '1' : '0'); } catch {}
    if (!voiceOn && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [voiceOn]);

  // Gate voice on the first real user gesture so browsers that block
  // autoplay (no-user-gesture synthesis) still let the guide speak once
  // the citizen taps/clicks anywhere on the page.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onInteract = () => setUserInteracted(true);
    window.addEventListener('click', onInteract);
    window.addEventListener('touchstart', onInteract);
    window.addEventListener('keydown', onInteract);
    return () => {
      window.removeEventListener('click', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('keydown', onInteract);
    };
  }, []);

  useEffect(() => {
    if (!current || !open) return;
    const stop = () => {
      setNarrating(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
        setTimeout(() => window.speechSynthesis.cancel(), 0);
      }
    };
    const unsub = () => stop();
    window.addEventListener('beforeunload', unsub);
    return () => {
      unsub();
      window.removeEventListener('beforeunload', unsub);
    };
  }, [open, current]);

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

  if (!current && phase === 'page') return null;

  const spotlightVisible = current && (phase === 'spotlight' || phase === 'modal') && spotlightOn && targetRect;

  return (
    <>
      {spotlightVisible && (
        <div
          className="pointer-events-none fixed inset-0 z-[9990]"
          role="presentation"
          aria-hidden="true"
          style={{
            opacity: phase === 'modal' ? 0.45 : 1,
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
          </span>            </div>
      )}

      {phase === 'modal' && targetRect && modalRect && (() => {
        const startX = modalRect.left + modalRect.width / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top;
        const goingDown = endY < modalRect.top;
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

      {phase === 'modal' && (
        <div
          className="fixed inset-0 z-[9995] flex items-center justify-center overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
          aria-label="DocBridge guide"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setPhase('dismissed');
              setSpotlightOn(false);
            }
          }}
        >
          <div
            ref={modalCardRef}
            className="relative flex max-h-[min(86vh,780px)] w-full max-w-2xl flex-col animate-[modalIn_560ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-2xl border border-white/50 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.3)]"
          >
            <div className="flex shrink-0 items-center gap-2.5 px-5 py-3" style={{ backgroundColor: NAVY }}>
              <span className="flex h-7 w-7 items-center justify-center rounded-full text-[13px]" style={{ backgroundColor: ACCENT }}>
                🌉
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold leading-tight text-white">DocBridge Assist</p>
                <p className="text-[11px] leading-tight text-white/70">
                  {current ? `${t('guide.step')} ${completedCount + 1} ${t('guide.of')} ${total}` : t('guide.allDone')}
                </p>
              </div>
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
              {assistive && (
                <button
                  type="button"
                  onClick={() => setVoiceOn((v) => !v)}
                  title={voiceOn ? t('ov.voiceOn') : t('ov.voiceOff')}
                  aria-pressed={voiceOn}
                  className="rounded-md px-1.5 py-1 text-[13px] transition hover:bg-white/10"
                  style={{ color: voiceOn ? '#ffd9a0' : 'rgba(255,255,255,0.7)' }}
                >
                  {voiceOn ? '🔊' : '🔈'}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setPhase('dismissed');
                  setSpotlightOn(false);
                }}
                aria-label={t('guide.collapse')}
                className="rounded-md px-1.5 py-1 text-[13px] text-white/80 transition hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
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
                    widgetStateRef={widgetStateRef}
                    sourceRef={sourceRef}
                    onWidgetPhase={onWidgetPhase}
                  />
                </div>
              )}

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
            </div>
          </div>            </div>
      )}

      {phase === 'dismissed' && current && targetRect && (
        <button
          type="button"
          onClick={() => {
            setSpotlightOn(true);
            setPhase('modal');
          }}
          aria-label={`Reopen DocBridgeAssist for ${current.label}`}
          className="fixed z-[9995] flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-left text-[11px] font-bold text-white shadow-md"
          style={{
            left: Math.min(Math.max(targetRect.left, 16), Math.max(16, window.innerWidth - 172)),
            top: Math.min(Math.max(targetRect.bottom + 4, 12), window.innerHeight - 34),
            backgroundColor: NAVY,
            borderColor: `${ACCENT}33`,
          }}
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]" style={{ backgroundColor: ACCENT }}>
            🌉
          </span>
          <span className="min-w-0">
            <span className="block leading-tight text-white">DocBridgeAssist</span>
            <span className="block text-[9px] leading-tight text-white/60">{current.label}</span>
          </span>
        </button>
      )}
    </>
  );
}
