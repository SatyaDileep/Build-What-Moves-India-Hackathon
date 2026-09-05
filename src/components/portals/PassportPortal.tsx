'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const photoKeys = ['pp.pr4', 'pp.pr5', 'pp.pr6'];
const signatureKeys = ['pp.sr1', 'pp.sr3', 'pp.sr4'];
const stageKeys = ['pp.sg1', 'pp.sg2', 'pp.sg3', 'pp.sg4'];

export default function PassportPortal() {
  const { t } = useLang();
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [done, setDone] = useState({ photo: false, signature: false });
  // Files chosen through the card's hidden native inputs (carve-out mode).
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const handleNativeInput = (slot: 'photo' | 'signature') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (slot === 'photo') setPhotoFile(file);
    else setSignatureFile(file);
    // Reset so choosing the same file again still fires onChange.
    e.target.value = '';
  };

  useEffect(() => {
    if (done.photo && done.signature) setStep('submitted');
  }, [done]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.legacyBg, fontFamily: "Arial, 'Open Sans', sans-serif", fontSize: '14px', color: '#212529' }}>
      <GovernmentHeader
        portalName="Passport Seva"
        portalFullName="PSP Division — Ministry of External Affairs, Government of India"
        portalInitials="PSP"
        welcomeText={step === 'login' ? undefined : `${t('auth.welcome')}, Kabir Mehta`}
        userIdText={step === 'login' ? undefined : 'File No: BNGO40217846125'}
      />

      <div className="mx-auto mt-0 max-w-6xl px-4">
        <div id="main-content" className="mb-4 mt-4 flex items-center justify-between rounded-[3px] border px-4 py-2" style={{ backgroundColor: '#F2F2F2', borderColor: COLORS.legacyBorder }}>
          <div className="text-[13px]" style={{ color: '#495057' }}>
            <span className="font-bold" style={{ color: '#000C80' }}>{t('pp.appHome')}</span>
            <span className="mx-2 text-[#ADB5BD]">/</span>
            <span>{t('upload.photoSig')}</span>
          </div>
          <Link
            href="/"
            className="px-3 py-1.5 text-[13px] hover:underline"
            style={{ color: '#125699' }}
          >
            {t('nav.backHome')}
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {step === 'login' && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="rounded-[3px] border bg-white p-6" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-[12px] font-bold uppercase tracking-wide" style={{ color: '#495057' }}>{t('pp.loginEyebrow')}</p>
                <h1 className="mt-2 font-bold leading-[1.2em]" style={{ color: '#000C80', fontSize: '26px', fontFamily: 'Arial, sans-serif' }}>{t('pp.loginTitle')}</h1>
                <p className="mt-3 leading-[1.5em]" style={{ fontSize: '14px', color: '#212529' }}>
                  {t('pp.loginSub')}
                </p>
              </div>

              <div className="rounded-[3px] border p-5" style={{ borderColor: '#FFC107', backgroundColor: '#FFF3CD' }}>
                <p className="font-bold" style={{ fontSize: '14px', color: '#212529' }}>{t('pp.mandatory')}</p>
                <p className="mt-2 leading-[1.5em]" style={{ fontSize: '14px', color: '#212529' }}>
                  {t('pp.mandatoryBody')}
                </p>
              </div>
            </div>

            <div className="rounded-[3px] border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#F8F9FA' }}>
                <h2 className="font-bold" style={{ fontSize: '18px', color: '#000C80', fontFamily: 'Arial, sans-serif' }}>{t('login.applicant')}</h2>
                <p className="mt-1" style={{ fontSize: '13px', color: '#6C757D' }}>{t('pp.loginBox')}</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label={t('auth.loginId')} value="kabir.mehta34" />
                <Field label={t('epfo.password')} value="••••••••••" />
                <div>
                  <label className="mb-2 block font-bold" style={{ fontSize: '13px', color: '#212529' }}>{t('epfo.captcha')}</label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-[3px] border px-4 py-2.5 font-mono tracking-[0.28em]" style={{ borderColor: '#CCC', backgroundColor: '#F8F9FA', color: '#000C80', fontSize: '18px' }}>
                      7 3 9 4
                    </div>
                    <input
                      readOnly
                      value="7394"
                      className="w-full rounded-[3px] border px-4 py-2.5"
                      style={{ borderColor: '#CCC', backgroundColor: COLORS.white, fontSize: '14px', color: '#212529' }}
                    />
                  </div>
                  <p className="mt-1" style={{ fontSize: '12px', color: '#6C757D' }}>{t('auth.demoPrefill')}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="w-full rounded-[3px] px-4 py-2.5 font-bold text-white transition-colors"
                  style={{ backgroundColor: '#000C80', fontSize: '14px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#071064'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000C80'; }}
                >
                  {t('auth.login')}
                </button>
                <div className="flex justify-between" style={{ fontSize: '13px', color: '#125699' }}>
                  <span className="cursor-pointer hover:underline">{t('pp.newUser')}</span>
                  <span className="cursor-pointer hover:underline">{t('auth.forgotLogin')}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-6">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow={t('pp.nudgeEyebrow')}
                title={t('pp.nudgeTitle')}
                description={t('pp.nudgeDesc')}
                ctaLabel={t('upload.photoSig')}
                onAction={() => setStep('upload')}
                onDismiss={() => setNudgeDismissed(true)}
                tone="amber"
              />
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-amber-50/70 px-4 py-2.5 text-sm" style={{ borderColor: '#FDE68A' }}>
                <span className="text-amber-800">{t('pp.nudgeDismissed')}</span>
                <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                  {t('epfo.showAgain')}
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-[3px] border bg-white p-6" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="font-bold" style={{ fontSize: '18px', color: '#000C80', fontFamily: 'Arial, sans-serif' }}>{t('pp.applicantHome')}</h2>
                <div className="mt-4 rounded-[3px] border p-4" style={{ backgroundColor: '#F8F9FA', borderColor: COLORS.legacyBorder }}>
                  <p className="font-bold uppercase" style={{ fontSize: '12px', color: '#495057' }}>{t('pp.fileNo')}</p>
                  <p className="mt-1 font-bold" style={{ fontSize: '14px', color: '#000C80' }}>BNGO40217846125</p>
                  <p style={{ fontSize: '12px', color: '#6C757D' }}>{t('pp.fileSub')}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-[3px] px-2 py-1 font-bold" style={{ backgroundColor: '#FFF3CD', color: '#664D03', fontSize: '12px' }}>{t('upload.pending')}</span>
                    <span style={{ fontSize: '12px', color: '#6C757D' }}>{t('pp.attemptsLeft')}</span>
                  </div>
                </div>
                <h3 className="mt-5 font-bold uppercase" style={{ fontSize: '12px', color: '#495057' }}>{t('pp.stages')}</h3>
                <ul className="mt-3 space-y-3" style={{ fontSize: '14px' }}>
                  {stageKeys.map((k, index) => (
                    <li key={k} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white"
                        style={{ backgroundColor: index < 2 ? '#198754' : '#FFB04F', color: index < 2 ? '#fff' : '#212529' }}
                      >
                        {index < 2 ? '✓' : '!'}
                      </span>
                      <span style={{ color: '#212529' }}>{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[3px] border bg-white p-6" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="font-bold uppercase" style={{ fontSize: '12px', color: '#495057' }}>{t('pp.track')}</p>
                <h2 className="mt-2 font-bold leading-[1.2em]" style={{ fontSize: '26px', color: '#000C80', fontFamily: 'Arial, sans-serif' }}>{t('pp.trackTitle')}</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left" style={{ fontSize: '14px' }}>
                    <thead className="uppercase" style={{ fontSize: '12px', color: '#495057' }}>
                      <tr style={{ backgroundColor: '#F8F9FA' }}>
                        <th className="px-5 py-3 pr-4 font-bold">{t('pp.application')}</th>
                        <th className="px-5 py-3 pr-4 font-bold">{t('epfo.status')}</th>
                        <th className="px-5 py-3 pr-4 font-bold">{t('pp.action')}</th>
                      </tr>
                    </thead>
                    <tbody style={{ color: '#212529' }}>
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="px-5 py-3 pr-4">BNGO40217846125 · Fresh</td>
                        <td className="px-5 py-3 pr-4"><span className="rounded-[3px] px-2 py-1 font-bold" style={{ backgroundColor: '#FFF3CD', color: '#664D03', fontSize: '12px' }}>{t('pp.rowStatus')}</span></td>
                        <td className="px-5 py-3 pr-4"><button type="button" onClick={() => setStep('upload')} className="font-bold hover:underline" style={{ color: '#125699' }}>{t('pp.uploadBtn')}</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="mt-6 rounded-[3px] px-4 py-2.5 font-bold text-white transition-colors"
                  style={{ backgroundColor: '#000C80', fontSize: '14px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#071064'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#000C80'; }}
                >
                  {t('upload.photoSig')} →
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'upload' && (
          <section className="space-y-6">
            <div className="rounded-[3px] border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold" style={{ fontSize: '18px', color: '#000C80', fontFamily: 'Arial, sans-serif' }}>{t('pp.uploadTitle')}</h2>
                  <p className="mt-1" style={{ fontSize: '13px', color: '#6C757D' }}>ARN BNGO40217846125 · {t('pp.attemptsRem')} <strong style={{ color: '#664D03' }}>photo + signature</strong></p>
                </div>
                <span className="rounded-[3px] border px-3 py-1 font-bold" style={{ fontSize: '12px', color: '#495057', backgroundColor: '#F8F9FA', borderColor: COLORS.legacyBorder }}>{t('pp.stage34')}</span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[3px] border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#F8F9FA' }}>
                  <h3 className="font-bold" style={{ fontSize: '16px', color: '#000C80', fontFamily: 'Arial, sans-serif' }}>{t('pp.photo')}</h3>
                  <p className="mt-1" style={{ fontSize: '13px', color: '#6C757D' }}>{t('pp.photoSub')}</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2" style={{ fontSize: '14px', color: '#212529' }}>
                    {photoKeys.map((k) => (
                      <li key={k} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#000C80' }} />
                        <span>{t(k)}</span>
                      </li>
                    ))}
                  </ul>
<div className="rounded-[3px] border p-4" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#F8F9FA' }}>
                      {/* Native Choose File — same carve-out as UPSC OTR: DocBridge's
                          "Upload from device" card opens this dialog */}
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <input
                          id="native-passport-photo-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          style={{ display: 'none' }}
                          onChange={handleNativeInput('photo')}
                        />
                        <span className="rounded-[3px] border px-3 py-1.5 font-bold" style={{ fontSize: '12px', color: '#495057', borderColor: COLORS.legacyBorder, backgroundColor: '#fff' }}>Choose File</span>
                        <span style={{ fontSize: '12px', color: '#6C757D' }}>No file chosen</span>
                        <a href="#" onClick={(e) => e.preventDefault()} className="ml-auto" style={{ fontSize: '12px', color: '#125699', textDecoration: 'underline' }}>{t('pp.guidelines')}</a>
                      </div>
                      <DocBridgeWidget
                        portalId="passport"
                        docType="photo"
                        requirements="Passport Seva GPSP upload. Photo exactly 630x810 pixels, JPEG only, 10KB - 250KB, white background, 80-85 percent face coverage."
                        onSuccess={() => setDone((d) => ({ ...d, photo: true }))}
                        deviceInputId="native-passport-photo-input"
                        deviceFile={photoFile}
                        onDeviceFileChange={setPhotoFile}
                      />
                    </div>
                </div>
              </div>

              <div className="rounded-[3px] border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#F8F9FA' }}>
                  <h3 className="font-bold" style={{ fontSize: '16px', color: '#000C80', fontFamily: 'Arial, sans-serif' }}>{t('pp.signature')}</h3>
                  <p className="mt-1" style={{ fontSize: '13px', color: '#6C757D' }}>{t('pp.sigSub')}</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2" style={{ fontSize: '14px', color: '#212529' }}>
                    {signatureKeys.map((k) => (
                      <li key={k} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: '#000C80' }} />
                        <span>{t(k)}</span>
                      </li>
                    ))}
                  </ul>
<div className="rounded-[3px] border p-4" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#F8F9FA' }}>
                      {/* Native Choose File — same carve-out as UPSC OTR */}
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <input
                          id="native-passport-signature-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          style={{ display: 'none' }}
                          onChange={handleNativeInput('signature')}
                        />
                        <span className="rounded-[3px] border px-3 py-1.5 font-bold" style={{ fontSize: '12px', color: '#495057', borderColor: COLORS.legacyBorder, backgroundColor: '#fff' }}>Choose File</span>
                        <span style={{ fontSize: '12px', color: '#6C757D' }}>No file chosen</span>
                        <a href="#" onClick={(e) => e.preventDefault()} className="ml-auto" style={{ fontSize: '12px', color: '#125699', textDecoration: 'underline' }}>{t('pp.guidelines')}</a>
                      </div>
                      <DocBridgeWidget
                        portalId="passport"
                        docType="signature"
                        requirements="Passport signature upload. Signature scan, JPEG only, under 100KB, white paper background."
                        onSuccess={() => setDone((d) => ({ ...d, signature: true }))}
                        deviceInputId="native-passport-signature-input"
                        deviceFile={signatureFile}
                        onDeviceFileChange={setSignatureFile}
                      />
                    </div>
                </div>
              </div>
            </div>


          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-[3px] border bg-white p-6" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="font-bold uppercase" style={{ fontSize: '12px', color: '#198754' }}>{t('upload.accepted')}</p>
            <h2 className="mt-2 font-bold leading-[1.2em]" style={{ fontSize: '26px', color: '#000C80', fontFamily: 'Arial, sans-serif' }}>{t('pp.doneTitle')}</h2>
            <p className="mt-3 max-w-3xl leading-[1.5em]" style={{ fontSize: '14px', color: '#212529' }}>
              {t('pp.doneBody')}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label={t('pp.rc1l')} value={t('pp.rc1v')} tone="green" />
              <ResultCard label={t('pp.rc2l')} value={t('pp.rc2v')} tone="blue" />
              <ResultCard label={t('upsc.rc2l')} value={t('pp.rc3v')} tone="saffron" />
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
      <label className="mb-1 block font-bold" style={{ fontSize: '13px', color: '#212529' }}>{label}</label>
      <input
        readOnly
        value={value}
        className="w-full rounded-[3px] border px-3 py-2.5"
        style={{ borderColor: '#CCC', backgroundColor: COLORS.white, fontSize: '14px', color: '#212529', height: '40px' }}
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
      ? { backgroundColor: '#D1E7DD', color: '#0F5132', borderColor: '#BADBCC' }
      : tone === 'saffron'
        ? { backgroundColor: '#FFF3CD', color: '#664D03', borderColor: '#FFC107' }
        : { backgroundColor: '#E3EBFC', color: '#000C80', borderColor: '#B6C6F5' };

  return (
    <div className="rounded-[3px] border p-4" style={styles}>
      <p className="font-bold uppercase" style={{ fontSize: '12px' }}>{label}</p>
      <p className="mt-2 font-bold leading-[1.5em]" style={{ fontSize: '14px' }}>{value}</p>
    </div>
  );
}
