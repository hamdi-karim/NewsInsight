import { describe, expect, it } from 'vitest';
import { dedupeByUrl, sortByDate, mergeArticles } from './merge';
import type { Article, SourceResult } from './types';

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 'default-id',
    source: 'newsapi',
    title: 'Default Title',
    url: 'https://example.com/default',
    publishedAt: '2026-02-15T12:00:00Z',
    ...overrides,
  };
}

describe('dedupeByUrl', () => {
  it('removes duplicates sharing the same url, keeps first', () => {
    const a = makeArticle({
      id: '1',
      url: 'https://example.com/dup',
      title: 'First',
    });
    const b = makeArticle({
      id: '2',
      url: 'https://example.com/dup',
      title: 'Second',
    });
    const c = makeArticle({ id: '3', url: 'https://example.com/unique' });

    const result = dedupeByUrl([a, b, c]);

    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('First');
    expect(result[1].url).toBe('https://example.com/unique');
  });

  it('preserves order for unique articles', () => {
    const a = makeArticle({ url: 'https://a.com' });
    const b = makeArticle({ url: 'https://b.com' });
    const c = makeArticle({ url: 'https://c.com' });

    const result = dedupeByUrl([a, b, c]);

    expect(result.map((r) => r.url)).toEqual([
      'https://a.com',
      'https://b.com',
      'https://c.com',
    ]);
  });

  it('returns an empty array for empty input', () => {
    expect(dedupeByUrl([])).toEqual([]);
  });
});

describe('sortByDate', () => {
  it('sorts articles by publishedAt descending (newest first)', () => {
    const old = makeArticle({
      publishedAt: '2026-01-01T00:00:00Z',
      title: 'Old',
    });
    const mid = makeArticle({
      publishedAt: '2026-02-01T00:00:00Z',
      title: 'Mid',
    });
    const recent = makeArticle({
      publishedAt: '2026-03-01T00:00:00Z',
      title: 'Recent',
    });

    const result = sortByDate([old, recent, mid]);

    expect(result.map((a) => a.title)).toEqual(['Recent', 'Mid', 'Old']);
  });

  it('does not mutate the original array', () => {
    const articles = [
      makeArticle({ publishedAt: '2026-01-01T00:00:00Z' }),
      makeArticle({ publishedAt: '2026-03-01T00:00:00Z' }),
    ];
    const original = [...articles];

    sortByDate(articles);

    expect(articles).toEqual(original);
  });

  it('handles articles with identical dates', () => {
    const a = makeArticle({ publishedAt: '2026-02-01T00:00:00Z', title: 'A' });
    const b = makeArticle({ publishedAt: '2026-02-01T00:00:00Z', title: 'B' });

    const result = sortByDate([a, b]);
    expect(result).toHaveLength(2);
  });
});

describe('mergeArticles', () => {
  it('merges successful SourceResult entries', () => {
    const results: SourceResult[] = [
      {
        source: 'newsapi',
        status: 'success',
        articles: [
          makeArticle({
            url: 'https://a.com',
            publishedAt: '2026-02-20T00:00:00Z',
          }),
        ],
      },
      {
        source: 'guardian',
        status: 'success',
        articles: [
          makeArticle({
            url: 'https://b.com',
            publishedAt: '2026-02-21T00:00:00Z',
          }),
        ],
      },
    ];

    const merged = mergeArticles(results);
    expect(merged).toHaveLength(2);
    expect(merged[0].url).toBe('https://b.com');
  });

  it('ignores errored sources', () => {
    const results: SourceResult[] = [
      {
        source: 'newsapi',
        status: 'success',
        articles: [makeArticle({ url: 'https://a.com' })],
      },
      {
        source: 'guardian',
        status: 'error',
        error: 'Network failure',
      },
    ];

    const merged = mergeArticles(results);
    expect(merged).toHaveLength(1);
    expect(merged[0].url).toBe('https://a.com');
  });

  it('returns an empty array when all sources errored', () => {
    const results: SourceResult[] = [
      { source: 'newsapi', status: 'error', error: 'Timeout' },
      { source: 'guardian', status: 'error', error: '500' },
      { source: 'nyt', status: 'error', error: 'Rate limited' },
    ];

    expect(mergeArticles(results)).toEqual([]);
  });

  it('deduplicates and sorts the merged result', () => {
    const results: SourceResult[] = [
      {
        source: 'newsapi',
        status: 'success',
        articles: [
          makeArticle({
            url: 'https://dup.com',
            publishedAt: '2026-01-01T00:00:00Z',
            title: 'NewsAPI',
          }),
          makeArticle({
            url: 'https://unique.com',
            publishedAt: '2026-03-01T00:00:00Z',
          }),
        ],
      },
      {
        source: 'guardian',
        status: 'success',
        articles: [
          makeArticle({
            url: 'https://dup.com',
            publishedAt: '2026-02-01T00:00:00Z',
            title: 'Guardian',
          }),
        ],
      },
    ];

    const merged = mergeArticles(results);

    expect(merged).toHaveLength(2);
    expect(merged[0].url).toBe('https://unique.com');
    expect(merged[1].title).toBe('NewsAPI');
  });
});
