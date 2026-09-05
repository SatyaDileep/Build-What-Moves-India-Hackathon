'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitting' | 'submitted';

const checklistKeys = ['upsc.cl1', 'upsc.cl2', 'upsc.cl3', 'upsc.cl4'];
const instructionKeys = ['upsc.ii1', 'upsc.ii2', 'upsc.ii3'];

// OTR sidebar — mirrors upsconline.nic.in Common Application Form steps
const OTR_STEPS = [
  'Personal Profile',
  "Parents' Profile",
  'Social Category Profile',
  'Disability Profile',
  'Address',
  'Educational Profile',
  'Employment Experience Profile',
  'Achievements',
  'Previous UPSC Examination Profile',
  'Photo & Signature',
];

// What's New — mirrors upsc.gov.in ticker items
const WHATS_NEW = [
  'e - Admit Card: Combined Defence Services Examination (II), 2026',
  'Press Note: National Defence Academy and Naval Academy Examination (II), 2026',
  'e - Admit Card: National Defence Academy and Naval Academy Examination (II), 2026',
  'Final Result: CISF AC(EXE) LDCE-2026',
  'Exam Notification: Combined Geo-Scientist (Preliminary) Exam 2027',
];

export default function UPSCPortal() {
  const { t } = useLang();
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [done, setDone] = useState({ photo: false, signature: false });
  // Files chosen through the OTR card's hidden native inputs (carve-out mode).
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const handleNativeInput = (slot: 'photo' | 'signature') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (slot === 'photo') setPhotoFile(file);
    else setSignatureFile(file);
    // Reset so choosing the same file again still fires onChange.
    e.target.value = '';
  };

  // Both OTR slots accepted → hold a "Submitting…" beat (~1s) so the user sees
  // the upload happen, then advance to the submitted receipt. No jarring jump.
  useEffect(() => {
    if (step !== 'upload' || !done.photo || !done.signature) return;
    setStep('submitting');
    const id = setTimeout(() => setStep('submitted'), 1200);
    return () => clearTimeout(id);
  }, [done, step]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E9EDF2', fontFamily: "Arial, 'Open Sans', sans-serif" }}>
      <UpscGovHeader
        welcomeText={step === 'login' ? undefined : `${t('auth.welcome')}, Priya Sharma`}
        userIdText={step === 'login' ? undefined : 'URN: 25XXXXXX | Registration: UPSC2024001234'}
      />

      <div className="mx-auto mt-3 max-w-6xl px-4">
        <div className="mb-2 flex justify-end">
          <Link
            href="/"
            className="rounded border bg-white px-3 py-1.5 text-xs font-semibold text-[#1a3a6b] hover:bg-blue-50"
            style={{ borderColor: COLORS.legacyBorder }}
          >
            {t('nav.backHome')}
          </Link>
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-6xl px-4 pb-10">
        {step === 'login' && (
          <section className="space-y-4">
            {/* Hero + What's New — upsc.gov.in homepage replica */}
            <div className="grid gap-0 overflow-hidden rounded-sm border bg-white shadow-sm lg:grid-cols-[1fr_360px]" style={{ borderColor: '#c9d2dc' }}>
              <div className="relative min-h-[220px] bg-gradient-to-br from-[#d9c9a8] via-[#b8c4d4] to-[#7d94b5] p-6">
                <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(180deg, transparent 55%, #2c4a6e 100%)' }} />
                <p className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a3a6b]">{t('upsc.appPortal')}</p>
                <h1 className="relative mt-2 max-w-md text-2xl font-bold leading-snug text-[#10254a]">{t('upsc.loginTitle')}</h1>
                <p className="relative mt-2 max-w-md text-[13px] leading-6 text-[#2c3e55]">
                  {t('upsc.loginSub')}
                </p>
                <span className="relative mt-4 inline-block rounded-sm bg-[#1a3a6b] px-4 py-2 text-[13px] font-bold text-white">One Time Registration (OTR)</span>
              </div>
              <div style={{ backgroundColor: '#4a6b9c' }} className="p-0">
                <div className="flex items-center justify-between px-4 pb-2 pt-3">
                  <h2 className="text-lg font-bold text-white">What&apos;s New</h2>
                  <span className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-[10px] text-white">❚❚</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-[10px] text-white">▶</span>
                  </span>
                </div>
                <ul className="space-y-2.5 px-4 pb-4 text-[12.5px] leading-5 text-white">
                  {WHATS_NEW.map((n) => (
                    <li key={n} className="flex gap-2">
                      <span aria-hidden="true">»</span>
                      <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">{n}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Candidate login — upsconline.nic.in style box */}
            <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
              <div className="rounded-sm border bg-white p-5 shadow-sm" style={{ borderColor: '#c9d2dc' }}>
                <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: COLORS.legacyBorder }}>
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-[#eef3f9] text-sm">🏠</span>
                  <p className="text-[13px] text-[#495057]">Common Application Form &nbsp;›&nbsp; Examinations &nbsp;›&nbsp; Update My data &nbsp;›&nbsp; Instructions and FAQs</p>
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#1a3a6b]">{t('upsc.reviewTitle')}</h2>
                <p className="mt-2 text-[13px] leading-6 text-slate-600">{t('upsc.reviewBody')}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-sm border bg-[#f4f7fb] p-3" style={{ borderColor: '#c9d2dc' }}>
                    <p className="text-[13px] font-bold text-[#1a3a6b]">{t('upsc.task')}</p>
                    <p className="mt-1 text-[12.5px] leading-5 text-slate-600">{t('upsc.taskBody')}</p>
                  </div>
                  <div className="rounded-sm border border-amber-200 bg-[#fff8e1] p-3">
                    <p className="text-[13px] font-bold text-[#8a5a00]">{t('upsc.pain')}</p>
                    <p className="mt-1 text-[12.5px] leading-5 text-slate-600">{t('upsc.painBody')}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-sm border bg-slate-50 p-3" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{t('upsc.impInst')}</p>
                  <ul className="mt-1.5 list-disc space-y-1 pl-5 text-[12px] leading-5 text-slate-600">
                    {instructionKeys.map((k) => <li key={k}>{t(k)}</li>)}
                  </ul>
                </div>
              </div>

              <div className="h-fit rounded-sm border bg-white shadow-sm" style={{ borderColor: '#c9d2dc' }}>
                <div className="border-b px-4 py-3" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#f4f7fb' }}>
                  <h2 className="text-[15px] font-bold text-[#1a3a6b]">{t('login.candidate')}</h2>
                  <p className="mt-0.5 text-[12px] text-slate-500">{t('upsc.loginBox')}</p>
                </div>
                <div className="space-y-3 p-4">
                  <Field label={t('upsc.regId')} value="UPSC2024001234" />
                  <Field label={t('epfo.password')} value="••••••••••" />
                  <Field label={t('upsc.otp')} value="582914" />
                  <div>
                    <label className="mb-1.5 block text-[13px] font-medium text-slate-700">{t('epfo.captcha')}</label>
                    <div className="flex items-center gap-2">
                      <div className="rounded border bg-[#f8fafc] px-3 py-2.5 font-mono tracking-[0.28em] text-[#0b3c92]" style={{ borderColor: COLORS.gray[300] }}>
                        5 8 2 9
                      </div>
                      <input
                        readOnly
                        value="5829"
                        className="w-full rounded border px-3 py-2.5 text-[13px] text-slate-700"
                        style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.white }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{t('auth.demoPrefill')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('dashboard')}
                    className="w-full rounded-sm px-4 py-2.5 text-[13px] font-bold text-white hover:brightness-110"
                    style={{ backgroundColor: '#1a3a6b' }}
                  >
                    {t('auth.signInContinue')}
                  </button>
                  <div className="flex justify-between text-[12px] text-[#0b3c92]">
                    <span className="cursor-pointer hover:underline">{t('upsc.newReg')}</span>
                    <span className="cursor-pointer hover:underline">{t('auth.forgot')}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-4">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow={t('upsc.nudgeEyebrow')}
                title={t('upsc.nudgeTitle')}
                description={t('upsc.nudgeDesc')}
                ctaLabel={t('upload.continuePhoto')}
                onAction={() => setStep('upload')}
                onDismiss={() => setNudgeDismissed(true)}
                tone="amber"
              />
            ) : (
              <div className="flex items-center justify-between rounded border bg-amber-50/70 px-4 py-2.5 text-[13px]" style={{ borderColor: '#FDE68A' }}>
                <span className="text-amber-800">{t('upsc.nudgeDismissed')}</span>
                <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                  {t('epfo.showAgain')}
                </button>
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
              {/* OTR sidebar */}
              <OtrSidebar active="dashboard" />

              <div className="rounded-sm border bg-white p-5 shadow-sm" style={{ borderColor: '#c9d2dc' }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8a5a00]">{t('upsc.review')}</p>
                <h2 className="mt-1 text-2xl font-bold text-[#1a3a6b]">{t('upsc.candHome')}</h2>
                <div className="mt-3 rounded-sm border bg-[#f4f7fb] p-3" style={{ borderColor: '#c9d2dc' }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">{t('upsc.registration')}</p>
                  <p className="mt-0.5 text-[13px] font-bold text-[#1a3a6b]">UPSC2024001234</p>
                  <p className="text-[12px] text-slate-500">{t('upsc.regSub')}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">{t('upsc.inProg')}</span>
                    <span className="text-[12px] text-slate-500">{t('upsc.step35')}</span>
                  </div>
                </div>
                <h3 className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-slate-500">{t('upsc.checklist')}</h3>
                <ul className="mt-2 space-y-2.5 text-[13px]">
                  {checklistKeys.map((k, index) => (
                    <li key={k} className="flex items-start gap-2.5">
                      <span
                        className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: index < 2 ? '#2e7d32' : '#c77800' }}
                      >
                        {index < 2 ? '✓' : '!'}
                      </span>
                      <span className="text-slate-600">{t(k)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 rounded-sm border bg-white p-3" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{t('upsc.myApps')}</p>
                  <table className="mt-1.5 w-full text-left text-[12px]">
                    <thead className="text-slate-500">
                      <tr>
                        <th className="py-1 pr-2 font-semibold">{t('upsc.exam')}</th>
                        <th className="py-1 pr-2 font-semibold">{t('epfo.status')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-1.5 pr-2">CSE 2026</td>
                        <td className="py-1.5 pr-2">
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">{t('upsc.incomplete')}</span>
                        </td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-1.5 pr-2">CAPF 2025</td>
                        <td className="py-1.5 pr-2">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">{t('upsc.submitted')}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 rounded-sm bg-blue-50 p-3 text-[12px] leading-5 text-blue-800">
                  {t('upsc.tip')}
                </div>
                <button
                  type="button"
                  onClick={() => { setDone({ photo: false, signature: false }); setStep('upload'); }}
                  className="mt-4 rounded-sm px-4 py-2.5 text-[13px] font-bold text-white hover:brightness-110"
                  style={{ backgroundColor: '#c77800' }}
                >
                  {t('upload.continuePhoto')} →
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'upload' && (
          <section className="grid gap-4 lg:grid-cols-[300px_1fr]">
            <OtrSidebar active="upload" />

            <div className="space-y-4">
              {/* Slot progress — both OTR uploads must validate before submission */}
              <div className="flex items-center gap-3 rounded-sm border bg-white px-4 py-2.5 text-[12.5px] shadow-sm" style={{ borderColor: '#c9d2dc' }}>
                <span className="font-bold text-[#1a3a6b]">{t('upload.pending')}:</span>
                <SlotChip label="Photo" done={done.photo} />
                <SlotChip label="Signature" done={done.signature} />
              </div>
              {/* Update Passport Size Photo — upsconline OTR replica */}
              <div className="overflow-hidden rounded-sm border bg-white shadow-sm" style={{ borderColor: '#c9d2dc' }}>
                <div className="border-b px-5 py-3 text-center" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#f4f7fb' }}>
                  <h2 className="text-[15px] font-bold text-[#1a3a6b]">Update Passport Size Photo</h2>
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="mx-auto flex h-36 w-28 shrink-0 items-center justify-center rounded-sm border bg-[#f8fafc] text-[11px] text-slate-400" style={{ borderColor: COLORS.gray[300] }}>
                      Photo
                      <br />
                      350×1000px
                    </div>
                    <div className="text-[12.5px] font-bold leading-6" style={{ color: '#b30000' }}>
                      <p>NOTE 1:- Allowed Photo size - 20 KB to 200 KB, File format jpg</p>
                      <p>NOTE 2:- File name should be photo</p>
                      <p>NOTE 3:- Face must cover at least 75% or 3/4th of the area in the photo and show face looking directly at the camera</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {/* Hidden native input — DocBridge's "Upload from device" card opens this dialog */}
                    <input
                      id="native-photo-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      style={{ display: 'none' }}
                      onChange={handleNativeInput('photo')}
                    />
                    <span className="text-[12px] text-slate-400">Choose File</span>
                    <a href="#" onClick={(e) => e.preventDefault()} className="ml-auto text-[12px] text-[#0b3c92] underline">View guidelines for uploading photo</a>
                  </div>
                  <div className="mt-3 rounded-sm border border-dashed p-4" style={{ borderColor: '#9db6d8', backgroundColor: '#f6f9fd' }}>
                    <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1a3a6b]">DocBridge assist — {t('upsc.step35doc')}</p>
                    <DocBridgeWidget
                      portalId="upsc"
                      docType="photo"
                      requirements="Upload latest Passport Photo. JPEG only. File size 20KB - 200KB. Resolution 350px - 1000px. Plain white background. Face must cover 3/4th (75%) of the photo. A live photograph must also be captured and matched."
                      onSuccess={() => setDone((d) => ({ ...d, photo: true }))}
                      deviceInputId="native-photo-input"
                      deviceFile={photoFile}
                      onDeviceFileChange={setPhotoFile}
                    />
                  </div>
                </div>
              </div>

              {/* Update Signature — upsconline OTR replica, DocBridge-enabled */}
              <div className="overflow-hidden rounded-sm border bg-white shadow-sm" style={{ borderColor: '#c9d2dc' }}>
                <div className="border-b px-5 py-3 text-center" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#f4f7fb' }}>
                  <h2 className="text-[15px] font-bold text-[#1a3a6b]">Update Signature</h2>
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <div className="mx-auto flex h-20 w-56 shrink-0 items-center justify-center rounded-sm border bg-[#f8fafc] font-[cursive] text-xl text-slate-500" style={{ borderColor: COLORS.gray[300] }}>
                      Signature
                    </div>
                    <div className="text-[12.5px] font-bold leading-6" style={{ color: '#b30000' }}>
                      <p>NOTE 1:- Allowed Signature size - 20 KB to 200 KB, File format jpg</p>
                      <p>NOTE 2:- File name should be signature</p>
                      <p>NOTE 3:- The height and width of signature image must be between 350 and 1000 pixels</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {/* Hidden native input — DocBridge's "Upload from device" card opens this dialog */}
                    <input
                      id="native-signature-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      style={{ display: 'none' }}
                      onChange={handleNativeInput('signature')}
                    />
                    <span className="text-[12px] text-slate-400">Choose File</span>
                    <a href="#" onClick={(e) => e.preventDefault()} className="ml-auto text-[12px] text-[#0b3c92] underline">View guidelines for uploading signature</a>
                  </div>
                  <div className="mt-3 rounded-sm border border-dashed p-4" style={{ borderColor: '#9db6d8', backgroundColor: '#f6f9fd' }}>
                    <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.12em] text-[#1a3a6b]">DocBridge assist — Signature</p>
                    <DocBridgeWidget
                      portalId="upsc"
                      docType="signature"
                      requirements="UPSC signature upload. Signature scan, JPEG only, 20KB - 200KB, height and width between 350 and 1000 pixels, white paper background, running handwriting."
                      onSuccess={() => setDone((d) => ({ ...d, signature: true }))}
                      deviceInputId="native-signature-input"
                      deviceFile={signatureFile}
                      onDeviceFileChange={setSignatureFile}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'submitting' && (
          <section className="rounded-sm border bg-white p-8 text-center shadow-sm" style={{ borderColor: '#c9d2dc' }}>
            <div className="mx-auto mb-5 flex items-center justify-center">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 animate-spin rounded-full" style={{ border: '4px solid #E5E7EB', borderTopColor: COLORS.saffron }} />
                <div className="absolute inset-2 animate-spin rounded-full" style={{ border: '3px solid transparent', borderTopColor: COLORS.success, animationDirection: 'reverse', animationDuration: '1.2s' }} />
                <div className="absolute inset-0 flex items-center justify-center text-[#1a3a6b]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 10l-4-4-4 4M12 6v12" /></svg>
                </div>
              </div>
            </div>
            <h2 className="text-lg font-bold text-[#1a3a6b]">Submitting your documents to upsconline.nic.in…</h2>
            <p className="mt-1.5 text-sm text-slate-500">Uploading Photograph + Signature to OTR&nbsp;·&nbsp;validated 20–200&nbsp;KB JPG</p>
            <div className="mx-auto mt-5 h-1.5 max-w-sm overflow-hidden rounded-full" style={{ backgroundColor: '#E5E7EB' }}>
              <div className="h-full animate-pulse rounded-full" style={{ width: '100%', backgroundColor: '#2e7d32' }} />
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-sm border bg-white p-6 shadow-sm" style={{ borderColor: '#c9d2dc' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0d6b07]">{t('upsc.doneEyebrow')}</p>
            <h2 className="mt-1 text-2xl font-bold text-[#1a3a6b]">{t('upsc.doneTitle')}</h2>
            <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-600">
              {t('upsc.doneBody')}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <ResultCard label={t('vahan.rc1l')} value={t('upsc.rc1v')} tone="blue" />
              <ResultCard label={t('upsc.rc2l')} value={t('upsc.rc2v')} tone="green" />
              <ResultCard label={t('upsc.rc3l')} value={t('upsc.rc3v')} tone="saffron" />
            </div>
          </section>
        )}
      </main>

      {/* Gov footer strip */}
      <footer className="border-t py-4 text-center text-[11.5px] text-slate-500" style={{ borderColor: '#c9d2dc', backgroundColor: '#f4f7fb' }}>
        Content owned, updated and maintained by Union Public Service Commission · Demo recreation for hackathon — Helpline: 1800-118-711
      </footer>
    </div>
  );
}

// Authentic UPSC chrome: utility bar + masthead + navy nav + helpline strip
function UpscGovHeader({ welcomeText, userIdText }: { welcomeText?: string; userIdText?: string }) {
  return (
    <header>
      {/* Utility bar */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #DEE2E6' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-1.5 text-[12px]" style={{ color: '#212529' }}>
          <a href="#" onClick={(e) => e.preventDefault()} className="hover:underline">SiteMap</a>
          <span className="text-[#ADB5BD]">|</span>
          <a href="#main-content" className="hover:underline">Skip To Main Content</a>
          <span className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1 sm:flex">
              <input placeholder="Search - Keyword, Phrase" className="w-44 rounded-sm border px-2 py-1 text-[12px]" style={{ borderColor: '#c9d2dc' }} />
              <button type="button" className="rounded-sm border px-2.5 py-1 text-[12px] font-semibold" style={{ borderColor: '#c9d2dc', backgroundColor: '#f4f7fb' }}>Search</button>
            </span>
            {['A⁺', 'A', 'A⁻'].map((a) => (
              <span key={a} className="flex h-5 w-5 items-center justify-center rounded-sm border border-red-700 text-[10px] font-bold text-red-700">{a}</span>
            ))}
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#1a3a6b] text-[10px] font-bold text-white">A</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#0a66c2] text-[10px] font-bold text-white">in</span>
            <span className="font-semibold">हिन्दी</span>
          </span>
        </div>
      </div>

      {/* Masthead */}
      <div style={{ backgroundColor: '#fff' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center" aria-label="National Emblem">
              <svg viewBox="0 0 64 64" className="h-12 w-12" role="img" aria-label="National Emblem">
                <g fill="none" stroke="#8a6d1b" strokeWidth="1.6">
                  <circle cx="32" cy="24" r="13" />
                  <circle cx="32" cy="24" r="3" fill="#8a6d1b" stroke="none" />
                  {Array.from({ length: 24 }).map((_, i) => {
                    const a = (i * 15 * Math.PI) / 180;
                    return <line key={i} x1={32 + 4.5 * Math.cos(a)} y1={24 + 4.5 * Math.sin(a)} x2={32 + 12 * Math.cos(a)} y2={24 + 12 * Math.sin(a)} strokeWidth="0.9" />;
                  })}
                </g>
                <rect x="14" y="40" width="36" height="9" rx="1" fill="#7a1f1f" />
                <text x="32" y="47.5" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#ffd766" fontFamily="Arial">UPSC</text>
              </svg>
            </span>
            <span>
              <span className="block text-[19px] font-bold leading-tight text-[#1a1a1a]" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>संघ लोक सेवा आयोग</span>
              <span className="block text-[19px] font-bold leading-tight tracking-wide text-[#1a1a1a]">UNION PUBLIC SERVICE COMMISSION</span>
            </span>
          </div>
          <div className="ml-auto flex items-center gap-5">
            <span className="hidden items-center gap-1 sm:flex" aria-label="UPSC centenary">
              <span className="text-5xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>1</span>
              <span className="text-5xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>0</span>
              <span className="text-5xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>0</span>
              <span className="ml-1 text-[10px] font-bold leading-tight text-[#1a3a6b]">UPSC<br />1926–2026</span>
              <span className="ml-1 h-8 w-14 rounded-b-full" style={{ background: 'linear-gradient(90deg,#FF9933 33%,#fff 33% 66%,#138808 66%)' }} />
            </span>
            <span className="hidden text-right md:block" aria-label="Azadi Ka Amrit Mahotsav">
              <span className="block text-2xl font-bold" style={{ color: '#8a6d1b', fontFamily: 'Georgia, serif' }}>75</span>
              <span className="block text-[11px] font-bold leading-tight text-[#7a4a00]" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>आज़ादी का<br />अमृत महोत्सव</span>
            </span>
            {(welcomeText || userIdText) && (
              <span className="hidden border-l pl-4 text-right lg:block" style={{ borderColor: '#c9d2dc' }}>
                {welcomeText && <span className="block text-[12px] font-bold text-[#212529]">{welcomeText}</span>}
                {userIdText && <span className="mt-0.5 block text-[11px] text-[#495057]">{userIdText}</span>}
                <span className="mt-1 inline-block rounded-sm bg-[#1a3a6b] px-2 py-0.5 text-[11px] font-bold text-white">Logout</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navy nav */}
      <nav style={{ backgroundColor: '#2c4f82' }}>
        <div className="mx-auto flex max-w-6xl items-center gap-0 overflow-x-auto px-4 text-[13.5px] font-medium text-white">
          <a href="#" onClick={(e) => e.preventDefault()} className="px-4 py-2.5 hover:bg-[#1e3a63]" aria-label="Home">⌂</a>
          {['About Us', 'Examination', 'Recruitment', 'Government Users', 'Forms & Downloads', 'FAQs', 'RTI'].map((label) => (
            <a key={label} href="#" onClick={(e) => e.preventDefault()} className="whitespace-nowrap border-l border-white/15 px-4 py-2.5 hover:bg-[#1e3a63]">
              {label}{['About Us', 'Examination', 'Recruitment', 'Government Users'].includes(label) ? ' ▾' : ''}
            </a>
          ))}
        </div>
      </nav>

      {/* Helpline strip */}
      <div style={{ backgroundColor: '#3f6db3' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-0.5 px-4 py-1.5 text-center text-[12.5px] font-medium text-white">
          <span>Helpline - SC/ST/OBC/EWS/PwBD (1800-118-711)</span>
          <span>HELPDESK : 011-24041001 / 011-40303444</span>
        </div>
      </div>
    </header>
  );
}

function OtrSidebar({ active }: { active: 'dashboard' | 'upload' }) {
  return (
    <div className="h-fit overflow-hidden rounded-sm border bg-white shadow-sm" style={{ borderColor: '#c9d2dc' }}>
      <div className="border-b px-4 py-2.5" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#eef3f9' }}>
        <p className="text-[12px] font-bold uppercase tracking-wide text-[#1a3a6b]">⌕ Preview Universal Registration</p>
        <p className="mt-0.5 text-[13px] font-bold text-[#1a3a6b]">Common Application Form</p>
      </div>
      <ul className="divide-y text-[12.5px]" style={{ borderColor: COLORS.legacyBorder }}>
        {OTR_STEPS.map((label) => {
          const isActive = active === 'upload' && label === 'Photo & Signature';
          const done = ['Personal Profile', "Parents' Profile", 'Social Category Profile'].includes(label);
          return (
            <li key={label} className="flex items-center gap-2.5 px-4 py-2" style={{ backgroundColor: isActive ? '#e8f0fc' : undefined }}>
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]" style={{ borderColor: '#9db6d8', color: '#1a3a6b' }}>◉</span>
              <span className={isActive ? 'font-bold text-[#1a3a6b]' : 'text-slate-600'}>{label}</span>
              <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: done || isActive ? '#2e7d32' : '#b0bec5' }}>
                {done || isActive ? '✓' : '·'}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SlotChip({ label, done }: { label: string; done: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={done ? { backgroundColor: '#e6f4ea', color: '#0d6b07' } : { backgroundColor: '#fff8e1', color: '#8a5a00' }}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full text-[9px] text-white" style={{ backgroundColor: done ? '#2e7d32' : '#c77800' }}>
        {done ? '✓' : '!'}
      </span>
      {label} {done ? '✓' : '○'}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</label>
      <input
        readOnly
        value={value}
        className="w-full rounded-sm border px-3 py-2.5 text-[13px] text-slate-700"
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
    <div className="rounded-sm p-4" style={styles}>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em]">{label}</p>
      <p className="mt-1.5 text-[13px] font-semibold leading-6">{value}</p>
    </div>
  );
}
