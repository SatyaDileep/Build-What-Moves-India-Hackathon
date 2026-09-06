'use client';

import { COLORS, GOV_CONFIG } from '@/lib/constants';
import { LanguageToggle, useLang } from '@/lib/i18n';
import TricolorBar from '@/components/ui/TricolorBar';

interface GovernmentHeaderProps {
  portalName: string;
  portalFullName: string;
  portalInitials: string;
  welcomeText?: string;
  userIdText?: string;
  variant?: 'default' | 'nsp';
}

export default function GovernmentHeader({
  portalName,
  portalFullName,
  portalInitials,
  welcomeText,
  userIdText,
  variant,
}: GovernmentHeaderProps) {
  const { t } = useLang();
  const isNSP = variant === 'nsp' || portalInitials === 'NSP' || portalName === 'NSP';
  if (isNSP) {
    return (
      <header className="relative" style={{ fontFamily: "'Roboto', sans-serif" }}>
        <div style={{ background: '#EDEDED', padding: '5px 20px' }}>
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 px-4 text-[13px]" style={{ color: '#222', fontFamily: "'Roboto', sans-serif" }}>
            <span className="border-l-0 pl-0">Government of India</span>
            <span className="border-l border-[#ccc] pl-4">Ministry of Electronics &amp; Information Technology</span>
            <span className="flex items-center gap-1 border-l border-[#ccc] pl-4 font-bold">
              <span className="inline-block h-4 w-8 rounded-[2px]" style={{ background: 'linear-gradient(90deg,#FF9933 33%,#fff 33% 66%,#138808 66%)' }} />
              Digital India
            </span>
            <span className="ml-auto flex items-center gap-2">
              <span className="font-medium">A-</span>
              <span className="font-medium">A</span>
              <span className="font-medium">A+</span>
              <LanguageToggle />
            </span>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff' }}>
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="flex h-[58px] w-[58px] shrink-0 items-center justify-center" aria-label="NSP logo">
                <img src="/nsp.png" alt="National Scholarship Portal logo" className="h-[52px] w-[52px] object-contain" />
              </span>
              <span className="hidden h-12 w-px bg-[#ccc] sm:block" />
              <span>
                <span className="block text-[22px] font-bold leading-tight" style={{ color: '#1C5C89' }}>National Scholarship Portal</span>
                <span className="block text-[13px]" style={{ color: '#717171' }}>{portalFullName}</span>
                <span className="mt-0.5 inline-block rounded-[3px] px-2 py-0.5 text-[12px] font-bold text-white" style={{ background: COLORS.nspGradient }}>Academic Year 2026-27</span>
              </span>
              <span className="ml-4 hidden items-center gap-2 border-l border-[#ccc] pl-4 lg:flex">
                <span className="inline-flex h-9 w-14 flex-col overflow-hidden rounded-[2px] border border-[#ccc]">
                  <span className="flex-1" style={{ background: '#FF9933' }} />
                  <span className="flex flex-1 items-center justify-center bg-white text-[8px] font-bold text-[#1C5C89]">DIGITAL</span>
                  <span className="flex-1" style={{ background: '#138808' }} />
                </span>
                <span className="text-[12px] font-bold leading-tight" style={{ color: '#1C5C89' }}>Digital<br />India</span>
              </span>
            </div>
            <div className="ml-auto hidden text-right md:block">
              {welcomeText ? (
                <>
                  <div className="text-[15px] font-semibold" style={{ color: '#000' }}>{welcomeText}</div>
                  {userIdText && <div className="mt-0.5 text-[13px]" style={{ color: '#717171' }}>{userIdText}</div>}
                </>
              ) : (
                <div className="flex items-center gap-4 text-[15px] font-medium" style={{ color: '#000' }}>
                  <a href="#" className="rounded-[1.25rem] px-3 py-1 hover:bg-[#f3f3f3]">FAQs</a>
                  <a href="#" className="rounded-[1.25rem] px-3 py-1 hover:bg-[#f3f3f3]">Announcements</a>
                  <a href="#" className="rounded-[1.25rem] px-3 py-1 hover:bg-[#f3f3f3]">Helpdesk</a>
                </div>
              )}
            </div>
          </div>
        </div>

        <nav style={{ background: '#3F51B5' }}>
          <div className="mx-auto flex max-w-6xl items-center px-4 text-[14px]">
            {[t('nav.home'), 'Students', 'Institutes', 'Officers', t('nav.help')].map((label, i) => (
              <a
                key={label}
                href="#"
                className="border-b-[3px] px-4 py-2.5 text-white"
                style={{ background: i === 1 ? '#3949AB' : 'transparent', borderColor: i === 1 ? '#198754' : 'transparent' }}
              >
                {label}
              </a>
            ))}
            <span className="ml-auto hidden items-center gap-2 py-2.5 text-[12px] text-white/90 lg:flex">
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: '#198754' }} />
              DBT • PFMS • Aadhaar Seeding
            </span>
          </div>
        </nav>
        <div style={{ height: '8px', background: 'linear-gradient(90deg,#F7768D 0%,#D870C7 34%,#7E75D0 57.5%,#36AAC9 100%)' }} />
      </header>
    );
  }
  return (
    <header className="relative" style={{ fontFamily: "Arial, 'Open Sans', sans-serif" }}>
      <div className="fixed inset-x-0 top-0 z-50">
        <TricolorBar />
      </div>
      <div className="h-3.5" />

      <div style={{ backgroundColor: '#F2F2F2', borderBottom: '1px solid #DEE2E6' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5 text-[12px] leading-[19px]" style={{ color: '#212529' }}>
          <a href="#main-content" className="hover:underline" style={{ color: COLORS.linkHover }}>Skip to main content</a>
          <span className="text-[#ADB5BD]">|</span>
          <a href="#" className="hover:underline" style={{ color: COLORS.linkHover }}>Screen Reader Access</a>
          <span className="text-[#ADB5BD]">|</span>
          <a href="#" className="hover:underline" style={{ color: COLORS.linkHover }}>Sitemap</a>
          <span className="ml-auto flex items-center gap-2">
            <span className="font-bold">A-</span>
            <span className="font-bold">A</span>
            <span className="font-bold">A+</span>
            <span className="text-[#ADB5BD]">|</span>
            <span style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{GOV_CONFIG.mottoHindi} • {t('gov.ofIndia')}</span>
          </span>
        </div>
      </div>

      <div style={{ backgroundColor: COLORS.white, borderBottom: '3px solid #000C80' }}>
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center" aria-label={GOV_CONFIG.emblemAlt}>
            <svg viewBox="0 0 64 64" className="h-14 w-14" role="img" aria-label="National Emblem">
              <g fill="none" stroke="#000C80" strokeWidth="1.6">
                <circle cx="32" cy="26" r="14" />
                <circle cx="32" cy="26" r="3.5" fill="#000C80" stroke="none" />
                {Array.from({ length: 24 }).map((_, i) => {
                  const a = (i * 15 * Math.PI) / 180;
                  return <line key={i} x1={32 + 5 * Math.cos(a)} y1={26 + 5 * Math.sin(a)} x2={32 + 13 * Math.cos(a)} y2={26 + 13 * Math.sin(a)} strokeWidth="0.9" />;
                })}
              </g>
              <rect x="22" y="42" width="20" height="3" fill="#000C80" />
              <text x="32" y="53" textAnchor="middle" fontSize="7" fontWeight="700" fill="#000C80" fontFamily="Arial">सत्यमेव जयते</text>
            </svg>
          </div>

          <div className="min-w-0">
            <div className="text-[26px] font-bold leading-[1.2em]" style={{ color: '#000C80' }}>
              {portalName}
            </div>
            <div className="text-[13px] leading-5" style={{ color: '#495057' }}>
              {portalFullName}
            </div>
            <div className="text-[12px]" style={{ color: '#6C757D' }}>
              {t('gov.ministry')}
            </div>
          </div>

          <div className="ml-auto hidden text-right md:block">
            {welcomeText ? (
              <>
                <div className="text-[13px] font-bold" style={{ color: '#212529' }}>{welcomeText}</div>
                {userIdText && <div className="mt-0.5 text-[12px]" style={{ color: '#495057' }}>{userIdText}</div>}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white" style={{ backgroundColor: '#000C80' }}>
                  {portalInitials.slice(0, 2)}
                </span>
                <LanguageToggle />
              </div>
            )}
            {welcomeText && (
              <div className="mt-1 flex justify-end"><LanguageToggle /></div>
            )}
          </div>
        </div>
      </div>

      <nav style={{ backgroundColor: '#000C80' }}>
        <div className="mx-auto flex max-w-6xl items-center gap-0 px-4 text-[14px]">
          {[t('nav.home'), t('nav.services'), t('nav.help'), t('nav.contact')].map((label, i) => (
            <a
              key={label}
              href="#"
              className="px-4 py-2.5 text-white transition-colors hover:underline"
              style={{ backgroundColor: i === 0 ? '#071064' : 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#071064'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = i === 0 ? '#071064' : 'transparent'; }}
            >
              {label}
            </a>
          ))}
          <span className="ml-auto hidden py-2.5 text-[12px] text-white/75 lg:block" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
            {GOV_CONFIG.mottoHindi} • Truth Alone Triumphs
          </span>
        </div>
      </nav>
    </header>
  );
}
