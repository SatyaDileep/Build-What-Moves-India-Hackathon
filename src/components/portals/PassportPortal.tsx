'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const photoRequirements = [
  'Exactly 630 × 810 pixels (35 × 45 mm, 7:9)',
  'JPEG only — PNG, HEIC, WebP rejected',
  'File size between 10 KB and 250 KB',
  'Plain white background, no shadows',
  'Face covers 80–85% of the frame',
  'No glasses, neutral expression',
];

const signatureRequirements = [
  'Handwritten in blue or black ballpoint pen',
  'JPEG only, under 100 KB',
  'Wide rectangular crop, centred with margin',
  'Plain white paper — no ruled lines or shadows',
];

export default function PassportPortal() {
  const { t } = useLang();
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [done, setDone] = useState({ photo: false, signature: false });

  useEffect(() => {
    if (done.photo && done.signature) setStep('submitted');
  }, [done]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.legacyBg }}>
      <GovernmentHeader
        portalName="Passport Seva"
        portalFullName="Passport Seva — Ministry of External Affairs"
        portalInitials="PSP"
        welcomeText={step === 'login' ? undefined : `${t('auth.welcome')}, Kabir Mehta`}
        userIdText={step === 'login' ? undefined : 'File No: BNGO40217846125'}
      />

      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">Passport Seva — Applicant Home</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>Upload Photo & Signature</span>
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">GPSP 2.0 · Applicant login</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Existing user login</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Sign in with your Login ID to track the application, upload the ICAO photo and signature, and book the PSK appointment.
                </p>
              </div>

              <div className="rounded-xl border bg-[#fff8e1] p-5" style={{ borderColor: '#FDE68A' }}>
                <p className="text-sm font-bold text-[#8a5a00]">Uploads are mandatory before acceptance</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Since GPSP 2.0, the digital photo and signature must be uploaded online — the application is not accepted without them. Only 12 upload attempts are allowed per application.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">{t('login.applicant')}</h2>
                <p className="mt-1 text-sm text-slate-500">Login ID and password, then the application dashboard.</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label="Login ID" value="kabir.mehta34" />
                <Field label="Password" value="••••••••••" />
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Captcha</label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border bg-[#f8fafc] px-4 py-3 font-mono tracking-[0.28em] text-[#0b3c92]" style={{ borderColor: COLORS.gray[300] }}>
                      7 3 9 4
                    </div>
                    <input
                      readOnly
                      value="7394"
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
                  {t('auth.login')}
                </button>
                <div className="flex justify-between text-xs text-[#0b3c92]">
                  <span>New User Registration</span>
                  <span>Forgot Login ID / Password</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-6">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow="ARN DL107 series · 12 attempts left"
                title="Photo & signature upload pending — application not accepted without them"
                description="Passport Seva needs exactly 630×810px JPEG (10–250 KB) plus a signature under 100 KB. Open the upload section — DocBridge prepares both from DigiLocker before the portal burns an attempt."
                ctaLabel={t('upload.photoSig')}
                onAction={() => setStep('upload')}
                onDismiss={() => setNudgeDismissed(true)}
                tone="amber"
              />
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-amber-50/70 px-4 py-2.5 text-sm" style={{ borderColor: '#FDE68A' }}>
                <span className="text-amber-800">Nudge dismissed — use the table below to continue.</span>
                <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                  Show again
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-xl font-bold text-[#0b1f4d]">Applicant home</h2>
                <div className="mt-4 rounded-lg bg-[#f8fafc] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">File number</p>
                  <p className="mt-1 text-sm font-bold text-[#0b1f4d]">BNGO40217846125</p>
                  <p className="text-xs text-slate-500">Kabir Mehta · Fresh · Normal scheme</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">Uploads pending</span>
                    <span className="text-xs text-slate-500">12/12 attempts left</span>
                  </div>
                </div>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Application stages</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {['Form submitted (ARN generated)', 'Fee paid online', 'Photo & signature upload', 'PSK appointment'].map((item, index) => (
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
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">Track application status</p>
                <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Two uploads stand between you and the PSK slot</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      <tr>
                        <th className="py-2 pr-4">Application</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-2 pr-4">BNGO40217846125 · Fresh</td>
                        <td className="py-2 pr-4"><span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">Photo/Signature pending</span></td>
                        <td className="py-2 pr-4"><button type="button" onClick={() => setStep('upload')} className="font-semibold text-[#0b3c92] underline">Upload ⋮</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-lg p-3 text-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                  <strong>Why attempts matter:</strong> each rejected file burns one of 12 tries. After the 12th failure the ARN is blocked and the form must be redone.
                </div>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="mt-6 rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.saffronDark }}
                >
                  {t('upload.photoSig')} →
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
                  <p className="mt-1 text-sm text-slate-500">ARN BNGO40217846125 · attempts remaining: <strong className="text-amber-700">12 / 12</strong></p>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Stage 3 of 4 · Uploads</span>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">Photograph</h3>
                  <p className="mt-1 text-sm text-slate-500">Exactly 630 × 810 px · JPEG · 10–250 KB</p>
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
                    <p className="mt-2 text-sm text-slate-600">Fetch the photo from DigiLocker and get a pixel-exact 630×810 JPEG before the portal sees it.</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="passport"
                        docType="photo"
                        requirements="Passport Seva GPSP upload. Photo exactly 630x810 pixels, JPEG only, 10KB - 250KB, white background, 80-85 percent face coverage."
                        onSuccess={() => setDone((d) => ({ ...d, photo: true }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">Signature</h3>
                  <p className="mt-1 text-sm text-slate-500">JPEG · under 100 KB · wide rectangular crop</p>
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
                    <p className="mt-2 text-sm text-slate-600">Fetch the signature scan and compress it under 100 KB without touching legibility.</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="passport"
                        docType="signature"
                        requirements="Passport signature upload. Signature scan, JPEG only, under 100KB, white paper background."
                        onSuccess={() => setDone((d) => ({ ...d, signature: true }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: COLORS.errorLight, color: '#991B1B' }}>
              <strong>Portal errors you avoid:</strong> “Image size is not correct. Dimensions should be 630*810 pixels.” — one pixel off is a rejection and a burned attempt.
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d6b07]">Uploads accepted</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Photo and signature cleared GPSP checks — book the PSK slot</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Both files passed the pixel, format, and size validators with attempts to spare. The application can now move to appointment booking at the Passport Seva Kendra.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label="Photograph" value="630×810 JPEG, 10–250 KB ✓" tone="green" />
              <ResultCard label="Signature" value="JPEG under 100 KB ✓" tone="blue" />
              <ResultCard label="Next milestone" value="Pay & book PSK appointment" tone="saffron" />
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
