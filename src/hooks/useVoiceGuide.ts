'use client';
import { useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    if (!enabled || !text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    let cancelled = false;
    const speak = () => {
      if (cancelled) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.95;
      const voice = pickVoice(lang);
      if (voice) u.voice = voice;
      utterRef.current = u;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    };

    speak();
    // Voices load asynchronously; re-pick once they arrive so Hindi gets a Hindi voice.
    window.speechSynthesis.addEventListener('voiceschanged', speak);
    return () => {
      cancelled = true;
      window.speechSynthesis.removeEventListener('voiceschanged', speak);
      window.speechSynthesis.cancel();
    };
  }, [enabled, text, lang]);

  return { speaking, stop: () => typeof window !== 'undefined' && window.speechSynthesis.cancel() };
}