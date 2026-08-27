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
    <main className="min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-900">
      <div className="h-1.5 bg-gradient-to-r from-[#f28c28] via-white via-50% to-[#138808]" />

      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3" aria-label="DocBridge home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#061c4f] text-lg font-bold text-white shadow-sm">D</span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-[#061c4f]">DocBridge</span>
              <span className="block text-xs font-medium text-slate-500">Document readiness for public services</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsExperienceOpen(true)}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-[#061c4f] transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#061c4f] sm:px-4"
          >
            Explore the experience
          </button>
        </div>
      </header>

      <section className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_78%_18%,rgba(255,153,51,0.17),transparent_24rem),radial-gradient(circle_at_12%_16%,rgba(6,28,79,0.12),transparent_28rem)]" />
        <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:px-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-sm font-semibold text-[#0b3c92] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#138808]" />
              Built for India&apos;s public-service journeys
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight text-[#061c4f] sm:text-5xl lg:text-6xl">
              One trusted bridge for every public-service upload.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Every portal has different file-size, format, and dimension rules. DocBridge unifies that complexity behind one secure, seamless upload experience.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => setIsExperienceOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#061c4f] px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-950/15 transition hover:-translate-y-0.5 hover:bg-[#0b2d76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#061c4f] focus-visible:ring-offset-2"
              >
              Explore how it works
                <span aria-hidden="true">→</span>
              </button>
              <span className="text-sm text-slate-500">A drop-in layer for legacy portals—no backend rewrite required.</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white p-5 shadow-2xl shadow-slate-900/10 sm:p-7">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Document status</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Ready for portal submission</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Compliant</span>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                ['Source', 'Authorised DigiLocker document', 'bg-blue-50 text-blue-700'],
                ['Requirements', 'PDF · under 500 KB · account number visible', 'bg-amber-50 text-amber-700'],
                ['Preparation', 'Converted and optimised in browser', 'bg-violet-50 text-violet-700'],
              ].map(([label, value, tone]) => (
                <div key={label} className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${tone}`}>✓</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                    <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
              <span className="text-lg">🔒</span>
              <span>Review first. Submit only when the citizen is ready.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-6 md:grid-cols-3">
          {principles.map(([title, description]) => (
            <article key={title} className="border-l-2 border-[#f28c28] pl-5">
              <h2 className="text-lg font-bold text-[#061c4f]">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#e17614]">One simple bridge</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#061c4f] sm:text-4xl">Unify the upload layer. Keep every portal intact.</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">DocBridge works between the citizen and the portal, translating each site&apos;s scattered rules into one familiar experience—without requiring a government infrastructure overhaul.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, description]) => (
            <article key={number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="text-sm font-bold text-[#e17614]">{number}</span>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#061c4f] px-5 py-16 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 rounded-3xl border border-white/15 bg-white/5 p-8 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#ffb35c]">Designed to scale</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Universal ingestion middleware for public services.</h2>
            <p className="mt-4 leading-7 text-blue-100">From pensions and KYC to admissions, recruitment, benefits, and licences—one integration can make every distinct attachment rule feel consistent, secure, and simple.</p>
          </div>
          <button type="button" onClick={() => setIsExperienceOpen(true)} className="shrink-0 rounded-xl bg-white px-6 py-3.5 font-semibold text-[#061c4f] transition hover:bg-blue-50">
            Explore the prototype
          </button>
        </div>
      </section>

      <footer className="bg-[#041538] px-5 py-7 text-sm text-blue-100 sm:px-6">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="experience-title">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#e17614]">Interactive walkthrough</p>
            <h2 id="experience-title" className="mt-2 text-2xl font-bold tracking-tight text-[#061c4f]">See one experience across two very different portals</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Each scenario demonstrates the same DocBridge layer adapting to a portal&apos;s unique rules. Connect to a safe mock DigiLocker vault, select a document, and see it prepared for the destination.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label="Close experience chooser">✕</button>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <JourneyCard href="/epfo" title="EPFO KYC" label="Passbook · PDF under 500 KB" description="See a passbook prepared for a strict KYC upload requirement." onNavigate={onClose} />
          <JourneyCard href="/upsc" title="UPSC photograph" label="JPEG · 3.5 cm × 4.5 cm" description="See a photograph transformed for a precise application upload rule." onNavigate={onClose} />
        </div>
        <p className="mt-6 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">This submission uses mock identities and sample documents. No real citizen data is collected or stored.</p>
      </div>
    </div>
  );
}

function JourneyCard({ href, title, label, description, onNavigate }: { href: string; title: string; label: string; description: string; onNavigate: () => void }) {
  return (
    <Link href={href} onClick={onNavigate} className="group rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#061c4f]">
      <p className="text-xs font-bold uppercase tracking-wide text-[#e17614]">{label}</p>
      <h3 className="mt-3 text-lg font-bold text-[#061c4f]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0b3c92]">Open journey <span className="transition group-hover:translate-x-1">→</span></span>
    </Link>
  );
}
