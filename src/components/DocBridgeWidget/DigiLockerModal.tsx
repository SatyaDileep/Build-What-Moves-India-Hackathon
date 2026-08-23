'use client';

import { useState } from 'react';
import { DigiLockerAsset } from '@/types';
import { COLORS, USER_PROFILES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';

interface DigiLockerModalProps {
  portalId: 'epfo' | 'upsc';
  onClose: () => void;
  onAssetSelected: (asset: DigiLockerAsset) => void;
}

export default function DigiLockerModal({ 
  portalId, 
  onClose, 
  onAssetSelected 
}: DigiLockerModalProps) {
  const [step, setStep] = useState<'mobile' | 'otp' | 'select'>('mobile');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<DigiLockerAsset[]>([]);

  const handleMobileSubmit = async () => {
    if (!mobile || mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    const result = await supabase.signInWithMobile(mobile);
    
    if (result.success) {
      setStep('otp');
    } else {
      setError(result.error || 'Authentication failed');
    }
    
    setLoading(false);
  };

  const handleOTPSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    const result = await supabase.verifyOTP(otp);
    
    if (result.success) {
      const userAssets = supabase.getAssets();
      setAssets(userAssets);
      setStep('select');
    } else {
      setError(result.error || 'OTP verification failed');
    }
    
    setLoading(false);
  };

  const handleAssetSelect = (asset: DigiLockerAsset) => {
    onAssetSelected(asset);
  };

  // Filter assets based on portal
  const filteredAssets = portalId === 'epfo' 
    ? assets.filter(a => a.name.includes('passbook') || a.name.includes('pan'))
    : assets.filter(a => a.name.includes('selfie') || a.name.includes('signature'));

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="DigiLocker Authentication"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: COLORS.saffron }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">DigiLocker</h2>
                <p className="text-sm opacity-90">Secure Document Access</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Mobile Step */}
          {step === 'mobile' && (
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray[800] }}>
                Enter your mobile number
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.gray[500] }}>
                We'll send a one-time password to verify your identity
              </p>
              
              <div className="mb-4">
                <div className="flex">
                  <span 
                    className="px-4 py-3 rounded-l-lg border border-r-0 text-sm font-medium"
                    style={{ 
                      backgroundColor: COLORS.gray[100],
                      borderColor: COLORS.gray[300],
                      color: COLORS.gray[700]
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 px-4 py-3 border rounded-r-lg focus:outline-none focus:ring-2 focus:border-transparent text-lg"
                    style={{ 
                      borderColor: COLORS.gray[300],
                    }}
                    aria-label="Mobile number"
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm mb-4" style={{ color: COLORS.error }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleMobileSubmit}
                disabled={loading || mobile.length !== 10}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.primary }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>

              <p className="text-xs mt-4 text-center" style={{ color: COLORS.gray[400] }}>
                Demo: Use 9876543210 (Ramesh) or 8765432109 (Priya)
              </p>
            </div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray[800] }}>
                Enter OTP
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.gray[500] }}>
                We've sent a 6-digit code to {mobile}
              </p>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{ 
                    borderColor: COLORS.gray[300],
                  }}
                  aria-label="One-time password"
                />
              </div>

              {error && (
                <p className="text-sm mb-4" style={{ color: COLORS.error }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleOTPSubmit}
                disabled={loading || otp.length !== 6}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.primary }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <p className="text-xs mt-4 text-center" style={{ color: COLORS.gray[400] }}>
                Demo: Enter any 6-digit code (e.g., 123456)
              </p>
            </div>
          )}

          {/* Asset Selection Step */}
          {step === 'select' && (
            <div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray[800] }}>
                Select Document
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.gray[500] }}>
                Choose the document from your DigiLocker vault
              </p>

              {filteredAssets.length === 0 ? (
                <p className="text-center py-8" style={{ color: COLORS.gray[500] }}>
                  No matching documents found for this portal.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredAssets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => handleAssetSelect(asset)}
                      className="w-full p-4 border rounded-lg text-left hover:border-opacity-50 transition-colors flex items-center gap-4"
                      style={{ 
                        borderColor: COLORS.gray[200],
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = COLORS.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = COLORS.gray[200];
                      }}
                    >
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: COLORS.primaryLight }}
                      >
                        <svg 
                          className="w-6 h-6" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          style={{ color: COLORS.primary }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ color: COLORS.gray[800] }}>
                          {asset.name}
                        </p>
                        <p className="text-sm" style={{ color: COLORS.gray[500] }}>
                          {asset.size_mb.toFixed(1)} MB • {asset.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                      <svg 
                        className="w-5 h-5 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{ color: COLORS.gray[400] }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="px-6 py-4 border-t"
          style={{ 
            backgroundColor: COLORS.gray[50],
            borderColor: COLORS.gray[200]
          }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.gray[500] }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secured by DigiLocker • Government of India</span>
          </div>
        </div>
      </div>
    </div>
  );
}
