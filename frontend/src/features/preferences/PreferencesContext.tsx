import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Preferences } from './types';
import { DEFAULT_PREFERENCES } from './types';
import { loadPreferences, savePreferences } from './storage';

interface PreferencesContextValue {
  preferences: Preferences;
  setPreferences: (next: Preferences) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  return (
    <PreferencesContext value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return ctx;
}

export { DEFAULT_PREFERENCES };
