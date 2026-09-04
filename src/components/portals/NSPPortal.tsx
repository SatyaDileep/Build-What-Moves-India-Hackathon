'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const photoKeys = ['nsp.pr1', 'nsp.pr2', 'nsp.pr3', 'nsp.pr4'];
const incomeKeys = ['nsp.ir1', 'nsp.ir2', 'nsp.ir3', 'nsp.ir4'];
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
    <div className="min-h-screen" style={{ backgroundColor: COLORS.legacyBg }}>
      <GovernmentHeader
        portalName="NSP"
        portalFullName="National Scholarship Portal — Ministry of Electronics & IT"
        portalInitials="NSP"
        welcomeText={step === 'login' ? undefined : `${t('auth.welcome')}, Meera Nair`}
        userIdText={step === 'login' ? undefined : 'OTR: NSPOTR2026MEERA19'}
      />

      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">{t('nsp.dash')}</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>{t('nsp.ayUpload')}</span>
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
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {[['nsp.tabStudent', true], ['nsp.tabInstitute', false], ['nsp.tabOfficer', false]].map(([k, active]) => (
            <span key={k as string} className={`rounded-full px-4 py-1.5 text-sm font-bold ${active ? 'bg-white text-[#1E3A8A] shadow-sm ring-1 ring-black/5' : 'text-slate-500'}`} style={active ? {} : { backgroundColor: 'transparent' }}>
              {t(k as string)}
            </span>
          ))}
          <span className="ml-auto rounded-full bg-[#0d6b07] px-3 py-1.5 text-xs font-bold text-white">{t('nsp.ayBanner')}</span>
        </div>
        {step === 'login' && (
          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">{t('nsp.loginEyebrow')}</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('login.student')}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {t('nsp.loginSub')}
                </p>
              </div>

              <div className="rounded-xl border bg-[#fff8e1] p-5" style={{ borderColor: '#FDE68A' }}>
                <p className="text-sm font-bold text-[#8a5a00]">{t('nsp.stall')}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t('nsp.stallBody')}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-sm font-bold text-[#0b3c92]">{t('nsp.otrInfoT')}</p>
                <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600">
                  {['nsp.otrI1', 'nsp.otrI2', 'nsp.otrI3', 'nsp.otrI4'].map((k) => (
                    <li key={k} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0d6b07]" />
                      <span>{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">{t('login.student')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('nsp.loginBox')}</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label={t('nsp.otrNo')} value="12345678901234" />
                <Field label={t('nsp.aadMobile')} value="97450 12365" />
                <Field label={t('upsc.otp')} value="491726" />
                <button
                  type="button"
                  onClick={() => setStep('dashboard')}
                  className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  {t('nsp.loginOtr')}
                </button>
                <div className="flex justify-between text-xs text-[#0b3c92]">
                  <span>{t('nsp.applyOtr')}</span>
                  <span>{t('nsp.faceAuth')}</span>
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

            <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <h2 className="text-lg font-bold text-[#0b1f4d]">{t('nsp.annT')}</h2>
              <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-600">
                {['nsp.ann1', 'nsp.ann2', 'nsp.ann3'].map((k) => (
                  <li key={k} className="flex items-start gap-2">
                    <span className="mt-1.5 text-[#EA580C]" aria-hidden="true">▸</span>
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <h2 className="text-lg font-bold text-[#0b1f4d]">{t('nsp.quickLinks')}</h2>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {['nsp.linkApply', 'nsp.linkTrack', 'nsp.linkSeed', 'nsp.linkSchemes', 'nsp.linkHelp', 'nsp.linkPfms'].map((k) => (
                  <span key={k} className="rounded-lg bg-[#f8fafc] px-3 py-2.5 text-sm font-semibold text-[#0b3c92]" style={{ border: `1px solid ${COLORS.legacyBorder}` }}>
                    {t(k)}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-xl font-bold text-[#0b1f4d]">{t('nsp.profile')}</h2>
                <div className="mt-4 rounded-lg bg-[#f8fafc] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">OTR</p>
                  <p className="mt-1 text-sm font-bold text-[#0b1f4d]">NSPOTR2026MEERA19</p>
                  <p className="text-xs text-slate-500">{t('nsp.profSub')}</p>
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{t('nsp.dbt')}</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700">{t('nsp.seeded')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">{t('nsp.docs')}</span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-700">{t('nsp.pending2')}</span>
                    </div>
                  </div>
                </div>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{t('nsp.schemes')}</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {schemeKeys.map((scheme) => (
                    <li key={scheme} className="rounded-lg border bg-white p-3" style={{ borderColor: COLORS.legacyBorder }}>
                      <p className="font-semibold text-slate-700">{scheme}</p>
                      <p className="mt-1 text-xs text-slate-500">{t('nsp.openTill')}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">{t('nsp.app2627')}</p>
                <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('nsp.appTitle')}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {t('nsp.appBody')}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    <p className="text-sm font-semibold text-[#0b3c92]">{t('nsp.photoBox')}</p>
                    <p className="mt-2 text-sm text-slate-600">{t('nsp.photoBoxSub')}</p>
                  </div>
                  <div className="rounded-xl bg-[#fff8e1] p-4">
                    <p className="text-sm font-semibold text-[#8a5a00]">{t('nsp.certBox')}</p>
                    <p className="mt-2 text-sm text-slate-600">{t('nsp.certBoxSub')}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('upload')}
                  className="mt-6 rounded-md px-4 py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: COLORS.saffronDark }}
                >
                  {t('upload.docs')} →
                </button>
                <div className="mt-6 rounded-lg border bg-slate-50 p-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{t('nsp.chainTitle')}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{t('nsp.chainBody')}</p>
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
                  <h2 className="text-lg font-bold text-[#0b1f4d]">{t('nsp.uploadTitle')}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t('nsp.uploadSub')}</p>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{t('nsp.uploadDocs')}</span>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">{t('pp.photo')}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t('nsp.photoSub')}</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2 text-sm text-slate-600">
                    {photoKeys.map((k) => (
                      <li key={k} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                        <span>{t(k)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('epfo.assist')}</p>
                    <p className="mt-2 text-sm text-slate-600">{t('nsp.photoAssist')}</p>
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
                  <h3 className="text-lg font-bold text-[#0b1f4d]">{t('nsp.cert')}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t('nsp.certSub')}</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2 text-sm text-slate-600">
                    {incomeKeys.map((k) => (
                      <li key={k} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                        <span>{t(k)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('epfo.assist')}</p>
                    <p className="mt-2 text-sm text-slate-600">{t('nsp.certAssist')}</p>
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
              <strong>{t('nsp.errAvoid')}</strong> {t('nsp.errAvoidBody')}
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d6b07]">{t('upload.accepted')}</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('nsp.doneTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
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

      <footer className="border-t bg-white/80 px-4 py-4" style={{ borderColor: COLORS.legacyBorder }}>
        <div className="mx-auto max-w-6xl text-center text-xs leading-5 text-slate-500">
          <p>{t('nsp.footer')}</p>
          <p className="mt-1">{t('nsp.updated')}</p>
        </div>
      </footer>
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
