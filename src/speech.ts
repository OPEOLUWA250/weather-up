import * as Speech from 'expo-speech';

import { Language, VoiceSpeed } from './types';

// Listing the voices also wakes up the phone's text-to-speech engine.
// Android only starts the engine the first time it's needed, which made the
// first "Read aloud" slow. So the app calls warmUpSpeech() as soon as it opens.
//
// We keep the Promise in a variable so the list is only fetched once.
let voicesPromise: Promise<Speech.Voice[]> | null = null;

function loadVoices(): Promise<Speech.Voice[]> {
  if (voicesPromise === null) {
    voicesPromise = Speech.getAvailableVoicesAsync().catch((error) => {
      console.warn('Could not list text-to-speech voices:', error);
      return [];
    });
  }
  return voicesPromise;
}

export function warmUpSpeech(): void {
  loadVoices();
}

// Which voices to try for each language, best first.
// Phones rarely have Yorùbá, Igbo or Hausa voices, so those fall back to a
// Nigerian English voice, which pronounces them better than other accents.
const VOICE_LANGUAGES: Record<Language, string[]> = {
  en: ['en-NG'],
  pcm: ['en-NG'],
  yo: ['yo-NG', 'en-NG'],
  ig: ['ig-NG', 'en-NG'],
  ha: ['ha-NG', 'en-NG'],
};

// Finds the best installed voice for a language, or null if none fits.
export async function findVoice(language: Language): Promise<Speech.Voice | null> {
  const voices = await loadVoices();

  for (const code of VOICE_LANGUAGES[language]) {
    const matches = voices.filter(
      // `?? ''` guards against a voice with no language listed.
      (voice) => (voice.language ?? '').replace('_', '-').toLowerCase() === code.toLowerCase(),
    );
    // Prefer voices stored on the phone over ones that stream from the
    // internet ("network" in the name): they start speaking much faster.
    const best = matches.find((voice) => !voice.identifier.includes('network')) ?? matches[0];
    if (best) return best;
  }
  return null;
}

export const SPEECH_RATE: Record<VoiceSpeed, number> = {
  slow: 0.8,
  normal: 0.95,
  fast: 1.15,
};
