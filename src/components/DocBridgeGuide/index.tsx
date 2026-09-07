'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import { COLORS } from '@/lib/constants';
import { useLang, voiceLang } from '@/lib/i18n';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { estimateSpeechMs, isVoiceOn } from '@/lib/voice';
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
  /** Fired when a step's optimized document is accepted by the legacy endpoint.
      Carries the processing result so portals can reuse the optimized copy
      (e.g. stamping it into a printable application form). */
  onStepDone: (id: string, result?: any) => void;
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
  /**
   * DigiLocker identity (first name) the widget signs in as. Defaults to the
   * portal persona — override for multi-persona demos sharing one portal.
   */
  vaultUser?: string;
  /**
   * Where the collapsed assist pill parks: 'below' the target (default) or
   * 'topRight' inside it — for dropzone cards where the pill should read as
   * the upload entry point.
   */
  pillAlign?: 'below' | 'topRight';
  /**
   * Optional element id the collapsed pill anchors to (e.g. a slot inside a
   * dropzone card). Spotlight keeps following the upload target; only the
   * pill parks against this anchor, centered beneath it.
   */
  pillTargetId?: string;
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
  vaultUser,
  pillAlign = 'below',
  pillTargetId,
}: DocBridgeGuideProps) {
  const { t, lang } = useLang();
  const guidePortalId = portalId as PortalId;
  const guideCopy = useMemo(() => getGuideCopy(guidePortalId, lang), [guidePortalId, lang]);

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
  const narrating = true;
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const allDoneRef = useRef(false);
  const widgetStateRef = useRef<string>('idle');
  const sourceRef = useRef<string>('');
  const stepIdlePrev = useRef<string>('');
  const [userInteracted, setUserInteracted] = useState(false);
  const [welcomeFired, setWelcomeFired] = useState(false);
  const [readyText, setReadyText] = useState<string | null>(null);
  const [voiceOn, setVoiceOn] = useState<boolean>(() => assistive);
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
    // Assistive: slow-burn spotlight + modal so viewers register the
    // auto-nudge before the modal takes over.
    setPhase('page');
    const t1 = setTimeout(() => setPhase('spotlight'), 2000);
    const t2 = setTimeout(() => setPhase('modal'), 3200);
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

  // Serialize welcome → step: both hooks firing in the same tick makes
  // Chrome drop the pair. The step line waits until the welcome has had
  // time to finish (short beat on later steps where welcome doesn't replay).
  const [stepVoiceReady, setStepVoiceReady] = useState(false);
  useEffect(() => {
    if (!open || !current) return;
    setStepVoiceReady(false);
    const delay = welcomeFired ? 900 : estimateSpeechMs(guideCopy.welcome) + 700;
    const timer = setTimeout(() => setStepVoiceReady(true), delay);
    return () => clearTimeout(timer);
  }, [open, current, guideCopy, welcomeFired]);

  useVoiceGuide(
    !!(voiceOn && userInteracted && open && current && stepVoiceReady && stepNarration && stepNarration !== stepIdlePrev.current),
    stepNarration,
    voiceLang(lang),
  );

  // Early ack only (authenticating/parsing) — the overlay owns the
  // processing/submitting readouts, so speaking here too would cut them.
  // Text is guarded: after the final step current is null for one render
  // before unmount, and the unguarded call crashed there.
  const sourcePickedText = !current || !sourceRef.current ? '' : guideCopy.sourcePicked(current, sourceRef.current);
  useVoiceGuide(
    !!(voiceOn && userInteracted && current && open && (widgetPhase === 'parsing' || (widgetPhase as string) === 'authenticating') && sourceRef.current),
    sourcePickedText,
    voiceLang(lang),
  );

  // After optimization finishes (widget enters previewing), narrate a delayed
  // 'ready to upload' line so the optimizing readout is not cut short.
  // The hook itself stays at component top-level; only the timing is deferred.
  useEffect(() => {
    if (!current || !open || widgetPhase !== 'previewing') {
      if (widgetPhase === 'success' || widgetPhase === 'idle') setReadyText(null);
      return;
    }
    const delayed = setTimeout(() => setReadyText(guideCopy.readyToUpload(current!)), 2600);
    return () => clearTimeout(delayed);
  }, [current, open, widgetPhase, guideCopy]);

  useVoiceGuide(
    !!(voiceOn && userInteracted && readyText),
    readyText ?? '',
    voiceLang(lang),
  );

  // Keep stepIdlePrev in sync only when narration could actually play — so a
  // blocked first attempt (no user gesture yet) retries after the first click
  // instead of going silent for the whole modal.
  useEffect(() => {
    if (voiceOn && userInteracted && open && stepVoiceReady) stepIdlePrev.current = stepNarration;
  }, [stepNarration, voiceOn, userInteracted, open, stepVoiceReady]);

  useEffect(() => {
    if (open && !!current && voiceOn && userInteracted) setWelcomeFired(true);
  }, [open, current, voiceOn, userInteracted]);

  // Voice opt-in is persisted under the same key the widget/overlay check, so
  // the guide and the widget share one switch. The modal header exposes this
  // for assistive launches (e.g. EPFO KYC) where the citizen otherwise has no
  // in-screen way to enable narration before the modal opens.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const v = localStorage.getItem('docbridge-voice');
      if (v === '1') setVoiceOn(true);
      else if (v === '0') setVoiceOn(false);
      else setVoiceOn(assistive);
    } catch { setVoiceOn(assistive); }
  }, [assistive]);
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
            🌉 DocBridge Assist
          </span>            </div>
      )}

      {/* Dotted connector between modal and upload target — removed: it
          lingered distractingly on minimize/dismiss. Spotlight remains. */}

      {phase === 'modal' && (
        <div
          className="fixed inset-0 z-[9995] flex items-center justify-center overflow-y-auto p-4"
          role="dialog"
          aria-modal="true"
          aria-label="DocBridge guide"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (widgetPhase !== 'idle' && (widgetPhase as string) !== 'success') return;
              setPhase('dismissed');
              setSpotlightOn(false);
            }
          }}
        >
          <div
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
              <button
                type="button"
                onClick={() => setVoiceOn((v) => !v)}
                title={voiceOn ? t('ov.voiceOn') : t('ov.voiceOff')}
                aria-label={voiceOn ? t('ov.voiceOn') : t('ov.voiceOff')}
                aria-pressed={voiceOn}
                className="rounded-md px-1.5 py-1 text-[13px] transition hover:bg-white/10"
                style={{ color: voiceOn ? '#ffd9a0' : 'rgba(255,255,255,0.7)' }}
              >
                {voiceOn ? '🔊' : '🔈'}
              </button>
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
                  <p className="mb-3 text-xs leading-5 text-slate-500">{current.assistantNote ?? `${t('guide.rules')}: ${current.requirements}`}</p>
                  <DocBridgeWidget
                    portalId={portalId}
                    docType={current.id}
                    requirements={current.requirements}
                    onSuccess={(res: any) => onStepDone(current.id, res?.result)}
                    digiLockerUser={vaultUser}
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
        <PillButton
          pillAlign={pillAlign}
          pillTargetId={pillTargetId}
          targetRect={targetRect}
          onOpen={() => {
            setSpotlightOn(true);
            setPhase('modal');
          }}
        />
      )}
    </>
  );
}

