'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const photoRequirements = [
  'Recent passport-size photo, plain background',
  'JPEG / JPG only — PNG and HEIC rejected',
  'Under 50 KB',
  'Face clearly visible, no filters or shadows',
];

const incomeRequirements = [
  'Issued by SDM / Tehsildar for FY 2026-27',
  'PDF or JPG, maximum 500 KB',
  'Stamp and signature of issuing authority visible',
  'Name must match Aadhaar exactly',
];

export default function NSPPortal() {
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [done, setDone] = useState({ photo: false, income: false });

  useEffect(() => {
    if (done.photo && done.income) setStep('submitted');
  }, [done]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.legacyBg }}>
      <GovernmentHeader
        portalName="NSP"
        portalFullName="National Scholarship Portal — Ministry of Electronics & IT"
        portalInitials="NSP"
        welcomeText={step === 'login' ? undefined : 'Welcome, Meera Nair'}
        userIdText={step === 'login' ? undefined : 'OTR: NSPOTR2026MEERA19'}
      />

      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">NSP Student Dashboard</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>AY 2026-27 · Upload Documents</span>
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">AY 2026-27 · OTR login</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Student login</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  One 14-digit OTR number carries the student through the entire academic career — login once, apply for merit and welfare schemes together.
                </p>
              </div>

              <div className="rounded-xl border bg-[#fff8e1] p-5" style={{ borderColor: '#FDE68A' }}>
                <p className="text-sm font-bold text-[#8a5a00]">Document upload is where applications stall</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Strict size and format rules block final submission — and a blurred or expired income certificate is the most common reason a nodal officer defects an application.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">Student Login</h2>
                <p className="mt-1 text-sm text-slate-500">OTR number, Aadhaar-linked mobile OTP.</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label="OTR Number (14-digit)" value="12345678901234" />
                <Field label="Aadhaar-linked Mobile" value="97450 12365" />
                <Field label="One-Time Passcode" value="491726" />
                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Login with OTR
                </button>
                <div className="flex justify-between text-xs text-[#0b3c92]">
                  <span>Apply for OTR</span>
                  <span>NSP OTR App (face auth)</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-6">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow="AY 2026-27 · OTR NSPOTR2026MEERA19"
                title="2 documents pending — photo and income certificate block submission"
                description="NSP needs a photo under 50 KB plus a stamped income-certificate PDF under 500 KB. Open uploads — DocBridge prepares the JPEG and the PDF side by side from DigiLocker."
                ctaLabel="Upload Documents"
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
                <h2 className="text-xl font-bold text-[#0b1f4d]">Student profile</h2>
                <div className="mt-4 rounded-lg bg-[#f8fafc] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">OTR</p>
                  <p className="mt-1 text-sm font-bold text-[#0b1f4d]">NSPOTR2026MEERA19</p>
                  <p className="text-xs text-slate-500">Meera Nair · B.Sc 1st year · Kerala</p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Aadhaar seeding (DBT)</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">Seeded</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Documents</span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">2 pending</span>
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Eligible schemes</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {['Post-Matric Scholarship (SC)', 'Merit-cum-Means (Minority)'].map((scheme) => (
                    <li key={scheme} className="rounded-lg border bg-white p-3" style={{ borderColor: COLORS.legacyBorder }}>
                      <p className="font-semibold text-slate-700">{scheme}</p>
                      <p className="mt-1 text-xs text-slate-500">Open till 31-10-2026</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">Application 2026-27</p>
                <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">One photo, one certificate — two different rulebooks</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  The photo is a tiny JPEG while the income certificate is a stamped PDF up to 500 KB — students usually bounce between a photo resizer and a PDF compressor. DocBridge does both in place.
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    <p className="text-sm font-semibold text-[#0b3c92]">Photograph · ≤50 KB</p>
                    <p className="mt-2 text-sm text-slate-600">JPEG · plain background · face clearly visible.</p>
                  </div>
                  <div className="rounded-xl bg-[#fff8e1] p-4">
                    <p className="text-sm font-semibold text-[#8a5a00]">Income certificate · ≤500 KB</p>
                    <p className="mt-2 text-sm text-slate-600">PDF · FY 2026-27 · stamp & signature visible.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="mt-6 rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.saffronDark }}
                >
                  Upload Documents →
                </button>
                <div className="mt-6 rounded-lg border bg-slate-50 p-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Verification chain after submit</p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">Institute nodal officer → District → State → PFMS payment. A defect at any level sends the form back to the student.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'upload' && (
          <section className="space-y-8">
            <div className="rounded-lg border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0b1f4d]">Upload documents</h2>
                  <p className="mt-1 text-sm text-slate-500">AY 2026-27 · Post-Matric + Merit-cum-Means · only PDF and JPG accepted</p>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Upload Document(s)</span>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">Photograph</h3>
                  <p className="mt-1 text-sm text-slate-500">JPEG · under 50 KB</p>
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
                    <p className="mt-2 text-sm text-slate-600">Fetch the photo from DigiLocker and compress it under 50 KB.</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="nsp"
                        docType="photo"
                        requirements="NSP OTR scholarship photo. JPEG only, under 50KB, 200x230 pixels, white background, face visible."
                        onSuccess={() => setDone((d) => ({ ...d, photo: true }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">Income certificate</h3>
                  <p className="mt-1 text-sm text-slate-500">PDF · maximum 500 KB · FY 2026-27</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2 text-sm text-slate-600">
                    {incomeRequirements.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">DocBridge assist</p>
                    <p className="mt-2 text-sm text-slate-600">Fetch the certificate scan and convert it to a stamped PDF under 500 KB — no ilovepdf detour.</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="nsp"
                        docType="income"
                        requirements="NSP income certificate upload. PDF only, maximum 500KB, stamp and signature of issuing authority visible."
                        onSuccess={() => setDone((d) => ({ ...d, income: true }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: COLORS.errorLight, color: '#991B1B' }}>
              <strong>Rejections you avoid:</strong> PNG/HEIC uploads that the portal silently drops, and expired certificates that a nodal officer defects months later.
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d6b07]">Documents uploaded</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Photo and income proof are in — the verification chain takes over</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Both documents met the format and size rules, so the application can move to institute verification instead of bouncing at upload.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label="Photograph" value="JPEG under 50 KB ✓" tone="green" />
              <ResultCard label="Income certificate" value="PDF under 500 KB ✓" tone="blue" />
              <ResultCard label="Next milestone" value="Institute → District → PFMS" tone="saffron" />
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
