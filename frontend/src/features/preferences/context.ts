import { createContext } from 'react';
import type { Preferences } from './types';

export interface PreferencesContextValue {
  preferences: Preferences;
  setPreferences: (next: Preferences) => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
