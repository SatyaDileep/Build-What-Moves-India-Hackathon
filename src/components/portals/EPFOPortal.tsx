'use client';

import Link from 'next/link';
import { useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import PortalNudge from '@/components/ui/PortalNudge';
import TricolorBar from '@/components/ui/TricolorBar';
import { COLORS } from '@/lib/constants';
import { useLang, voiceLang } from '@/lib/i18n';
import { useVoiceGuide } from '@/hooks/useVoiceGuide';
import { isVoiceOn } from '@/lib/voice';

type JourneyStep = 'login' | 'home' | 'kyc' | 'submitted';

const stepKeys = ['epfo.st1', 'epfo.st2', 'epfo.st3', 'epfo.st4'];

export default function EPFOPortal() {
  const { t, lang } = useLang();
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);
  const [alerts, setAlerts] = useState({ rbi: true, mobile: true });
  useVoiceGuide(isVoiceOn() && step === 'submitted', t('w.congrats'), voiceLang(lang));

  const masthead = (signedIn: boolean) => (
    <header style={{ backgroundColor: '#fff' }}>
      <div className="sticky top-0 z-50">
        <TricolorBar />
      </div>
      {step === 'login' && (
        <div className="flex items-center justify-end gap-3 px-4 py-1.5 text-[13px]" style={{ backgroundColor: '#f5f5f5', color: '#e4791a' }}>
          <span>👉 <span className="hover:underline" style={{ color: '#2a7de1' }}>Screen Reader Access</span></span>
          <span className="rounded border bg-white px-1.5 py-0.5 font-bold text-[#333]">A-</span>
          <span className="rounded border bg-white px-1.5 py-0.5 font-bold text-[#333]">A</span>
          <span className="rounded border bg-white px-1.5 py-0.5 font-bold text-[#333]">A+</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid #e5e5e5' }}>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: 'radial-gradient(circle at 35% 35%, #2a7de1, #0b3c92)', border: '3px solid #c0392b' }}>EPFO</span>
        <span>
          <span className="block text-[14px] font-bold tracking-wide" style={{ color: '#1a8a8a' }}>{t('epfo.orgName')}</span>
          <span className="block text-[13px]" style={{ color: '#b5651d' }}>{t('epfo.ministry')}</span>
        </span>
        {signedIn ? (
          <span className="ml-auto flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-bold" style={{ borderColor: '#bcd6d6', backgroundColor: '#eef6f6', color: '#0b5e5e' }}>
              <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ backgroundColor: '#1a7a7a' }}>👤</span>
              <span>UAN: 100765432109<br />{t('epfo.fullName')}</span>
            </span>
            <span className="hidden items-center gap-1 sm:flex">
              <span className="rounded border bg-white px-1.5 py-0.5 text-[11px] font-bold text-[#333]">A-</span>
              <span className="rounded border bg-white px-1.5 py-0.5 text-[11px] font-bold text-[#333]">A</span>
              <span className="rounded border bg-white px-1.5 py-0.5 text-[11px] font-bold text-[#333]">A+</span>
            </span>
            <button type="button" onClick={() => setStep('login')} className="rounded-md px-4 py-2 text-[13px] font-bold text-white" style={{ backgroundColor: '#c0392b' }}>⎋ {t('epfo.logout')}</button>
          </span>
        ) : (
          <Link href="/" className="ml-auto text-[13px] hover:underline" style={{ color: '#2a7de1' }}>{t('nav.backHome')}</Link>
        )}
      </div>
      {signedIn && (
        <nav style={{ backgroundColor: '#1a7a7a' }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 text-[13px] font-semibold text-white">
            {[
              { label: `🏠 ${t('epfo.navHome')}`, action: () => setStep('home'), active: step === 'home' },
              { label: `👁 ${t('epfo.navView')}`, action: () => setStep('home'), active: false },
              { label: `⚙ ${t('epfo.navManage')}`, action: () => setStep('kyc'), active: step === 'kyc' },
              { label: `👤 ${t('epfo.navAccount')}`, action: () => setStep('home'), active: false },
              { label: `🌐 ${t('epfo.navOnline')}`, action: () => setStep('home'), active: false },
              { label: `📈 ${t('epfo.navPmvbry')}`, action: () => setStep('home'), active: false },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                className="rounded px-3 py-2.5"
                style={{ backgroundColor: item.active ? 'rgba(255,255,255,0.22)' : 'transparent' }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: step === 'login' ? '#f1f1f1' : '#f7f9fb' }}>
      {masthead(step !== 'login')}

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        {step !== 'login' && step !== 'home' && (
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">{t('epfo.unifiedPortal')}</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>{t('epfo.kycServices')}</span>
          </div>
          <Link
            href="/"
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-[#1E3A8A] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-50"
          >
            {t('nav.backHome')}
          </Link>
        </div>
        )}

        <div className="mb-6 rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
          {step === 'login' && (
            <section className="grid gap-5 bg-[#f1f1f1] p-4 lg:grid-cols-[1fr_300px] lg:p-5" style={{ borderRadius: '6px' }}>
              <div className="rounded-xl border bg-white" style={{ borderColor: '#e0e0e0' }}>
                <div className="flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-[14px] font-bold text-white" style={{ backgroundColor: '#1a7a7a' }}>
                  <span>🧑‍🤝‍🧑</span> {t('epfo.dearMembers')}
                </div>
                <ul className="space-y-3 p-4 text-[14px] leading-6 text-[#222]">
                  <li className="flex items-start gap-2">
                    <span className="rounded px-1.5 py-0.5 text-[11px] font-bold text-white" style={{ backgroundColor: '#d32f2f' }}>NEW</span>
                    <span>{t('epfo.uanActivation')}</span>
                  </li>
                  <li className="flex items-start gap-2"><span style={{ color: '#e4791a' }}>👉</span><span>{t('epfo.eshram')} 📄</span></li>
                  <li className="flex items-start gap-2"><span style={{ color: '#e4791a' }}>👉</span><span>{t('epfo.edli')} 📄</span></li>
                  <li className="flex items-start gap-2"><span style={{ color: '#e4791a' }}>🔔</span><span>{t('epfo.nomination')}</span></li>
                </ul>
              </div>

              <div className="relative rounded-xl border bg-white px-4 pb-4 pt-8" style={{ borderColor: '#e0e0e0' }}>
                <span className="absolute -top-1 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border bg-white text-2xl" style={{ borderColor: '#1a7a7a' }}>👥</span>
                <div className="mt-8 rounded-md px-3 py-3 text-center text-[13px] leading-5" style={{ backgroundColor: '#fef3cd', color: '#664d03', border: '1px solid #ffe69c' }}>
                  {t('epfo.invalidCreds')}
                </div>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1 block text-[13px] font-bold text-[#222]">{t('epfo.uan')} <span style={{ color: '#d32f2f' }}>*</span></label>
                    <input readOnly value="100765432109" className="w-full rounded-md border px-3 py-2 text-[14px]" style={{ borderColor: '#bfc6d4', backgroundColor: '#e8eefc' }} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-bold text-[#222]">{t('epfo.password')} <span style={{ color: '#d32f2f' }}>*</span></label>
                    <div className="relative">
                      <input readOnly value="••••••••••" type="password" className="w-full rounded-md border px-3 py-2 text-[14px]" style={{ borderColor: '#bfc6d4', backgroundColor: '#e8eefc' }} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]">👁</span>
                    </div>
                  </div>
                  <p className="text-[11px]" style={{ color: '#6C757D' }}>{t('auth.demoPrefill')}</p>
                  <div className="flex justify-center gap-3">
                    <button type="button" onClick={() => setStep('home')} className="rounded-md px-6 py-2 text-[14px] font-semibold text-white" style={{ backgroundColor: '#1a7a7a' }}>{t('epfo.signin')}</button>
                    <button type="button" className="rounded-md px-6 py-2 text-[14px] font-semibold text-white" style={{ backgroundColor: '#6c757d' }}>{t('epfo.reset')}</button>
                  </div>
                  <p className="text-[13px]" style={{ color: '#2a7de1' }}><span className="cursor-pointer hover:underline">{t('epfo.forgotPwd')}</span></p>
                </div>
              </div>
            </section>
          )}

          {step === 'home' && (
            <section className="space-y-6 p-4 lg:p-6">
              {/* Persistent banner / nudge — this is the click that reveals DocBridge in the KYC upload screen */}
              {!nudgeDismissed ? (
                <PortalNudge
                  eyebrow={t('epfo.nudgeEyebrow')}
                  title={t('epfo.nudgeTitle')}
                  description={t('epfo.nudgeDesc')}
                  ctaLabel={t('epfo.nudgeCta')}
                  onAction={() => setStep('kyc')}
                  onDismiss={() => setNudgeDismissed(true)}
                  tone="amber"
                />
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-amber-50/70 px-4 py-2.5 text-sm" style={{ borderColor: '#FDE68A' }}>
                  <span className="text-amber-800">{t('epfo.nudgeDismissed')}</span>
                  <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                    {t('epfo.showAgain')}
                  </button>
                </div>
              )}

              <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  {alerts.rbi && (
                    <div className="flex items-start gap-3 rounded-lg border-l-4 p-4 text-[13px] leading-6 shadow-sm" style={{ borderColor: '#f0c6c6', borderLeftColor: '#d32f2f', backgroundColor: '#fdecea', color: '#5f2120' }}>
                      <span className="mt-0.5">ⓘ</span>
                      <p className="flex-1"><span className="mr-2 rounded px-1.5 py-0.5 text-[11px] font-bold text-white" style={{ backgroundColor: '#d32f2f' }}>New!</span>{t('epfo.rbiNotice')}</p>
                      <button type="button" aria-label="Dismiss" onClick={() => setAlerts((a) => ({ ...a, rbi: false }))} className="shrink-0 text-[#999] hover:text-[#333]">✕</button>
                    </div>
                  )}
                  {alerts.mobile && (
                    <div className="flex items-start gap-3 rounded-lg border-l-4 p-4 text-[13px] leading-6 shadow-sm" style={{ borderColor: '#b3e5fc', borderLeftColor: '#29b6f6', backgroundColor: '#e1f5fe', color: '#01579b' }}>
                      <span className="mt-0.5">🔔</span>
                      <p className="flex-1 font-semibold">{t('epfo.mobileNotice')} 📄</p>
                      <button type="button" aria-label="Dismiss" onClick={() => setAlerts((a) => ({ ...a, mobile: false }))} className="shrink-0 text-[#999] hover:text-[#333]">✕</button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="rounded-xl border bg-white shadow-sm" style={{ borderColor: '#e5e5e5' }}>
                    <p className="flex items-center gap-2 border-b px-4 py-3 text-[14px] font-bold" style={{ borderColor: '#eee', color: '#1a7a7a' }}>👤 {t('epfo.memberProfile')}</p>
                    <dl className="text-[13px]">
                      {(
                        [
                          ['UAN', '100765432109', false],
                          [t('epfo.nameLabel'), t('epfo.fullName'), false],
                          [t('epfo.dobLabel'), '18/02/1991', true],
                          [t('epfo.genderLabel'), t('epfo.male'), false],
                        ] as [string, string, boolean][]
                      ).map(([dt, dd, editable]) => (
                        <div key={dt} className="flex items-center justify-between gap-3 border-b px-4 py-2.5" style={{ borderColor: '#f0f0f0' }}>
                          <dt className="text-[#555]">{dt}</dt>
                          <dd className="font-semibold text-[#222]">{dd}{editable && <span className="ml-2 text-[#1a7a7a]">✎</span>}</dd>
                        </div>
                      ))}
                    </dl>
                    <details className="border-b px-4 py-2.5 text-[13px] font-bold" style={{ borderColor: '#f0f0f0', color: '#1a7a7a' }}>
                      <summary className="cursor-pointer">✚ {t('epfo.profileInfo')}</summary>
                    </details>
                    <details className="px-4 py-2.5 text-[13px] font-bold" style={{ color: '#1a7a7a' }}>
                      <summary className="cursor-pointer">✚ {t('epfo.moreInfo')}</summary>
                    </details>
                  </div>
                </div>

              </div>

              <div className="mt-6">
                <h3 className="text-[13px] font-bold tracking-wide text-[#777]">▦ {t('epfo.quickLinks')}</h3>
                <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {(
                    [
                      ['🚩', '#fef6e8', t('epfo.navPmvbry'), false],
                      ['📖', '#e8f4f4', t('epfo.qlPassbook'), true],
                      ['📄', '#fdeee9', t('epfo.qlFileClaim'), false],
                      ['🔍', '#e3f5f5', t('epfo.qlTrackClaim'), false],
                      ['👥', '#e9f6ec', t('epfo.qlNomination'), false],
                      ['🕘', '#f1f1f1', t('epfo.qlHistory'), false],
                    ] as [string, string, string, boolean][]
                  ).map(([icon, bg, label, clickable]) =>
                    clickable ? (
                      <button key={label} type="button" onClick={() => setStep('kyc')} className="rounded-xl border bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-0.5" style={{ borderColor: '#e5e5e5' }}>
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: bg }}>{icon}</span>
                        <span className="mt-2 block text-[12px] font-bold text-[#222]">{label}</span>
                      </button>
                    ) : (
                      <div key={label} className="rounded-xl border bg-white p-4 text-center shadow-sm" style={{ borderColor: '#e5e5e5' }}>
                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: bg }}>{icon}</span>
                        <span className="mt-2 block text-[12px] font-bold text-[#222]">{label}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          )}

          {step === 'kyc' && (
            <section className="grid gap-6 p-4 lg:grid-cols-[250px_1fr] lg:p-6">
              <aside className="space-y-4">
                <div className="rounded-lg border bg-white p-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-sm font-bold text-[#0b1f4d]">{t('epfo.svcProgress')}</p>
                  <ol className="mt-4 space-y-3 text-sm text-slate-600">
                    {stepKeys.map((k, index) => (
                      <li key={k} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: index < 3 ? COLORS.green : COLORS.saffronDark }}
                        >
                          {index < 3 ? '✓' : '4'}
                        </span>
                        <span>{t(k)}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('home')}
                  className="w-full rounded-md border bg-white px-4 py-3 text-sm font-medium text-slate-600"
                  style={{ borderColor: COLORS.gray[300] }}
                >
                  {t('epfo.backDash')}
                </button>
              </aside>

              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{t('epfo.breadcrumb')}</p>
                  <h2 className="mt-2 text-xl font-bold text-[#0b1f4d]">{t('epfo.uploadTitle')}</h2>
                  <p className="mt-1 text-sm text-slate-500">{t('epfo.portalRule')}</p>
                </div>

                <div className="space-y-6 p-6">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{t('epfo.acctNo')}</label>
                    <input
                      type="text"
                      value="3847 2910 5678"
                      readOnly
                      className="w-full rounded-lg border px-4 py-3 text-sm"
                      style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.gray[50] }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{t('epfo.passbookCopy')}</label>
                    <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[500] }}>
                      <svg className="mx-auto mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="font-medium">{t('epfo.stdUpload')}</p>
                      <p className="mt-1 text-sm">{t('epfo.stdUploadSub')}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                      <DocBridgeWidget
                        portalId="epfo"
                        requirements="Upload Passbook copy. Must be PDF format. Maximum size 500 KB. Account number must be visible."
                        onSuccess={() => setStep('submitted')}
                        sourceHeading={t('epfo.skipHassle')}
                        sourceSub={t('epfo.skipHassleSub')}
                      />
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 'submitted' && (
            <section className="p-4 lg:p-6">
              <div className="rounded-2xl border bg-white p-6 shadow-sm" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0d6b07]">{t('epfo.doneEyebrow')}</p>
                    <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">{t('epfo.doneTitle')}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                      {t('epfo.doneBody')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('home')}
                    className="rounded-md px-4 py-3 text-sm font-semibold text-white"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    {t('epfo.returnDash')}
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <ResultCard label={t('epfo.rc1l')} value={t('epfo.rc1v')} tone="green" />
                  <ResultCard label={t('epfo.rc2l')} value={t('epfo.rc2v')} tone="saffron" />
                  <ResultCard label={t('epfo.rc3l')} value={t('epfo.rc3v')} tone="blue" />
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
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
