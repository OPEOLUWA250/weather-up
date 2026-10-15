import * as Speech from 'expo-speech';

// Finding voices also wakes up the phone's text-to-speech engine. Android only
// starts the engine the first time it's needed, which made the first
// "Read aloud" slow. So App calls this as soon as the app opens.
//
// We keep the Promise in a variable so the search only ever runs once.
let nigerianVoice: Promise<Speech.Voice | null> | null = null;

export function getNigerianVoice(): Promise<Speech.Voice | null> {
  if (nigerianVoice === null) {
    nigerianVoice = findNigerianVoice();
  }
  return nigerianVoice;
}

async function findNigerianVoice(): Promise<Speech.Voice | null> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const nigerianVoices = voices.filter(
      (voice) => voice.language.replace('_', '-').toLowerCase() === 'en-ng',
    );

    // Prefer voices stored on the phone over ones that stream from the
    // internet ("network" in the name): they start speaking much faster.
    return (
      nigerianVoices.find((voice) => !voice.identifier.includes('network')) ??
      nigerianVoices[0] ??
      null
    );
  } catch (error) {
    console.warn('Could not list text-to-speech voices:', error);
    return null;
  }
}
