'use client';
import { useEffect, useRef, useState } from 'react';
export function useVoiceGuide(enabled: boolean, text: string, lang: string = 'en-IN') {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => {
    if (!enabled || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = 0.95;
    utterRef.current = u; u.onstart = () => setSpeaking(true); u.onend = () => setSpeaking(false);
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    return () => { window.speechSynthesis.cancel(); };
  }, [enabled, text, lang]);
  return { speaking, stop: () => typeof window !== 'undefined' && window.speechSynthesis.cancel() };
}
