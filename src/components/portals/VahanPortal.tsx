'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import DocBridgeWidget from '@/components/DocBridgeWidget';
import VoiceToggle from '@/components/ui/VoiceToggle';
import { COLORS } from '@/lib/constants';
import { useLang, LanguageToggle } from '@/lib/i18n';
import HowItWorksModal, { HowItWorksTrigger } from '@/components/ui/HowItWorksModal';

type JourneyStep = 'state' | 'menu' | 'lookup' | 'upload' | 'submitted';

const STATES = [
  'Andaman and Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Ladakh', 'Lakshadweep(UT)', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Pondicherry', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'UT of DNH and DD',
  'Uttarakhand', 'Uttar Pradesh', 'West Bengal',
];

const MENU_ITEMS = [
  { id: 'll', title: "Learner's Licence", desc: 'New LL · STALL online test · Print Form 3', icon: '◉' },
  { id: 'dl', title: 'Driving Licence', desc: 'New DL · Renewal · Duplicate · Corrections', icon: '▣' },
  { id: 'upload', title: 'Upload Document', desc: 'Scanned images · Photograph and Signature', icon: '⇪', highlight: true },
  { id: 'slot', title: 'Appointments', desc: 'Book LL / DL test slot at your RTO', icon: '◷' },
  { id: 'status', title: 'Application Status', desc: 'Track by Application No. + Date of Birth', icon: '☰' },
  { id: 'others', title: 'Others', desc: 'Find Application No. · Mobile update', icon: '⋯' },
];

