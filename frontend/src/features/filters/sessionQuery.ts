import type { ArticleQuery } from '../../domain/types';

const SESSION_KEY = 'newsinsight-active-query';

export function loadSessionQuery(): ArticleQuery | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? (parsed as ArticleQuery) : null;
  } catch {
    return null;
  }
}

export function saveSessionQuery(query: ArticleQuery): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(query));
  } catch { /* sessionStorage may be unavailable */ }
}

export function clearSessionQuery(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}
