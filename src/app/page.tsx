'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import TricolorBar from '@/components/ui/TricolorBar';
import { LanguageToggle, useLang } from '@/lib/i18n';

const steps: [string, string, string][] = [
  ['01', 'home.s1t', 'home.s1d'],
  ['02', 'home.s2t', 'home.s2d'],
  ['03', 'home.s3t', 'home.s3d'],
  ['04', 'home.s4t', 'home.s4d'],
];

const principles: [string, string][] = [
  ['home.pr1t', 'home.pr1d'],
  ['home.pr2t', 'home.pr2d'],
  ['home.pr3t', 'home.pr3d'],
];

const audiences: [string, string][] = [
  ['home.aud1t', 'home.aud1d'],
  ['home.aud2t', 'home.aud2d'],
  ['home.aud3t', 'home.aud3d'],
];

export default function Home() {
  const { t } = useLang();
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [portalNav, setPortalNav] = useState<string | null>(null);

  useEffect(() => {
    if (!isPortalModalOpen) return;
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && !portalNav && setIsPortalModalOpen(false);
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [isPortalModalOpen, portalNav]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FDFBF7] text-[#1F2937]">
      <TricolorBar className="h-1.5" />

      <header className="border-b border-stone-200/60 bg-[#fffdf9]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="DocBridge home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1E3A8A] text-lg font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">D</span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-[#1E3A8A]">DocBridge</span>
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{t('home.tagline')}</span>
            </span>
          </Link>
          <span className="flex items-center gap-2">
            <span className="rounded-full bg-[#1E3A8A] px-1 py-1"><LanguageToggle compact /></span>
            <span className="rounded-full border border-stone-200/60 bg-white px-3 py-1.5 text-xs font-bold tracking-[0.14em] text-slate-500">
              {t('home.badge')}
            </span>
          </span>
        </div>
      </header>

      <section className="relative">
        <div className="jaali-mesh absolute inset-x-0 top-0 -z-10 h-[38rem]" />
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:py-28">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.04em] text-[#1E3A8A] sm:text-5xl lg:text-6xl">
              {t('home.title')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              {t('home.heroSub')}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setIsPortalModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EA580C] px-6 py-3.5 font-semibold text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#C2410C] hover:shadow-[0_16px_40px_rgba(234,88,12,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] focus-visible:ring-offset-2"
              >
                {t('home.login')}
                <span aria-hidden="true">→</span>
              </button>
              <span className="text-sm text-slate-500">{t('home.pick')}</span>
            </div>
          </div>

          <figure className="glass-card overflow-hidden rounded-3xl">
            <picture>
              <source srcSet="/img_ind.webp" type="image/webp" />
              <img
                src="/img_ind.png"
                alt="Indian citizens completing digital public-service uploads"
                className="w-full object-cover"
                style={{ aspectRatio: '16 / 10' }}
                width={1376}
                height={768}
                loading={typeof navigator !== 'undefined' && (navigator as any)?.connection?.effectiveType === 'slow-2g' ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={typeof navigator !== 'undefined' && (navigator as any)?.connection?.effectiveType?.includes('2g') ? 'low' as any : 'auto' as any}
              />
            </picture>
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A]">
                <span className="h-2 w-2 rounded-full bg-[#059669]" />
                {t('home.figcap')}
              </span>
              <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 sm:inline-flex">{t('home.compliant')}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-stone-200/60 bg-white/70 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 md:grid-cols-3">
          {principles.map(([tk, dk]) => (
            <article key={tk} className="border-l-2 border-[#f28c28] pl-5">
              <h2 className="text-lg font-bold tracking-tight text-[#1E3A8A]">{t(tk)}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{t(dk)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('home.madeEyebrow')}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#1E3A8A] sm:text-4xl">{t('home.madeTitle')}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {t('home.madeSub')}
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {audiences.map(([tk, dk]) => (
            <article key={tk} className="glass-card rounded-3xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(30,58,138,0.12)]">
              <h3 className="text-lg font-bold tracking-tight text-[#1E3A8A]">{t(tk)}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t(dk)}</p>
            </article>
          ))}
        </div>
        <p className="mt-9 rounded-2xl border border-stone-200/60 bg-white/70 p-5 text-sm leading-6 text-slate-600 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {t('home.bridgeNote')}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('home.bridgeEyebrow')}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#1E3A8A] sm:text-4xl">{t('home.bridgeTitle')}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">{t('home.bridgeSub')}</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, tk, dk]) => (
            <article key={number} className="glass-card rounded-3xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(30,58,138,0.12)]">
              <span className="text-sm font-bold text-[#EA580C]">{number}</span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-[#1E3A8A]">{t(tk)}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{t(dk)}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="portals" className="mx-auto max-w-6xl px-5 py-16 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('home.loginEyebrow')}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#1E3A8A] sm:text-4xl">{t('home.portalsTitle')}</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {t('home.portalsSub')}
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <PortalCard
            step="01"
            accent="#1E3A8A"
            eyebrow="UPSC · CSE 2026"
            title={t('home.cUpscT')}
            description={t('home.cUpscD')}
            href="/upsc"
            cta={t('home.cUpscC')}
            busy={portalNav === '/upsc'}
            onNavigateStart={() => setPortalNav('/upsc')}
          />
          <PortalCard
            step="02"
            accent="#EA580C"
            eyebrow="Vahan · Sarathi"
            title={t('home.cVahanT')}
            description={t('home.cVahanD')}
            href="/vahan"
            cta={t('home.cVahanC')}
            busy={portalNav === '/vahan'}
            onNavigateStart={() => setPortalNav('/vahan')}
          />
          <PortalCard
            step="03"
            accent="#138808"
            eyebrow="EPFO · Member Portal"
            title={t('home.cEpfoT')}
            description={t('home.cEpfoD')}
            href="/epfo"
            cta={t('home.cEpfoC')}
            busy={portalNav === '/epfo'}
            onNavigateStart={() => setPortalNav('/epfo')}
          />
          <PortalCard
            step="04"
            accent="#0b3c92"
            eyebrow="Passport Seva · MEA"
            title={t('home.cPpT')}
            description={t('home.cPpD')}
            href="/passport"
            cta={t('home.cPpC')}
            busy={portalNav === '/passport'}
            onNavigateStart={() => setPortalNav('/passport')}
          />
          <PortalCard
            step="05"
            accent="#9a3412"
            eyebrow="SSC · OTR"
            title={t('home.cSscT')}
            description={t('home.cSscD')}
            href="/ssc"
            cta={t('home.cSscC')}
            busy={portalNav === '/ssc'}
            onNavigateStart={() => setPortalNav('/ssc')}
          />
          <PortalCard
            step="06"
            accent="#0d6b07"
            eyebrow="NSP · Scholarship"
            title={t('home.cNspT')}
            description={t('home.cNspD')}
            href="/nsp"
            cta={t('home.cNspC')}
            busy={portalNav === '/nsp'}
            onNavigateStart={() => setPortalNav('/nsp')}
          />
        </div>
      </section>

      <section className="bg-[#1E3A8A] px-5 py-16 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffb35c]">{t('home.scaleEyebrow')}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white">{t('home.scaleTitle')}</h2>
            <p className="mt-4 leading-7 text-blue-100">{t('home.scaleSub')}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPortalModalOpen(true)}
            className="shrink-0 rounded-2xl bg-[#EA580C] px-6 py-3.5 text-center font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#C2410C] hover:shadow-[0_16px_40px_rgba(234,88,12,0.22)]"
          >
            {t('home.login')}
          </button>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-stone-200/60 bg-white/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('home.dbEyebrow')}</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#1E3A8A]">{t('home.dbTitle')}</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{t('home.dbSub')}</p>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-[1fr_72px_1fr] items-center gap-4">
              <div className="rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t('home.src')}</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[#1E3A8A]">DigiLocker</p>
              </div>
              <div className="bridge-line h-2 rounded-full bg-white/40" />
              <div className="rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t('home.bridge')}</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[#1E3A8A]">DocBridge</p>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_72px_1fr] items-center gap-4">
              <div className="rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t('home.checks')}</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[#059669]">{t('home.checksV')}</p>
              </div>
              <div className="bridge-line h-2 rounded-full bg-white/40" />
              <div className="rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t('home.dest')}</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[#1E3A8A]">{t('home.destV')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#132a66] px-5 py-7 text-sm text-blue-100 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 sm:flex-row">
          <span><strong className="text-white">DocBridge</strong> · {t('home.tagline')}</span>
          <span className="text-blue-200">{t('home.footerBuilt')}</span>
        </div>
      </footer>

      {isPortalModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="portal-modal-title"
        >
          {/* Glassmorphic backdrop */}
          <button
            type="button"
            aria-label="Close portal chooser"
            onClick={() => !portalNav && setIsPortalModalOpen(false)}
            className="absolute inset-0 bg-[#0f172a]/30 backdrop-blur-[14px] backdrop-saturate-150 transition-opacity duration-300"
          />
          {/* Subtle gradient sheen */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-[#1E3A8A]/10" />

          <div className="relative w-full max-w-5xl animate-[modalIn_420ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.22),0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-[18px] sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('home.modalEyebrow')}</p>
                <h2 id="portal-modal-title" className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#1E3A8A] sm:text-3xl">
                  {t('home.modalTitle')}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {t('home.modalSub')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => !portalNav && setIsPortalModalOpen(false)}
                disabled={!!portalNav}
                className="rounded-2xl bg-white/80 p-2.5 text-slate-500 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 disabled:opacity-50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <ModalPortalCard step="01" accent="#1E3A8A" eyebrow="UPSC · CSE 2026" title={t('home.mUpscT')} description={t('home.mUpscD')} href="/upsc" cta={t('home.mUpscC')} busy={portalNav === '/upsc'} onNavigateStart={() => setPortalNav('/upsc')} onNavigate={() => {}} />
              <ModalPortalCard step="02" accent="#EA580C" eyebrow="Vahan · Sarathi" title={t('home.mVahanT')} description={t('home.mVahanD')} href="/vahan" cta={t('home.mVahanC')} busy={portalNav === '/vahan'} onNavigateStart={() => setPortalNav('/vahan')} onNavigate={() => {}} />
              <ModalPortalCard step="03" accent="#138808" eyebrow="EPFO · Member Portal" title={t('home.mEpfoT')} description={t('home.mEpfoD')} href="/epfo" cta={t('home.mEpfoC')} busy={portalNav === '/epfo'} onNavigateStart={() => setPortalNav('/epfo')} onNavigate={() => {}} />
              <ModalPortalCard step="04" accent="#0b3c92" eyebrow="Passport Seva · MEA" title={t('home.mPpT')} description={t('home.mPpD')} href="/passport" cta={t('home.mPpC')} busy={portalNav === '/passport'} onNavigateStart={() => setPortalNav('/passport')} onNavigate={() => {}} />
              <ModalPortalCard step="05" accent="#9a3412" eyebrow="SSC · OTR" title={t('home.mSscT')} description={t('home.mSscD')} href="/ssc" cta={t('home.mSscC')} busy={portalNav === '/ssc'} onNavigateStart={() => setPortalNav('/ssc')} onNavigate={() => {}} />
              <ModalPortalCard step="06" accent="#0d6b07" eyebrow="NSP · Scholarship" title={t('home.mNspT')} description={t('home.mNspD')} href="/nsp" cta={t('home.mNspC')} busy={portalNav === '/nsp'} onNavigateStart={() => setPortalNav('/nsp')} onNavigate={() => {}} />
            </div>

            <p className="mt-6 rounded-2xl bg-white/60 px-4 py-3 text-xs leading-5 text-slate-500 ring-1 ring-black/5">
              {t('home.modalNote')}
            </p>

            {portalNav && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/72 backdrop-blur-[10px]">
                <span className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-[#EA580C]" aria-hidden="true" />
                <span className="text-sm font-semibold tracking-[0.12em] text-[#1E3A8A]">{t('home.opening')} {portalNav.replace('/', '').toUpperCase()} {t('home.openingPortal')}</span>
                <span className="text-xs text-slate-500">{t('home.openingSub')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function PortalCard({
  step,
  accent,
  eyebrow,
  title,
  description,
  href,
  cta,
  busy = false,
  onNavigateStart,
}: {
  step: string;
  accent: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  busy?: boolean;
  onNavigateStart?: () => void;
}) {
  const { t } = useLang();
  return (
    <Link
      href={href}
      prefetch
      aria-busy={busy}
      onClick={() => onNavigateStart?.()}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-stone-200/60 bg-white/80 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_16px_40px_rgba(30,58,138,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] ${busy ? 'pointer-events-none' : ''}`}
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-white" style={{ backgroundColor: accent }}>
          {step}
        </span>
        <span className="rounded-full border border-stone-200/60 bg-white px-3 py-1 text-xs font-semibold" style={{ color: accent }}>
          {eyebrow}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-[#1E3A8A]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1E3A8A]">
        {busy ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#1E3A8A]" aria-hidden="true" />
            {t('home.openingEll')}
          </>
        ) : (
          <>
            {cta} <span className="transition group-hover:translate-x-1">→</span>
          </>
        )}
      </span>
      {busy && <span className="absolute inset-0 rounded-3xl bg-white/45 backdrop-blur-[1px]" aria-hidden="true" />}
    </Link>
  );
}

function ModalPortalCard({
  step,
  accent,
  eyebrow,
  title,
  description,
  href,
  cta,
  busy = false,
  onNavigateStart,
  onNavigate,
}: {
  step: string;
  accent: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  busy?: boolean;
  onNavigateStart?: () => void;
  onNavigate: () => void;
}) {
  const { t } = useLang();
  return (
    <Link
      href={href}
      prefetch
      aria-busy={busy}
      onClick={() => {
        onNavigateStart?.();
        onNavigate();
      }}
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-white/50 bg-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white hover:shadow-[0_16px_40px_rgba(30,58,138,0.16)] ${busy ? 'pointer-events-none' : ''}`}
    >
      <div className="flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-white" style={{ backgroundColor: accent }}>
          {step}
        </span>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold ring-1 ring-black/5" style={{ color: accent }}>
          {eyebrow}
        </span>
      </div>
      <h3 className="mt-4 text-base font-bold tracking-tight text-[#1E3A8A]">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1E3A8A]">
        {busy ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-[#EA580C]" aria-hidden="true" />
            {t('home.openingEll')}
          </>
        ) : (
          <>
            {cta} <span className="transition group-hover:translate-x-1">→</span>
          </>
        )}
      </span>
      {busy && <span className="absolute inset-0 rounded-3xl bg-white/40 backdrop-blur-[1px]" aria-hidden="true" />}
    </Link>
  );
}
