'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeGuide from '@/components/DocBridgeGuide';
import TricolorBar from '@/components/ui/TricolorBar';
import VoiceToggle from '@/components/ui/VoiceToggle';
import { LanguageToggle, useLang } from '@/lib/i18n';
import HowItWorksModal, { HowItWorksIcon, HowItWorksTrigger } from '@/components/ui/HowItWorksModal';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

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
  const [done, setDone] = useState({ photo: false, signature: false });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [captcha, setCaptcha] = useState('7 3 9 4');

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

  useEffect(() => {
    if (done.photo && done.signature) setStep('submitted');
  }, [done]);

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
              <><strong>Welcome, Kabir Mehta</strong><br />File No: BNGO40217846125</>
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
                  <Field label={t('auth.loginId')} value="kabir.mehta34" />
                  <Field label={t('epfo.password')} value="••••••••••" />
                  <div>
                    <label className="mb-1 block font-bold" style={{ fontSize: '12px', color: '#222' }}>{t('epfo.captcha')}</label>
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block select-none px-3 py-1 font-mono font-bold italic"
                        style={{
                          fontSize: '16px',
                          letterSpacing: '0.3em',
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
                        className="border px-1.5 py-1 leading-none"
                        style={{ borderColor: '#999', backgroundColor: '#f0f0f0', fontSize: '14px', color: '#333' }}
                      >
                        ⟳
                      </button>
                      <input
                        readOnly
                        value={captcha.replace(/ /g, '')}
                        className="w-20 border px-2 py-1"
                        style={{ borderColor: '#999', fontSize: '12px' }}
                      />
                    </div>
                    <p className="mt-1" style={{ fontSize: '11px', color: '#666' }}>{t('auth.demoPrefill')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('dashboard')}
                    className="border px-6 py-1 font-bold text-white"
                    style={{ backgroundColor: NAVY, borderColor: NAVY_DARK, fontSize: '13px' }}
                  >
                    {t('auth.login')}
                  </button>
                  <div className="flex justify-between pt-1" style={{ fontSize: '11px' }}>
                    <a href="#" style={{ color: LINK_BLUE }}>{t('pp.newUser')}</a>
                    <a href="#" style={{ color: LINK_BLUE }}>{t('auth.forgotLogin')}</a>
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
                  <button
                    type="button"
                    onClick={() => setStep('upload')}
                    className="mt-2 border px-4 py-1 font-bold text-white"
                    style={{ backgroundColor: NAVY, borderColor: NAVY_DARK, fontSize: '12px' }}
                  >
                    {t('upload.photoSig')} →
                  </button>
                  <div className="mt-2 flex flex-wrap items-center gap-2.5">
                    <HowItWorksTrigger onClick={() => setShowHowModal(true)} tone="chip" />
                    <VoiceToggle />
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
                    <p style={{ fontSize: '11px', color: '#666' }}>{t('pp.fileSub')}</p>
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
            <section className="space-y-3">
              <div className="border bg-white p-2" style={{ borderColor: BORDER }}>
                <h2 className="font-bold" style={{ fontSize: '14px', color: NAVY }}>{t('pp.uploadTitle')}<HowItWorksIcon onClick={() => setShowHowModal(true)} /></h2>
                <p style={{ fontSize: '11px', color: '#666' }}>ARN BNGO40217846125 · {t('pp.attemptsRem')} <strong>photo + signature</strong> · {t('pp.stage34')}</p>
              </div>

              {/* Native portal upload rows — untouched. DocBridge Guide overlays as a
                  floating companion and spotlights whichever row is active. */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="border bg-white" style={{ borderColor: BORDER }}>
                  <h3 className="border-b px-2 py-1.5 font-bold" style={{ fontSize: '13px', color: NAVY, borderColor: BORDER, backgroundColor: '#f0f0f0' }}>{t('pp.photo')}</h3>
                  <p className="px-2 pt-1" style={{ fontSize: '11px', color: '#666' }}>{t('pp.photoSub')}</p>
                  <details className="mx-2 mt-1 border px-2 py-1" style={{ borderColor: BORDER, backgroundColor: '#fafafa', fontSize: '12px' }}>
                    <summary className="cursor-pointer underline" style={{ color: LINK_BLUE }}>{t('pp.viewPhotoRules')}</summary>
                    <ul className="mt-1 space-y-1 pb-1" style={{ fontSize: '12px' }}>
                      {photoKeys.map((k) => (
                        <li key={k} className="flex items-start gap-1.5">
                          <span style={{ color: NAVY }}>▪</span>
                          <span>{t(k)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                  <div className="m-2 border p-2" style={{ borderColor: BORDER, backgroundColor: '#fafafa' }}>
                    <input
                      id="native-passport-photo-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      style={{ display: 'none' }}
                      onChange={handleNativeInput('photo')}
                    />
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '12px', color: '#666' }}>Choose File</span>
                      <span className="ml-auto" style={{ fontSize: '11px', color: '#999' }}>JPEG · 10–250 KB · 630×810 px</span>
                    </div>
                  </div>
                </div>

                <div className="border bg-white" style={{ borderColor: BORDER }}>
                  <h3 className="border-b px-2 py-1.5 font-bold" style={{ fontSize: '13px', color: NAVY, borderColor: BORDER, backgroundColor: '#f0f0f0' }}>{t('pp.signature')}</h3>
                  <p className="px-2 pt-1" style={{ fontSize: '11px', color: '#666' }}>{t('pp.sigSub')}</p>
                  <details className="mx-2 mt-1 border px-2 py-1" style={{ borderColor: BORDER, backgroundColor: '#fafafa', fontSize: '12px' }}>
                    <summary className="cursor-pointer underline" style={{ color: LINK_BLUE }}>{t('pp.viewSigRules')}</summary>
                    <ul className="mt-1 space-y-1 pb-1" style={{ fontSize: '12px' }}>
                      {signatureKeys.map((k) => (
                        <li key={k} className="flex items-start gap-1.5">
                          <span style={{ color: NAVY }}>▪</span>
                          <span>{t(k)}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                  <div className="m-2 border p-2" style={{ borderColor: BORDER, backgroundColor: '#fafafa' }}>
                    <input
                      id="native-passport-signature-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      style={{ display: 'none' }}
                      onChange={handleNativeInput('signature')}
                    />
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '12px', color: '#666' }}>Choose File</span>
                      <span className="ml-auto" style={{ fontSize: '11px', color: '#999' }}>JPEG · under 100 KB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock normal user (non-PII): passive pill near upload, no auto-launch — experience stays optional */}
              <DocBridgeGuide
                portalId="passport"
                steps={guideSteps}
                done={{ photo: done.photo, signature: done.signature }}
                onStepDone={(id) => setDone((d) => ({ ...d, [id]: true }))}
                deviceFiles={{ photo: photoFile, signature: signatureFile }}
                onDeviceFileChange={handleGuideDeviceFile}
                assistMode="passive"
              />
            </section>
          )}

          {step === 'submitted' && (
            <section className="border bg-white p-3" style={{ borderColor: BORDER }}>
              <p className="font-bold uppercase" style={{ fontSize: '11px', color: '#1a7a1a' }}>{t('upload.accepted')}</p>
              <h2 className="mt-1 font-bold" style={{ fontSize: '18px', color: NAVY }}>{t('pp.doneTitle')}</h2>
              <p className="mt-2 max-w-3xl" style={{ fontSize: '12px', color: '#333' }}>{t('pp.doneBody')}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                <ResultCard label={t('pp.rc1l')} value={t('pp.rc1v')} bg="#e6f4e6" fg="#145214" />
                <ResultCard label={t('pp.rc2l')} value={t('pp.rc2v')} bg="#e8eefc" fg={NAVY} />
                <ResultCard label={t('upsc.rc2l')} value={t('pp.rc3v')} bg="#ffffe0" fg="#7a5c00" />
              </div>
            </section>
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

function ResultCard({ label, value, bg, fg }: { label: string; value: string; bg: string; fg: string }) {
  return (
    <div className="border p-2" style={{ backgroundColor: bg, color: fg, borderColor: BORDER }}>
      <p className="font-bold uppercase" style={{ fontSize: '11px' }}>{label}</p>
      <p className="mt-1 font-bold" style={{ fontSize: '12px' }}>{value}</p>
    </div>
  );
}
