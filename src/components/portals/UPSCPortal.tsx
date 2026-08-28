'use client';

import Link from 'next/link';
import { useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
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
  'Size between 20 KB and 200 KB',
  'Resolution 350px to 1000px',
  'Plain white background',
  'Face must cover 3/4th (75%) of photo',
  'Live photograph capture & match required',
];

export default function UPSCPortal() {
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

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
        <div className="mb-4 flex justify-end">
          <Link
            href="/"
            className="rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-2 text-sm font-semibold text-[#1E3A8A] shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-50"
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">Application portal</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Candidate login</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Sign in to continue your application and complete the required photograph and signature uploads before final submission.
                </p>
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
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Captcha</label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border bg-[#f8fafc] px-4 py-3 font-mono tracking-[0.28em] text-[#0b3c92]" style={{ borderColor: COLORS.gray[300] }}>
                      5 8 2 9
                    </div>
                    <input
                      readOnly
                      value="5829"
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
                  Sign In and Continue
                </button>
                <div className="flex justify-between text-xs text-[#0b3c92]">
                  <span>New Registration (OTR)</span>
                  <span>Forgot Password</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-6">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow="UPSC CSE 2026 · Registration UPSC2024001234"
                title="Photograph upload pending — complete before payment & final submission"
                description="UPSC needs a 20-200 KB JPEG (350-1000px, 75% face) plus a live-photo match. Open the upload section — DocBridge will prepare it from DigiLocker to pass both checks."
                ctaLabel="Continue to Photograph Upload"
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
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-xl font-bold text-[#0b1f4d]">Candidate home</h2>
                <div className="mt-4 rounded-lg bg-[#f8fafc] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Registration</p>
                  <p className="mt-1 text-sm font-bold text-[#0b1f4d]">UPSC2024001234</p>
                  <p className="text-xs text-slate-500">Priya Sharma · CSE 2026 · OTR: UTR2024008841</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">In progress</span>
                    <span className="text-xs text-slate-500">Step 3 of 5</span>
                  </div>
                </div>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Application checklist</h3>
                <ul className="mt-3 space-y-3 text-sm">
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
                <div className="mt-4 rounded-lg border bg-white p-3" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">My applications</p>
                  <table className="mt-2 w-full text-left text-xs">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="py-1 pr-2">Exam</th>
                        <th className="py-1 pr-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-1.5 pr-2">CSE 2026</td>
                        <td className="py-1.5 pr-2">
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Incomplete</span>
                        </td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-1.5 pr-2">CAPF 2025</td>
                        <td className="py-1.5 pr-2">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Submitted</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-lg bg-blue-50 p-3 text-xs leading-5 text-blue-800">
                  Tip: Complete uploads before “Pay & Submit” — the portal locks edits after payment.
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">Application review</p>
                <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Photograph upload is still pending</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Please continue to the document upload section to complete the photograph requirement before moving to payment and final submission.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    <p className="text-sm font-semibold text-[#0b3c92]">Current task</p>
                    <p className="mt-2 text-sm text-slate-600">Upload passport photo before payment; UPSC will also run a live-photo match.</p>
                  </div>
                  <div className="rounded-xl bg-[#fff8e1] p-4">
                    <p className="text-sm font-semibold text-[#8a5a00]">Pain point</p>
                    <p className="mt-2 text-sm text-slate-600">Exact size and dimension rules, but no friendly tooling to help meet them.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="mt-6 rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.saffronDark }}
                >
                  Continue to Photograph Upload →
                </button>
                <div className="mt-6 rounded-lg border bg-slate-50 p-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Important instructions</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">
                    <li>Keep your OTR details consistent across exams.</li>
                    <li>Live photograph must match uploaded photo (same lighting/pose).</li>
                    <li>Editing window closes before admit card release.</li>
                  </ul>
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
                          Upload latest Passport Photo. JPEG only. File size 20KB - 200KB. Resolution 350px - 1000px. Plain white background. Face must cover 3/4th (75%) of the photo. A live photograph must also be captured and matched.
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
                      <p className="font-medium">Standard upload expects a fully compliant JPEG</p>
                      <p className="mt-1 text-sm">20KB - 200KB · 350 - 1000px · white background · 75% face</p>
                    </div>



                    <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">DocBridge assist</p>
                      <p className="mt-2 text-sm text-slate-600">Fetch the photograph from DigiLocker, prepare it to the required UPSC 2026 format, and review before continuing.</p>
                      <div className="mt-4">
                        <DocBridgeWidget
                          portalId="upsc"
                          requirements="Upload latest Passport Photo. JPEG only. File size 20KB - 200KB. Resolution 350px - 1000px. Plain white background. Face must cover 3/4th (75%) of the photo. A live photograph must also be captured and matched."
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
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">The application cleared the 2026 photo and live-match checks without a resize loop</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              The photograph met the 20-200KB, 350-1000px, and white-background rules, and stayed consistent with the live photograph. You may continue to signature upload, payment, and final submission.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label="Document state" value="JPEG validated for UPSC 2026 rules" tone="blue" />
              <ResultCard label="Next milestone" value="Payment and final submission" tone="green" />
              <ResultCard label="Live photo match" value="Consistent with DigiLocker source" tone="saffron" />
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
