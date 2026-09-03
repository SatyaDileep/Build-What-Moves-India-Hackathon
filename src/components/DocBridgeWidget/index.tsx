'use client';

import { useRef, useState } from 'react';
import { WidgetState, DocumentConstraint, DigiLockerAsset } from '@/types';
import { COLORS, PORTALS, WIDGET_STATES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { parsePortalConstraints } from '@/lib/openai';
import { processDocument } from '@/lib/processor';
import DigiLockerModal from './DigiLockerModal';
import ProcessingOverlay from './ProcessingOverlay';
import PreviewPanel from './PreviewPanel';
import PrivacyBadge from '@/components/ui/PrivacyBadge';

interface DocBridgeWidgetProps {
  portalId: 'epfo' | 'upsc' | 'vahan';
  requirements: string;
  onSuccess?: (result: any) => void;
}

export default function DocBridgeWidget({ 
  portalId, 
  requirements, 
  onSuccess 
}: DocBridgeWidgetProps) {
  const [state, setState] = useState<WidgetState>('idle');
  const [showModal, setShowModal] = useState(false);
  const [showSaveAuthModal, setShowSaveAuthModal] = useState(false);
  const [isSaveAuthed, setIsSaveAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<DigiLockerAsset | null>(null);
  const [source, setSource] = useState<'digilocker' | 'device'>('digilocker');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startDigiLocker = () => {
    setError(null);
    setShowModal(true);
    setState('authenticating');
  };

  const startManualUpload = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const [lastBlob, setLastBlob] = useState<Blob | null>(null);
  const [lastMeta, setLastMeta] = useState<{ name: string; type: string; size_mb: number } | null>(null);
  const [isRecompressing, setIsRecompressing] = useState(false);

  const runProcessing = async (blob: Blob, meta: { name: string; type: string; size_mb: number }, opts?: { aggressive?: boolean; rotation?: number; enhance?: boolean }) => {
    const conn = (navigator as any)?.connection?.effectiveType;
    if ((conn === '2g' || conn === 'slow-2g') && !opts?.aggressive && !opts?.rotation && !opts?.enhance) opts = { ...opts, aggressive: true };
    try {
      setLastBlob(blob);
      setLastMeta(meta);
      const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

      setState('parsing');
      await wait(1600);
      const constraint = await parsePortalConstraints(requirements);
      setState('processing');
      await wait(400);
      const result = await processDocument(blob, constraint, meta, opts);
      await wait(1400);

      setProcessingResult(result);
      setState('previewing');
      return result;
    } catch (err: any) {
      setError(err?.message || 'Failed to process document. Please try again.');
      setState('idle');
      return null;
    }
  };

  const handleRecompress = async () => {
    if (!lastBlob || !lastMeta) return;
    setIsRecompressing(true);
    setError(null);
    await runProcessing(lastBlob, lastMeta, { aggressive: true });
    setIsRecompressing(false);
  };
  const handleAdjust = async (rotation: number) => {
    if (!lastBlob || !lastMeta) return;
    setError(null);
    await runProcessing(lastBlob, lastMeta, { rotation });
  };
  const handleEnhance = async () => {
    if (!lastBlob || !lastMeta) return;
    setError(null);
    await runProcessing(lastBlob, lastMeta, { enhance: true });
  };

  const handleAssetSelected = async (asset: DigiLockerAsset) => {
    setSelectedAsset(asset);
    setSource('digilocker');
    setShowModal(false);

    const fileBlob = await supabase.fetchAsset(asset.id);
    await runProcessing(fileBlob, {
      name: asset.name,
      type: asset.type,
      size_mb: asset.size_mb,
    });
  };

  const handleManualFile = async (input: File | FileList | null) => {
    if (!input) return;
    const isList = typeof (input as FileList).length === 'number' && ((input as FileList).length as number) > 0;
    const files: File[] = isList ? Array.from(input as FileList) : [input as unknown as File];
    const batch = files.filter(Boolean).slice(0, 3);
    if (batch.length > 1) {
      setSelectedAsset({ id: 'manual-batch', name: `${batch.length} files`, type: batch[0].type, size_mb: batch.reduce((s,f)=>s+f.size,0)/(1024*1024), url: '', owner: 'ramesh' });
      setSource('device');
      for (const f of batch) { await runProcessing(f, { name: f.name, type: f.type, size_mb: f.size/(1024*1024) }); await new Promise(r=>setTimeout(r,300)); }
      return;
    }
    const file = batch[0] as File;
    setSelectedAsset({ id: 'manual', name: file.name, type: file.type, size_mb: file.size / (1024 * 1024), url: '', owner: 'ramesh' });
    setSource('device');
    await runProcessing(file, { name: file.name, type: file.type, size_mb: file.size / (1024 * 1024) });
  };

  const handleSubmit = async (saveToDigiLocker: boolean = true) => {
    if (!processingResult) return;
    setState('submitting');
    try {
      let blobToSend: Blob = processingResult.processed.blob;
      try {
        const { embedDocBridgeMetadata } = await import('@/lib/processor');
        const hash = await crypto.subtle.digest('SHA-256', await processingResult.original.blob.slice(0, 65536).arrayBuffer()).then(b => Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('').slice(0,16)).catch(()=>undefined);
        blobToSend = await embedDocBridgeMetadata(blobToSend, { portalId, source, hash });
      } catch {}
      if (saveToDigiLocker) {
        const ext = processingResult.constraint.format;
        const storedName = `${processingResult.original.assetName || 'Document'} (${portalId.toUpperCase()}-ready).${ext}`;
        await supabase.storeAsset(storedName, `image/${ext}`, processingResult.processed.size_kb / 1024);
      }
      const formData = new FormData();
      const extension = processingResult.constraint.format === 'pdf' ? 'pdf' : 'jpg';
      formData.append('file', blobToSend, `docbridge-ready.${extension}`);

      // EPFO's legacy endpoint expects the account number as a separate form value.
      if (portalId === 'epfo') {
        formData.append('account_number', '3847 2910 5678');
      }
      
      const endpoint = portalId === 'epfo' 
        ? '/api/legacy-epfo' 
        : portalId === 'vahan'
          ? '/api/legacy-vahan'
          : '/api/legacy-upsc';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setState('success');
        onSuccess?.(data);
      } else {
        setError(data.error || 'Submission failed');
        setState('previewing');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setState('previewing');
    }
  };

  const handleReset = () => {
    setState('idle');
    setError(null);
    setProcessingResult(null);
    setSelectedAsset(null);
    setIsSaveAuthed(false);
    setShowSaveAuthModal(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="relative">
      {/* Source chooser */}
      {state === 'idle' && (
        <div className="space-y-3">
          <div className="rounded-xl border p-4" style={{ borderColor: COLORS.gray[300], backgroundColor: COLORS.primaryLight }}>
            <p className="text-sm font-semibold mb-1" style={{ color: COLORS.primary }}>Where is your document?</p>
            <p className="text-xs mb-4" style={{ color: COLORS.gray[600] }}>
              DocBridge works with either a trusted source or a file you already have.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <SourceOption
                title="From DigiLocker"
                description="Authorised, consent-based access to your issued documents."
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                onClick={startDigiLocker}
              />
              <SourceOption
                title="Upload from device"
                description="Pick a photo or PDF you already have on your phone or computer."
                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>}
                onClick={startManualUpload}
              />
            </div>
          </div>
          <PrivacyBadge />
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*,.pdf" multiple className="hidden" onChange={(e) => handleManualFile(e.target.files?.[0] ? (e.target.files as any) : null)} />

      {/* Error Message */}
      {error && (
        <div 
          className="mt-4 p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: COLORS.errorLight, color: COLORS.error }}
          role="alert"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
          <button 
            onClick={handleReset}
            className="ml-auto underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading States */}
      {['authenticating', 'parsing', 'processing', 'submitting'].includes(state) && (
        <ProcessingOverlay state={state} source={source} portalId={portalId} />
      )}

      {/* Preview Panel */}
      {state === 'previewing' && processingResult && (
        <PreviewPanel
          result={processingResult}
          portalId={portalId}
          source={source}
          isSaveAuthed={isSaveAuthed}
          onRequestSaveAuth={() => setShowSaveAuthModal(true)}
          onRecompress={handleRecompress}
          isRecompressing={isRecompressing}
          onAdjust={handleAdjust}
          onEnhance={handleEnhance}
          onSubmit={handleSubmit}
          onCancel={handleReset}
        />
      )}

      {/* Success State */}
      {state === 'success' && (
        <div 
          className="p-6 rounded-lg text-center"
          style={{ backgroundColor: COLORS.successLight }}
        >
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: COLORS.success }}
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.success }}>
            Success!
          </h3>
          <p className="text-gray-600 mb-4">
            Your document has been successfully processed and submitted.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
            style={{ backgroundColor: COLORS.primary }}
          >
            Process Another Document
          </button>
        </div>
      )}

      {/* DigiLocker Modal — fetch flow */}
      {showModal && (
        <DigiLockerModal
          portalId={portalId}
          signInName={PORTALS.find(p => p.id === portalId)?.persona?.name || 'the citizen'}
          onClose={() => {
            setShowModal(false);
            setState('idle');
          }}
          onAssetSelected={handleAssetSelected}
        />
      )}

      {/* DigiLocker Modal — save-auth flow for device uploads */}
      {showSaveAuthModal && (
        <DigiLockerModal
          portalId={portalId}
          signInName={PORTALS.find(p => p.id === portalId)?.persona?.name || 'the citizen'}
          onClose={() => setShowSaveAuthModal(false)}
          onAssetSelected={() => {}}
          onAuthenticated={() => {
            setIsSaveAuthed(true);
            setShowSaveAuthModal(false);
          }}
        />
      )}
    </div>
  );
}

function SourceOption({ title, description, icon, onClick }: { title: string; description: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-xl border bg-white/80 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_30px_rgba(30,58,138,0.12)]"
      style={{ borderColor: COLORS.gray[300] }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.primary; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.gray[300]; }}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: COLORS.primaryLight, color: COLORS.primary }}>
        {icon}
      </span>
      <span className="text-sm font-bold" style={{ color: COLORS.gray[800] }}>{title}</span>
      <span className="text-xs leading-5" style={{ color: COLORS.gray[600] }}>{description}</span>
    </button>
  );
}
