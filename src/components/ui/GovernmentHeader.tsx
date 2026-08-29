'use client';

import { COLORS, GOV_CONFIG } from '@/lib/constants';
import AshokaChakra from '@/components/ui/AshokaChakra';

interface GovernmentHeaderProps {
  portalName: string;
  portalFullName: string;
  portalInitials: string;
  welcomeText?: string;
  userIdText?: string;
}

export default function GovernmentHeader({
  portalName,
  portalFullName,
  portalInitials,
  welcomeText,
  userIdText,
}: GovernmentHeaderProps) {
  return (
    <header className="relative">
      {/* Tricolor Bar - subtle Ashoka Chakra on white band (outline, low-opacity motif — not a flag reproduction) */}
      <div className="fixed inset-x-0 top-0 z-50 h-2 overflow-hidden shadow-sm">
        <div className="flex h-full">
          <div className="flex-1" style={{ backgroundColor: COLORS.saffron }} />
          <div className="relative flex-1" style={{ backgroundColor: COLORS.white }}>
            <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <AshokaChakra size={16} stroke="#1E3A8A" opacity={0.62} />
            </span>
          </div>
          <div className="flex-1" style={{ backgroundColor: COLORS.green }} />
        </div>
        <div className="flag-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3" />
      </div>
      {/* Spacer so header content sits below the pinned flag bar */}
      <div className="h-2" />

      {/* Government of India Top Bar */}
      <div 
        className="py-1 text-center text-xs"
        style={{ backgroundColor: '#1A1A1A', color: COLORS.white }}
      >
        <span className="opacity-90">Government of India</span>
        <span className="mx-3 opacity-50">|</span>
        <span className="opacity-90" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
          {GOV_CONFIG.mottoHindi}
        </span>
      </div>

      {/* Main Header */}
      <div 
        className="py-3"
        style={{ backgroundColor: COLORS.primary }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Left: Emblem + Portal Name */}
            <div className="flex items-center gap-4">
              {/* Ashoka Chakra / Emblem */}
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-white border-opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <svg 
                  className="w-10 h-10" 
                  viewBox="0 0 24 24" 
                  fill="none"
                >
                  {/* Ashoka Chakra representation */}
                  <circle 
                    cx="12" cy="12" r="10" 
                    stroke="white" strokeWidth="1.5" 
                    fill="none"
                  />
                  <circle 
                    cx="12" cy="12" r="3" 
                    fill="white"
                  />
                  {/* 24 Spokes — toFixed to avoid hydration mismatch (server vs client float) */}
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 15 * Math.PI) / 180;
                    const x1 = (12 + 4 * Math.cos(angle)).toFixed(3);
                    const y1 = (12 + 4 * Math.sin(angle)).toFixed(3);
                    const x2 = (12 + 9.5 * Math.cos(angle)).toFixed(3);
                    const y2 = (12 + 9.5 * Math.sin(angle)).toFixed(3);
                    return (
                      <line
                        key={i}
                        x1={x1} y1={y1}
                        x2={x2} y2={y2}
                        stroke="white"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                </svg>
              </div>
              
              <div className="text-white">
                <div className="text-2xl font-bold tracking-wide">
                  {portalName}
                </div>
                <div className="text-sm opacity-90 mt-0.5">
                  {portalFullName}
                </div>
                <div className="text-xs opacity-75 mt-0.5">
                  {GOV_CONFIG.ministry}
                </div>
              </div>
            </div>

            {/* Right: User Info */}
            {welcomeText && (
              <div className="text-right text-white hidden md:block">
                <div className="text-sm font-medium opacity-90">
                  {welcomeText}
                </div>
                {userIdText && (
                  <div className="text-xs opacity-75 mt-1">
                    {userIdText}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div 
        className="py-1"
        style={{ backgroundColor: '#000066' }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-white opacity-90 hover:opacity-100 transition-opacity">
              Home
            </a>
            <a href="#" className="text-white opacity-90 hover:opacity-100 transition-opacity">
              Services
            </a>
            <a href="#" className="text-white opacity-90 hover:opacity-100 transition-opacity">
              Help
            </a>
            <a href="#" className="text-white opacity-90 hover:opacity-100 transition-opacity">
              Contact
            </a>
            <span 
              className="ml-auto text-xs opacity-75"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            >
              सत्यमेव जयते • Truth Alone Triumphs
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
