import { describe, expect, it } from 'vitest';
import { adaptNytArticles } from './nyt';
import type { NytRawArticle, NytResponse } from '../types';
import { normalizeNytDocs } from '../../features/articles/useArticles';

const fullArticle: NytRawArticle = {
  _id: 'nyt://article/abc123',
  headline: { main: 'NYT Headline' },
  abstract: 'An important abstract.',
  web_url: 'https://nytimes.com/article/abc',
  multimedia: {
    default: { url: 'images/2026/02/photo.jpg' },
    thumbnail: { url: 'images/2026/02/thumb.jpg' },
  },
  pub_date: '2026-02-20T14:00:00Z',
  byline: { original: 'By Alice Johnson' },
  section_name: 'Technology',
};

describe('adaptNytArticles', () => {
  it('maps all fields to normalized Article shape', () => {
    const [article] = adaptNytArticles([fullArticle]);

    expect(article).toEqual({
      id: 'https://nytimes.com/article/abc',
      source: 'nyt',
      title: 'NYT Headline',
      summary: 'An important abstract.',
      url: 'https://nytimes.com/article/abc',
      imageUrl: 'https://static01.nyt.com/images/2026/02/photo.jpg',
      publishedAt: '2026-02-20T14:00:00Z',
      author: 'By Alice Johnson',
      category: 'Technology',
    });
  });

  it('prefixes relative image URLs with NYT_IMAGE_BASE', () => {
    const [article] = adaptNytArticles([fullArticle]);
    expect(article.imageUrl).toBe(
      'https://static01.nyt.com/images/2026/02/photo.jpg',
    );
  });

  it('passes through absolute image URLs unchanged', () => {
    const absolute: NytRawArticle = {
      ...fullArticle,
      multimedia: {
        default: { url: 'https://cdn.example.com/photo.jpg' },
      },
    };

    const [article] = adaptNytArticles([absolute]);
    expect(article.imageUrl).toBe('https://cdn.example.com/photo.jpg');
  });

  it('falls back to thumbnail when default image is missing', () => {
    const thumbOnly: NytRawArticle = {
      ...fullArticle,
      multimedia: {
        thumbnail: { url: 'images/2026/02/thumb.jpg' },
      },
    };

    const [article] = adaptNytArticles([thumbOnly]);
    expect(article.imageUrl).toBe(
      'https://static01.nyt.com/images/2026/02/thumb.jpg',
    );
  });

  it('handles missing multimedia', () => {
    const noMedia: NytRawArticle = {
      ...fullArticle,
      multimedia: undefined,
    };

    const [article] = adaptNytArticles([noMedia]);
    expect(article.imageUrl).toBeUndefined();
  });

  it('handles missing optional fields', () => {
    const minimal: NytRawArticle = {
      _id: 'nyt://article/min',
      headline: { main: 'Minimal' },
      web_url: 'https://nytimes.com/minimal',
      pub_date: '2026-01-01T00:00:00Z',
    };

    const [article] = adaptNytArticles([minimal]);

    expect(article.summary).toBeUndefined();
    expect(article.imageUrl).toBeUndefined();
    expect(article.author).toBeUndefined();
    expect(article.category).toBeUndefined();
  });

  it('returns an empty array for empty input', () => {
    expect(adaptNytArticles([])).toEqual([]);
  });
});

describe('normalizeNytDocs', () => {
  it('returns an empty array when docs is null', () => {
    const response: NytResponse = {
      status: 'OK',
      response: { docs: null },
    };

    expect(normalizeNytDocs(response)).toEqual([]);
  });

  it('returns docs when response has an array', () => {
    const response: NytResponse = {
      status: 'OK',
      response: {
        docs: [fullArticle],
      },
    };

    expect(normalizeNytDocs(response)).toHaveLength(1);
  });

  it('produces an empty adapted result for null docs', () => {
    const response: NytResponse = {
      status: 'OK',
      response: { docs: null },
    };

    const docs = normalizeNytDocs(response);
    expect(adaptNytArticles(docs)).toEqual([]);
  });
});
