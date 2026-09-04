'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const photoKeys = ['ssc.pr1', 'ssc.pr2', 'ssc.pr3', 'ssc.pr4', 'ssc.pr5'];
const signatureKeys = ['ssc.sr1', 'ssc.sr2', 'ssc.sr3', 'ssc.sr4'];

export default function SSCPortal() {
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
        portalName="SSC"
        portalFullName="Staff Selection Commission — One Time Registration"
        portalInitials="SSC"
        welcomeText={step === 'login' ? undefined : `${t('auth.welcome')}, Priya Sharma`}
        userIdText={step === 'login' ? undefined : 'OTR: SSCOTR20240055231'}
      />

      <div className="mx-auto mt-6 max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">{t('ssc.otrHome')}</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>{t('ssc.cglSub')}</span>
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">{t('ssc.loginEyebrow')}</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('upsc.loginTitle')}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {t('ssc.loginSub')}
                </p>
              </div>

              <div className="rounded-xl border bg-[#fff8e1] p-5" style={{ borderColor: '#FDE68A' }}>
                <p className="text-sm font-bold text-[#8a5a00]">{t('ssc.screening')}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t('ssc.screeningBody')}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">{t('login.candidate')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('ssc.loginBox')}</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label={t('ssc.regNo')} value="SSC20240055231" />
                <Field label={t('ssc.dob')} value="14/08/2003" />
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t('epfo.captcha')}</label>
                  <div className="flex items-center gap-3">
                    <div className="rounded-md border bg-[#f8fafc] px-4 py-3 font-mono tracking-[0.28em] text-[#0b3c92]" style={{ borderColor: COLORS.gray[300] }}>
                      2 6 1 8
                    </div>
                    <input
                      readOnly
                      value="2618"
                      className="w-full rounded-md border px-4 py-3 text-sm text-slate-700"
                      style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.white }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{t('auth.demoPrefill')}</p>
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
                  <span>{t('ssc.newOtr')}</span>
                  <span>{t('ssc.forgotReg')}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'dashboard' && (
          <section className="space-y-6">
            {!nudgeDismissed ? (
              <PortalNudge
                eyebrow={t('ssc.nudgeEyebrow')}
                title={t('ssc.nudgeTitle')}
                description={t('ssc.nudgeDesc')}
                ctaLabel={t('upload.photoSig')}
                onAction={() => setStep('upload')}
                onDismiss={() => setNudgeDismissed(true)}
                tone="amber"
              />
            ) : (
              <div className="flex items-center justify-between rounded-lg border bg-amber-50/70 px-4 py-2.5 text-sm" style={{ borderColor: '#FDE68A' }}>
                <span className="text-amber-800">{t('ssc.nudgeDismissed')}</span>
                <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                  {t('epfo.showAgain')}
                </button>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-xl font-bold text-[#0b1f4d]">{t('ssc.otrProfile')}</h2>
                <div className="mt-4 rounded-lg bg-[#f8fafc] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{t('ssc.candidate')}</p>
                  <p className="mt-1 text-sm font-bold text-[#0b1f4d]">Priya Sharma</p>
                  <p className="text-xs text-slate-500">{t('ssc.candSub')}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{t('upload.pending')}</span>
                  </div>
                </div>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{t('ssc.myExams')}</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {[
                    ['CGL 2026', 'ssc.applyPending', true],
                    ['CHSL 2025', 'upsc.submitted', false],
                    ['MTS 2025', 'upsc.submitted', false],
                  ].map(([exam, sk, pending]) => (
                    <li key={exam as string} className="flex items-center justify-between gap-3 rounded-lg border bg-white p-3" style={{ borderColor: COLORS.legacyBorder }}>
                      <span className="font-semibold text-slate-700">{exam as string}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${(pending as boolean) ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{t(sk as string)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">{t('ssc.cglApp')}</p>
                <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('ssc.cglTitle')}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {t('ssc.cglBody')}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-[#f8fafc] p-4">
                    <p className="text-sm font-semibold text-[#0b3c92]">{t('ssc.photoBox')}</p>
                    <p className="mt-2 text-sm text-slate-600">{t('ssc.photoBoxSub')}</p>
                  </div>
                  <div className="rounded-xl bg-[#fff8e1] p-4">
                    <p className="text-sm font-semibold text-[#8a5a00]">{t('ssc.sigBox')}</p>
                    <p className="mt-2 text-sm text-slate-600">{t('ssc.sigBoxSub')}</p>
                  </div>
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
                  <h2 className="text-lg font-bold text-[#0b1f4d]">{t('ssc.uploadTitle')}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t('ssc.uploadSub')}</p>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{t('ssc.step24')}</span>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">{t('pp.photo')}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t('ssc.photoSub')}</p>
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
                    <p className="mt-2 text-sm text-slate-600">{t('ssc.photoAssist')}</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="ssc"
                        docType="photo"
                        requirements="SSC OTR photo upload. JPEG only, 20KB - 50KB, exactly 200x230 pixels, white background, no cap."
                        onSuccess={() => setDone((d) => ({ ...d, photo: true }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">{t('pp.signature')}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t('ssc.sigSub')}</p>
                </div>
                <div className="space-y-4 p-6">
                  <ul className="space-y-2 text-sm text-slate-600">
                    {signatureKeys.map((k) => (
                      <li key={k} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: COLORS.primary }} />
                        <span>{t(k)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">{t('epfo.assist')}</p>
                    <p className="mt-2 text-sm text-slate-600">{t('ssc.sigAssist')}</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="ssc"
                        docType="signature"
                        requirements="SSC signature upload. Signature scan, JPEG only, 10KB - 20KB, 140x60 pixels, running handwriting."
                        onSuccess={() => setDone((d) => ({ ...d, signature: true }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg p-4 text-sm" style={{ backgroundColor: COLORS.errorLight, color: '#991B1B' }}>
              <strong>{t('ssc.errAvoid')}</strong> {t('ssc.errAvoidBody')}
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d6b07]">{t('upload.accepted')}</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('ssc.doneTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              {t('ssc.doneBody')}
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ResultCard label={t('pp.rc1l')} value={t('ssc.rc1v')} tone="green" />
              <ResultCard label={t('pp.rc2l')} value={t('ssc.rc2v')} tone="blue" />
              <ResultCard label={t('ssc.rc3l')} value={t('ssc.rc3v')} tone="saffron" />
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
