import type { Preferences } from './types';
import { DEFAULT_PREFERENCES } from './types';

const STORAGE_KEY = 'newsinsight-preferences';

export function loadPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null)
      return DEFAULT_PREFERENCES;

    const obj = parsed as Record<string, unknown>;

    return {
      sources: Array.isArray(obj.sources)
        ? obj.sources
        : DEFAULT_PREFERENCES.sources,
      category:
        typeof obj.category === 'string'
          ? obj.category
          : DEFAULT_PREFERENCES.category,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Preferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
