import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Preferences } from './types';
import { loadPreferences, savePreferences } from './storage';
import { PreferencesContext } from './context';

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
