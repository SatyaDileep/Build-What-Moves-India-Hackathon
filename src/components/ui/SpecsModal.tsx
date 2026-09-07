'use client';

type Badge = 'auto' | 'verified' | 'confirm';

const BADGE: Record<Badge, { label: string; bg: string; fg: string }> = {
  auto: { label: 'Auto-fixed', bg: '#e6f4ea', fg: '#0d6b07' },
  verified: { label: 'Verified', bg: '#e8eefc', fg: '#0b3c92' },
  confirm: { label: 'You confirm', bg: '#ffffe0', fg: '#7a5c00' },
};

interface SpecRow {
  rule: string;
  how: string;
  badge: Badge;
}

const PHOTO: SpecRow[] = [
  { rule: 'JPEG or JPG format', how: 'Converted automatically', badge: 'auto' },
  { rule: 'Exactly 630 × 810 pixels', how: 'Resized & cropped automatically', badge: 'auto' },
  { rule: 'File under 250 KB', how: 'Compressed automatically', badge: 'auto' },
  { rule: 'Face fills 80–85% of the frame', how: 'Checked before submit + framing tips', badge: 'verified' },
  { rule: 'Head centered, front-facing, no tilt', how: 'Live-photo framing guide', badge: 'confirm' },
  { rule: 'Solid plain white background, no shadows', how: 'Checked before submit', badge: 'verified' },
  { rule: 'Taken within the past 6 months', how: 'Confirm it is recent', badge: 'confirm' },
  { rule: 'Neutral expression, closed mouth; eyes on camera, ears & forehead visible', how: 'Confirm while capturing', badge: 'confirm' },
  { rule: 'No glasses; no hats (religious headwear ok if face fully visible)', how: 'Confirm while capturing', badge: 'confirm' },
  { rule: 'No filters or edits; under-3 may have mouth slightly open, no other person or props', how: 'Confirm while capturing', badge: 'confirm' },
];

const SIGNATURE: SpecRow[] = [
  { rule: 'Blue or black ink on plain white paper', how: 'Confirm the scan', badge: 'confirm' },
  { rule: 'File under 100 KB', how: 'Compressed automatically', badge: 'auto' },
  { rule: 'Centred with margin, wide crop', how: 'Trimmed automatically', badge: 'auto' },
];

function SpecSection({ title, rows }: { title: string; rows: SpecRow[] }) {
  return (
    <div>
      <h3 className="font-bold" style={{ fontSize: '14px', color: '#0a4a90' }}>{title}</h3>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => {
          const b = BADGE[r.badge];
          return (
            <li key={r.rule} className="flex items-start gap-2 rounded-md border border-slate-100 bg-slate-50/60 px-2.5 py-1.5" style={{ fontSize: '12px' }}>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-slate-800">{r.rule}</span>
                <span className="block text-slate-500">{r.how}</span>
              </span>
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ backgroundColor: b.bg, color: b.fg }}
              >
                {b.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SpecsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="File specifications"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div className="relative flex max-h-[86vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: '#0a1633' }}>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold leading-tight text-white">Passport file specifications</p>
            <p className="text-[11px] leading-tight text-white/70">Every rule below is handled — DocBridge fixes, verifies, or guides.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close specifications"
            className="rounded-md px-1.5 py-1 text-[13px] text-white/80 transition hover:bg-white/10"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
          <SpecSection title="Photograph" rows={PHOTO} />
          <SpecSection title="Signature" rows={SIGNATURE} />
        </div>
      </div>
    </div>
  );
}
