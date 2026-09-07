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
    <button
      type="button"
      role="switch"
      aria-checked={voiceOn}
      aria-label={t('nudge.voiceHint')}
      onClick={toggle}
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border bg-white px-2.5 py-1 text-[11.5px] font-bold shadow-sm transition-colors hover:-translate-y-0.5 ${className}`}
      style={{ borderColor: voiceOn ? '#059669' : COLORS.gray[300], color: voiceOn ? '#065F46' : COLORS.gray[600] }}
    >
      <span aria-hidden="true">{voiceOn ? '🔊' : '🔈'}</span>
      {voiceOn ? t('ov.voiceOn') : t('ov.voiceOff')}
    </button>
  );
}