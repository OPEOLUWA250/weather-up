import { Language } from '../types';
import { en } from './en';
import { ha } from './ha';
import { ig } from './ig';
import { pcm } from './pcm';
import { Phrases } from './phrases';
import { yo } from './yo';

// "i18n" is short for "internationalization" (i + 18 letters + n).

export const PHRASES: Record<Language, Phrases> = { en, pcm, yo, ig, ha };

// Shown in Settings, each written in its own language.
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  pcm: 'Naijá (Pidgin)',
  yo: 'Yorùbá',
  ig: 'Igbo',
  ha: 'Hausa',
};
