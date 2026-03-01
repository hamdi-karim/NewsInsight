import { describe, expect, it } from 'vitest';
import { resolveNewsApiRequest } from './newsapi.js';

describe('resolveNewsApiRequest', () => {
  it('uses top-headlines when no query or date filters are provided', () => {
    const result = resolveNewsApiRequest({});

    expect(result.base).toContain('/top-headlines');
    expect(result.params.q).toBeUndefined();
    expect(result.params.from).toBeUndefined();
    expect(result.params.to).toBeUndefined();
    expect(result.params.country).toBe('us');
    expect(result.params.language).toBeUndefined();
  });

  it('uses everything when a search query is provided', () => {
    const result = resolveNewsApiRequest({ q: 'climate' });

    expect(result.base).toContain('/everything');
    expect(result.params.q).toBe('climate');
    expect(result.params.language).toBe('en');
    expect(result.params.sortBy).toBe('publishedAt');
    expect(result.params).not.toHaveProperty('country');
  });

  it('uses everything and forwards dates when query + dates are provided', () => {
    const result = resolveNewsApiRequest({
      q: 'climate',
      from: '2026-02-01',
      to: '2026-02-15',
    });

    expect(result.base).toContain('/everything');
    expect(result.params.q).toBe('climate');
    expect(result.params.from).toBe('2026-02-01');
    expect(result.params.to).toBe('2026-02-15');
  });

  it('uses everything with fallback query when only from-date is provided', () => {
    const result = resolveNewsApiRequest({ from: '2026-02-20' });

    expect(result.base).toContain('/everything');
    expect(result.params.q).toBe('news');
    expect(result.params.from).toBe('2026-02-20');
    expect(result.params.language).toBe('en');
    expect(result.params).not.toHaveProperty('country');
  });

  it('uses everything with fallback query when only to-date is provided', () => {
    const result = resolveNewsApiRequest({ to: '2026-02-28' });

    expect(result.base).toContain('/everything');
    expect(result.params.q).toBe('news');
    expect(result.params.to).toBe('2026-02-28');
  });

  it('uses everything with fallback query when both dates are provided without q', () => {
    const result = resolveNewsApiRequest({
      from: '2026-02-01',
      to: '2026-02-28',
    });

    expect(result.base).toContain('/everything');
    expect(result.params.q).toBe('news');
    expect(result.params.from).toBe('2026-02-01');
    expect(result.params.to).toBe('2026-02-28');
    expect(result.params.sortBy).toBe('publishedAt');
  });

  it('forwards page parameter in all scenarios', () => {
    const headlinesResult = resolveNewsApiRequest({ page: '2' });
    expect(headlinesResult.params.page).toBe('2');

    const everythingResult = resolveNewsApiRequest({ q: 'tech', page: '3' });
    expect(everythingResult.params.page).toBe('3');
  });
});
