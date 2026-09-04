'use client';

import Link from 'next/link';
import { useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

export default function VahanPortal() {
  const { t } = useLang();
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.legacyBg }}>
      <GovernmentHeader
        portalName="Vahan"
        portalFullName="Vahan & Sarathi - Ministry of Road Transport & Highways"
        portalInitials="VAHAN"
        welcomeText={step === 'login' ? undefined : `${t('auth.welcome')}, Priya Sharma`}
        userIdText={step === 'login' ? undefined : 'Application: DL2026-0092451'}
      />

      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">Sarathi - Citizen Services</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>Learner&apos;s Licence · Application</span>
          </div>
          <Link
            href="/"
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-[#1E3A8A] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-50"
          >
            {t('nav.backHome')}
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {step === 'login' && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">Sarathi Portal</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Learner&apos;s Licence login</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Sign in to continue your Learner&apos;s Licence application and complete the required photograph upload before the fee step.
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-sm font-semibold text-[#0b3c92]">Status</p>
                <p className="mt-2 text-2xl font-bold text-[#0b1f4d]">LLR application in progress</p>
                <p className="mt-2 text-sm text-slate-600">The photograph upload is the pending step before you can proceed to the fee.</p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">{t('login.sarathi')}</h2>
                <p className="mt-1 text-sm text-slate-500">Learner number, password, and OTP checkpoint.</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label="Learner No / Mobile" value="DL2026-0092451" />
                <Field label="Password" value="••••••••••" />
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Captcha</label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border bg-[#f8fafc] px-4 py-3 font-mono tracking-[0.28em] text-[#0b3c92]" style={{ borderColor: COLORS.gray[300] }}>
                      7 3 9 2
                    </div>
                    <input
                      readOnly
                      value="7392"
                      className="w-full rounded-md border px-4 py-3 text-sm text-slate-700"
                      style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.white }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Demo is pre-filled — just click Sign In.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {t('auth.signInContinue')}
                </button>
                <div className="flex justify-between text-xs text-[#0b3c92]">
                  <span>New Registration</span>
                  <span>{t('auth.forgot')}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-6">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow="Application DL2026-0092451 · Action required"
                title="Photograph upload is pending — upload a 10-20 KB JPEG before fee payment"
                description="Sarathi caps the photo at 20 KB (your phone photo is 2-5 MB). Click to open the upload section — DocBridge will crop to 35mm × 45mm and compress without blurring."
                ctaLabel={t('upload.continuePhoto')}
                onAction={() => setStep('upload')}
                onDismiss={() => setNudgeDismissed(true)}
                tone="amber"
              />
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-amber-50/70 px-4 py-2.5 text-sm" style={{ borderColor: '#FDE68A' }}>
                <span className="text-amber-800">Nudge dismissed — use the card below to continue.</span>
                <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                  Show again
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="space-y-5">
                <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                  <h2 className="text-xl font-bold text-[#0b1f4d]">Application home</h2>
                  <div className="mt-4 rounded-lg bg-[#f8fafc] p-4" style={{ borderColor: COLORS.legacyBorder }}>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Application</p>
                    <p className="mt-1 text-sm font-bold text-[#0b1f4d]">DL2026-0092451 — Learner Licence (MCWG)</p>
                    <p className="text-xs text-slate-500">RTO: Delhi — Central · Applied: 26 Aug 2026</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">60% complete</span>
                      <span className="text-xs text-slate-500">2 steps remaining</span>
                    </div>
                  </div>
                  <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Progress tracker</h3>
                  <ul className="mt-3 space-y-3 text-sm">
                    {[
                      ['Learner details', 'completed', true],
                      ['Fee — not started', 'pending', false],
                      ['Photograph upload', 'pending', false],
                      ['Signature upload', 'pending', false],
                      ['Slot booking', 'locked', false],
                    ].map(([label, _s, done]) => (
                      <li key={label as string} className="flex items-center gap-3">
                        <span
                          className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: done ? COLORS.green : '#E5E7EB', color: done ? 'white' : '#6B7280' }}
                        >
                          {done ? '✓' : '·'}
                        </span>
                        <span className={done ? 'text-slate-700' : 'text-slate-500'}>{label as string}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-lg border bg-white p-3" style={{ borderColor: COLORS.legacyBorder }}>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Services</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {['Licence Services', 'Vehicle Services', 'Permit', 'Fee Payment'].map((s) => (
                        <span key={s} className="rounded-full border bg-white px-2.5 py-1 font-medium text-slate-600" style={{ borderColor: COLORS.gray[300] }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">Next step</p>
                  <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Complete your photograph upload</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    This is the remaining step before your application moves to the fee. Continue to upload your photograph and signature.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('upload')}
                    className="mt-6 rounded-md px-4 py-3 text-sm font-semibold text-white"
                    style={{ backgroundColor: COLORS.saffronDark }}
                  >
                    {t('upload.continuePhoto')} →
                  </button>
                </div>

                <div className="rounded-xl border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Applicant snapshot</h3>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Name</p>
                      <p className="font-semibold text-slate-800">Priya Sharma</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">DOB</p>
                      <p className="font-semibold text-slate-800">12 May 2004</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Mobile</p>
                      <p className="font-semibold text-slate-800">87654 32109</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">State</p>
                      <p className="font-semibold text-slate-800">Delhi</p>
                    </div>
                  </div>
                  <p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                    Fee module unlocks after photograph and signature are accepted. All data shown is mock for demo.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'upload' && (
          <section className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-lg border bg-white p-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h3 className="mb-4 font-semibold" style={{ color: COLORS.gray[800] }}>
                  Photo Requirements (Sarathi)
                </h3>
                <ul className="space-y-3 text-sm" style={{ color: COLORS.gray[600] }}>
                  {[
                    'JPEG / JPG only',
                    'File size 10KB - 20KB',
                    'Dimensions 35mm x 45mm',
                    'White or light background',
                    'Face covers 70-80%',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primary }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-lg p-3 text-sm" style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}>
                  <strong>Aadhaar e-KYC:</strong> many states auto-fetch your Aadhaar photo as the DL photo. A DigiLocker photograph keeps the journey on trusted identity.
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h2 className="text-lg font-bold" style={{ color: COLORS.gray[800] }}>
                    Upload Photograph & Signature
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: COLORS.gray[500] }}>
                    Step 3 of 5: Document Upload
                  </p>
                </div>

                <div className="p-6">

                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium" style={{ color: COLORS.gray[700] }}>
                      Photograph (JPEG, 35mm x 45mm) *
                    </label>
                    <div className="mb-4 rounded-lg border-2 border-dashed p-8 text-center" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[500] }}>
                      <svg className="mx-auto mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium">Standard upload expects a compliant JPEG</p>
                      <p className="mt-1 text-sm">10KB - 20KB · 35mm x 45mm · white background</p>
                    </div>

                    <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">DocBridge assist</p>
                      <p className="mt-2 text-sm text-slate-600">Fetch the photograph from DigiLocker, prepare it to the 10-20KB Sarathi rule, and review before continuing.</p>
                      <div className="mt-4">
                        <DocBridgeWidget
                          portalId="vahan"
                          requirements="Upload passport photograph in JPEG only. File size 10KB - 20KB. Dimensions 35mm x 45mm. Plain white or light background. Face should cover 70-80% of the photo."
                          onSuccess={() => setStep('submitted')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d6b07]">Photograph accepted</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">The 10-20KB limit was met on the first try</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              The photograph passed Sarathi&apos;s strict size and 35mm x 45mm dimension check without an external compressor. You may proceed to the fee step.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label="Document state" value="JPEG validated (10-20KB)" tone="blue" />
              <ResultCard label="Next milestone" value="Fee payment" tone="green" />
              <ResultCard label="Source" value="DigiLocker photograph" tone="saffron" />
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
