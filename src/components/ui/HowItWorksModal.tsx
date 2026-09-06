'use client';

import { useEffect, useRef, useState } from 'react';
import { LanguageToggle, useLang, voiceLang } from '@/lib/i18n';

interface Step {
  num: string;
  icon: string;
  key: string;
  narrationKey: string;
  bullets?: string[];
}

const STEPS: Step[] = [
  {
    num: '1',
    icon: '🔐',
    key: 'how.step1',
    narrationKey: 'how.step1Narration',
    bullets: ['how.step1Way1', 'how.step1Way2'],
  },
  {
    num: '2',
    icon: '🤖',
    key: 'how.step2',
    narrationKey: 'how.step2Narration',
  },
  {
    num: '3',
    icon: '✅',
    key: 'how.step3',
    narrationKey: 'how.step3Narration',
  },
] as const;

function speak(text: string, lang: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 1.08;
  window.speechSynthesis.speak(u);
}

// Full spoken text for a step: narration line + bullet points. Bullets are
// part of the script (step 1's two ways), so they must be read aloud too.
function stepScript(step: Step, t: (k: string) => string): string {
  const parts = [t(step.narrationKey)];
  if (step.bullets) parts.push(...step.bullets.map((b) => t(b)));
  return parts.join('. ');
}

export default function HowItWorksModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useLang();
  const [active, setActive] = useState(0);
  const activeStep = STEPS[active] ?? STEPS[0]!;
  const [done, setDone] = useState(false);
  const [narrating, setNarrating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [voiceAvailable, setVoiceAvailable] = useState(false);

  useEffect(() => {
    setVoiceAvailable(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // Reset on open. Narration is ON by default — the walkthrough is explicitly
  // triggered by the user, so it opens already speaking step 1. The per-step
  // narration effect below performs the actual speak once narrating flips true.
  useEffect(() => {
    if (open) {
      setActive(0);
      setDone(false);
      setNarrating(voiceAvailable);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // Chrome quirk: pause-then-cancel on the next tick actually stops a
        // just-started utterance; a bare cancel() can leave it speaking.
        window.speechSynthesis.pause();
        setTimeout(() => window.speechSynthesis.cancel(), 0);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Auto-advance paced by the narration length (min 5s, +70ms/char) so each
  // step can be read (and heard) fully — but stops at the last step.
  useEffect(() => {
    if (!open || done) return;
    const step = STEPS[active];
    const narration = stepScript(step, t);
    const baseMs = 3200 + narration.length * 48;
    timerRef.current = setTimeout(() => {              if (active < STEPS.length - 1) {
                setActive((a: number) => a + 1);
              } else {
                setDone(true);
              }
    }, baseMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, active, done, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Voice narration when toggled on.
  useEffect(() => {
    if (!open || !narrating) return;
    speak(stepScript(STEPS[active], t), voiceLang(lang));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, narrating, active, lang]);

  if (!open) return null;

  const handleNarrationToggle = () => {
    const next = !narrating;
    setNarrating(next);
    if (next) {
      // Fresh narration run: restart from step 1.
      setDone(false);
      setActive(0);
      speak(stepScript(STEPS[0], t), voiceLang(lang));
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#0f172a]/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t('how.title')}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-3xl animate-[modalIn_420ms_cubic-bezier(0.16,1,0.3,1)] rounded-2xl border border-white/50 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.3)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('how.eyebrow')}</p>
            <h2 className="mt-1.5 pr-6 text-xl font-bold tracking-tight text-[#1E3A8A] sm:text-2xl">{t('how.title')}</h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Horizontal track */}
        <div className="relative mt-9">
          {/* Track line */}
          <div className="absolute left-0 right-0 top-[30px] h-1 rounded-full bg-slate-200" aria-hidden="true">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#138808] via-[#EA580C] to-[#1E3A8A] transition-all duration-1000 ease-in-out"
              style={{ width: `${(active / (STEPS.length - 1)) * 100}%` }}
            />
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex flex-col items-center text-center">
                {/* Station node with step number badge */}
                <div
                  className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-3xl shadow-md transition-all duration-500"
                  style={{
                    backgroundColor: i === active ? '#fff' : '#F1F5F9',
                    borderColor: i === active ? '#EA580C' : '#CBD5E1',
                    transform: i === active ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: i === active ? '0 8px 24px rgba(234,88,12,0.25)' : undefined,
                  }}
                  aria-hidden="true"
                >
                  {s.icon}
                  <span
                    className="absolute -left-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow"
                    style={{ backgroundColor: i === active ? '#EA580C' : '#64748B', color: '#fff' }}
                  >
                    {s.num}
                  </span>
                </div>
                <p
                  className={`mt-3 text-sm leading-6 ${i === active ? 'font-extrabold text-[#1E3A8A]' : 'font-semibold text-slate-500'}`}
                >
                  {t(s.key)}
                </p>
              </div>
            ))}
          </div>

          {/* Persistent description panel — always visible, swaps content per step */}
          <div
            className="mt-5 rounded-xl border-2 px-5 py-4 transition-colors duration-300"
            style={{ borderColor: '#FDBA74', backgroundColor: '#FFF7ED' }}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white"
                style={{ backgroundColor: '#EA580C' }}
                aria-hidden="true"
              >
                {STEPS[active].num}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-6 text-slate-800 sm:text-[15px]">
                  {t(STEPS[active].narrationKey)}
                </p>
                {STEPS[active].bullets && (
                  <ul className="mt-2 space-y-1.5">
                    {STEPS[active].bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#EA580C' }} aria-hidden="true" />
                        <span className="font-semibold">{t(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setDone(false); setActive(i); }}
                aria-label={`Step ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{ width: i === active ? 24 : 8, backgroundColor: i === active ? '#EA580C' : '#CBD5E1' }}
              />
            ))}
            {done && (
              <button
                type="button"
                onClick={() => { setDone(false); setActive(0); }}
                className="ml-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition"
                style={{ backgroundColor: '#fff', color: '#1E3A8A', borderColor: '#CBD5E1' }}
              >
                <span aria-hidden="true">🔁</span> {t('how.hearAgain')}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {voiceAvailable && (
              <button
                type="button"
                onClick={handleNarrationToggle}
                aria-pressed={narrating}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition"
                style={
                  narrating
                    ? { backgroundColor: '#1E3A8A', color: '#fff', borderColor: '#1E3A8A' }
                    : { backgroundColor: '#fff', color: '#1E3A8A', borderColor: '#CBD5E1' }
                }
              >
                <span aria-hidden="true">{narrating ? '🔊' : '🔈'}</span>
                {narrating ? t('how.narrationOn') : t('how.narrationOff')}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#EA580C] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#C2410C]"
            >
              {t('how.gotIt')}
            </button>
          </div>
        </div>

        {/* Privacy line */}
        <p className="mt-3 text-center text-[11px] leading-5 text-slate-500">{t('how.privacy')}</p>
      </div>
    </div>
  );
}

// Reusable pill trigger — placed next to nudge CTAs.
export function HowItWorksTrigger({ onClick, tone = 'link' }: { onClick: () => void; tone?: 'link' | 'chip' }) {
  const { t } = useLang();
  if (tone === 'chip') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#1E3A8A]/25 bg-white px-3 py-1.5 text-xs font-bold text-[#1E3A8A] shadow-sm transition hover:-translate-y-0.5 hover:shadow"
      >
        <span aria-hidden="true">🛈</span> {t('how.trigger')}
      </button>
    );
  }
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 font-bold underline hover:no-underline" style={{ color: '#1E3A8A' }}>
      <span aria-hidden="true">🛈</span> {t('how.trigger')}
    </button>
  );
}
