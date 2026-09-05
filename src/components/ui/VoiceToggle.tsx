'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/i18n';
import { isVoiceOn } from '@/lib/voice';
import { COLORS } from '@/lib/constants';

interface VoiceToggleProps {
  withHint?: boolean;
  className?: string;
}

// Shared voice guide switch — persisted under one key so the choice is common
// across every portal. Defaults to OFF; narrating only ever reads the same
// docbridge-voice flag the widget's processing overlay checks.
export default function VoiceToggle({ withHint = false, className = '' }: VoiceToggleProps) {
  const { t } = useLang();
  const [voiceOn, setVoiceOn] = useState(false);

  useEffect(() => {
    setVoiceOn(isVoiceOn());
  }, []);

  const toggle = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    try { localStorage.setItem('docbridge-voice', next ? '1' : '0'); } catch {}
    if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={voiceOn}
        aria-label={t('nudge.voiceHint')}
        onClick={toggle}
        className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-bold shadow-sm transition-colors hover:-translate-y-0.5"
        style={{ borderColor: voiceOn ? '#059669' : COLORS.gray[300], color: voiceOn ? '#065F46' : COLORS.gray[600] }}
      >
        <span aria-hidden="true">{voiceOn ? '🔊' : '🔈'}</span>
        {voiceOn ? t('ov.voiceOn') : t('ov.voiceOff')}
      </button>
      {withHint && (
        <span className="text-[11.5px] leading-4 text-slate-500" style={{ maxWidth: '26ch' }}>
          {t('nudge.voiceHint')} · {t('nudge.voiceSub')}
        </span>
      )}
    </div>
  );
}