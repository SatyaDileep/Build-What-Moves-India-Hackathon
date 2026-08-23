'use client';

import { useRef, useEffect, useState } from 'react';
import { ProcessingResult } from '@/types';
import { COLORS } from '@/lib/constants';

interface PreviewPanelProps {
  result: ProcessingResult;
  portalId: 'epfo' | 'upsc';
  onSubmit: () => void;
  onCancel: () => void;
}

export default function PreviewPanel({ 
  result, 
  portalId, 
  onSubmit, 
  onCancel 
}: PreviewPanelProps) {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  useEffect(() => {
    // Create object URLs for preview
    const origUrl = URL.createObjectURL(result.original.blob);
    const procUrl = URL.createObjectURL(result.processed.blob);
    
    setOriginalUrl(origUrl);
    setProcessedUrl(procUrl);

    return () => {
      URL.revokeObjectURL(origUrl);
      URL.revokeObjectURL(procUrl);
    };
  }, [result]);

  const formatSize = (mb: number) => {
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(mb * 1024).toFixed(0)} KB`;
  };

  const formatSizeKB = (kb: number) => {
    return `${Math.round(kb)} KB`;
  };

  const isPDF = result.constraint.format === "pdf";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2" style={{ color: COLORS.gray[800] }}>
          Document Preview
        </h3>
        <p className="text-sm" style={{ color: COLORS.gray[500] }}>
          Review your optimized document before submission
        </p>
      </div>

      {/* Side by Side Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original */}
        <div 
          className="border rounded-lg overflow-hidden"
          style={{ borderColor: COLORS.gray[200] }}
        >
          <div 
            className="px-4 py-2 border-b"
            style={{ 
              backgroundColor: COLORS.gray[50],
              borderColor: COLORS.gray[200]
            }}
          >
            <h4 className="font-semibold text-sm" style={{ color: COLORS.gray[700] }}>
              📷 Source Image (JPEG)
            </h4>
          </div>
          <div className="p-4">
            <div 
              className="aspect-[3/4] rounded-lg overflow-hidden mb-4 flex items-center justify-center"
              style={{ backgroundColor: COLORS.gray[100] }}
            >
              {originalUrl ? (
                result.constraint.format === 'pdf' ? (
                  <div className="text-center p-4">
                    <svg 
                      className="w-16 h-16 mx-auto mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: COLORS.gray[400] }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium" style={{ color: COLORS.gray[600] }}>
                      Original Image
                    </p>
                  </div>
                ) : (
                  <img 
                    src={originalUrl} 
                    alt="Original document" 
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <div className="animate-pulse w-full h-full" style={{ backgroundColor: COLORS.gray[200] }} />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: COLORS.gray[500] }}>Size:</span>
                <span className="font-medium" style={{ color: COLORS.gray[800] }}>
                  {formatSize(result.original.size_mb)}
                </span>
              </div>
              {result.original.dimensions && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: COLORS.gray[500] }}>Dimensions:</span>
                  <span className="font-medium" style={{ color: COLORS.gray[800] }}>
                    {result.original.dimensions.width} × {result.original.dimensions.height}px
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Processed */}
        <div 
          className="border-2 rounded-lg overflow-hidden"
          style={{ borderColor: COLORS.success }}
        >
          <div 
            className="px-4 py-2 border-b"
            style={{ 
              backgroundColor: COLORS.successLight,
              borderColor: COLORS.success
            }}
          >
            <h4 className="font-semibold text-sm" style={{ color: COLORS.success }}>
              {isPDF ? "📄 Optimized PDF" : "🖼️ Optimized JPEG"} ✓
            </h4>
          </div>
          <div className="p-4">
            <div 
              className="aspect-[3/4] rounded-lg overflow-hidden mb-4 flex items-center justify-center"
              style={{ backgroundColor: COLORS.gray[100] }}
            >
              {processedUrl ? (
                result.constraint.format === 'pdf' ? (
                  <div className="text-center p-4">
                    <svg 
                      className="w-16 h-16 mx-auto mb-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ color: COLORS.success }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm font-medium" style={{ color: COLORS.success }}>
                      PDF Ready
                    </p>
                  </div>
                ) : (
                  <img 
                    src={processedUrl} 
                    alt="Processed document" 
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <div className="animate-pulse w-full h-full" style={{ backgroundColor: COLORS.gray[200] }} />
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: COLORS.gray[500] }}>Size:</span>
                <span className="font-medium" style={{ color: COLORS.gray[800] }}>
                  {formatSizeKB(result.processed.size_kb)}
                </span>
              </div>
              {result.processed.dimensions && (
                <div className="flex justify-between text-sm">
                  <span style={{ color: COLORS.gray[500] }}>Dimensions:</span>
                  <span className="font-medium" style={{ color: COLORS.gray[800] }}>
                    {result.processed.dimensions.width} × {result.processed.dimensions.height}px
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span style={{ color: COLORS.gray[500] }}>Format:</span>
                <span className="font-medium uppercase" style={{ color: COLORS.gray[800] }}>
                  {result.constraint.format}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Constraints Met */}
      <div 
        className="p-4 rounded-lg"
        style={{ backgroundColor: COLORS.successLight }}
      >
        <h4 className="font-semibold mb-2" style={{ color: COLORS.success }}>
          ✓ Requirements Met
        </h4>
        <ul className="text-sm space-y-1" style={{ color: COLORS.gray[700] }}>
          {result.constraint.format && (
            <li>• Format: {result.constraint.format.toUpperCase()}</li>
          )}
          {result.constraint.max_kb && (
            <li>• Max size: {result.constraint.max_kb}KB (yours: {Math.round(result.processed.size_kb)}KB)</li>
          )}
          {result.constraint.min_kb && (
            <li>• Min size: {result.constraint.min_kb}KB (yours: {Math.round(result.processed.size_kb)}KB)</li>
          )}
          {result.constraint.width_cm && result.constraint.height_cm && (
            <li>• Dimensions: {result.constraint.width_cm}cm × {result.constraint.height_cm}cm</li>
          )}
          {result.constraint.bg_color && (
            <li>• Background: {result.constraint.bg_color}</li>
          )}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-lg font-semibold border transition-colors"
          style={{ 
            borderColor: COLORS.gray[300],
            color: COLORS.gray[700]
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.gray[100];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 py-3 px-4 rounded-lg font-semibold text-white transition-colors"
          style={{ backgroundColor: COLORS.success }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.successHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.success;
          }}
        >
          Submit to {portalId === 'epfo' ? 'EPFO' : 'UPSC'}
        </button>
      </div>

      {/* Download Options */}
      <div className="flex gap-4">
        <a
          href={originalUrl || '#'}
          download={`original_${portalId}`}
          className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-center border transition-colors"
          style={{ 
            borderColor: COLORS.gray[300],
            color: COLORS.gray[600]
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.gray[100];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Download Original
        </a>
        <a
          href={processedUrl || '#'}
          download={`optimized_${portalId}.${result.constraint.format}`}
          className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-center border transition-colors"
          style={{ 
            borderColor: COLORS.primary,
            color: COLORS.primary
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.primaryLight;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Download Optimized
        </a>
      </div>
    </div>
  );
}
