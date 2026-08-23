'use client';

import DocBridgeWidget from '@/components/DocBridgeWidget';
import { COLORS } from '@/lib/constants';

export default function EPFOPortal() {
  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: COLORS.legacyBg }}
    >
      {/* Legacy Header */}
      <header 
        className="border-b"
        style={{ 
          backgroundColor: COLORS.white,
          borderColor: COLORS.legacyBorder
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: COLORS.primary }}
              >
                <span className="text-white font-bold text-lg">EPFO</span>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: COLORS.gray[800] }}>
                  Employees' Provident Fund Organisation
                </h1>
                <p className="text-sm" style={{ color: COLORS.gray[500] }}>
                  Government of India • Ministry of Labour & Employment
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: COLORS.gray[700] }}>
                Welcome, Ramesh Kumar
              </p>
              <p className="text-xs" style={{ color: COLORS.gray[500] }}>
                UAN: 10098765432
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-lg border p-4"
              style={{ 
                backgroundColor: COLORS.white,
                borderColor: COLORS.legacyBorder
              }}
            >
              <h3 className="font-semibold mb-4" style={{ color: COLORS.gray[800] }}>
                Quick Links
              </h3>
              <nav className="space-y-2">
                {[
                  'View Passbook',
                  'Update KYC',
                  'Claim Status',
                  'Transfer Request',
                  'Help & Support'
                ].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block px-3 py-2 rounded text-sm hover:bg-opacity-50 transition-colors"
                    style={{ 
                      color: item === 'Update KYC' ? COLORS.primary : COLORS.gray[600],
                      backgroundColor: item === 'Update KYC' ? COLORS.primaryLight : 'transparent'
                    }}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div 
              className="rounded-lg border"
              style={{ 
                backgroundColor: COLORS.white,
                borderColor: COLORS.legacyBorder
              }}
            >
              {/* Form Header */}
              <div 
                className="px-6 py-4 border-b"
                style={{ borderColor: COLORS.legacyBorder }}
              >
                <h2 className="text-lg font-bold" style={{ color: COLORS.gray[800] }}>
                  Update KYC Documents
                </h2>
                <p className="text-sm mt-1" style={{ color: COLORS.gray[500] }}>
                  Please upload the required documents to update your KYC information
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {/* Requirement Notice */}
                <div 
                  className="p-4 rounded-lg mb-6"
                  style={{ 
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #F59E0B'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <svg 
                      className="w-5 h-5 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      style={{ color: '#D97706' }}
                    >
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold" style={{ color: '#92400E' }}>
                        Upload Requirements
                      </h4>
                      <p className="text-sm mt-1" style={{ color: '#78350F' }}>
                        Upload Passbook copy. Must be PDF format. Maximum size 500 KB. Account number must be visible.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Number Field */}
                <div className="mb-6">
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.gray[700] }}
                  >
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value="3847 2910 5678"
                    readOnly
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                    style={{ 
                      borderColor: COLORS.gray[300],
                      backgroundColor: COLORS.gray[50]
                    }}
                  />
                </div>

                {/* Document Upload Section */}
                <div className="mb-6">
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.gray[700] }}
                  >
                    Passbook Copy (PDF, max 500KB) *
                  </label>
                  
                  {/* Standard File Input (hidden but functional) */}
                  <div className="mb-4">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="standard-upload"
                    />
                    <label
                      htmlFor="standard-upload"
                      className="block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors"
                      style={{ 
                        borderColor: COLORS.gray[300],
                        color: COLORS.gray[500]
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = COLORS.gray[400];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = COLORS.gray[300];
                      }}
                    >
                      <svg 
                        className="w-12 h-12 mx-auto mb-3" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm mt-1">PDF files only, max 500KB</p>
                    </label>
                  </div>

                  {/* DocBridge Integration */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t" style={{ borderColor: COLORS.gray[200] }} />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span 
                        className="px-4 py-1 rounded-full text-sm font-medium"
                        style={{ 
                          backgroundColor: COLORS.white,
                          color: COLORS.gray[500]
                        }}
                      >
                        OR use DocBridge
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <DocBridgeWidget 
                      portalId="epfo"
                      requirements="Upload Passbook copy. Must be PDF format. Maximum size 500 KB. Account number must be visible."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div 
                  className="flex justify-end gap-4 pt-6 border-t"
                  style={{ borderColor: COLORS.legacyBorder }}
                >
                  <button
                    className="px-6 py-2 rounded font-medium text-sm"
                    style={{ 
                      color: COLORS.gray[600],
                      border: `1px solid ${COLORS.gray[300]}`
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 rounded font-medium text-sm text-white"
                    style={{ backgroundColor: COLORS.gray[400] }}
                    disabled
                  >
                    Submit (Auto-filled by DocBridge)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="border-t mt-8"
        style={{ 
          backgroundColor: COLORS.white,
          borderColor: COLORS.legacyBorder
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: COLORS.gray[500] }}>
            <p>© 2024 Employees' Provident Fund Organisation. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Use</a>
              <a href="#" className="hover:underline">Help</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
