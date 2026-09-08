// Voice pacing — keeps each processing step on screen long enough for its
// narration to finish. The overlay speaks on every state change and cancels
// the previous utterance, so without a dwell the parsing/processing/submitting
// lines get cut off mid-sentence.

// Two channels so personas never leak into each other: assistive flows
// (elder auto-nudge) default ON, quiet flows (standard pill) default OFF.
export const VOICE_KEY_AUTO = 'docbridge-voice';
export const VOICE_KEY_QUIET = 'docbridge-voice-quiet';

export function isVoiceOn(key: string = VOICE_KEY_AUTO): boolean {
  try {
    return typeof window !== 'undefined' && localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function setVoiceStored(on: boolean, key: string = VOICE_KEY_AUTO): void {
  try {
    if (typeof window !== 'undefined') localStorage.setItem(key, on ? '1' : '0');
  } catch {}
}

// Rough speech duration: ~16 chars/sec at rate 1.08 + settle buffer, capped.
export function estimateSpeechMs(text: string): number {
  if (!text) return 0;
  return Math.min(Math.round((text.length / 16) * 1000) + 500, 8000);
}

// Wait baseMs normally; when voice is on, wait at least the narration length.
export async function dwellForSpeech(text: string, baseMs: number, key?: string): Promise<void> {
  const ms = isVoiceOn(key ?? VOICE_KEY_AUTO) && text ? Math.max(baseMs, estimateSpeechMs(text)) : baseMs;
  await new Promise<void>((res) => setTimeout(res, ms));
}
