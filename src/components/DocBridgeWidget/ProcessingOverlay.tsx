'use client';

import { useState } from 'react';
import { WidgetState } from '@/types';
import { COLORS } from '@/lib/constants';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { useLang, voiceLang } from '@/lib/i18n';

interface ProcessingOverlayProps {
  state: WidgetState;
  source?: 'digilocker' | 'device';
}

// The three moments we narrate while a document is worked on.
// authenticating/parsing = accessing the file · processing = AI compression ·
// submitting = seamless handoff to the portal.

function currentStep(state: WidgetState): number {
  if (state === 'authenticating' || state === 'parsing') return 0;
  if (state === 'processing') return 1;
  return 2; // submitting
}

function stepIcon(state: WidgetState): React.ReactNode {
  if (state === 'authenticating') {
    return (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    );
  }
  if (state === 'parsing' || state === 'processing') {
    return (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function ProcessingOverlay({ state, source = 'digilocker', portalId }: ProcessingOverlayProps & { portalId?: string }) {
  const { t, lang } = useLang();
  const active = currentStep(state);
  const portalLabel = portalId === 'epfo' ? 'EPFO' : portalId === 'vahan' ? 'Sarathi' : portalId === 'upsc' ? 'UPSC' : portalId === 'passport' ? 'Passport Seva' : portalId === 'ssc' ? 'SSC' : portalId === 'nsp' ? 'NSP' : 'portal';
  const voiceText = state === 'parsing' ? `${t('ov.reading')} ${portalLabel}` : state === 'processing' ? `${t('ov.optimizingFor')} ${portalLabel}` : state === 'submitting' ? t('ov.submitting') : '';
  const [voiceOn, setVoiceOn] = useState(() => typeof window !== 'undefined' && localStorage.getItem('docbridge-voice') === '1');
  useVoiceGuide(voiceOn && !!voiceText, voiceText, voiceLang(lang));
  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    try { localStorage.setItem('docbridge-voice', next ? '1' : '0'); } catch {}
    if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  };
  const portalHint = portalId === 'epfo' ? 'PDF ≤500KB' : portalId === 'vahan' ? 'JPEG 10–20KB' : portalId === 'upsc' ? 'JPEG 20–200KB' : portalId === 'passport' ? 'JPEG 630×810' : portalId === 'ssc' ? 'JPEG 200×230' : portalId === 'nsp' ? 'JPEG + PDF' : '';

  const STEPS: { label: string; tag?: string; sub?: string }[] = state === 'submitting'
    ? [
        { label: source === 'device' ? t('ov.fileReady') : t('ov.fetched'), sub: t('ov.verified') },
        { label: `${t('ov.optimizingFor')} ${portalLabel}`, sub: portalHint, tag: 'AI' },
        { label: t('ov.validSubmit'), sub: t('ov.almost') },
      ]
    : [
        { label: source === 'device' ? t('ov.fileAdded') : t('ov.fetching'), sub: source === 'device' ? t('ov.localFile') : t('ov.consent') },
        { label: `${t('ov.optimizingFor')} ${portalLabel}…`, sub: portalHint, tag: 'AI' },
        { label: t('ov.validating'), sub: t('ov.checkFormat') },
      ];

  return (
    <div
      className="p-8 rounded-lg overflow-hidden"
      style={{ backgroundColor: COLORS.gray[50], border: `1px solid ${COLORS.gray[200]}` }}
    >
      {/* Soft tricolor accent */}
      <div className="flex h-1 -mt-8 -mx-8 mb-6 opacity-90" aria-hidden="true">
        <div className="flex-1" style={{ backgroundColor: COLORS.saffron }} />
        <div className="flex-1 border-x" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray[200] }} />
        <div className="flex-1" style={{ backgroundColor: COLORS.green }} />
      </div>

      {/* Animated spinner */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{ border: `4px solid ${COLORS.gray[200]}`, borderTopColor: COLORS.saffron }}
        />
        <div
          className="absolute inset-2 rounded-full animate-spin"
          style={{ border: `4px solid ${COLORS.gray[100]}`, borderTopColor: COLORS.success, animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center" style={{ color: COLORS.primary }}>
          {stepIcon(state)}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 text-center" style={{ color: COLORS.gray[800] }}>
        {state === 'parsing' ? t('ov.reading') : state === 'processing' ? `${t('ov.optimizingFor')} ${portalLabel}…` : state === 'submitting' ? t('ov.submitting') : t('ov.working')}
      </h3>
      <div className="mx-auto mb-3 flex justify-center gap-2">
        <button type="button" onClick={toggleVoice} aria-pressed={voiceOn} className="rounded-full border px-2.5 py-1 text-[10px] font-bold" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[600] }}>{voiceOn ? t('ov.voiceOn') : t('ov.voiceOff')}</button>
      </div>
      <div className="mx-auto mb-4 h-1.5 max-w-sm overflow-hidden rounded-full" style={{ backgroundColor: COLORS.gray[200] }} aria-hidden="true">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${((active + 1) / 3) * 100}%`, background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.primary}, ${COLORS.success})` }} />
      </div>

      {/* Narrated steps */}
      <div className="mx-auto mt-6 max-w-sm space-y-3">
        {STEPS.map((step, index) => {
          const complete = index < active;
          const isActive = index === active;
          return (
            <div
              key={index}
              className="flex items-center gap-3 transition-all duration-500"
              style={{
                opacity: isActive || complete ? 1 : 0.45,
              }}
            >
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm transition-colors duration-500"
                style={{
                  backgroundColor: complete ? COLORS.success : isActive ? COLORS.primary : COLORS.gray[200],
                  color: complete || isActive ? COLORS.white : COLORS.gray[500],
                }}
              >
                {complete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : isActive ? (
                  <span className="block h-2.5 w-2.5 animate-pulse rounded-full" style={{ backgroundColor: COLORS.white }} />
                ) : (
                  index + 1
                )}
              </div>

              <span className="text-sm font-medium leading-tight" style={{ color: COLORS.gray[800] }}>
                {step.label}
                {step.tag && (
                  <span
                    className="ml-2 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                    style={{ backgroundColor: COLORS.saffronLight, color: COLORS.saffronDark }}
                  >
                    {step.tag}
                  </span>
                )}
                {step.sub && <span className="ml-2 text-xs font-normal" style={{ color: COLORS.gray[500] }}>{step.sub}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
