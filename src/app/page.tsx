import Link from 'next/link';
import { COLORS } from '@/lib/constants';

export default function Home() {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: COLORS.legacyBg }}
    >
      {/* Header */}
      <header>
        {/* Tricolor Bar */}
        <div className="flex h-2">
          <div className="flex-1" style={{ backgroundColor: COLORS.saffron }} />
          <div className="flex-1" style={{ backgroundColor: COLORS.white }} />
          <div className="flex-1" style={{ backgroundColor: COLORS.green }} />
        </div>

        {/* Gov of India Top Bar */}
        <div 
          className="py-1 text-center text-xs"
          style={{ backgroundColor: '#1A1A1A', color: COLORS.white }}
        >
          <span className="opacity-90">Government of India</span>
          <span className="mx-3 opacity-50">|</span>
          <span className="opacity-90">सत्यमेव जयते</span>
        </div>

        {/* Main Header */}
        <div 
          className="py-4"
          style={{ backgroundColor: COLORS.saffron, border: "2px solid " + COLORS.saffronDark }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-4">
              {/* Ashoka Chakra */}
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white border-opacity-30"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="none" />
                  <circle cx="12" cy="12" r="3" fill="white" />
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 15) * (Math.PI / 180);
                    const x1 = 12 + 4 * Math.cos(angle);
                    const y1 = 12 + 4 * Math.sin(angle);
                    const x2 = 12 + 9.5 * Math.cos(angle);
                    const y2 = 12 + 9.5 * Math.sin(angle);
                    return (
                      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.5" />
                    );
                  })}
                </svg>
              </div>
              
              <div className="text-white">
                <div className="text-3xl font-bold tracking-wide">DocBridge</div>
                <div className="text-sm opacity-90 mt-1">Smart Document Upload Middleware</div>
                <div className="text-xs opacity-75 mt-0.5">Digital India Initiative • Ministry of Electronics & IT</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ 
              backgroundColor: COLORS.primaryLight,
              color: COLORS.primary
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            AI-Powered Document Processing
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ color: COLORS.gray[900] }}
          >
            Never Get Rejected Again
          </h1>
          
          <p 
            className="text-xl max-w-2xl mx-auto mb-8"
            style={{ color: COLORS.gray[600] }}
          >
            DocBridge automatically parses portal requirements, fetches your documents from DigiLocker, 
            and optimizes them to meet strict government upload specifications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/epfo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-white text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: COLORS.primary }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Try EPFO Portal
            </Link>
            
            <Link
              href="/upsc"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ 
                backgroundColor: COLORS.white,
                color: COLORS.primary,
                border: `2px solid ${COLORS.primary}`
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Try UPSC Portal
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: 'AI Constraint Parsing',
              description: 'Automatically reads and understands complex upload requirements from government portals.'
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              ),
              title: 'Smart Processing',
              description: 'Client-side compression, cropping, and format conversion to meet exact specifications.'
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: 'DigiLocker Integration',
              description: 'Securely fetch documents from your government-verified DigiLocker vault.'
            },
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border"
              style={{ 
                backgroundColor: COLORS.white,
                borderColor: COLORS.legacyBorder
              }}
            >
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: COLORS.primaryLight,
                  color: COLORS.primary
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray[800] }}>
                {feature.title}
              </h3>
              <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl font-bold mb-8"
            style={{ color: COLORS.gray[800] }}
          >
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Click DocBridge', description: 'Instead of the standard upload button' },
              { step: 2, title: 'Authenticate', description: 'Securely log into your DigiLocker' },
              { step: 3, title: 'Select Document', description: 'Choose from your vault' },
              { step: 4, title: 'Auto-Format', description: 'AI optimizes and submits' },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 mx-auto"
                  style={{ 
                    backgroundColor: COLORS.primary,
                    color: COLORS.white
                  }}
                >
                  {step.step}
                </div>
                <h4 className="font-semibold mb-1" style={{ color: COLORS.gray[800] }}>
                  {step.title}
                </h4>
                <p className="text-sm" style={{ color: COLORS.gray[500] }}>
                  {step.description}
                </p>
                
                {step.step < 4 && (
                  <div 
                    className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5"
                    style={{ backgroundColor: COLORS.gray[200] }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Demo Users */}
        <div 
          className="rounded-lg border p-8"
          style={{ 
            backgroundColor: COLORS.white,
            borderColor: COLORS.legacyBorder
          }}
        >
          <h2 
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: COLORS.gray[800] }}
          >
            Demo Users
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="p-6 rounded-lg border"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ 
                    backgroundColor: COLORS.primaryLight,
                    color: COLORS.primary
                  }}
                >
                  RK
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: COLORS.gray[800] }}>
                    Ramesh Kumar
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.gray[500] }}>
                    68 years old • Pensioner
                  </p>
                </div>
              </div>
              <div className="text-sm" style={{ color: COLORS.gray[600] }}>
                <p className="mb-2"><strong>Portal:</strong> EPFO - Update KYC</p>
                <p className="mb-2"><strong>Mobile:</strong> 9876543210</p>
                <p><strong>Document:</strong> Bank Passbook (4.2MB JPEG → 480KB PDF)</p>
              </div>
            </div>

            <div 
              className="p-6 rounded-lg border"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ 
                    backgroundColor: COLORS.successLight,
                    color: COLORS.success
                  }}
                >
                  PS
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: COLORS.gray[800] }}>
                    Priya Sharma
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.gray[500] }}>
                    22 years old • Applicant
                  </p>
                </div>
              </div>
              <div className="text-sm" style={{ color: COLORS.gray[600] }}>
                <p className="mb-2"><strong>Portal:</strong> UPSC - Document Upload</p>
                <p className="mb-2"><strong>Mobile:</strong> 8765432109</p>
                <p><strong>Document:</strong> Selfie (5MB JPEG → 35KB JPEG)</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="border-t mt-12"
        style={{ backgroundColor: COLORS.primary }}
      >
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white">
            <div className="flex items-center gap-3">
              <span className="opacity-75">©</span>
              <span className="opacity-90 font-bold">DocBridge</span>
              <span className="opacity-75">•</span>
              <span className="opacity-75">Built for Build What Moves India Hackathon</span>
            </div>
            <div className="text-xs opacity-60">
              सत्यमेव जयते • Truth Alone Triumphs
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
