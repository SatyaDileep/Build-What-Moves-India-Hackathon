'use client';

import { useState } from 'react';
import { WidgetState, DocumentConstraint, DigiLockerAsset } from '@/types';
import { COLORS, WIDGET_STATES } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { parsePortalConstraints } from '@/lib/openai';
import { processDocument } from '@/lib/processor';
import DigiLockerModal from './DigiLockerModal';
import ProcessingOverlay from './ProcessingOverlay';
import PreviewPanel from './PreviewPanel';

interface DocBridgeWidgetProps {
  portalId: 'epfo' | 'upsc';
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
  const [error, setError] = useState<string | null>(null);
  const [processingResult, setProcessingResult] = useState<any>(null);
  const [selectedAsset, setSelectedAsset] = useState<DigiLockerAsset | null>(null);

  const handleStart = () => {
    setError(null);
    setShowModal(true);
    setState('authenticating');
  };

  const handleAssetSelected = async (asset: DigiLockerAsset) => {
    setSelectedAsset(asset);
    setShowModal(false);
    
    try {
      // Step 1: Parse portal requirements
      setState('parsing');
      const constraint = await parsePortalConstraints(requirements);
      
      // Step 2: Fetch and process document
      setState('processing');
      const fileBlob = await supabase.fetchAsset(asset.id);
      const result = await processDocument(fileBlob, constraint);
      
      setProcessingResult(result);
      setState('previewing');
      
    } catch (err) {
      setError('Failed to process document. Please try again.');
      setState('idle');
    }
  };

  const handleSubmit = async () => {
    if (!processingResult) return;
    
    setState('submitting');
    
    try {
      const formData = new FormData();
      formData.append('file', processingResult.processed.blob);
      
      const endpoint = portalId === 'epfo' 
        ? '/api/legacy-epfo' 
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
  };

  return (
    <div className="relative">
      {/* Main Button */}
      {state === 'idle' && (
        <button
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: COLORS.saffron, border: "2px solid " + COLORS.saffronDark }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.primaryHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.primary;
          }}
          aria-label="Fetch and auto-format via DigiLocker"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          ✨ Fetch & Auto-Format via DocBridge ✨
        </button>
      )}

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
        <ProcessingOverlay state={state} />
      )}

      {/* Preview Panel */}
      {state === 'previewing' && processingResult && (
        <PreviewPanel
          result={processingResult}
          portalId={portalId}
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

      {/* DigiLocker Modal */}
      {showModal && (
        <DigiLockerModal
          portalId={portalId}
          onClose={() => {
            setShowModal(false);
            setState('idle');
          }}
          onAssetSelected={handleAssetSelected}
        />
      )}
    </div>
  );
}
