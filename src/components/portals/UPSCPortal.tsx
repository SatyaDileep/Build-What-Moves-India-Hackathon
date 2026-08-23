'use client';

import DocBridgeWidget from '@/components/DocBridgeWidget';
import { COLORS } from '@/lib/constants';

export default function UPSCPortal() {
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
                <span className="text-white font-bold text-lg">UPSC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: COLORS.gray[800] }}>
                  Union Public Service Commission
                </h1>
                <p className="text-sm" style={{ color: COLORS.gray[500] }}>
                  Government of India • Civil Services Examination 2024
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: COLORS.gray[700] }}>
                Welcome, Priya Sharma
              </p>
              <p className="text-xs" style={{ color: COLORS.gray[500] }}>
                Registration: UPSC2024001234
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div 
        className="border-b"
        style={{ 
          backgroundColor: COLORS.white,
          borderColor: COLORS.legacyBorder
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {['Personal Details', 'Education', 'Document Upload', 'Payment', 'Submit'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    backgroundColor: index < 2 
                      ? COLORS.success 
                      : index === 2 
                        ? COLORS.primary 
                        : COLORS.gray[200],
                    color: index < 2 || index === 2 ? COLORS.white : COLORS.gray[500]
                  }}
                >
                  {index < 2 ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span 
                  className="ml-2 text-sm font-medium hidden md:inline"
                  style={{ 
                    color: index === 2 ? COLORS.primary : COLORS.gray[500]
                  }}
                >
                  {step}
                </span>
                {index < 4 && (
                  <div 
                    className="w-8 h-1 mx-2 rounded hidden md:block"
                    style={{ 
                      backgroundColor: index < 2 ? COLORS.success : COLORS.gray[200]
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Instructions */}
          <div className="lg:col-span-1">
            <div 
              className="rounded-lg border p-4 sticky top-4"
              style={{ 
                backgroundColor: COLORS.white,
                borderColor: COLORS.legacyBorder
              }}
            >
              <h3 className="font-semibold mb-4" style={{ color: COLORS.gray[800] }}>
                Photo Requirements
              </h3>
              <ul className="text-sm space-y-3" style={{ color: COLORS.gray[600] }}>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primary }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Passport size photograph only</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primary }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>JPEG format only</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primary }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Size: 20KB - 50KB</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primary }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Dimensions: 3.5cm × 4.5cm</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" style={{ color: COLORS.primary }}>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>White background required</span>
                </li>
              </ul>
              
              <div 
                className="mt-6 p-3 rounded-lg text-sm"
                style={{ 
                  backgroundColor: '#FEF3C7',
                  color: '#92400E'
                }}
              >
                <strong>Tip:</strong> Use DocBridge to auto-format your photo to meet all requirements!
              </div>
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
                  Upload Passport Photograph
                </h2>
                <p className="text-sm mt-1" style={{ color: COLORS.gray[500] }}>
                  Step 3 of 5: Document Upload
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {/* Requirement Notice */}
                <div 
                  className="p-4 rounded-lg mb-6"
                  style={{ 
                    backgroundColor: COLORS.errorLight,
                    border: `1px solid ${COLORS.error}`
                  }}
                >
                  <div className="flex items-start gap-3">
                    <svg 
                      className="w-5 h-5 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      style={{ color: COLORS.error }}
                    >
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h4 className="font-semibold" style={{ color: COLORS.error }}>
                        Strict Requirements
                      </h4>
                      <p className="text-sm mt-1" style={{ color: '#991B1B' }}>
                        Upload Passport Photo. JPEG only. Size 20KB - 50KB. Dimensions strictly 3.5cm width x 4.5cm height. White background.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="mb-6">
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.gray[700] }}
                  >
                    Passport Photograph *
                  </label>
                  
                  {/* Standard File Input */}
                  <div className="mb-4">
                    <input
                      type="file"
                      accept=".jpg,.jpeg"
                      className="hidden"
                      id="standard-upload-upsc"
                    />
                    <label
                      htmlFor="standard-upload-upsc"
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm mt-1">JPEG only, 20KB - 50KB, 3.5cm × 4.5cm</p>
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
                        OR use DocBridge (Recommended)
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <DocBridgeWidget 
                      portalId="upsc"
                      requirements="Upload Passport Photo. JPEG only. Size 20KB - 50KB. Dimensions strictly 3.5cm width x 4.5cm height. White background."
                    />
                  </div>
                </div>

                {/* Photo Guidelines */}
                <div 
                  className="p-4 rounded-lg mb-6"
                  style={{ backgroundColor: COLORS.gray[50] }}
                >
                  <h4 className="font-semibold mb-2" style={{ color: COLORS.gray[800] }}>
                    Photo Guidelines
                  </h4>
                  <ul className="text-sm space-y-1" style={{ color: COLORS.gray[600] }}>
                    <li>• Recent photograph (last 6 months)</li>
                    <li>• Clear face, front view, eyes open</li>
                    <li>• Plain white background</li>
                    <li>• No glasses, hats, or head coverings</li>
                    <li>• File name should be your registration number</li>
                  </ul>
                </div>

                {/* Form Actions */}
                <div 
                  className="flex justify-between gap-4 pt-6 border-t"
                  style={{ borderColor: COLORS.legacyBorder }}
                >
                  <button
                    className="px-6 py-2 rounded font-medium text-sm"
                    style={{ 
                      color: COLORS.gray[600],
                      border: `1px solid ${COLORS.gray[300]}`
                    }}
                  >
                    ← Previous
                  </button>
                  <div className="flex gap-4">
                    <button
                      className="px-6 py-2 rounded font-medium text-sm"
                      style={{ 
                        color: COLORS.gray[600],
                        border: `1px solid ${COLORS.gray[300]}`
                      }}
                    >
                      Save Draft
                    </button>
                    <button
                      className="px-6 py-2 rounded font-medium text-sm text-white"
                      style={{ backgroundColor: COLORS.gray[400] }}
                      disabled
                    >
                      Next → (Auto-filled by DocBridge)
                    </button>
                  </div>
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
            <p>© 2024 Union Public Service Commission. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Use</a>
              <a href="#" className="hover:underline">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
