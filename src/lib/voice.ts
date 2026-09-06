// Voice pacing — keeps each processing step on screen long enough for its
// narration to finish. The overlay speaks on every state change and cancels
// the previous utterance, so without a dwell the parsing/processing/submitting
// lines get cut off mid-sentence.

export function isVoiceOn(): boolean {
  try {
    return typeof window !== 'undefined' && localStorage.getItem('docbridge-voice') === '1';
  } catch {
    return false;
  }
}

// Rough speech duration: ~16 chars/sec at rate 1.08 + settle buffer, capped.
export function estimateSpeechMs(text: string): number {
  if (!text) return 0;
  return Math.min(Math.round((text.length / 16) * 1000) + 500, 8000);
}

// Wait baseMs normally; when voice is on, wait at least the narration length.
export async function dwellForSpeech(text: string, baseMs: number): Promise<void> {
  const ms = isVoiceOn() && text ? Math.max(baseMs, estimateSpeechMs(text)) : baseMs;
  await new Promise<void>((res) => setTimeout(res, ms));
}