function PillButton({ pillAlign, pillTargetId, targetRect, onOpen }: {
  pillAlign: 'below' | 'topRight';
  pillTargetId?: string;
  targetRect: DOMRect;
  onOpen: () => void;
}) {
  // Optional in-card anchor (measured at render): the pill parks centered
  // beneath it. Falls back to the upload target rect when absent.
  const anchor = pillTargetId && typeof document !== 'undefined'
    ? document.getElementById(pillTargetId)?.getBoundingClientRect() ?? null
    : null;
  const rect = anchor ?? targetRect;
  const left = anchor
    ? rect.left + rect.width / 2 - 86
    : pillAlign === 'topRight'
      ? rect.left + rect.width / 2 - 86
      : rect.left;
  const top = anchor
    ? rect.top
    : pillAlign === 'topRight'
      ? rect.top - 17
      : rect.bottom + 4;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Open DocBridgeAssist"
      className="fixed z-[9995] flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-left text-[11px] font-bold text-white shadow-md"
      style={{
        left: Math.min(Math.max(left, 16), Math.max(16, window.innerWidth - 172)),
        top: Math.min(Math.max(top, 12), window.innerHeight - 34),
        backgroundColor: NAVY,
        borderColor: `${ACCENT}33`,
      }}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]" style={{ backgroundColor: ACCENT }}>
        🌉
      </span>
      <span className="min-w-0">
        <span className="block whitespace-nowrap leading-tight text-white">DocBridgeAssist</span>
      </span>
    </button>
  );
}