export default function VahanPortal() {
  const { t } = useLang();
  const [step, setStep] = useState<JourneyStep>('state');
  const [stateName, setStateName] = useState('Delhi');
  const [fraudDismissed, setFraudDismissed] = useState(false);
  const [showHowModal, setShowHowModal] = useState(false);
  const [done, setDone] = useState({ photo: false, signature: false });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eef1f5', fontFamily: "Arial, 'Open Sans', sans-serif" }}>
      <SarathiHeader fraudDismissed={fraudDismissed} onDismissFraud={() => setFraudDismissed(true)} onShowHow={() => setShowHowModal(true)} />
      <HowItWorksModal open={showHowModal} onClose={() => setShowHowModal(false)} />

      <div className="mx-auto mt-3 max-w-6xl px-4">
        <div className="mb-2 flex items-center justify-between rounded-sm border bg-white px-4 py-2 text-[12.5px] shadow-sm" style={{ borderColor: '#c9d2dc' }}>
          <div className="text-slate-600">
            <span className="font-bold text-[#0b3c92]">Sarathi 4.0</span>
            <span className="mx-2 text-slate-300">/</span>
            <span>{step === 'state' && 'Select State'}{step === 'menu' && `${stateName} · Services`}{step === 'lookup' && `${stateName} · Upload Document`}{step === 'upload' && `${stateName} · Upload Photograph and Signature`}{step === 'submitted' && `${stateName} · Receipt`}</span>
          </div>
          <Link href="/" className="font-semibold text-[#0b3c92] hover:underline">
            {t('nav.backHome')}
          </Link>
          {step !== 'state' && <VoiceToggle />}
        </div>
      </div>

      <main id="main-content" className="mx-auto max-w-6xl px-4 pb-10">
        {step === 'state' && (
          <section className="mx-auto max-w-2xl rounded-sm border bg-white p-6 text-center shadow-sm" style={{ borderColor: '#c9d2dc' }}>
            <h1 className="text-xl font-bold text-[#1a1a1a]">Please select the State from where the service is to be taken</h1>
            <p className="mt-1 text-[12.5px] text-slate-500">Online services in this portal are available only for the States listed below</p>
            <select
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="mx-auto mt-5 block w-full max-w-md rounded-sm border px-3 py-2.5 text-[13.5px] text-slate-700"
              style={{ borderColor: '#9db6d8', backgroundColor: '#f6f9fd' }}
            >
              <option value="">---Select State Name---</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              type="button"
              disabled={!stateName}
              onClick={() => setStep('menu')}
              className="mt-4 rounded-sm px-8 py-2.5 text-[13px] font-bold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: '#1a5fb4' }}
            >
              Proceed →
            </button>
            <p className="mt-4 rounded-sm bg-amber-50 p-2.5 text-[11.5px] leading-5 text-amber-800" style={{ border: '1px solid #FDE68A' }}>
              Contactless (eKYC) services need no RTO visit. For all other services, book a slot and visit the RTO with originals after fee payment.
            </p>
          </section>
        )}

        {step === 'menu' && (
          <section>
            <div className="mb-3 rounded-sm border bg-white px-4 py-2.5 text-[12.5px] text-slate-600 shadow-sm" style={{ borderColor: '#c9d2dc' }}>
              <span className="font-bold text-[#0b3c92]">{stateName}</span> · Choose option to avail Services · Application: <span className="font-mono font-bold">DL2026-0092451</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MENU_ITEMS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => m.id === 'upload' && setStep('lookup')}
                  disabled={m.id !== 'upload'}
                  className="rounded-sm border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                  style={{ borderColor: m.highlight ? '#1a5fb4' : '#c9d2dc', borderWidth: m.highlight ? 2 : 1 }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-sm text-lg text-white" style={{ backgroundColor: m.highlight ? '#1a5fb4' : '#6b7d99' }}>{m.icon}</span>
                  <span className="mt-2 block text-[14px] font-bold" style={{ color: m.highlight ? '#0b3c92' : '#333' }}>{m.title}</span>
                  <span className="mt-0.5 block text-[12px] text-slate-500">{m.desc}</span>
                  {m.highlight
                    ? <span className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white" style={{ backgroundColor: '#1a5fb4' }}>Demo flow — continue →</span>
                    : <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">Full portal only</span>}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'lookup' && (
          <section className="mx-auto max-w-xl rounded-sm border bg-white shadow-sm" style={{ borderColor: '#c9d2dc' }}>
            <div className="border-b px-5 py-3" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#f4f7fb' }}>
              <h1 className="text-[15px] font-bold text-[#0b3c92]">Upload Photograph and Signature</h1>
              <p className="mt-0.5 text-[12px] text-slate-500">{stateName} · Enter Application No. and Date of Birth to fetch your record</p>
            </div>
            <div className="space-y-3.5 p-5">
              <LookupField label="Application No." value="DL2026-0092451" mono />
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Date of Birth</label>
                <input readOnly value="12-05-2004" className="w-full rounded-sm border px-3 py-2.5 text-[13px] text-slate-700" style={{ borderColor: COLORS.gray[300] }} />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-slate-700">{t('epfo.captcha')}</label>
                <div className="flex items-center gap-2">
                  <div className="rounded-sm border bg-[#f8fafc] px-3 py-2.5 font-mono tracking-[0.28em] text-[#0b3c92]" style={{ borderColor: COLORS.gray[300] }}>7 3 9 2</div>
                  <input readOnly value="7392" className="w-full rounded-sm border px-3 py-2.5 text-[13px]" style={{ borderColor: COLORS.gray[300] }} />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">{t('auth.demoPrefill')}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep('menu')} className="rounded-sm border px-4 py-2.5 text-[13px] font-bold text-slate-600" style={{ borderColor: COLORS.gray[300] }}>← Back</button>
                <button
                  type="button"
                  onClick={() => { setDone({ photo: false, signature: false }); setStep('upload'); }}
                  className="flex-1 rounded-sm px-4 py-2.5 text-[13px] font-bold text-white hover:brightness-110"
                  style={{ backgroundColor: '#1a5fb4' }}
                >
                  Fetch Record & Continue →
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'upload' && (
          <section className="space-y-4">
            {/* Applicant summary strip */}
            <div className="rounded-sm border bg-white px-4 py-3 text-[12.5px] shadow-sm" style={{ borderColor: '#c9d2dc' }}>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-600">
                <span><strong>Application No.:</strong> <span className="font-mono">DL2026-0092451</span></span>
                <span><strong>Name:</strong> Priya Sharma</span>
                <span><strong>State:</strong> {stateName}</span>
                <span><strong>Service:</strong> Upload Photograph and Signature</span>
              </div>
            </div>

            {/* Photo slot — Sarathi DMS spec */}
            <div className="overflow-hidden rounded-sm border bg-white shadow-sm" style={{ borderColor: '#c9d2dc' }}>
              <div className="border-b px-5 py-2.5" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#f4f7fb' }}>
                <h2 className="text-[14px] font-bold text-[#0b3c92]">1. Photograph <span className="ml-2 font-normal text-slate-500">— 35mm × 45mm (413×531px) · JPG · 10–20KB · white background · face 70–80%</span></h2>
              </div>
              <div className="p-4">
                <DocBridgeWidget
                  portalId="vahan"
                  docType="photo"
                  requirements="Upload passport photograph in JPEG only. File size 10KB - 20KB. Dimensions 35mm x 45mm. Plain white or light background. Face should cover 70-80% of the photo."
                  onSuccess={() => setDone((d) => ({ ...d, photo: true }))}
                />
              </div>
            </div>

            {/* Signature slot */}
            <div className="overflow-hidden rounded-sm border bg-white shadow-sm" style={{ borderColor: '#c9d2dc' }}>
              <div className="border-b px-5 py-2.5" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#f4f7fb' }}>
                <h2 className="text-[14px] font-bold text-[#0b3c92]">2. Signature <span className="ml-2 font-normal text-slate-500">— 30×10mm strip · JPG · 10–20KB · black/blue ink on white paper</span></h2>
              </div>
              <div className="p-4">
                <DocBridgeWidget
                  portalId="vahan"
                  docType="signature"
                  requirements="Sarathi driving licence signature upload. Signature scan, JPEG only, 10KB - 20KB, 30x10mm strip, black ink on white paper."
                  onSuccess={() => setDone((d) => ({ ...d, signature: true }))}
                />
              </div>
            </div>

            {/* Uploaded Documents — Sarathi DMS table */}
            <div className="overflow-hidden rounded-sm border bg-white shadow-sm" style={{ borderColor: '#c9d2dc' }}>
              <div className="border-b px-5 py-2.5" style={{ borderColor: COLORS.legacyBorder, backgroundColor: '#f4f7fb' }}>
                <h2 className="text-[14px] font-bold text-[#0b3c92]">Uploaded Documents</h2>
              </div>
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="text-slate-500" style={{ backgroundColor: '#f8fafc' }}>
                    <th className="px-4 py-2 font-semibold">Document</th>
                    <th className="px-4 py-2 font-semibold">Slot</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <DocRow label="Photograph (35×45mm, JPG 10–20KB)" slot="photo" ok={done.photo} />
                  <DocRow label="Signature (strip, JPG 10–20KB)" slot="signature" ok={done.signature} />
                </tbody>
              </table>
              <div className="flex flex-wrap items-center gap-2 border-t px-4 py-3" style={{ borderColor: COLORS.legacyBorder }}>
                <button type="button" onClick={() => setStep('lookup')} className="rounded-sm border px-4 py-2 text-[12.5px] font-bold text-slate-600" style={{ borderColor: COLORS.gray[300] }}>← Back</button>
                <span className="text-[12px] text-slate-500">
                  {done.photo && done.signature ? 'All Documents are Uploaded Successfully. Click on the Next button.' : 'Validate both documents above to enable Confirm.'}
                </span>
                <button
                  type="button"
                  disabled={!done.photo || !done.signature}
                  onClick={() => setStep('submitted')}
                  className="ml-auto rounded-sm px-6 py-2 text-[12.5px] font-bold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ backgroundColor: '#2e7d32' }}
                >
                  Confirm & Next →
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 'submitted' && (
          <section className="rounded-sm border bg-white p-6 shadow-sm" style={{ borderColor: '#c9d2dc' }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0d6b07]">✓ Upload complete</p>
            <h2 className="mt-1 text-2xl font-bold text-[#0b3c92]">All Documents are Uploaded Successfully</h2>
            <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-600">
              {t('vahan.doneBody')}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <ResultCard label={t('vahan.rc1l')} value={t('vahan.rc1v')} tone="blue" />
              <ResultCard label={t('vahan.rc2l')} value={t('vahan.rc2v')} tone="green" />
              <ResultCard label={t('vahan.rc3l')} value={t('vahan.rc3v')} tone="saffron" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: COLORS.legacyBorder }}>
              <span className="rounded-sm bg-[#1a5fb4] px-4 py-2 text-[12.5px] font-bold text-white opacity-80">Fee Payment →</span>
              <span className="rounded-sm border px-4 py-2 text-[12.5px] font-bold text-slate-500" style={{ borderColor: COLORS.gray[300] }}>Book DL Slot →</span>
              <span className="w-full text-[11.5px] text-slate-400">Next in the real flow: pay the fee, then book your test slot (green dates) with OTP confirmation.</span>
            </div>
          </section>
        )}
      </main>

      {/* NIC footer */}
      <footer style={{ backgroundColor: '#fff', borderTop: '2px solid #1a5fb4' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 text-[11.5px] text-slate-500">
          <span className="flex items-center gap-2">
            <span className="flex h-7 w-12 items-center justify-center rounded-sm text-[10px] font-bold text-white" style={{ backgroundColor: '#1a5fb4' }}>NIC</span>
            <span>Designed, developed and hosted by <strong>National Informatics Centre</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3.5 w-7 rounded-[2px]" style={{ background: 'linear-gradient(90deg,#FF9933 33%,#fff 33% 66%,#138808 66%)' }} />
            <strong>Digital India</strong>
          </span>
          <span className="ml-auto">Best viewed in Google Chrome 140+ · 1366×768 or higher</span>
        </div>
        <div className="border-t px-4 py-2 text-center text-[11px] text-slate-400" style={{ borderColor: COLORS.legacyBorder }}>
          This Website belongs to Ministry of Road Transport & Highways (MoRTH), Government of India · Demo recreation for hackathon
        </div>
      </footer>
    </div>
  );
}

// Sarathi 4.0 chrome: gov bar + masthead + fraud notice
function SarathiHeader({ fraudDismissed, onDismissFraud, onShowHow }: { fraudDismissed: boolean; onDismissFraud: () => void; onShowHow: () => void }) {
  const [now, setNow] = useState('');
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toUpperCase());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header>
      <div style={{ backgroundColor: '#0b3c92' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-0.5 px-4 py-1 text-[11.5px] text-white">
          <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:underline">भारत सरकार</a>
          <span className="text-white/50">|</span>
          <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="hover:underline">GOVERNMENT OF INDIA</a>
          <span className="ml-auto flex items-center gap-2.5">
            <span className="tabular-nums">DATE: {now}</span>
            <span className="text-white/50">|</span>
            <span>Language: English</span>
            <span className="text-white/50">|</span>
            <span className="font-bold">A-</span>
            <span className="font-bold">A</span>
            <span className="font-bold">A+</span>
            <span className="text-white/50">|</span>
            <LanguageToggle />
            <span className="text-white/50">|</span>
            <span className="cursor-pointer font-bold hover:underline">Login</span>
          </span>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderBottom: '3px solid #1a5fb4' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white">
            <img src="/parivahan.png" alt="Parivahan Sewa logo" className="h-full w-full object-cover" />
          </span>
          <span>
            <span className="block text-[13px] font-bold leading-tight text-[#1a1a1a]">सड़क परिवहन और राजमार्ग मंत्रालय</span>
            <span className="block text-[12px] leading-tight text-slate-600">Ministry of Road Transport & Highways</span>
          </span>
          <span className="mx-2 hidden h-9 w-px bg-slate-200 sm:block" />
          <span className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: 'linear-gradient(135deg,#1a5fb4,#0b3c92)' }}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg>
            </span>
            <span>
              <span className="block text-[16px] font-bold tracking-wide text-[#0b3c92]">PARIVAHAN SEWA</span>
              <span className="block text-[10.5px] tracking-[0.18em] text-slate-500">SARATHI 4.0 · CITIZEN SERVICES</span>
            </span>
          </span>
          <span className="ml-auto hidden items-center gap-2 rounded-sm border px-2.5 py-1.5 text-[10.5px] leading-tight text-slate-500 md:flex" style={{ borderColor: '#c9d2dc' }}>
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ backgroundColor: '#2e7d32' }}>✓</span>
            <span>Swachh Bharat<br />Mission</span>
          </span>
        </div>
      </div>

      {!fraudDismissed && (
        <div style={{ backgroundColor: '#fff8e1', borderBottom: '1px solid #FDE68A' }}>
          <div className="mx-auto flex max-w-6xl items-start gap-2 px-4 py-1.5 text-[11.5px] leading-5 text-amber-900">
            <span aria-hidden="true">🛡️</span>
            <span className="flex-1"><strong>Beware of fraudulent websites and apps.</strong> Driving Licence services are only on <strong>parivahan.gov.in</strong> and the official <strong>NexGen mParivahan</strong> app — do not use unknown links or apps.</span>
            <HowItWorksTrigger onClick={onShowHow} tone="chip" />
            <button type="button" onClick={onDismissFraud} className="font-bold underline">Dismiss</button>
          </div>
        </div>
      )}
    </header>
  );
}

function LookupField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-slate-700">{label}</label>
      <input readOnly value={value} className={`w-full rounded-sm border px-3 py-2.5 text-[13px] text-slate-700 ${mono ? 'font-mono' : ''}`} style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.white }} />
    </div>
  );
}

function DocRow({ label, slot, ok }: { label: string; slot: string; ok: boolean }) {
  return (
    <tr className="border-t" style={{ borderColor: COLORS.legacyBorder }}>
      <td className="px-4 py-2.5">{label}</td>
      <td className="px-4 py-2.5 text-slate-500">{slot}</td>
      <td className="px-4 py-2.5">
        {ok
          ? <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: '#e6f4ea', color: '#0d6b07' }}>✓ Uploaded & validated</span>
          : <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">○ Pending — validate above</span>}
      </td>
    </tr>
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
