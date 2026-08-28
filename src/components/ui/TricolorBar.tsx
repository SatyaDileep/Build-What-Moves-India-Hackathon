'use client';

import AshokaChakra from '@/components/ui/AshokaChakra';
import { COLORS } from '@/lib/constants';

export default function TricolorBar({ className = 'h-1.5' }: { className?: string }) {
  return (
    <div className={`flex overflow-hidden ${className}`} aria-hidden="true">
      <div className="flex-1" style={{ backgroundColor: COLORS.saffron }} />
      <div className="relative flex-1" style={{ backgroundColor: COLORS.white }}>
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <AshokaChakra size={14} stroke="#1E3A8A" opacity={0.62} />
        </span>
      </div>
      <div className="flex-1" style={{ backgroundColor: COLORS.green }} />
    </div>
  );
}
