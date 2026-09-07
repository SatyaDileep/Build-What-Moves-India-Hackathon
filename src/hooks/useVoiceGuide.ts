'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Picks the best available voice for the target lang (e.g. hi-IN → Hindi).
function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = typeof window !== 'undefined' ? window.speechSynthesis.getVoices() : [];
  const norm = lang.replace('_', '-').toLowerCase();
  if (norm === 'hi-in') {
    return voices.find(v => v.lang?.toLowerCase().replace('_', '-') === 'hi-in' && /hindi/i.test(v.name))
      ?? voices.find(v => v.lang?.toLowerCase().replace('_', '-') === 'hi-in')
      ?? null;
  }
  return voices.find(v => v.lang?.toLowerCase().replace('_', '-') === norm) ?? null;
}

export function useVoiceGuide(enabled: boolean, text: string, lang: string = 'en-IN') {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const pathname = usePathname();

  // Navigation away (SPA route change) must always silence the guide —
  // even if the speaking component's own cleanup races with the queue.
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [pathname]);

  useEffect(() => {
    if (!enabled || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    let cancelled = false;
    const speak = () => {
      if (cancelled) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 1.08;
      const voice = pickVoice(lang);
      if (voice) u.voice = voice;
      utterRef.current = u;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    };

    speak();
    // Voices load asynchronously; only re-speak if nothing is playing yet
    // so a late voiceschanged can't restart — and cut — an active readout.
    const onVoices = () => {
      if (cancelled) return;
      if (window.speechSynthesis.speaking) return;
      speak();
    };
    window.speechSynthesis.addEventListener('voiceschanged', onVoices);
    return () => {
      cancelled = true;
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
      window.speechSynthesis.cancel();
    };
  }, [enabled, text, lang]);

  return { speaking, stop: () => typeof window !== 'undefined' && window.speechSynthesis.cancel() };
}