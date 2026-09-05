'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const photoKeys = ['nsp.pr1', 'nsp.pr4'];
const incomeKeys = ['nsp.ir1', 'nsp.ir3', 'nsp.ir4'];
const schemeKeys = ['Post-Matric Scholarship (SC)', 'Merit-cum-Means (Minority)'];

export default function NSPPortal() {
  const { t } = useLang();
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [done, setDone] = useState({ photo: false, income: false });

  useEffect(() => {
    if (done.photo && done.income) setStep('submitted');
  }, [done]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Roboto', sans-serif", fontSize: '14px', color: '#3B3B3B' }}>
      <GovernmentHeader
        portalName="NSP"
        portalFullName="National Scholarship Portal — Ministry of Electronics & IT"
        portalInitials="NSP"
        variant="nsp"
        welcomeText={step === 'login' ? undefined : `${t('auth.welcome')}, Meera Nair`}
        userIdText={step === 'login' ? undefined : 'OTR: NSPOTR2026MEERA19'}
      />

      <div className="mx-auto mt-0 max-w-6xl px-4">
        <div className="mb-4 mt-4 flex items-center justify-between border bg-white px-4 py-2" style={{ borderColor: '#dee2e6' }}>
          <div className="text-[14px]" style={{ color: '#717171' }}>
            <span className="font-medium" style={{ color: '#F7768D' }}>{t('nsp.dash')}</span>
            <span className="mx-2 text-[#ccc]">/</span>
            <span>{t('nsp.ayUpload')}</span>
          </div>
          <Link href="/" className="px-3 py-1.5 text-[14px] hover:underline" style={{ color: '#106BD8' }}>
            {t('nav.backHome')}
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-0 flex flex-wrap items-stretch gap-0" style={{ background: '#3F51B5' }}>
          {[['nsp.tabStudent', true], ['nsp.tabInstitute', false], ['nsp.tabOfficer', false]].map(([k, active]) => (
            <span key={k as string} className="flex items-center gap-2 border-r border-white/30 px-4 py-2.5 text-[14px] text-white" style={{ background: active ? '#3949AB' : 'transparent', borderBottom: active ? '3px solid #198754' : '3px solid transparent', fontWeight: active ? 500 : 400 }}>
              {t(k as string)}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#198754' }} />
            {t('nsp.ayBanner')}
          </span>
        </div>
        <div className="mb-4" style={{ height: '8px', background: 'linear-gradient(90deg,#F7768D 0%,#D870C7 34%,#7E75D0 57.5%,#36AAC9 100%)' }} />
        {step === 'login' && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_420px]">
            <div className="space-y-5">
              <div className="border bg-white p-6" style={{ borderColor: '#dee2e6' }}>
                <p className="text-[13px] font-medium" style={{ color: '#717171' }}>{t('nsp.loginEyebrow')}</p>
                <h1 className="mt-2" style={{ fontSize: '30px', fontWeight: 500, color: '#0D0D0D', lineHeight: '1.2em' }}>{t('login.student')}</h1>
                <p className="mt-3" style={{ fontSize: '16px', lineHeight: '27px', color: '#3B3B3B' }}>
                  {t('nsp.loginSub')}
                </p>
              </div>

              <div className="border bg-white p-5" style={{ borderColor: '#dee2e6', borderLeft: '4px solid #F7768D' }}>
                <p className="font-semibold" style={{ fontSize: '16px', color: '#0D0D0D' }}>{t('nsp.stall')}</p>
                <p className="mt-2" style={{ fontSize: '16px', lineHeight: '27px', color: '#3B3B3B' }}>
                  {t('nsp.stallBody')}
                </p>
              </div>

              <div className="border p-5" style={{ borderColor: '#dee2e6', background: '#EDEDED' }}>
                <p className="font-semibold" style={{ fontSize: '16px', color: '#202020' }}>{t('nsp.otrInfoT')}</p>
                <ul className="mt-2 space-y-1.5" style={{ fontSize: '14px', lineHeight: '24px', color: '#3B3B3B' }}>
                  {['nsp.otrI1', 'nsp.otrI2', 'nsp.otrI3', 'nsp.otrI4'].map((k) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#F7768D' }} />
                      <span>{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border bg-white" style={{ borderColor: '#dee2e6', maxWidth: '420px', width: '100%' }}>
              <div className="border-b px-5 py-4" style={{ borderColor: '#dee2e6', borderTop: '4px solid #3F51B5' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 600, color: '#0D0D0D' }}>{t('login.student')}</h2>
                <p className="mt-1" style={{ fontSize: '16px', fontWeight: 500, color: '#3B3B3B' }}>{t('nsp.loginBox')}</p>
                <p className="mt-1" style={{ fontSize: '13px', fontWeight: 600, color: '#00000061' }}>OTR • Aadhaar-linked mobile OTP • Face-auth via NSP OTR app</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label={t('nsp.otrNo')} value="12345678901234" />
                <div>
                  <Field label={t('nsp.aadMobile')} value="97450 12365" />
                  <button type="button" className="mt-2 px-3 py-1.5 font-semibold" style={{ fontSize: '14px', color: '#000', background: 'rgba(216,216,216,0.31)', borderRadius: 0, lineHeight: '30px' }}>
                    Get OTP
                  </button>
                </div>
                <Field label={t('upsc.otp')} value="491726" />
                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="w-full text-white transition-colors"
                  style={{ background: '#575757', fontSize: '16px', fontWeight: 500, lineHeight: '40px', borderRadius: 0 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1C5C89'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#575757'; }}
                >
                  {t('nsp.loginOtr')}
                </button>
                <button type="button" className="w-full font-medium" style={{ fontSize: '16px', color: '#1C5C89', background: '#fff', border: '1px solid #1C5C89', lineHeight: '40px', borderRadius: 0 }}>
                  {t('nsp.faceAuth')}
                </button>
                <div className="flex justify-between" style={{ fontSize: '14px', color: '#106BD8' }}>
                  <span className="cursor-pointer hover:underline">{t('nsp.applyOtr')}</span>
                  <span className="cursor-pointer hover:underline">Check Aadhaar Seeding Status</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-6">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow={t('nsp.nudgeEyebrow')}
                title={t('nsp.nudgeTitle')}
                description={t('nsp.nudgeDesc')}
                ctaLabel={t('upload.docs')}
                onAction={() => setStep('upload')}
                onDismiss={() => setNudgeDismissed(true)}
                tone="amber"
              />
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-amber-50/70 px-4 py-2.5 text-sm" style={{ borderColor: '#FDE68A' }}>
                <span className="text-amber-800">{t('nsp.nudgeDismissed')}</span>
                <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                  {t('epfo.showAgain')}
                </button>
              </div>
            )}

            <div className="border bg-white p-6" style={{ borderColor: '#dee2e6' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0D0D0D' }}>{t('nsp.annT')}</h2>
              <ul className="mt-3 space-y-2.5" style={{ fontSize: '16px', lineHeight: '27px', color: '#3B3B3B' }}>
                {['nsp.ann1', 'nsp.ann2', 'nsp.ann3'].map((k) => (
                  <li key={k} className="flex items-start gap-2" style={{ borderBottom: '1px dashed #ccc', paddingBottom: '15px' }}>
                    <span className="mt-1.5" style={{ color: '#F7768D' }} aria-hidden="true">▸</span>
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border bg-white p-6" style={{ borderColor: '#dee2e6' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0D0D0D' }}>{t('nsp.quickLinks')}</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {['nsp.linkApply', 'nsp.linkTrack', 'nsp.linkSeed', 'nsp.linkSchemes', 'nsp.linkHelp', 'nsp.linkPfms'].map((k, i) => (
                  <span key={k} className="block border bg-white p-6" style={{ borderColor: '#fff', fontSize: '16px', lineHeight: '27px', color: '#3B3B3B' }}>
                    <span className="mb-3 block h-1 w-12" style={{ background: ['#F7768D', '#D870C7', '#7E75D0', '#36AAC9', '#F47216', '#198754'][i % 6] }} />
                    <span className="block" style={{ fontSize: '18px', fontWeight: 600, color: '#0D0D0D' }}>{t(k)}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="border bg-white p-6" style={{ borderColor: '#dee2e6' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#000' }}>{t('nsp.profile')}</h2>
                <div className="mt-4 border p-4" style={{ borderColor: '#ccc' }}>
                  <p className="font-medium" style={{ fontSize: '15px', color: '#676767' }}>OTR</p>
                  <p className="mt-1" style={{ fontSize: '18px', fontWeight: 600, color: '#000' }}>NSPOTR2026MEERA19</p>
                  <p style={{ fontSize: '14px', color: '#717171' }}>{t('nsp.profSub')}</p>
                  <div className="mt-3 space-y-2 text-[14px]">
                    <div className="flex items-center justify-between">
                      <span style={{ color: '#676767' }}>{t('nsp.dbt')}</span>
                      <span className="px-2 py-0.5 font-medium" style={{ background: '#D1E7DD', color: '#0F5132', fontSize: '13px' }}>{t('nsp.seeded')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: '#676767' }}>{t('nsp.docs')}</span>
                      <span className="px-2 py-0.5 font-medium" style={{ background: '#FFF3CD', color: '#664D03', fontSize: '13px' }}>{t('nsp.pending2')}</span>
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 font-medium" style={{ fontSize: '15px', color: '#484848' }}>{t('nsp.schemes')}</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {schemeKeys.map((scheme) => (
                    <li key={scheme} className="rounded-lg border bg-white p-3" style={{ borderColor: COLORS.legacyBorder }}>
                      <p className="font-semibold text-slate-700">{scheme}</p>
                      <p className="mt-1 text-xs text-slate-500">{t('nsp.openTill')}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border bg-white p-6" style={{ borderColor: '#dee2e6' }}>
                <p className="font-medium" style={{ fontSize: '13px', color: '#717171' }}>{t('nsp.app2627')}</p>
                <h2 className="mt-2" style={{ fontSize: '30px', fontWeight: 500, color: '#0D0D0D' }}>{t('nsp.appTitle')}</h2>
                <p className="mt-3" style={{ fontSize: '16px', lineHeight: '27px', color: '#3B3B3B' }}>
                  {t('nsp.appBody')}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="flex min-h-[120px] items-center justify-center p-4 text-center text-white" style={{ background: '#F7768D' }}>
                    <span><span className="block" style={{ fontSize: '18px', fontWeight: 500 }}>{t('nsp.photoBox')}</span><span className="mt-1 block" style={{ fontSize: '14px' }}>{t('nsp.photoBoxSub')}</span></span>
                  </div>
                  <div className="flex min-h-[120px] items-center justify-center p-4 text-center text-white" style={{ background: '#7E75D0' }}>
                    <span><span className="block" style={{ fontSize: '18px', fontWeight: 500 }}>{t('nsp.certBox')}</span><span className="mt-1 block" style={{ fontSize: '14px' }}>{t('nsp.certBoxSub')}</span></span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="mt-6 text-white transition-colors"
                  style={{ background: '#575757', fontSize: '16px', fontWeight: 500, lineHeight: '24px', padding: '15px 24px', borderRadius: 0, width: '150px' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1C5C89'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#575757'; }}
                >
                  {t('upload.docs')} →
                </button>
                <div className="mt-6 border bg-white p-4" style={{ borderColor: '#dee2e6' }}>
                  <p className="font-semibold" style={{ fontSize: '18px', color: '#202020' }}>{t('nsp.chainTitle')}</p>
                  <p className="mt-2" style={{ fontSize: '14px', lineHeight: '24px', color: '#3B3B3B' }}>{t('nsp.chainBody')}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'upload' && (
          <section className="space-y-6">
            <div className="border bg-white p-5" style={{ borderColor: '#dee2e6' }}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0D0D0D' }}>{t('nsp.uploadTitle')}</h2>
                  <p className="mt-1" style={{ fontSize: '14px', color: '#717171' }}>{t('nsp.uploadSub')}</p>
                </div>
                <span className="border px-3 py-1 font-medium" style={{ fontSize: '13px', color: '#484848', background: '#EDEDED', borderColor: '#ccc' }}>{t('nsp.uploadDocs')}</span>
              </div>
            </div>
            <div style={{ height: '8px', background: COLORS.nspGradient }} />

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="border bg-white" style={{ borderColor: '#dee2e6', borderTop: '3px solid #3F51B5' }}>
                <div className="border-b px-6 py-4" style={{ borderColor: '#dee2e6', background: '#F8F9FA' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#3F51B5' }}>{t('pp.photo')}</h3>
                  <p className="mt-1" style={{ fontSize: '14px', color: '#495057' }}>{t('nsp.photoSub')}</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2" style={{ fontSize: '14px', lineHeight: '24px', color: '#3B3B3B' }}>
                    {photoKeys.map((k) => (
                      <li key={k} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#3F51B5' }} />
                        <span>{t(k)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border p-4" style={{ borderColor: '#dee2e6', background: '#fff' }}>
                      <DocBridgeWidget
                        portalId="nsp"
                        docType="photo"
                        requirements="NSP OTR scholarship photo. JPEG only, under 50KB, 200x230 pixels, white background, face visible."
                        onSuccess={() => setDone((d) => ({ ...d, photo: true }))}
                      />
                  </div>
                </div>
              </div>

              <div className="border bg-white" style={{ borderColor: '#dee2e6', borderTop: '3px solid #198754' }}>
                <div className="border-b px-6 py-4" style={{ borderColor: '#dee2e6', background: '#F8F9FA' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 500, color: '#3949AB' }}>{t('nsp.cert')}</h3>
                  <p className="mt-1" style={{ fontSize: '14px', color: '#495057' }}>{t('nsp.certSub')}</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2" style={{ fontSize: '14px', lineHeight: '24px', color: '#3B3B3B' }}>
                    {incomeKeys.map((k) => (
                      <li key={k} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#198754' }} />
                        <span>{t(k)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border p-4" style={{ borderColor: '#dee2e6', background: '#fff' }}>
                      <DocBridgeWidget
                        portalId="nsp"
                        docType="income"
                        multi
                        requirements="NSP income certificate upload. PDF only, maximum 500KB, stamp and signature of issuing authority visible."
                        onSuccess={() => setDone((d) => ({ ...d, income: true }))}
                      />
                  </div>
                </div>
              </div>
            </div>


          </section>
        )}

        {step === 'submitted' && (
          <section className="border bg-white p-6" style={{ borderColor: '#dee2e6' }}>
            <p className="font-medium" style={{ fontSize: '13px', color: '#36AAC9' }}>{t('upload.accepted')}</p>
            <h2 className="mt-2" style={{ fontSize: '30px', fontWeight: 500, color: '#0D0D0D' }}>{t('nsp.doneTitle')}</h2>
            <p className="mt-3 max-w-3xl" style={{ fontSize: '16px', lineHeight: '27px', color: '#3B3B3B' }}>
              {t('nsp.doneBody')}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label={t('pp.rc1l')} value={t('nsp.rc1v')} tone="green" />
              <ResultCard label={t('nsp.rc2l')} value={t('nsp.rc2v')} tone="blue" />
              <ResultCard label={t('nsp.rc3l')} value={t('nsp.rc3v')} tone="saffron" />
            </div>
          </section>
        )}
      </main>

      <footer className="mt-8 border-t px-4 py-4" style={{ borderColor: '#dee2e6', background: '#fff' }}>
        <div className="mx-auto max-w-6xl text-center leading-5" style={{ fontSize: '16px', color: '#333' }}>
          <p>{t('nsp.footer')}</p>
          <p className="mt-2 px-4 py-2" style={{ background: '#D9D9D9', fontSize: '16px', color: '#000', lineHeight: '50px' }}>{t('nsp.updated')}</p>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block w-full" style={{ fontSize: '16px', fontWeight: 500, color: '#202020' }}>{label}</label>
      <input
        readOnly
        value={value}
        className="w-full border-none px-4"
        style={{ background: 'rgba(216,216,216,0.31)', fontSize: '16px', fontWeight: 300, lineHeight: '30px', height: '46px', borderRadius: 0, color: '#000' }}
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
      ? { background: '#36AAC9', color: '#fff' }
      : tone === 'saffron'
        ? { background: '#F7768D', color: '#fff' }
        : { background: '#7E75D0', color: '#fff' };

  return (
    <div className="flex min-h-[120px] flex-col items-center justify-center p-4 text-center" style={styles}>
      <p style={{ fontSize: '14px', fontWeight: 400 }}>{label}</p>
      <p className="mt-2" style={{ fontSize: '16px', fontWeight: 500 }}>{value}</p>
    </div>
  );
}
