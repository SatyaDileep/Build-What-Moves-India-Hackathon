'use client';

import Link from 'next/link';
import { useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import GovernmentHeader from '@/components/ui/GovernmentHeader';
import PortalNudge from '@/components/ui/PortalNudge';
import { COLORS } from '@/lib/constants';
import { useLang } from '@/lib/i18n';

type JourneyStep = 'login' | 'home' | 'kyc' | 'submitted';

const notices = [
  'EPFO services are available in a phased manner after recent platform upgrades.',
  'Members may experience slightly longer processing times during peak hours.',
  'Avoid repeated submissions while your request is under review.',
];

const shortcuts = [
  'Activate UAN',
  'Know Your UAN',
  'Track Claim Status',
  'Download Passbook',
];

const kycItems = [
  ['Aadhaar', 'Verified', COLORS.greenLight, COLORS.greenDark],
  ['PAN', 'Pending employer approval', '#FFF7E6', '#B45309'],
  ['Bank Account', 'Document required', '#FFF1F2', '#BE123C'],
] as const;

export default function EPFOPortal() {
  const { t } = useLang();
  const [step, setStep] = useState<JourneyStep>('login');
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eef1f4' }}>
      <GovernmentHeader
        portalName="EPFO"
        portalFullName="Employees' Provident Fund Organisation"
        portalInitials="EPFO"
        welcomeText={step === 'login' ? undefined : `${t('auth.welcome')}, Ramesh Kumar`}
        userIdText={step === 'login' ? undefined : 'UAN: 10098765432'}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-stone-200/60 bg-white/80 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-[#1E3A8A]">Unified Member Portal</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>KYC Services</span>
          </div>
          <Link
            href="/"
            className="rounded-2xl px-4 py-2 text-sm font-semibold text-[#1E3A8A] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-blue-50"
          >
            {t('nav.backHome')}
          </Link>
        </div>

        <div className="mb-6 rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
          {step === 'login' && (
            <section className="grid gap-6 p-4 lg:grid-cols-[1.2fr_0.8fr] lg:p-6">
              <div className="space-y-5">
                <div className="rounded-lg border p-5" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#f8fafc' }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a3412]">Unified Member Portal</p>
                  <h1 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Sign in to continue your KYC update</h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                    Access member services, review KYC status, and upload supporting bank proof where required.
                  </p>
                </div>

                <div className="rounded-lg border bg-[#fffdf6] p-5" style={{ borderColor: '#f5d28b' }}>
                  <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#8a5a00]">Important notice</h2>
                  <ul className="mt-3 space-y-2 text-sm text-[#6b4b00]">
                    {notices.map((notice) => (
                      <li key={notice} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#ff9933]" />
                        <span>{notice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {shortcuts.map((item) => (
                    <div key={item} className="rounded-lg border bg-white p-4" style={{ borderColor: COLORS.legacyBorder }}>
                      <p className="text-sm font-semibold text-[#0b3c92]">{item}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">Quick access for common member account actions.</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border bg-white shadow-sm" style={{ borderColor: '#cfd6e4' }}>
                <div className="border-b px-5 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <h2 className="text-lg font-bold text-[#0b1f4d]">{t('login.member')}</h2>
                  <p className="mt-1 text-sm text-slate-500">UAN, password, and captcha are required on the live portal.</p>
                </div>
                <div className="space-y-4 p-5">
                  <Field label="UAN Number" value="10098765432" />
                  <Field label="Password" value="••••••••••" />
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Captcha</label>
                    <div className="flex items-center gap-3">
                      <div className="rounded-md border bg-[#f8fafc] px-4 py-3 font-mono tracking-[0.28em] text-[#0b3c92]" style={{ borderColor: COLORS.gray[300] }}>
                        4 8 2 1
                      </div>
                      <input
                        readOnly
                        value="4821"
                        className="w-full rounded-md border px-4 py-3 text-sm text-slate-700"
                        style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.white }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('home')}
                    className="w-full rounded-md px-4 py-3 text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    Sign In
                  </button>

                  <div className="flex justify-between text-xs text-[#0b3c92]">
                    <span>Activate UAN</span>
                    <span>{t('auth.forgot')}</span>
                    <span>Know Your UAN</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {step === 'home' && (
            <section className="space-y-6 p-4 lg:p-6">
              {/* Persistent banner / nudge — this is the click that reveals DocBridge in the KYC upload screen */}
              {!nudgeDismissed ? (
                <PortalNudge
                  eyebrow="Action required · Manage → KYC"
                  title="Bank account KYC is pending document verification"
                  description="Your bank proof needs a clear PDF under 500 KB with account number and IFSC visible. Open KYC to fetch from DigiLocker and prepare it in one step — no external compressor."
                  ctaLabel="Open Manage → KYC now"
                  onAction={() => setStep('kyc')}
                  onDismiss={() => setNudgeDismissed(true)}
                  tone="amber"
                />
              ) : (
                <div className="flex items-center justify-between rounded-lg border bg-amber-50/70 px-4 py-2.5 text-sm" style={{ borderColor: '#FDE68A' }}>
                  <span className="text-amber-800">KYC nudge dismissed — you can still open it from the sidebar.</span>
                  <button type="button" onClick={() => setNudgeDismissed(false)} className="font-semibold text-amber-700 underline">
                    Show again
                  </button>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                <aside className="space-y-4">
                  <div className="rounded-lg border bg-white p-4" style={{ borderColor: COLORS.legacyBorder }}>
                    <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Manage</h2>
                    <nav className="mt-3 space-y-2 text-sm">
                      {['Profile', 'Service History', 'KYC', 'Mark Exit', 'Contact Details'].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => item === 'KYC' && setStep('kyc')}
                          className="block w-full rounded-md px-3 py-2 text-left transition-colors"
                          style={{
                            color: item === 'KYC' ? COLORS.primary : COLORS.gray[700],
                            backgroundColor: item === 'KYC' ? COLORS.primaryLight : 'transparent',
                          }}
                        >
                          {item}
                          {item === 'KYC' && <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">1 pending</span>}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="rounded-lg border bg-[#f8fafc] p-4" style={{ borderColor: COLORS.legacyBorder }}>
                    <p className="text-sm font-semibold text-[#0b1f4d]">Member Snapshot</p>
                    <dl className="mt-3 space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between gap-3">
                        <dt>UAN</dt>
                        <dd className="font-medium text-slate-800">10098765432</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Status</dt>
                        <dd className="font-medium text-slate-800">Active</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Mobile</dt>
                        <dd className="font-medium text-slate-800">98765 43210</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt>Last login</dt>
                        <dd className="font-medium text-slate-800">Today, 10:42 AM</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-lg border bg-white p-4" style={{ borderColor: COLORS.legacyBorder }}>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Establishment</p>
                    <p className="mt-2 text-sm font-semibold text-[#0b3c92]">M/S Example Pvt Ltd</p>
                    <p className="text-xs text-slate-500">Est. ID: DS/12345/789 · DOE: 01/04/2018</p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700">Active</span>
                      <span className="text-slate-500">Member since 2019</span>
                    </div>
                  </div>
                </aside>

                <div className="space-y-6">
                  {/* Welcome + quick stats — mimic real Member Home */}
                  <div className="rounded-lg border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="text-xl font-bold text-[#0b1f4d]">Welcome, Ramesh Kumar</h2>
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Member Home · UAN dashboard</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Review your service history, passbook, and KYC. Bank proof is the pending item before your employer can approve the update.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">PF Balance</p>
                        <p className="mt-1 text-lg font-bold text-[#0b1f4d]">₹ 2,84,350</p>
                        <p className="text-xs text-slate-500">As on 27 Aug 2026</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Last contribution</p>
                        <p className="mt-1 text-sm font-bold text-[#0b1f4d]">July 2026 — ₹ 3,600</p>
                        <p className="text-xs text-slate-500">Employer: M/S Example</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Service length</p>
                        <p className="mt-1 text-sm font-bold text-[#0b1f4d]">7 years, 4 months</p>
                        <p className="text-xs text-slate-500">3 establishments</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {kycItems.map(([label, status, bg, color]) => (
                      <div key={label} className="rounded-lg border bg-white p-4" style={{ borderColor: COLORS.legacyBorder }}>
                        <p className="text-sm font-semibold text-slate-800">{label}</p>
                        <span className="mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: bg, color }}>
                          {status}
                        </span>
                        {label === 'Bank Account' && <p className="mt-2 text-xs text-slate-500">Tap the banner above to fix this.</p>}
                      </div>
                    ))}
                  </div>

                  {/* Quick links — mimics real portal service tiles */}
                  <div className="rounded-lg border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
                    <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Quick services</h3>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        ['View Passbook', 'Month-wise credits'],
                        ['Transfer Claim', 'Move PF on job change'],
                        ['Track Claim Status', 'Withdrawals & advances'],
                        ['e-Nomination', 'Add/update nominee'],
                      ].map(([title, sub]) => (
                        <div key={title} className="rounded-lg border bg-[#f8fafc] p-3" style={{ borderColor: COLORS.legacyBorder }}>
                          <p className="text-sm font-semibold text-[#0b3c92]">{title}</p>
                          <p className="text-xs text-slate-500">{sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
                    <h3 className="text-lg font-bold text-[#0b1f4d]">Why the passbook proof matters</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      EPFO guidance says members can seed bank account KYC online, and bank proof such as the first page of the passbook is commonly required so the name, account number, and IFSC are visible.
                    </p>
                    <div className="mt-3 rounded-lg p-3 text-sm" style={{ backgroundColor: '#FFF1F2', color: '#BE123C' }}>
                      <strong>Real friction:</strong> a scanned passbook is often over 500 KB; the portal rejects it with “File size should be less than 500KB” and members hunt for online compressors.
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent activity — adds realism below fold */}
              <div className="rounded-lg border bg-white p-5" style={{ borderColor: COLORS.legacyBorder }}>
                <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Recent activity</h3>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      <tr>
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Service</th>
                        <th className="py-2 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-2 pr-4">27 Aug 2026</td>
                        <td className="py-2 pr-4">Bank KYC update</td>
                        <td className="py-2 pr-4"><span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">Document required</span></td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-2 pr-4">19 Aug 2026</td>
                        <td className="py-2 pr-4">e-KYC via Aadhaar</td>
                        <td className="py-2 pr-4"><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Completed</span></td>
                      </tr>
                      <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
                        <td className="py-2 pr-4">04 Jul 2026</td>
                        <td className="py-2 pr-4">Passbook viewed</td>
                        <td className="py-2 pr-4"><span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">Viewed</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {step === 'kyc' && (
            <section className="grid gap-6 p-4 lg:grid-cols-[250px_1fr] lg:p-6">
              <aside className="space-y-4">
                <div className="rounded-lg border bg-white p-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-sm font-bold text-[#0b1f4d]">Service progress</p>
                  <ol className="mt-4 space-y-3 text-sm text-slate-600">
                    {[
                      'Signed in with UAN and password',
                      'Opened Manage section',
                      'Selected KYC',
                      'Preparing bank proof for upload',
                    ].map((item, index) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: index < 3 ? COLORS.green : COLORS.saffronDark }}
                        >
                          {index < 3 ? '✓' : '4'}
                        </span>
                        <span>{item}</span>
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
                  Back to dashboard
                </button>
              </aside>

              <div className="rounded-lg border bg-white" style={{ borderColor: COLORS.legacyBorder }}>
                <div className="border-b px-6 py-4" style={{ borderColor: COLORS.legacyBorder }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Manage / KYC / Bank Account</p>
                  <h2 className="mt-2 text-xl font-bold text-[#0b1f4d]">Upload bank proof for KYC update</h2>
                  <p className="mt-1 text-sm text-slate-500">Portal rule: PDF only, maximum 500 KB, account number must be visible.</p>
                </div>

                <div className="space-y-6 p-6">

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Account Number *</label>
                    <input
                      type="text"
                      value="3847 2910 5678"
                      readOnly
                      className="w-full rounded-lg border px-4 py-3 text-sm"
                      style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.gray[50] }}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Passbook Copy *</label>
                    <div className="rounded-xl border-2 border-dashed p-8 text-center" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[500] }}>
                      <svg className="mx-auto mb-3 h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="font-medium">Standard upload expects a ready PDF</p>
                      <p className="mt-1 text-sm">PDF only, maximum 500 KB, with bank details visible</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-stone-200/60 bg-[#fffaf3] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EA580C]">DocBridge assist</p>
                    <p className="mt-2 text-sm text-slate-600">Fetch the passbook from DigiLocker, prepare it to the required format, and review before submission.</p>
                    <div className="mt-4">
                      <DocBridgeWidget
                        portalId="epfo"
                        requirements="Upload Passbook copy. Must be PDF format. Maximum size 500 KB. Account number must be visible."
                        onSuccess={() => setStep('submitted')}
                      />
                    </div>
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
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0d6b07]">Submission complete</p>
                    <h2 className="mt-2 text-3xl font-bold text-[#0b1f4d]">Bank proof reached the portal in the exact format it expects</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                      Your request has been recorded. The uploaded bank proof is available for the existing verification workflow without any additional manual file preparation.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('home')}
                    className="rounded-md px-4 py-3 text-sm font-semibold text-white"
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    Return to member dashboard
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <ResultCard label="Portal status" value="KYC pending employer approval" tone="green" />
                  <ResultCard label="Uploaded file" value="Passbook proof PDF under 500 KB" tone="saffron" />
                  <ResultCard label="Citizen experience" value="No external resize site needed" tone="blue" />
                </div>
              </div>
            </section>
          )}
        </div>
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
