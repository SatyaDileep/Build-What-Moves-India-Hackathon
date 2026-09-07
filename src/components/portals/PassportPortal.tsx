'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import DocBridgeGuide from '@/components/DocBridgeGuide';
import TricolorBar from '@/components/ui/TricolorBar';
import { LanguageToggle, useLang } from '@/lib/i18n';
import HowItWorksModal, { HowItWorksIcon, HowItWorksTrigger } from '@/components/ui/HowItWorksModal';
import SpecsModal from '@/components/ui/SpecsModal';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'apps' | 'preview';

const photoKeys = ['pp.pr4', 'pp.pr5', 'pp.pr6'];
const signatureKeys = ['pp.sr1', 'pp.sr3', 'pp.sr4'];
const stageKeys = ['pp.sg1', 'pp.sg2', 'pp.sg3', 'pp.sg4'];

const NAVY = '#003366';
const NAVY_DARK = '#00264d';
const LINK_BLUE = '#0a4a90';
const PAGE_BG = '#f8f9fa';
const BORDER = '#ccc';

function randomCaptcha(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join(' ');
}

export default function PassportPortal() {
  const { t } = useLang();
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [showHowModal, setShowHowModal] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [done, setDone] = useState({ photo: false, signature: false });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [photoResult, setPhotoResult] = useState<any>(null);
  const [sigResult, setSigResult] = useState<any>(null);
  const [captcha, setCaptcha] = useState('7 3 9 4');

  // Two demo personas on the same portal: default Kabir (standard, quiet
  // pill) vs ?persona=elder Ramesh (68, assistive auto-launch + voice).
  const [isElder, setIsElder] = useState(false);
  useEffect(() => {
    try { setIsElder(new URLSearchParams(window.location.search).get('persona') === 'elder'); } catch {}
  }, []);
  const applicantName = isElder ? 'RAMESH SINGH' : 'KABIR MEHTA';
  const applicantLogin = isElder ? 'ramesh.singh68' : 'kabir.mehta34';

  // Optimized copies stamped into the printed form. Object URLs are revoked
  // whenever the underlying result changes or the portal unmounts.
  const photoURL = useOptimizedUrl(photoResult);
  const sigURL = useOptimizedUrl(sigResult);

  const handleStepDone = (id: string, result?: any) => {
    setDone((d) => ({ ...d, [id]: true }));
    if (result) {
      if (id === 'photo') setPhotoResult(result);
      else setSigResult(result);
    }
  };

  // DocBridge Guide overlay — the portal page keeps its native upload rows;
  // the guide companion walks photo → signature with a spotlight on each.
  const guideSteps = [
    {
      id: 'photo',
      label: t('pp.photo'),
      requirements: 'Passport Seva GPSP upload. Photo exactly 630x810 pixels, JPEG only, 10KB - 250KB, white background, 80-85 percent face coverage.',
      deviceInputId: 'native-passport-photo-input',
      captureModes: ['camera', 'digilocker', 'device'] as const,
      assistantNote: t('pp.smartPhoto'),
    },
    {
      id: 'signature',
      label: t('pp.signature'),
      requirements: 'Passport signature upload. Signature scan, JPEG only, under 100KB, white paper background.',
      deviceInputId: 'native-passport-signature-input',
      captureModes: ['draw', 'digilocker', 'device'] as const,
      assistantNote: t('pp.smartSig'),
    },
  ];

  const handleNativeInput = (slot: 'photo' | 'signature') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (slot === 'photo') setPhotoFile(file);
    else setSignatureFile(file);
    e.target.value = '';
  };

  const handleGuideDeviceFile = (id: string, file: File | null) => {
    if (id === 'photo') setPhotoFile(file);
    else setSignatureFile(file);
  };

  // Stay on the upload screen once both docs are in — the demo shows the
  // 2-row table here, then the narrator manually continues to My Applications.
  const bothDone = done.photo && done.signature;

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BG, fontFamily: 'Arial, Tahoma, Verdana, sans-serif', fontSize: '13px', color: '#222' }}>
      <TricolorBar className="h-2.5" />

      <div style={{ backgroundColor: '#e9ecef', borderBottom: '1px solid #d4d4d4' }}>
        <div className="mx-auto flex max-w-[980px] flex-wrap items-center gap-x-2 px-3 py-1" style={{ fontSize: '11px' }}>
          <a href="#main-content" style={{ color: LINK_BLUE }}>Skip to main content</a>
          <span style={{ color: '#999' }}>|</span>
          <a href="#" style={{ color: LINK_BLUE }}>Screen Reader Access</a>
          <span style={{ color: '#999' }}>|</span>
          <a href="#" style={{ color: LINK_BLUE }}>Sitemap</a>
          <span className="ml-auto flex items-center gap-2">
            <span className="font-bold">A-</span>
            <span className="font-bold">A</span>
            <span className="font-bold">A+</span>
            <span style={{ color: '#999' }}>|</span>
            <LanguageToggle />
          </span>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #d4d4d4' }}>
        <div className="mx-auto flex max-w-[980px] items-center gap-3 px-3 py-2">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white" style={{ border: '2px solid #b5651d' }}>
            <img src="/passport.png" alt="Passport Seva logo" className="h-full w-full object-contain" />
          </span>
          <span>
            <span className="block font-bold leading-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '28px', color: NAVY }}>Passport Seva</span>
            <span className="block" style={{ fontSize: '11px', color: '#555' }}>PSP Division — Ministry of External Affairs, Government of India</span>
          </span>
          <span className="ml-auto hidden text-right sm:block" style={{ fontSize: '11px', color: '#555' }}>
            {step === 'login' ? (
              <>Toll Free: 1800-258-1800</>
            ) : (
              <><strong>Welcome, {isElder ? 'Ramesh Singh' : 'Kabir Mehta'}</strong><br />File No: BNGO40217846125</>
            )}
          </span>
        </div>
      </div>

      <nav style={{ backgroundColor: NAVY }}>
        <div className="mx-auto flex max-w-[980px] items-center px-3" style={{ fontSize: '12px' }}>
          {['Home', 'Services', 'Help', 'Contact'].map((label, i) => (
            <a key={label} href="#" className="px-2.5 py-1.5 font-bold text-white hover:underline" style={{ backgroundColor: i === 0 ? NAVY_DARK : 'transparent' }}>
              {label}
            </a>
          ))}
          <span className="ml-auto hidden py-1.5 text-white/80 md:block" style={{ fontSize: '11px' }}>सत्यमेव जयते • Truth Alone Triumphs</span>
        </div>
      </nav>

      <div className="mx-auto max-w-[980px] px-3" style={{ backgroundColor: '#fff', borderLeft: `1px solid ${BORDER}`, borderRight: `1px solid ${BORDER}`, boxShadow: '0 0 4px rgba(0,0,0,0.08)' }}>
        <div id="main-content" className="flex items-center justify-between border-b px-1 py-1.5" style={{ borderColor: '#ddd', fontSize: '12px' }}>
          <span>
            <strong style={{ color: NAVY }}>{t('pp.appHome')}</strong>
            <span className="mx-1" style={{ color: '#999' }}>/</span>
            <span style={{ color: '#555' }}>{t('upload.photoSig')}</span>
          </span>
          <Link href="/" style={{ fontSize: '12px', color: LINK_BLUE }}>{t('nav.backHome')}</Link>
        </div>

        <main className="py-3">
          {step === 'login' && (
            <section className="grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-3">
                <div className="border bg-white p-3" style={{ borderColor: BORDER }}>
                  <p className="font-bold uppercase" style={{ fontSize: '11px', color: '#666' }}>{t('pp.loginEyebrow')}</p>
                  <h1 className="mt-1 font-bold" style={{ fontSize: '20px', color: NAVY }}>{t('pp.loginTitle')}</h1>
                  <p className="mt-2" style={{ fontSize: '12px', color: '#333' }}>{t('pp.loginSub')}</p>
                </div>

                <div className="border p-3" style={{ borderColor: '#d4a017', backgroundColor: '#ffffe0' }}>
                  <p className="font-bold" style={{ fontSize: '12px', color: '#222' }}>{t('pp.mandatory')}</p>
                  <p className="mt-1" style={{ fontSize: '12px', color: '#333' }}>{t('pp.mandatoryBody')}</p>
                </div>
              </div>

              <div className="border bg-white" style={{ borderColor: BORDER }}>
                <div className="border-b px-3 py-2" style={{ borderColor: BORDER, backgroundColor: '#f0f0f0' }}>
                  <h2 className="font-bold" style={{ fontSize: '14px', color: NAVY }}>{t('login.applicant')}</h2>
                  <p style={{ fontSize: '11px', color: '#666' }}>{t('pp.loginBox')}</p>
                </div>
                <div className="space-y-2 p-3">
                  <Field label={t('auth.loginId')} value={applicantLogin} />
                  <Field label={t('epfo.password')} value="••••••••••" />
                  <div>
                    <label className="mb-1 block font-bold" style={{ fontSize: '12px', color: '#222' }}>{t('epfo.captcha')}</label>
                    <div className="flex flex-nowrap items-center gap-1.5">
                      <span
                        className="inline-block shrink-0 select-none px-2 py-1 font-mono font-bold italic"
                        style={{
                          fontSize: '15px',
                          letterSpacing: '0.22em',
                          color: '#1a1a7a',
                          background: 'repeating-linear-gradient(0deg, #e8e8f5 0 2px, #f7f7fb 2px 4px)',
                          border: '1px solid #999',
                          transform: 'skewX(-8deg)',
                        }}
                      >
                        {captcha}
                      </span>
                      <button
                        type="button"
                        title="Refresh captcha"
                        aria-label="Refresh captcha"
                        onClick={() => setCaptcha(randomCaptcha())}
                        className="shrink-0 border px-1.5 py-1 leading-none"
                        style={{ borderColor: '#999', backgroundColor: '#f0f0f0', fontSize: '14px', color: '#333' }}
                      >
                        ⟳
                      </button>
                      <input
                        readOnly
                        value={captcha.replace(/ /g, '')}
                        aria-label={t('epfo.captcha')}
                        className="min-w-0 flex-1 border px-2 py-1"
                        style={{ borderColor: '#999', fontSize: '12px' }}
                      />
                    </div>
                    <p className="mt-1" style={{ fontSize: '11px', color: '#666' }}>{t('auth.demoPrefill')}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <button
                      type="button"
                      onClick={() => setStep('dashboard')}
                      className="shrink-0 border px-6 py-1 font-bold text-white"
                      style={{ backgroundColor: NAVY, borderColor: NAVY_DARK, fontSize: '13px' }}
                    >
                      {t('auth.login')}
                    </button>
                    <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-0.5" style={{ fontSize: '11px' }}>
                      <a href="#" className="whitespace-nowrap" style={{ color: LINK_BLUE }}>{t('pp.newUser')}</a>
                      <a href="#" className="whitespace-nowrap" style={{ color: LINK_BLUE }}>{t('auth.forgotLogin')}</a>
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 'dashboard' && (
            <section className="space-y-3">
              {!nudgeDismissed ? (
                <div className="border p-2.5" role="status" aria-live="polite" style={{ borderColor: '#d4a017', backgroundColor: '#ffffe0' }}>
                  <p className="font-bold uppercase" style={{ fontSize: '11px', color: '#7a5c00' }}>{t('pp.nudgeEyebrow')}</p>
                  <p className="mt-0.5 font-bold" style={{ fontSize: '13px', color: '#222' }}>{t('pp.nudgeTitle')}</p>
                  <p className="mt-0.5" style={{ fontSize: '12px', color: '#333' }}>{t('pp.nudgeDesc')}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                    <button
                      type="button"
                      onClick={() => setStep('upload')}
                      className="shrink-0 border px-4 py-1 font-bold text-white"
                      style={{ backgroundColor: NAVY, borderColor: NAVY_DARK, fontSize: '12px' }}
                    >
                      {t('upload.photoSig')} →
                    </button>
                    <HowItWorksTrigger onClick={() => setShowHowModal(true)} tone="chip" />
                    <button type="button" onClick={() => setNudgeDismissed(true)} className="underline" style={{ fontSize: '11px', color: LINK_BLUE }}>Dismiss</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between border px-2 py-1.5" style={{ borderColor: '#d4a017', backgroundColor: '#ffffe0', fontSize: '12px' }}>
                  <span>{t('pp.nudgeDismissed')}</span>
                  <button type="button" onClick={() => setNudgeDismissed(false)} className="font-bold underline" style={{ color: LINK_BLUE }}>{t('epfo.showAgain')}</button>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-[250px_1fr]">
                <div className="border bg-white" style={{ borderColor: BORDER }}>
                  <h2 className="border-b px-2 py-1.5 font-bold" style={{ fontSize: '13px', color: NAVY, borderColor: BORDER, backgroundColor: '#f0f0f0' }}>{t('pp.applicantHome')}</h2>
                  <div className="p-2">
                    <p className="font-bold uppercase" style={{ fontSize: '11px', color: '#666' }}>{t('pp.fileNo')}</p>
                    <p className="font-bold" style={{ fontSize: '13px', color: NAVY }}>BNGO40217846125</p>
                    <p style={{ fontSize: '11px', color: '#666' }}>{applicantName} · Fresh · Normal scheme</p>
                    <p className="mt-1 inline-block border px-1.5 py-0.5 font-bold" style={{ fontSize: '11px', borderColor: '#d4a017', backgroundColor: '#ffffe0', color: '#7a5c00' }}>{t('upload.pending')}</p>
                    <h3 className="mt-2 font-bold uppercase" style={{ fontSize: '11px', color: '#666' }}>{t('pp.stages')}</h3>
                    <ul className="mt-1 space-y-1" style={{ fontSize: '12px' }}>
                      {stageKeys.map((k, index) => (
                        <li key={k} className="flex items-start gap-1.5">
                          <span className="font-bold" style={{ color: index < 2 ? '#1a7a1a' : '#b5651d' }}>{index < 2 ? '✓' : '•'}</span>
                          <span>{t(k)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border bg-white" style={{ borderColor: BORDER }}>
                  <h2 className="border-b px-2 py-1.5 font-bold" style={{ fontSize: '13px', color: NAVY, borderColor: BORDER, backgroundColor: '#f0f0f0' }}>{t('pp.trackTitle')}</h2>
                  <table className="w-full" style={{ fontSize: '12px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
                        <th className="border px-2 py-1 text-left" style={{ borderColor: BORDER }}>{t('pp.application')}</th>
                        <th className="border px-2 py-1 text-left" style={{ borderColor: BORDER }}>{t('epfo.status')}</th>
                        <th className="border px-2 py-1 text-left" style={{ borderColor: BORDER }}>{t('pp.action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border px-2 py-1.5" style={{ borderColor: BORDER }}>BNGO40217846125 · Fresh</td>
                        <td className="border px-2 py-1.5" style={{ borderColor: BORDER }}><span className="border px-1 py-0.5" style={{ borderColor: '#d4a017', backgroundColor: '#ffffe0', fontSize: '11px' }}>{t('pp.rowStatus')}</span></td>
                        <td className="border px-2 py-1.5" style={{ borderColor: BORDER }}><button type="button" onClick={() => setStep('upload')} className="font-bold underline" style={{ color: LINK_BLUE }}>{t('pp.uploadBtn')}</button></td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => setStep('upload')}
                      className="border px-4 py-1 font-bold text-white"
                      style={{ backgroundColor: NAVY, borderColor: NAVY_DARK, fontSize: '12px' }}
                    >
                      {t('upload.photoSig')} →
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 'upload' && (
            <PspShell active="upload" onNav={(s) => { if (s === 'home') setStep('dashboard'); }}>
              <div className="flex items-start justify-between gap-3 px-4 pt-3">
                <h2 className="font-medium" style={{ fontSize: '17px', color: '#222' }}>
                  Upload Recent Photograph/Signature (Optional)
                </h2>
                <span className="flex items-center gap-2">
                  <HowItWorksIcon onClick={() => setShowHowModal(true)} />
                  <button
                    type="button"
                    onClick={() => setStep('dashboard')}
                    aria-label="Close"
                    className="flex h-6 w-6 items-center justify-center rounded-full border text-sm leading-none text-slate-500 hover:bg-slate-100"
                    style={{ borderColor: '#ccc' }}
                  >
                    ⊗
                  </button>
                </span>
              </div>

              <div className="grid gap-4 p-4 lg:grid-cols-[340px_1fr]">
                {/* Left: dropzone + constraints + slot buttons. Hidden native
                    inputs keep their ids so the Guide still spotlights each slot. */}
                <div>
                  {/* DocBridge-first dropzone: the portal's native file paths are
                      disabled for this demo — every upload flows through the
                      DocBridgeAssist companion. Hidden native inputs stay mounted
                      (same ids) so the guide's carve-out + spotlight keep working. */}
                  <div
                    className="rounded-xl border-2 border-dashed bg-sky-50/60 p-5 text-center"
                    style={{ borderColor: '#9db8d8' }}
                  >
                    {/* Hidden native inputs live inside the dropzone so the
                        guide's spotlight + assist pill anchor onto this card. */}
                    <input
                      id="native-passport-photo-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      style={{ display: 'none' }}
                      onChange={handleNativeInput('photo')}
                    />
                    <input
                      id="native-passport-signature-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      style={{ display: 'none' }}
                      onChange={handleNativeInput('signature')}
                    />
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-xl text-slate-400">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.5-4.5L12 15l3.5-3.5L20 16M4 20h16M4 4h16v12H4z" /><circle cx="9" cy="8.5" r="1.5" /></svg>
                    </span>
                    <p className="mt-2" style={{ fontSize: '13px', color: '#0a4a90' }}>Upload Photo/Signature</p>
                    <p className="mt-2 flex items-center justify-center gap-2" style={{ fontSize: '12px' }}>
                      <button
                        type="button"
                        disabled
                        title="Direct upload is disabled for this demo — use DocBridgeAssist"
                        className="cursor-not-allowed border bg-slate-100 px-2 py-0.5 text-slate-400"
                        style={{ borderColor: '#ccc' }}
                      >
                        Choose File
                      </button>
                      <span className="max-w-[180px] truncate text-slate-500">No file chosen</span>
                    </p>
                    {/* Assist-pill parking slot: uploads happen via DocBridge. */}
                    <div id="docbridge-assist-anchor" className="mx-auto mt-2 h-8 max-w-[220px]" />
                  </div>
                  <div className="mt-2" style={{ fontSize: '12px', color: '#333', lineHeight: '20px' }}>
                    <p>File supported: JPG/JPEG</p>
                    <p>Maximum size: 250 KB for Photograph, 100 KB for Signature</p>
                    <p style={{ color: '#1a7a1a' }}>Photograph Dimensions : 630*810 Pixels</p>
                    <button
                      type="button"
                      onClick={() => setShowSpecs(true)}
                      className="mt-0.5 underline"
                      style={{ color: LINK_BLUE }}
                    >
                      View full specifications
                    </button>
                  </div>
                  {(done.photo || done.signature) && (
                    <p className="mt-3 rounded-md px-2 py-1.5 text-center font-bold" style={{ fontSize: '12px', backgroundColor: '#e6f4ea', color: '#0d6b07' }}>
                      ✓ {bothDone ? 'Photo + signature ready — see the table' : done.photo ? 'Photograph ready — see the table' : 'Signature ready — see the table'}
                    </p>
                  )}
                  {bothDone && (
                    <button
                      type="button"
                      onClick={() => setStep('apps')}
                      className="mt-2 w-full rounded-md py-2 font-bold text-white"
                      style={{ fontSize: '13px', backgroundColor: '#0d6b07' }}
                    >
                      Continue to My Applications →
                    </button>
                  )}
                </div>

                {/* Right: attachments table mirroring the live portal */}
                <div>
                  <div
                    className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-t-md px-3 py-2 font-bold"
                    style={{ fontSize: '12px', color: '#0a4a90', backgroundColor: '#eef3fa' }}
                  >
                    <span>Attachment Type</span>
                    <span>Attachment Description</span>
                    <span>Upload documents</span>
                  </div>
                  <div className="border-t" style={{ borderColor: '#e5e7eb' }}>
                    {!done.photo && !done.signature && (
                      <p className="px-3 py-6 text-center font-bold" style={{ fontSize: '13px', color: '#222' }}>
                        You have not uploaded any photo
                      </p>
                    )}
                    {done.photo && (
                      <AttachmentRow
                        type="Applicant Photograph"
                        desc="Applicant Photograph"
                        onRemove={() => { setDone((d) => ({ ...d, photo: false })); handleGuideDeviceFile('photo', null); setPhotoResult(null); }}
                      />
                    )}
                    {done.signature && (
                      <AttachmentRow
                        type="Applicant Signature"
                        desc="Applicant Signature"
                        onRemove={() => { setDone((d) => ({ ...d, signature: false })); handleGuideDeviceFile('signature', null); setSigResult(null); }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Mock normal user (non-PII): passive pill near upload, no auto-launch — experience stays optional */}
              <DocBridgeGuide
                portalId="passport"
                steps={guideSteps}
                done={{ photo: done.photo, signature: done.signature }}
                onStepDone={handleStepDone}
                deviceFiles={{ photo: photoFile, signature: signatureFile }}
                onDeviceFileChange={handleGuideDeviceFile}
                assistMode={isElder ? 'assistive' : 'passive'}
                userSegment={isElder ? { isElderly: true, needsAssistance: true } : undefined}
                vaultUser={isElder ? 'Ramesh' : 'Kabir'}
                pillAlign="topRight"
                pillTargetId="docbridge-assist-anchor"
              />
            </PspShell>
          )}

          {step === 'apps' && (
            <PspShell active="apps" onNav={(s) => { if (s === 'home') setStep('dashboard'); }}>
              <div className="px-4 pt-3">
                <h2 className="font-medium" style={{ fontSize: '17px', color: '#222' }}>My Applications</h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="flex min-w-0 flex-1 items-center gap-2 rounded-md border bg-white px-2.5 py-1.5" style={{ borderColor: '#ccc', fontSize: '12px', color: '#999' }}>
                    <span aria-hidden="true">⌕</span>
                    <span className="truncate">Search by ARN, File No, Name</span>
                  </span>
                  <span className="shrink-0 rounded-md border bg-white px-2.5 py-1.5" style={{ borderColor: '#ccc', fontSize: '12px', color: '#555' }}>
                    Filter By Type ▾
                  </span>
                </div>
                <div className="mt-2 flex gap-1" style={{ fontSize: '12px' }}>
                  <span className="rounded-t-md px-3 py-1.5 font-bold text-white" style={{ backgroundColor: '#0a1633' }}>Submitted Applications</span>
                  <span className="rounded-t-md border border-b-0 bg-slate-50 px-3 py-1.5 text-slate-500" style={{ borderColor: '#e5e7eb' }}>Saved/Draft Applications</span>
                </div>
              </div>
              <div className="mx-4 mb-4 overflow-visible rounded-b-md border border-t-0" style={{ borderColor: '#e5e7eb' }}>
                <table className="w-full" style={{ fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#eef3fa', color: '#0a4a90' }}>
                      <th className="px-3 py-2 text-left font-bold">Application Type</th>
                      <th className="px-3 py-2 text-left font-bold">Arn / File no</th>
                      <th className="px-3 py-2 text-left font-bold">Applicant Name</th>
                      <th className="px-3 py-2 text-left font-bold">Submission Date</th>
                      <th className="px-3 py-2 text-left font-bold">More Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t" style={{ borderColor: '#e5e7eb' }}>
                      <td className="px-3 py-2.5">Passport</td>
                      <td className="px-3 py-2.5">BNGO40217846125</td>
                      <td className="px-3 py-2.5 font-bold">{applicantName}</td>
                      <td className="px-3 py-2.5">28/10/2025</td>
                      <td className="relative px-3 py-2.5">
                        <AppsMenu
                          onPrint={() => setStep('preview')}
                          onUpload={() => setStep('upload')}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </PspShell>
          )}

          {step === 'preview' && (
            <PspShell active="apps" onNav={(s) => { if (s === 'home') setStep('dashboard'); }}>
              <div className="flex items-center justify-between gap-3 px-4 pt-3">
                <h2 className="font-medium" style={{ fontSize: '17px', color: '#222' }}>Passport Preview</h2>
                <button
                  type="button"
                  onClick={() => setStep('apps')}
                  className="rounded-md border bg-white px-3 py-1 font-bold"
                  style={{ borderColor: '#999', fontSize: '12px', color: '#0a4a90' }}
                >
                  ← My Applications
                </button>
              </div>
              <div className="p-4">
                <div className="mx-auto max-w-2xl border bg-white p-4 shadow-sm" style={{ borderColor: '#999' }}>
                  <div className="flex items-start gap-3 border-b pb-2" style={{ borderColor: '#999' }}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-black/10">
                      <img src="/passport.png" alt="Passport Seva" className="h-full w-full object-contain" />
                    </span>
                    <span className="flex-1 text-center">
                      <span className="block font-bold" style={{ fontSize: '11px' }}>CONSULATE GENERAL OF INDIA</span>
                      <span className="block" style={{ fontSize: '10px' }}>540 ARGUELLO BOULEVARD, SAN FRANCISCO, CALIFORNIA, CA 94118, USA</span>
                      <span className="mt-1 block font-bold tracking-wide" style={{ fontSize: '12px' }}>PASSPORT PREVIEW</span>
                      <span className="block" style={{ fontSize: '11px' }}>भारत गणराज्य/Republic Of India</span>
                    </span>
                    <span
                      className="h-6 w-24 shrink-0"
                      aria-hidden="true"
                      style={{ background: 'repeating-linear-gradient(90deg,#111 0 2px,transparent 2px 4px,#111 4px 5px,transparent 5px 9px)' }}
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-[150px_1fr] gap-3">
                    <div>
                      <div className="flex h-40 items-center justify-center overflow-hidden border bg-slate-50" style={{ borderColor: '#666' }}>
                        {photoURL ? (
                          <img src={photoURL} alt="Applicant photograph" className="h-full w-full object-cover" />
                        ) : (
                          <span style={{ fontSize: '11px', color: '#999' }}>Photograph</span>
                        )}
                      </div>
                      <div className="mt-2 flex h-16 items-center justify-center overflow-hidden border bg-white" style={{ borderColor: '#666' }}>
                        {sigURL ? (
                          <img src={sigURL} alt="Applicant signature" className="max-h-full object-contain" />
                        ) : (
                          <span style={{ fontSize: '11px', color: '#999' }}>Signature</span>
                        )}
                      </div>
                      <p className="mt-1 text-center" style={{ fontSize: '10px', color: '#555' }}>Applicant&apos;s Signature</p>
                    </div>
                    <div style={{ fontSize: '11px', lineHeight: '22px' }}>
                      <PreviewLine label="Type / P" value="IND" />
                      <PreviewLine label={`Surname / ${isElder ? 'SINGH' : 'MEHTA'}`} value="" />
                      <PreviewLine label={`Given Name(s) / ${isElder ? 'RAMESH' : 'KABIR'}`} value="" />
                      <PreviewLine label="Nationality / INDIAN" value="Sex / M" />
                      <PreviewLine label="Date of Birth / 20/07/1997" value="" />
                      <PreviewLine label="Place of Birth / VARANASI, UTTAR PRADESH" value="" />
                      <PreviewLine label="Place of Issue" value="Date of Expiry" />
                      <div className="mt-2 border-t pt-1" style={{ borderColor: '#999' }}>
                        <p className="font-bold">Name of father / legal guardian — NAVEEN KUMAR</p>
                        <p className="font-bold">Name of mother — SITA KUMAR</p>
                        <p className="mt-1">Address — 1234 BELL AVENUE, HAYWARD 94540</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 rounded-md px-2 py-1.5" style={{ fontSize: '11px', backgroundColor: '#e6f4ea', color: '#0d6b07' }}>
                    ✓ Photo 630×810 JPEG & signature stamped from your DocBridge-optimized uploads — preview only, demo mock.
                  </p>
                </div>
              </div>
            </PspShell>
          )}
        </main>

        <footer className="border-t px-1 py-2 text-center" style={{ borderColor: '#ddd', fontSize: '11px', color: '#666' }}>
          <span className="mx-1" style={{ color: LINK_BLUE }}>Terms &amp; Conditions</span> |
          <span className="mx-1" style={{ color: LINK_BLUE }}>Privacy Policy</span> |
          <span className="mx-1" style={{ color: LINK_BLUE }}>Contact Us</span>
          <span className="mt-0.5 block">Content owned and maintained by PSP Division, Ministry of External Affairs · Demo mock for hackathon evaluation</span>
        </footer>
      </div>

      <HowItWorksModal open={showHowModal} onClose={() => setShowHowModal(false)} />
      <SpecsModal open={showSpecs} onClose={() => setShowSpecs(false)} />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-0.5 block font-bold" style={{ fontSize: '12px', color: '#222' }}>{label}</label>
      <input
        readOnly
        value={value}
        className="w-full border px-1.5 py-1"
        style={{ borderColor: '#999', fontSize: '12px', backgroundColor: '#fff' }}
      />
    </div>
  );
}

const PSP_NAVY = '#0a1633';

function PspShell({ active, onNav, children }: { active: 'home' | 'upload' | 'apps'; onNav: (s: 'home') => void; children: React.ReactNode }) {
  const items = [
    { id: 'home', label: 'Home', icon: '⌂' },
    { id: 'services', label: 'Services', icon: '◉' },
    { id: 'apps', label: 'My Application', icon: '▤' },
  ] as const;
  return (
    <div className="flex overflow-hidden rounded-md border" style={{ borderColor: BORDER, minHeight: '480px' }}>
      <aside className="w-40 shrink-0 py-3" style={{ background: `linear-gradient(180deg, ${PSP_NAVY}, #1b2a5e)` }}>
        {items.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => m.id === 'home' && onNav('home')}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-bold"
            style={{
              fontSize: '13px',
              color: active === m.id || (active === 'upload' && m.id === 'apps') ? '#f5b942' : '#fff',
              borderLeft: active === m.id || (active === 'upload' && m.id === 'apps') ? '3px solid #f5b942' : '3px solid transparent',
              backgroundColor: active === m.id || (active === 'upload' && m.id === 'apps') ? 'rgba(255,255,255,0.06)' : 'transparent',
            }}
          >
            <span aria-hidden="true">{m.icon}</span>
            {m.label}
          </button>
        ))}
        <div className="mt-2 border-t border-white/10 pt-2">
          <span className="flex w-full items-center gap-2.5 px-4 py-2.5 font-bold text-white" style={{ fontSize: '13px' }}>
            <span aria-hidden="true">◁</span>
            LOGOUT
          </span>
        </div>
      </aside>
      <div className="min-w-0 flex-1 bg-white">{children}</div>
    </div>
  );
}

function useOptimizedUrl(result: any): string | null {
  const url = useMemo(() => {
    const blob = result?.processed?.blob;
    if (!(blob instanceof Blob)) return null;
    return URL.createObjectURL(blob);
  }, [result]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url;
}

function AppsMenu({ onPrint, onUpload }: { onPrint: () => void; onUpload: () => void }) {
  const [open, setOpen] = useState(false);
  const items = [
    'View Form',
    'Track Application Status',
    'Upload Supporting Documents',
    'Upload Recent Photograph/ Signature',
    'Print Application Form',
  ];
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="More actions"
        aria-expanded={open}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 font-bold text-white"
        style={{ fontSize: '12px' }}
      >
        ⋮
      </button>
      {open && (
        <>
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="fixed inset-0 z-10 cursor-default" />
          <span className="absolute right-0 z-20 w-52 rounded-md border bg-white py-1 shadow-lg" style={{ borderColor: '#ddd' }}>
            {items.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (label === 'Print Application Form') onPrint();
                  else if (label.startsWith('Upload Recent')) onUpload();
                }}
                className="block w-full px-3 py-1.5 text-left hover:bg-slate-100"
                style={{ fontSize: '12px', color: label === 'Print Application Form' ? '#0a4a90' : '#222', fontWeight: label === 'Print Application Form' ? 700 : 400 }}
              >
                {label}
              </button>
            ))}
          </span>
        </>
      )}
    </span>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-2 border-b" style={{ borderColor: '#ccc' }}>
      <span>{label}</span>
      {value ? <span className="font-bold">{value}</span> : null}
    </p>
  );
}

function AttachmentRow({ type, desc, onRemove }: { type: string; desc: string; onRemove: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 border-b px-3 py-2.5" style={{ borderColor: '#e5e7eb', fontSize: '12px' }}>
      <span className="font-bold text-slate-800">{type}</span>
      <span className="text-slate-600">{desc}</span>
      <span className="flex items-center gap-3">
        <span className="font-bold" style={{ color: '#1a7a1a' }}>✓</span>
        <button type="button" onClick={onRemove} aria-label={`Remove ${type}`} title="Remove" className="text-base leading-none text-red-500 hover:text-red-700">
          🗑
        </button>
      </span>
    </div>
  );
}

function ResultCard({ label, value, bg, fg }: { label: string; value: string; bg: string; fg: string }) {
  return (
    <div className="border p-2" style={{ backgroundColor: bg, color: fg, borderColor: BORDER }}>
      <p className="font-bold uppercase" style={{ fontSize: '11px' }}>{label}</p>
      <p className="mt-1 font-bold" style={{ fontSize: '12px' }}>{value}</p>
    </div>
  );
}
