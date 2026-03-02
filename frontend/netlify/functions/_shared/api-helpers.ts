import type { Source } from './types.js';

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

export function toNytDate(isoDate: string): string {
  return isoDate.slice(0, 10).replace(/-/g, '');
}

export function toGuardianDate(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(source: Source, message: string, status = 500): Response {
  return jsonResponse(formatProxyError(source, message), status);
}
