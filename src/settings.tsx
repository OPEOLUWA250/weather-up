import { createContext, ReactNode, useContext } from 'react';

import { usePersistentState } from './hooks/usePersistentState';
import { Language, Unit, VoiceSpeed } from './types';

// React Context lets every screen read and change the same settings,
// without passing them through props from screen to screen.
//
//   <SettingsProvider>   ← holds the values (in _layout.tsx, around all screens)
//     ...any screen...   ← calls useSettings() to read or change them

interface Settings {
  unit: Unit;
  setUnit: (unit: Unit) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  voiceSpeed: VoiceSpeed;
  setVoiceSpeed: (speed: VoiceSpeed) => void;
  morningAlert: boolean;
  setMorningAlert: (on: boolean) => void;
  loaded: boolean; // true once every saved setting has been read
}

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit, unitLoaded] = usePersistentState<Unit>('unit', 'C');
  const [language, setLanguage, languageLoaded] = usePersistentState<Language>('language', 'en');
  const [voiceSpeed, setVoiceSpeed, speedLoaded] = usePersistentState<VoiceSpeed>(
    'voiceSpeed',
    'normal',
  );
  const [morningAlert, setMorningAlert, alertLoaded] = usePersistentState('morningAlert', false);

  const value: Settings = {
    unit,
    setUnit,
    language,
    setLanguage,
    voiceSpeed,
    setVoiceSpeed,
    morningAlert,
    setMorningAlert,
    loaded: unitLoaded && languageLoaded && speedLoaded && alertLoaded,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// Any component inside <SettingsProvider> can call this.
export function useSettings(): Settings {
  const settings = useContext(SettingsContext);
  if (settings === null) {
    throw new Error('useSettings() must be used inside <SettingsProvider>');
  }
  return settings;
}
