'use client';

import Link from 'next/link';
import { useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import { COLORS } from '@/lib/constants';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

export default function VahanPortal() {
  const [step, setStep] = useState<JourneyStep>('login');

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.legacyBg }}>
      <GovernmentHeader
        portalName="Vahan"
        portalFullName="Vahan & Sarathi - Ministry of Road Transport & Highways"
        portalInitials="VAHAN"
        welcomeText={step === 'login' ? undefined : 'Welcome, Priya Sharma'}
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
            Back to DocBridge Home
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
                <p className="mt-2 text-sm text-slate-600">The photograph upload is the pending step. Sarathi enforces a strict 10KB - 20KB JPEG rule.</p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">Sarathi Login</h2>
                <p className="mt-1 text-sm text-slate-500">Learner number, password, and OTP checkpoint.</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label="Learner No / Mobile" value="DL2026-0092451" />
                <Field label="Password" value="••••••••••" />
                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Sign In and Continue
                </button>
                <div className="flex justify-between text-xs text-[#0b3c92]">
                  <span>New Registration</span>
                  <span>Forgot Password</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <h2 className="text-xl font-bold text-[#0b1f4d]">Application checklist</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {['Learner details completed', 'Fee started', 'Photograph upload pending', 'Signature upload pending'].map((item, index) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: index < 1 ? COLORS.green : COLORS.saffronDark }}
                    >
                      {index < 1 ? '✓' : '!'}
                    </span>
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">The tightest upload rule in Indian gov portals</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Your photograph must be under 20KB</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A modern phone photo is 2-5 MB — over a hundred times too large. Sarathi&apos;s automated check rejects most uploads on the first try.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-[#f8fafc] p-4">
                  <p className="text-sm font-semibold text-[#0b3c92]">Current task</p>
                  <p className="mt-2 text-sm text-slate-600">Upload a 35mm x 45mm JPEG with a 70-80% face before the fee step.</p>
                </div>
                <div className="rounded-xl bg-[#fff8e1] p-4">
                  <p className="text-sm font-semibold text-[#8a5a00]">Pain point</p>
                  <p className="mt-2 text-sm text-slate-600">"You may use online option to compress them" — the portal offers no built-in tool.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="mt-6 rounded-md px-4 py-3 text-sm font-semibold text-white"
                style={{ backgroundColor: COLORS.saffronDark }}
              >
                Continue to Photograph Upload
              </button>
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
                  <div className="mb-6 rounded-lg p-4" style={{ backgroundColor: COLORS.errorLight, border: `1px solid ${COLORS.error}` }}>
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.error }}>
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h4 className="font-semibold" style={{ color: COLORS.error }}>
                          Strict automated check
                        </h4>
                        <p className="mt-1 text-sm" style={{ color: '#991B1B' }}>
                          Photograph in JPEG between 10KB and 20KB, 35mm x 45mm. Signature in JPEG between 10KB and 20KB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Standard upload fails before DocBridge */}
                  <div className="mb-6 rounded-lg border bg-white p-4" style={{ borderColor: COLORS.gray[300] }}>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Trying the standard upload</p>
                    <div className="mt-3 rounded-md p-3 text-sm" style={{ backgroundColor: COLORS.errorLight, color: COLORS.error }}>
                      <span className="font-semibold">File size should be between 10KB and 20KB.</span>
                      <p className="mt-1 text-xs text-[#991B1B]">
                        "Document need to be single jpeg copy or PDF file in the given size only. You may use online option to compress them." — a typical 3MB phone photo fails instantly.
                      </p>
                    </div>
                    <div className="mt-3 rounded-lg p-3 text-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                      <strong>Why DocBridge:</strong> fetch the photo from DigiLocker, force the 35mm x 45mm crop and 70-80% face, then compress to 10-20KB without blurring the face.
                    </div>
                  </div>

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
