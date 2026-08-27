'use client';

import { WidgetState } from '@/types';
import { COLORS, WIDGET_STATES } from '@/lib/constants';

interface ProcessingOverlayProps {
  state: WidgetState;
}

export default function ProcessingOverlay({ state }: ProcessingOverlayProps) {
  const stateConfig = WIDGET_STATES[state as keyof typeof WIDGET_STATES] || {
    title: 'Processing...',
    subtitle: 'Please wait',
  };

  return (
    <div 
      className="p-8 rounded-lg text-center border overflow-hidden"
      style={{ backgroundColor: COLORS.gray[50], borderColor: COLORS.gray[200] }}
    >
      <div className="flex h-1 -mx-8 -mt-8 mb-7" aria-hidden="true">
        <div className="flex-1" style={{ backgroundColor: COLORS.saffron }} />
        <div className="flex-1" style={{ backgroundColor: COLORS.white }} />
        <div className="flex-1" style={{ backgroundColor: COLORS.green }} />
      </div>
      {/* Animated Spinner */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div 
          className="absolute inset-0 rounded-full animate-spin"
          style={{ 
            border: `4px solid ${COLORS.gray[200]}`,
            borderTopColor: COLORS.saffron,
          }}
        />
        <div 
          className="absolute inset-2 rounded-full animate-spin"
          style={{ 
            border: `4px solid ${COLORS.gray[100]}`,
            borderTopColor: COLORS.success,
            animationDirection: 'reverse',
            animationDuration: '1.5s',
          }}
        />
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ color: COLORS.primary }}
        >
          {state === 'authenticating' && (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
          {state === 'parsing' && (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
          {state === 'processing' && (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          )}
          {state === 'submitting' && (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 
        className="text-xl font-bold mb-2"
        style={{ color: COLORS.gray[800] }}
      >
        {stateConfig.title}
      </h3>

      {/* Subtitle */}
      <p 
        className="text-sm"
        style={{ color: COLORS.gray[500] }}
      >
        {stateConfig.subtitle}
      </p>

      {/* Progress Steps */}
      <div className="mt-6 flex justify-center gap-2">
        {['authenticating', 'parsing', 'processing', 'submitting'].map((step, index) => {
          const stepOrder = ['authenticating', 'parsing', 'processing', 'submitting'];
          const currentIndex = stepOrder.indexOf(state);
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step}
              className="flex items-center"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: isComplete 
                    ? COLORS.success 
                    : isCurrent 
                      ? COLORS.primary 
                      : COLORS.gray[200],
                  color: isComplete || isCurrent ? COLORS.white : COLORS.gray[500],
                }}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < 3 && (
                <div 
                  className="w-8 h-1 mx-1 rounded"
                  style={{ 
                    backgroundColor: isComplete ? COLORS.success : COLORS.gray[200]
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
