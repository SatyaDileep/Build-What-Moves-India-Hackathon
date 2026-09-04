'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'dashboard' | 'upload' | 'submitted';

const photoKeys = ['pp.pr1', 'pp.pr2', 'pp.pr3', 'pp.pr4', 'pp.pr5', 'pp.pr6'];
const signatureKeys = ['pp.sr1', 'pp.sr2', 'pp.sr3', 'pp.sr4'];
const stageKeys = ['pp.sg1', 'pp.sg2', 'pp.sg3', 'pp.sg4'];

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
            <span className="font-semibold text-[#1E3A8A]">{t('pp.appHome')}</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>{t('upload.photoSig')}</span>
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
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a5a00]">{t('pp.loginEyebrow')}</p>
                <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('pp.loginTitle')}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {t('pp.loginSub')}
                </p>
              </div>

              <div className="rounded-xl border bg-[#fff8e1] p-5" style={{ borderColor: '#FDE68A' }}>
                <p className="text-sm font-bold text-[#8a5a00]">{t('pp.mandatory')}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {t('pp.mandatoryBody')}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-white shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
              <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-lg font-bold text-[#0b1f4d]">{t('login.applicant')}</h2>
                <p className="mt-1 text-sm text-slate-500">{t('pp.loginBox')}</p>
              </div>
              <div className="space-y-4 p-5">
                <Field label={t('auth.loginId')} value="kabir.mehta34" />
                <Field label={t('epfo.password')} value="••••••••••" />
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">{t('epfo.captcha')}</label>
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
                  <span>{t('pp.newUser')}</span>
                  <span>{t('auth.forgotLogin')}</span>
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
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <h2 className="text-xl font-bold text-[#0b1f4d]">{t('pp.applicantHome')}</h2>
                <div className="mt-4 rounded-lg bg-[#f8fafc] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{t('pp.fileNo')}</p>
                  <p className="mt-1 text-sm font-bold text-[#0b1f4d]">BNGO40217846125</p>
                  <p className="text-xs text-slate-500">{t('pp.fileSub')}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{t('upload.pending')}</span>
                    <span className="text-xs text-slate-500">{t('pp.attemptsLeft')}</span>
                  </div>
                </div>
                <h3 className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-slate-500">{t('pp.stages')}</h3>
                <ul className="mt-3 space-y-3 text-sm">
                  {stageKeys.map((k, index) => (
                    <li key={k} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: index < 2 ? COLORS.green : COLORS.saffronDark }}
                      >
                        {index < 2 ? '✓' : '!'}
                      </span>
                      <span className="text-slate-600">{t(k)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">{t('pp.track')}</p>
                <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('pp.trackTitle')}</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      <tr>
                        <th className="py-2 pr-4">{t('pp.application')}</th>
                        <th className="py-2 pr-4">{t('epfo.status')}</th>
                        <th className="py-2 pr-4">{t('pp.action')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-2 pr-4">BNGO40217846125 · Fresh</td>
                        <td className="py-2 pr-4"><span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{t('pp.rowStatus')}</span></td>
                        <td className="py-2 pr-4"><button type="button" onClick={() => setStep('upload')} className="font-semibold text-[#0b3c92] underline">{t('pp.uploadBtn')}</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-lg p-3 text-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                  <strong>{t('pp.whyAttempts')}</strong> {t('pp.whyAttemptsBody')}
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
                  <h2 className="text-lg font-bold text-[#0b1f4d]">{t('pp.uploadTitle')}</h2>
                  <p className="mt-1 text-sm text-slate-500">ARN BNGO40217846125 · {t('pp.attemptsRem')} <strong className="text-amber-700">photo + signature</strong></p>
                </div>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{t('pp.stage34')}</span>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h3 className="text-lg font-bold text-[#0b1f4d]">{t('pp.photo')}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t('pp.photoSub')}</p>
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
                    <p className="mt-2 text-sm text-slate-600">{t('pp.photoAssist')}</p>
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
                  <h3 className="text-lg font-bold text-[#0b1f4d]">{t('pp.signature')}</h3>
                  <p className="mt-1 text-sm text-slate-500">{t('pp.sigSub')}</p>
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
                    <p className="mt-2 text-sm text-slate-600">{t('pp.sigAssist')}</p>
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
              <strong>{t('pp.errAvoid')}</strong> {t('pp.errAvoidBody')}
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0d6b07]">{t('upload.accepted')}</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('pp.doneTitle')}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
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
