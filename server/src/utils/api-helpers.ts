import type { Source } from '../types/provider-responses.js';

export interface ProxyErrorBody {
  error: {
    source: Source;
    message: string;
    upstreamStatus?: number;
  };
}

export function buildSearchParams(
  entries: Record<string, string | number | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  return params;
}

export function formatProxyError(
  source: Source,
  message: string,
  upstreamStatus?: number,
): ProxyErrorBody {
  return {
    error: {
      source,
      message,
      ...(upstreamStatus !== undefined && { upstreamStatus }),
    },
  };
}

export function validateApiKey(key: string, source: Source): void {
  if (!key) {
    throw new Error(`${source.toUpperCase()} API key is not configured`);
  }
}

/**
 * Converts ISO date string "2026-02-28" or "2026-02-28T00:00:00Z"
 * to NYT format "20260228".
 */
export function toNytDate(isoDate: string): string {
  return isoDate.slice(0, 10).replace(/-/g, '');
}

/**
 * Extracts the YYYY-MM-DD portion from an ISO date string.
 * Guardian API expects dates without a time component.
 */
export function toGuardianDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}
