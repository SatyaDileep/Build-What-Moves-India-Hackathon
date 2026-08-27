'use client';

import Link from 'next/link';
import { useState } from 'react';

const steps = [
  ['01', 'Understand the portal', 'DocBridge reads upload instructions and turns them into clear, structured requirements.'],
  ['02', 'Connect with consent', 'The citizen selects the required file from an authorised DigiLocker vault.'],
  ['03', 'Prepare in the browser', 'The document is resized, converted, compressed, and checked without a third-party converter.'],
  ['04', 'Submit with confidence', 'The existing portal receives a file tailored to its own validation rules.'],
];

const principles = [
  ['DigiLocker-first', 'A familiar, consent-based source for documents instead of unknown upload tools.'],
  ['Privacy-conscious', 'Document preparation stays in the browser, reducing unnecessary data movement.'],
  ['Legacy-compatible', 'A lightweight layer that works with the upload flows portals already have.'],
];

export default function Home() {
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FDFBF7] text-[#1F2937]">
      <div className="h-1.5 bg-gradient-to-r from-[#f28c28] via-white via-50% to-[#138808]" />

      <header className="border-b border-stone-200/60 bg-[#fffdf9]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="DocBridge home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1E3A8A] text-lg font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">D</span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-[#1E3A8A]">DocBridge</span>
              <span className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Document readiness for public services</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsExperienceOpen(true)}
            className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-[#1E3A8A] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A] sm:px-5"
          >
            Explore the experience
          </button>
        </div>
      </header>

      <section className="relative">
        <div className="jaali-mesh absolute inset-x-0 top-0 -z-10 h-[38rem]" />
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#1E3A8A] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <span className="h-2 w-2 rounded-full bg-[#059669]" />
              No two Indian portals agree on a file upload
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.04em] text-[#1E3A8A] sm:text-5xl lg:text-6xl">
              One upload layer for India&apos;s many official portals.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              UPSC, Sarathi, and EPFO each enforce a different size, format, and dimension — so the same photo that clears one portal bounces on another. Complying often means handing that document to a third-party tool. DocBridge prepares it in the browser to match each portal&apos;s own rules — so the upload you came to do, finally goes through.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setIsExperienceOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#EA580C] px-6 py-3.5 font-semibold text-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#C2410C] hover:shadow-[0_16px_40px_rgba(234,88,12,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C] focus-visible:ring-offset-2"
              >
                Explore how it works
                <span aria-hidden="true">→</span>
              </button>
              <span className="text-sm text-slate-500">A drop-in layer for legacy portals—no backend rewrite required.</span>
            </div>
          </div>

          <figure className="glass-card overflow-hidden rounded-3xl">
            <img
              src="/img_ind.png"
              alt="Indian citizens completing digital public-service uploads"
              className="w-full object-cover"
              style={{ aspectRatio: '16 / 10' }}
            />
            <figcaption className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1E3A8A]">
                <span className="h-2 w-2 rounded-full bg-[#059669]" />
                The document should match the portal — not the other way around
              </span>
              <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 sm:inline-flex">Compliant</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-stone-200/60 bg-white/70 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 md:grid-cols-3">
          {principles.map(([title, description]) => (
            <article key={title} className="border-l-2 border-[#f28c28] pl-5">
              <h2 className="text-lg font-bold tracking-tight text-[#1E3A8A]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">Made for millions of Indians</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#1E3A8A] sm:text-4xl">This isn&apos;t a niche problem — it touches every new government user.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Every day, in official portals across the country, a photo or a passbook gets rejected — and the person on the other side has to figure out why, alone.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            ['Remote & first-time users', 'A villager logging in for the first time doesn\'t know about crop tools, KB, DPI, or pixel ranges. The error message might as well be another language.'],
            ['Elderly citizens', 'For a senior filling a pension or KYC form, a rejected upload means another trip, another helper, another day lost on something that should be instant.'],
            ['Even the tech-savvy', 'Younger users — who can code — still end up uploading an Aadhaar or a photo to unknown third-party resize sites, unsure whether they\'ve just leaked a sensitive document.'],
          ].map(([title, description]) => (
            <article key={title} className="glass-card rounded-3xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(30,58,138,0.12)]">
              <h3 className="text-lg font-bold tracking-tight text-[#1E3A8A]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
        <p className="mt-9 rounded-2xl border border-stone-200/60 bg-white/70 p-5 text-sm leading-6 text-slate-600 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          DocBridge removes the guesswork from the start — the document is prepared against the portal&apos;s own rule, so no one has to copy a file into an unfamiliar tool just to get a government service done.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">One simple bridge</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#1E3A8A] sm:text-4xl">Unify the upload layer. Keep every portal intact.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">DocBridge works between the citizen and the portal, translating each site&apos;s scattered rules into one familiar experience—without requiring a government infrastructure overhaul.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, description]) => (
            <article key={number} className="glass-card rounded-3xl p-6 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(30,58,138,0.12)]">
              <span className="text-sm font-bold text-[#EA580C]">{number}</span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-[#1E3A8A]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#1E3A8A] px-5 py-16 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffb35c]">Designed to scale</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white">Universal ingestion middleware for public services.</h2>
            <p className="mt-4 leading-7 text-blue-100">From pensions and KYC to admissions, recruitment, benefits, and licences—one integration can make every distinct attachment rule feel consistent, secure, and simple.</p>
          </div>
          <button type="button" onClick={() => setIsExperienceOpen(true)} className="shrink-0 rounded-2xl bg-[#EA580C] px-6 py-3.5 font-semibold text-white transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#C2410C] hover:shadow-[0_16px_40px_rgba(234,88,12,0.22)]">
            See it in action
          </button>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 rounded-[2rem] border border-stone-200/60 bg-white/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">Digital bridge</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#1E3A8A]">From DigiLocker trust to portal compliance, through one calm workflow.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">Instead of asking citizens to export sensitive files into random resize tools, DocBridge keeps the journey centred on a trusted source, local preparation, and a compliant final handoff.</p>
          </div>
          <div className="grid gap-4">
            <div className="grid grid-cols-[1fr_72px_1fr] items-center gap-4">
              <div className="rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Source</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[#1E3A8A]">DigiLocker</p>
              </div>
              <div className="bridge-line h-2 rounded-full bg-white/40" />
              <div className="rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Bridge</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[#1E3A8A]">DocBridge</p>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_72px_1fr] items-center gap-4">
              <div className="rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Checks</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[#059669]">Format, size, dimensions</p>
              </div>
              <div className="bridge-line h-2 rounded-full bg-white/40" />
              <div className="rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-5 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Destination</p>
                <p className="mt-2 text-lg font-bold tracking-tight text-[#1E3A8A]">Legacy portal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#132a66] px-5 py-7 text-sm text-blue-100 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 sm:flex-row">
          <span><strong className="text-white">DocBridge</strong> · Document readiness for public services</span>
          <span className="text-blue-200">Built for Build What Moves India Hackathon</span>
        </div>
      </footer>

      {isExperienceOpen && <ExperienceModal onClose={() => setIsExperienceOpen(false)} />}
    </main>
  );
}

function ExperienceModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="experience-title">
      <div className="w-full max-w-4xl rounded-3xl border border-stone-200/60 bg-[#fffdf9] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#EA580C]">Interactive walkthrough</p>
            <h2 id="experience-title" className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#1E3A8A] sm:text-3xl">Real governments, real upload dead-ends — and how DocBridge clears them</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Millions of Indians hit a subtle wall on official portals: the file they have doesn&apos;t match the rule the site silently expects. Pick a journey to walk through the friction — and the fix.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-2xl p-2 text-slate-500 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-slate-100 hover:text-slate-900" aria-label="Close experience chooser">✕</button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <JourneyCard step="01" accent="#1E3A8A" href="/upsc" title="UPSC" label="Apply for a government job" description="A single over-large or dim photo can stall the application — and 2026 adds a live-photo match check. See it clear in one try." onNavigate={onClose} />
          <JourneyCard step="02" accent="#EA580C" href="/vahan" title="Vahan / Sarathi" label="Get a driving licence" description="Sarathi caps the photo far below a phone screenshot size, so most uploads bounce. See the fix that keeps you moving." onNavigate={onClose} />
          <JourneyCard step="03" accent="#138808" href="/epfo" title="EPFO" label="Update my bank KYC" description="Every member must seed a bank proof to get claims moving. See a passbook prepared with no online compressor hunt." onNavigate={onClose} />
        </div>

        <div className="mt-7 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            DocBridge uses consent-based DigiLocker access. No documents are stored on our servers — everything is prepared in your browser.
          </p>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-[#059669]" /> Live demo · no setup needed
          </span>
        </div>
      </div>
    </div>
  );
}

function JourneyCard({ href, step, accent, title, label, description, onNavigate }: { href: string; step: string; accent: string; title: string; label: string; description: string; onNavigate: () => void }) {
  return (
    <Link href={href} onClick={onNavigate} className="group flex flex-col rounded-3xl border border-stone-200/60 bg-white/70 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-blue-300 hover:shadow-[0_16px_40px_rgba(30,58,138,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]">
      <div className="flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-white" style={{ backgroundColor: accent }}>{step}</span>
        <span className="rounded-full border border-stone-200/60 bg-white px-3 py-1 text-xs font-semibold" style={{ color: accent }}>{title}</span>
      </div>
      <h3 className="mt-5 text-lg font-bold tracking-tight text-[#1E3A8A]">{label}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1E3A8A]">
        Open journey <span className="transition group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
