import { describe, expect, it } from 'vitest';
import { adaptNewsApiArticles } from './newsapi';
import type { NewsApiRawArticle } from '../types';

const fullArticle: NewsApiRawArticle = {
  title: 'Breaking News',
  description: 'A very important story worth covering.',
  url: 'https://newsapi.com/breaking',
  urlToImage: 'https://newsapi.com/img.jpg',
  publishedAt: '2026-02-20T12:00:00Z',
  author: 'Karim Hamdi',
  source: { name: 'TechCrunch' },
};

describe('adaptNewsApiArticles', () => {
  it('maps all fields to normalized Article shape', () => {
    const [article] = adaptNewsApiArticles([fullArticle]);

    expect(article).toEqual({
      id: 'https://newsapi.com/breaking',
      source: 'newsapi',
      title: 'Breaking News',
      summary: 'A very important story worth covering.',
      url: 'https://newsapi.com/breaking',
      imageUrl: 'https://newsapi.com/img.jpg',
      publishedAt: '2026-02-20T12:00:00Z',
      author: 'Karim Hamdi',
      category: 'TechCrunch',
    });
  });

  it('filters out articles with title "[Removed]"', () => {
    const removed: NewsApiRawArticle = {
      ...fullArticle,
      title: '[Removed]',
    };

    const result = adaptNewsApiArticles([removed, fullArticle]);
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Breaking News');
  });

  it('handles missing optional fields', () => {
    const minimal: NewsApiRawArticle = {
      title: 'Minimal',
      url: 'https://newsapi.com/min',
      publishedAt: '2026-01-01T00:00:00Z',
      source: { name: 'Source' },
    };

    const [article] = adaptNewsApiArticles([minimal]);

    expect(article.summary).toBeUndefined();
    expect(article.imageUrl).toBeUndefined();
    expect(article.author).toBeUndefined();
  });

  it('returns an empty array for empty input', () => {
    expect(adaptNewsApiArticles([])).toEqual([]);
  });

  it('normalizes HTML entities in description', () => {
    const withHtml: NewsApiRawArticle = {
      ...fullArticle,
      description: 'Tom &amp; Jerry &lt;escaped&gt;',
    };

    const [article] = adaptNewsApiArticles([withHtml]);
    expect(article.summary).toBe('Tom & Jerry <escaped>');
  });

  it('strips HTML tags from description', () => {
    const withTags: NewsApiRawArticle = {
      ...fullArticle,
      description: '<p>Hello <b>world</b></p>',
    };

    const [article] = adaptNewsApiArticles([withTags]);
    expect(article.summary).toBe('Hello world');
  });
});
