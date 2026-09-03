'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const photoRequirements = [
  'Exactly 200 × 230 pixels (3.5 × 4.5 cm)',
  'JPEG only — PNG renamed to .jpg still fails',
  'File size between 20 KB and 50 KB',
  'White background, no cap, no spectacles',
  'Recent photo — not older than 3 months',
];

const signatureRequirements = [
  'Exactly 140 × 60 pixels (3.5 × 1.5 cm)',
  'JPEG only, between 10 KB and 20 KB',
  'Running handwriting — NOT block capitals',
  'Black or blue ink on plain white paper',
];

export default function SSCPortal() {
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [done, setDone] = useState({ photo: false, signature: false });

  useEffect(() => {
    if (done.photo && done.signature) setStep('submitted');
  }, [done]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.legacyBg }}>
      <GovernmentHeader
        portalName="SSC"
        portalFullName="Staff Selection Commission — One Time Registration"
        portalInitials="SSC"
        welcomeText={step === 'login' ? undefined : 'Welcome, Priya Sharma'}
        userIdText={step === 'login' ? undefined : 'OTR: SSCOTR20240055231'}
      />

      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">SSC OTR Home</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>CGL 2026 · Photo & Signature</span>
          </div>
          <Link
            href="/"
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-[#1E3A8A] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Back to DocBridge Home
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {step === 'login' && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">OTR · One Time Registration</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Candidate login</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  One registration drives every SSC exam — CGL, CHSL, MTS. Log in to complete the photo and signature uploads before applying.
                </p>
              </div>

              <div className="rounded-xl border bg-[#fff8e1] p-5" style={{ borderColor: '#FDE68A' }}>
                <p className="text-sm font-bold text-[#8a5a00]">Automated screening is unforgiving</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The OTR portal checks pixels and kilobytes arithmetically — a 201×230 photo or a 21 KB signature is rejected outright, and a distorted signature can mean disqualification at the venue.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">Candidate Login</h2>
                <p className="mt-1 text-sm text-slate-500">Registration number, date of birth, and captcha.</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label="Registration Number" value="SSC20240055231" />
                <Field label="Date of Birth (DD/MM/YYYY)" value="14/08/2003" />
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Captcha</label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border bg-[#f8fafc] px-4 py-3 font-mono tracking-[0.28em] text-[#0b3c92]" style={{ borderColor: COLORS.gray[300] }}>
                      2 6 1 8
                    </div>
                    <input
                      readOnly
                      value="2618"
                      className="w-full rounded-md border px-4 py-3 text-sm text-slate-700"
                      style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.white }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Demo is pre-filled — just click Login.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Login
                </button>
                <div className="flex justify-between text-xs text-[#0b3c92]">
                  <span>New OTR Registration</span>
                  <span>Forgot Registration No.</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-6">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow="CGL 2026 · OTR SSCOTR20240055231"
                title="Photo & signature pending — the tightest boxes of any portal"
                description="SSC needs a 200×230px photo (20–50 KB) and a 140×60px signature (10–20 KB) in running hand. Open uploads — DocBridge hits both boxes from DigiLocker in one pass."
                ctaLabel="Upload Photo & Signature"
                onAction={() => setStep('upload')}
                onDismiss={() => setNudgeDismissed(true)}
                tone="amber"
              />
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-amber-50/70 px-4 py-2.5 text-sm" style={{ borderColor: '#FDE68A' }}>
                <span className="text-amber-800">Nudge dismissed — use the cards below to continue.</span>
                <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                  Show again
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-xl font-bold text-[#0b1f4d]">OTR profile</h2>
                <div className="mt-4 rounded-lg bg-[#f8fafc] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Candidate</p>
                  <p className="mt-1 text-sm font-bold text-[#0b1f4d]">Priya Sharma</p>
                  <p className="text-xs text-slate-500">OTR SSCOTR20240055231 · Verified via Aadhaar</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">Uploads pending</span>
                  </div>
                </div>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">My examinations</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {[
                    ['CGL 2026', 'Apply — uploads pending', true],
                    ['CHSL 2025', 'Submitted', false],
                    ['MTS 2025', 'Submitted', false],
                  ].map(([exam, status, pending]) => (
                    <li key={exam as string} className="flex items-center justify-between gap-3 rounded-lg border bg-white p-3" style={{ borderColor: COLORS.legacyBorder }}>
                      <span className="font-semibold text-slate-700">{exam as string}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${(pending as boolean) ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{status as string}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">CGL 2026 application</p>
                <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Two tiny boxes, zero tolerance</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A phone photo is 3–10 MB — roughly 100× over the 50 KB cap — and must land on an exact pixel box. The signature must be a 140×60 strip in flowing hand, never capitals.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    <p className="text-sm font-semibold text-[#0b3c92]">Photograph · 200×230</p>
                    <p className="mt-2 text-sm text-slate-600">20–50 KB JPEG · white background · no cap, no spectacles.</p>
                  </div>
                  <div className="rounded-xl bg-[#fff8e1] p-4">
                    <p className="text-sm font-semibold text-[#8a5a00]">Signature · 140×60</p>
                    <p className="mt-2 text-sm text-slate-600">10–20 KB JPEG · running script — all-caps signatures are invalid.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="mt-6 rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.saffronDark }}
                >
                  Upload Photo & Signature →
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'upload' && (
          <section className="space-y-8">
            <div className="rounded-lg border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0b1f4d]">Upload photograph & signature</h2>
                  <p className="mt-1 text-sm text-slate-500">CGL 2026 · both files are validated arithmetically — exact pixels, exact KB band</p>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Step 2 of 4 · Uploads</span>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">Photograph</h3>
                  <p className="mt-1 text-sm text-slate-500">Exactly 200 × 230 px · JPEG · 20–50 KB</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2 text-sm text-slate-600">
                    {photoRequirements.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">DocBridge assist</p>
                    <p className="mt-2 text-sm text-slate-600">Fetch the photo from DigiLocker and land it on the 200×230 box inside the 20–50 KB band.</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="ssc"
                        docType="photo"
                        requirements="SSC OTR photo upload. JPEG only, 20KB - 50KB, exactly 200x230 pixels, white background, no cap."
                        onSuccess={() => setDone((d) => ({ ...d, photo: true }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">Signature</h3>
                  <p className="mt-1 text-sm text-slate-500">Exactly 140 × 60 px · JPEG · 10–20 KB</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2 text-sm text-slate-600">
                    {signatureRequirements.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">DocBridge assist</p>
                    <p className="mt-2 text-sm text-slate-600">Fetch the signature and squeeze it into the 140×60 strip without losing the hand.</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="ssc"
                        docType="signature"
                        requirements="SSC signature upload. Signature scan, JPEG only, 10KB - 20KB, 140x60 pixels, running handwriting."
                        onSuccess={() => setDone((d) => ({ ...d, signature: true }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: COLORS.errorLight, color: '#991B1B' }}>
              <strong>Portal errors you avoid:</strong> “Invalid dimensions or size” at 21 KB or 201 px — and a stretched signature that an invigilator cannot match at the venue.
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d6b07]">Uploads accepted</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Both files sit inside their boxes — the CGL form can proceed</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              The photograph and signature passed the pixel and KB-band validators. The OTR profile now carries them into every SSC exam application.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label="Photograph" value="200×230 JPEG, 20–50 KB ✓" tone="green" />
              <ResultCard label="Signature" value="140×60 JPEG, 10–20 KB ✓" tone="blue" />
              <ResultCard label="Next milestone" value="Preview, pay & final submit" tone="saffron" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <input
        readOnly
        value={value}
        className="w-full rounded-md border px-4 py-3 text-sm text-slate-700"
        style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.white }}
      />
    </div>
  );
}

function ResultCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'green' | 'saffron' | 'blue';
}) {
  const styles =
    tone === 'green'
      ? { backgroundColor: COLORS.greenLight, color: COLORS.greenDark }
      : tone === 'saffron'
        ? { backgroundColor: COLORS.saffronLight, color: '#9a4d00' }
        : { backgroundColor: COLORS.primaryLight, color: COLORS.primary };

  return (
    <div className="rounded-xl p-4" style={styles}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6">{value}</p>
    </div>
  );
}
