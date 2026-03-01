import { describe, expect, it } from 'vitest';
import type { NytResponse } from '../../domain/types';
import { adaptNytArticles } from '../../domain/adapters';
import { normalizeNytDocs } from './useArticles';

describe('normalizeNytDocs', () => {
  it('returns an empty array when NYT docs is null', () => {
    const response: NytResponse = {
      status: 'OK',
      response: {
        docs: null,
      },
    };

    expect(normalizeNytDocs(response)).toEqual([]);
  });

  it('produces an empty adapted result for NYT null docs', () => {
    const response: NytResponse = {
      status: 'OK',
      response: {
        docs: null,
      },
    };

    expect(() => adaptNytArticles(normalizeNytDocs(response))).not.toThrow();
    expect(adaptNytArticles(normalizeNytDocs(response))).toEqual([]);
  });

  it('returns docs when response has an array', () => {
    const response: NytResponse = {
      status: 'OK',
      response: {
        docs: [
          {
            _id: 'nyt://article/1',
            headline: { main: 'Title' },
            abstract: 'Summary',
            web_url: 'https://example.com/article',
            multimedia: [],
            pub_date: '2026-03-01T00:00:00Z',
            byline: { original: 'By Author' },
            section_name: 'World',
          },
        ],
      },
    };

    expect(normalizeNytDocs(response)).toHaveLength(1);
  });
});
