import type { ArticleQuery, Source } from '../../domain/types';

export interface Preferences {
  sources: Source[];
  category: string;
}

export const DEFAULT_PREFERENCES: Preferences = {
  sources: [],
  category: '',
};

export function buildQueryFromPreferences(prefs: Preferences): ArticleQuery {
  return {
    sources: prefs.sources.length > 0 ? prefs.sources : undefined,
    category: prefs.category || undefined,
  };
}
