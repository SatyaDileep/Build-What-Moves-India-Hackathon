'use client';

import { useState } from 'react';
import { DigiLockerAsset } from '@/types';
import { COLORS, USER_PROFILES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/lib/i18n';

interface DigiLockerModalProps {
  portalId: 'epfo' | 'upsc' | 'vahan' | 'passport' | 'ssc' | 'nsp';
  signInName: string;
  onClose: () => void;
  onAssetSelected: (asset: DigiLockerAsset) => void;
  onAssetsSelected?: (assets: DigiLockerAsset[]) => void;
  onAuthenticated?: () => void;
}

export default function DigiLockerModal({ 
  portalId, 
  signInName,
  onClose, 
  onAssetSelected,
  onAssetsSelected,
  onAuthenticated,
}: DigiLockerModalProps) {
  const { t } = useLang();
  const [step, setStep] = useState<'aadhaar' | 'otp' | 'select'>('aadhaar');
  const [aadhaarId, setAadhaarId] = useState('9876543210');
  const [otp, setOtp] = useState('582914');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<DigiLockerAsset[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isMulti = !!onAssetsSelected;

  const maxBatch = 3;

  const handleAadhaarSubmit = async () => {
    if (!aadhaarId || aadhaarId.length !== 10) {
      setError(t('dl.aadhaarErr'));
      return;
    }

    setLoading(true);
    setError('');

    // Sign in as the citizen matched to this portal journey.
    await supabase.signInAs(signInName);

    if (aadhaarId.length === 10) {
      setStep('otp');
    } else {
      setError(t('dl.aadhaarErr'));
    }
    
    setLoading(false);
  };

  const handleOTPSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setError(t('dl.otpErr'));
      return;
    }

    setLoading(true);
    setError('');

    const result = await supabase.verifyOTP(otp);
    
    if (result.success) {
      if (onAuthenticated) {
        onAuthenticated();
        return;
      }
      const userAssets = supabase.getVaultWithSaved();
      setAssets(userAssets);
      setStep('select');
    } else {
      setError(result.error || t('dl.otpErr'));
    }
    
    setLoading(false);
  };

  const handleAssetSelect = (asset: DigiLockerAsset) => {
    if (isMulti) {
      setSelectedIds((prev) =>
        prev.includes(asset.id) ? prev.filter((id) => id !== asset.id) : [...prev, asset.id].slice(0, maxBatch)
      );
      return;
    }
    onAssetSelected(asset);
  };

  // Filter assets based on portal (case-insensitive)
  const lower = (s: string) => s.toLowerCase();
  const filteredAssets = portalId === 'epfo'
    ? assets.filter(a => lower(a.name).includes('passbook') || lower(a.name).includes('pan'))
    : portalId === 'vahan'
      ? assets.filter(a => lower(a.name).includes('photo') || lower(a.name).includes('selfie'))
      : portalId === 'passport'
        ? assets.filter(a => lower(a.name).includes('photo') || lower(a.name).includes('signature') || lower(a.name).includes('selfie'))
        : portalId === 'ssc'
          ? assets.filter(a => lower(a.name).includes('photo') || lower(a.name).includes('selfie') || lower(a.name).includes('signature'))
          : portalId === 'nsp'
            ? assets.filter(a => lower(a.name).includes('photo') || lower(a.name).includes('cert') || lower(a.name).includes('scan'))
            : assets.filter(a => lower(a.name).includes('photo') || lower(a.name).includes('selfie') || lower(a.name).includes('signature'));

  // Reuse-first vault: DocBridge-optimized copies grouped above the
  // citizen's original issued documents.
  const optimizedAssets = filteredAssets.filter(a => a.source === 'optimized');
  const issuedAssets = filteredAssets.filter(a => a.source !== 'optimized');

  const renderAssetRow = (asset: DigiLockerAsset) => {
    const checked = selectedIds.includes(asset.id);
    const isOptimized = asset.source === 'optimized';
    const sizeLabel = asset.size_mb < 0.1 ? `${Math.round(asset.size_mb * 1024)} KB` : `${asset.size_mb.toFixed(1)} MB`;
    return (
      <button
        key={asset.id}
        onClick={() => handleAssetSelect(asset)}
        className="w-full p-4 border rounded-lg text-left transition-transform hover:-translate-y-0.5"
        style={{
          borderColor: checked ? COLORS.primary : isOptimized ? '#BBF7D0' : COLORS.gray[200],
          backgroundColor: checked ? COLORS.primaryLight : isOptimized ? '#F0FDF4' : undefined,
          borderWidth: checked ? 2 : 1,
        }}
      >
        {isOptimized && (
          <span
            className="mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ backgroundColor: '#DCFCE7', color: '#166534' }}
          >
            ✦ {t('dl.reusable').replace('{portals}', asset.optimizedFor || 'this portal')}
          </span>
        )}
        <span className="flex items-center gap-4">
          {isMulti && (
            <span
              className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border text-xs font-bold"
              style={{
                borderColor: checked ? COLORS.primary : COLORS.gray[300],
                backgroundColor: checked ? COLORS.primary : 'transparent',
                color: checked ? '#fff' : 'transparent',
              }}
            >
              ✓
            </span>
          )}
          <span
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: isOptimized ? '#DCFCE7' : COLORS.primaryLight, color: isOptimized ? '#166534' : COLORS.primary }}
          >
            {isOptimized ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold" style={{ color: COLORS.gray[800] }}>
              {asset.name}
            </span>
            <span className="block text-sm" style={{ color: isOptimized ? '#166534' : COLORS.gray[500] }}>
              {sizeLabel} • {asset.type.split('/')[1].toUpperCase()}
              {isOptimized && asset.tags && asset.tags.length > 0 && (
                <span className="ml-1.5 inline-flex flex-wrap gap-1 align-middle">
                  {asset.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold" style={{ border: '1px solid #BBF7D0', color: '#166534' }}>#{tag}</span>
                  ))}
                </span>
              )}
            </span>
            {isOptimized && !isMulti && (
              <span className="mt-0.5 block text-xs" style={{ color: '#047857' }}>↻ {t('dl.reuseSub')}</span>
            )}
          </span>
          {!isMulti && (
            <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: COLORS.gray[400] }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </span>
      </button>
    );
  };

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
        <div className="flex h-1.5" aria-hidden="true">
          <div className="flex-1" style={{ backgroundColor: COLORS.saffron }} />
          <div className="flex-1" style={{ backgroundColor: COLORS.white }} />
          <div className="flex-1" style={{ backgroundColor: COLORS.green }} />
        </div>
        {/* Header */}
        <div 
          className="p-6 text-white"
          style={{ backgroundColor: COLORS.primary }}
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
                <p className="text-sm opacity-90">{t('dl.consent')}</p>
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
          {/* Aadhaar Step */}
          {step === 'aadhaar' && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.gray[800] }}>
                  {t('dl.aadhaarTitle')}
                </h3>
                <span className="group relative inline-flex">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[500] }} aria-hidden="true">i</span>
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-56 -translate-x-1/2 rounded-lg border bg-white px-3 py-2 text-xs leading-5 shadow-lg group-hover:block" style={{ borderColor: COLORS.gray[200], color: COLORS.gray[600] }}>
                    {t('dl.aadhaarTip')}
                  </span>
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: COLORS.gray[500] }}>
                {t('dl.aadhaarSub')}
              </p>
              
              <div className="mb-4">
                <input
                  type="tel"
                  value={aadhaarId}
                  onChange={(e) => setAadhaarId(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-lg"
                  style={{ 
                    borderColor: COLORS.gray[300],
                  }}
                  aria-label="Aadhaar-linked number"
                />
              </div>

              {error && (
                <p className="text-sm mb-4" style={{ color: COLORS.error }}>
                  {error}
                </p>
              )}

              <button
                onClick={handleAadhaarSubmit}
                disabled={loading || aadhaarId.length !== 10}
                className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLORS.primary }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('dl.sendingOtp')}
                  </span>
                ) : (
                  t('dl.sendOtp')
                )}
              </button>

              <p className="text-xs mt-3 text-center" style={{ color: COLORS.gray[400] }}>
                {t('dl.demoNum')}
              </p>
            </div>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <div>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-lg font-semibold" style={{ color: COLORS.gray[800] }}>
                  {t('dl.otpTitle')}
                </h3>
                <span className="group relative inline-flex">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border text-xs font-bold" style={{ borderColor: COLORS.gray[300], color: COLORS.gray[500] }} aria-hidden="true">i</span>
                  <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-56 -translate-x-1/2 rounded-lg border bg-white px-3 py-2 text-xs leading-5 shadow-lg group-hover:block" style={{ borderColor: COLORS.gray[200], color: COLORS.gray[600] }}>
                    {t('dl.otpTip')}
                  </span>
                </span>
              </div>
              <p className="text-sm mb-4" style={{ color: COLORS.gray[500] }}>
                {t('dl.otpSent')} {aadhaarId}
              </p>
              
              <div className="mb-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="582914"
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
                    {t('dl.verifying')}
                  </span>
                ) : (
                  t('dl.verifyOtp')
                )}
              </button>

              <p className="text-xs mt-3 text-center" style={{ color: COLORS.gray[400] }}>
                {t('dl.demoCode')}
              </p>
            </div>
          )}

          {/* Asset Selection Step */}
          {step === 'select' && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.gray[800] }}>
                  {isMulti ? t('dl.selectMany') : t('dl.select')}
                </h3>
                {isMulti && (
                  <button
                    type="button"
                    onClick={() => setSelectedIds([])}
                    className="text-xs font-semibold underline"
                    style={{ color: COLORS.gray[500] }}
                  >
                    {t('w.removeDoc')}
                  </button>
                )}
              </div>
              <p className="text-sm mb-4" style={{ color: COLORS.gray[500] }}>
                {signInName}&apos;s DigiLocker
              </p>

              {optimizedAssets.length + issuedAssets.length === 0 ? (
                <p className="text-center py-8" style={{ color: COLORS.gray[500] }}>
                  {t('dl.noDocs')}
                </p>
              ) : (
                <div className="space-y-4">
                  {/* Batch selection is capped at 3 docs */}
                  {isMulti && selectedIds.length >= maxBatch && (
                    <p className="text-xs" style={{ color: COLORS.warning }}>Max {maxBatch} documents per batch</p>
                  )}
                  {optimizedAssets.length > 0 && (
                    <div>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: '#047857' }}>✦ {t('dl.savedDocs')}</p>
                      <div className="space-y-2.5">{optimizedAssets.map(renderAssetRow)}</div>
                    </div>
                  )}
                  {issuedAssets.length > 0 && (
                    <div>
                      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: COLORS.gray[500] }}>{t('dl.issuedDocs')}</p>
                      <div className="space-y-2.5">{issuedAssets.map(renderAssetRow)}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {isMulti && step === 'select' && (
          <div className="border-t px-6 py-3.5" style={{ borderColor: COLORS.gray[200] }}>
            <button
              type="button"
              disabled={selectedIds.length === 0}
              onClick={() => {
                const chosen = selectedIds
                  .map((id) => assets.find((a) => a.id === id))
                  .filter((a): a is DigiLockerAsset => !!a);
                onAssetsSelected?.(chosen);
              }}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: COLORS.primary }}
            >
              {t('dl.useSelected').replace('N', String(selectedIds.length))}
            </button>
          </div>
        )}

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
            <span>{t('dl.consent')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
