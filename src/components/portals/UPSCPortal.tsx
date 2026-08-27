'use client';

import Link from 'next/link';
import { useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import { COLORS } from '@/lib/constants';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const checklist = [
  'Personal details completed',
  'Education details completed',
  'Photo upload pending',
  'Signature upload pending',
];

const requirements = [
  'Passport size photograph only',
  'JPEG format only',
  'Size between 20 KB and 50 KB',
  'Dimensions 3.5 cm x 4.5 cm',
  'White background required',
];

export default function UPSCPortal() {
  const [step, setStep] = useState<JourneyStep>('login');

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.legacyBg }}>
      <GovernmentHeader
        portalName="UPSC"
        portalFullName="Union Public Service Commission"
        portalInitials="UPSC"
        welcomeText={step === 'login' ? undefined : 'Welcome, Priya Sharma'}
        userIdText={step === 'login' ? undefined : 'Registration: UPSC2024001234'}
      />

      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">Online Application Portal</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>Photograph Upload</span>
          </div>
          <Link
            href="/"
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-[#1E3A8A] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Back to DocBridge Home
          </Link>
        </div>
      </div>

      <div className="border-b bg-white" style={{ borderColor: COLORS.legacyBorder }}>
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="font-semibold text-[#0b3c92]">Application Status</span>
            <span className={`rounded-full px-3 py-1 ${step === 'submitted' ? 'bg-[#e8f5e9] text-[#0d6b07]' : 'bg-[#fff3e0] text-[#9a4d00]'}`}>
              {step === 'login' ? 'Step 1: Sign in' : step === 'dashboard' ? 'Step 2: Review application' : step === 'upload' ? 'Step 3: Upload photograph' : 'Step 4: Continue submission'}
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {step === 'login' && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">Application portal</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Candidate login</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Sign in to continue your application and complete the required photograph and signature uploads before final submission.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border bg-[#fff8e8] p-5" style={{ borderColor: '#f2cf7f' }}>
                  <p className="text-sm font-semibold text-[#8a5a00]">Status</p>
                  <p className="mt-2 text-2xl font-bold text-[#0b1f4d]">Application in progress</p>
                  <p className="mt-2 text-sm text-slate-600">Sections 1 and 2 are complete. The portal is waiting on photo and signature uploads.</p>
                </div>
                <div className="rounded-xl border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-sm font-semibold text-[#0b3c92]">Recruitment cycle</p>
                  <p className="mt-2 text-2xl font-bold text-[#0b1f4d]">Civil Services Examination 2026</p>
                  <p className="mt-2 text-sm text-slate-600">Application editing window is open. Complete document uploads before payment.</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">Candidate Login</h2>
                <p className="mt-1 text-sm text-slate-500">Registration ID, password, and OTP checkpoint before editing the form.</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label="Registration ID" value="UPSC2024001234" />
                <Field label="Password" value="••••••••••" />
                <Field label="One-Time Passcode" value="582914" />
                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Sign In and Continue
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <h2 className="text-xl font-bold text-[#0b1f4d]">Application checklist</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {checklist.map((item, index) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: index < 2 ? COLORS.green : COLORS.saffronDark }}
                    >
                      {index < 2 ? '✓' : '!'}
                    </span>
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">Application review</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Photograph upload is still pending</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Please continue to the document upload section to complete the photograph requirement before moving to payment.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-[#f8fafc] p-4">
                  <p className="text-sm font-semibold text-[#0b3c92]">Current task</p>
                  <p className="mt-2 text-sm text-slate-600">Upload passport photograph before payment and final submission.</p>
                </div>
                <div className="rounded-xl bg-[#fff8e1] p-4">
                  <p className="text-sm font-semibold text-[#8a5a00]">Pain point</p>
                  <p className="mt-2 text-sm text-slate-600">The portal gives exact size and dimension rules, but no friendly tooling to help meet them.</p>
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
                  Photo Requirements
                </h3>
                <ul className="space-y-3 text-sm" style={{ color: COLORS.gray[600] }}>
                  {requirements.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primary }}>
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-lg p-3 text-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                  <strong>Where DocBridge helps:</strong> the photograph can be fetched, cropped, resized, compressed, and checked before the portal rejects it.
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h2 className="text-lg font-bold" style={{ color: COLORS.gray[800] }}>
                    Upload Passport Photograph
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
                          Strict Requirements
                        </h4>
                        <p className="mt-1 text-sm" style={{ color: '#991B1B' }}>
                          Upload Passport Photo. JPEG only. Size 20KB - 50KB. Dimensions strictly 3.5cm width x 4.5cm height. White background.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium" style={{ color: COLORS.gray[700] }}>
                      Passport Photograph *
                    </label>

                    <div className="mb-4 rounded-lg border-2 border-dashed p-8 text-center" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[500] }}>
                      <svg className="mx-auto mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium">Standard upload expects a compliant JPEG</p>
                      <p className="mt-1 text-sm">20KB - 50KB, 3.5cm x 4.5cm, white background</p>
                    </div>

                    <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">DocBridge assist</p>
                      <p className="mt-2 text-sm text-slate-600">Fetch the photograph from DigiLocker, prepare it to the required format, and review before continuing.</p>
                      <div className="mt-4">
                        <DocBridgeWidget
                          portalId="upsc"
                          requirements="Upload Passport Photo. JPEG only. Size 20KB - 50KB. Dimensions strictly 3.5cm width x 4.5cm height. White background."
                          onSuccess={() => setStep('submitted')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.gray[50] }}>
                    <h4 className="mb-2 font-semibold" style={{ color: COLORS.gray[800] }}>
                      Photo Guidelines
                    </h4>
                    <ul className="space-y-1 text-sm" style={{ color: COLORS.gray[600] }}>
                      <li>Recent photograph from the last 6 months</li>
                      <li>Clear front-facing image with eyes open</li>
                      <li>Plain white background and balanced crop</li>
                      <li>No manual trial-and-error on external resize tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d6b07]">Photograph accepted</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">The application can move forward without another resize loop</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              The photograph has been accepted in the required format. You may continue to signature upload, payment, and final submission.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label="Document state" value="JPEG validated for portal rules" tone="blue" />
              <ResultCard label="Next milestone" value="Payment and final submission" tone="green" />
              <ResultCard label="User confidence" value="Review completed before upload" tone="saffron" />
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
