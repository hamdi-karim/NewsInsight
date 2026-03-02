import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import ArticleCard from './ArticleCard';
import type { Article } from '../../domain/types';

const fullArticle: Article = {
  id: 'https://example.com/story',
  source: 'guardian',
  title: 'Test Article Title',
  summary: 'A brief summary of the article.',
  url: 'https://example.com/story',
  imageUrl: 'https://example.com/image.jpg',
  publishedAt: '2026-02-20T12:00:00Z',
  author: 'Karim Hamdi',
  category: 'Technology',
};

function renderCard(article: Article = fullArticle) {
  return render(
    <MemoryRouter>
      <ArticleCard article={article} />
    </MemoryRouter>,
  );
}

describe('ArticleCard', () => {
  afterEach(cleanup);

  it('renders the article title', () => {
    renderCard();
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('renders the source badge with correct label', () => {
    renderCard();
    expect(screen.getByText('The Guardian')).toBeInTheDocument();
  });

  it('renders the formatted date', () => {
    renderCard();
    expect(screen.getByText('Feb 20, 2026')).toBeInTheDocument();
  });

  it('renders the author when provided', () => {
    renderCard();
    expect(screen.getByText('Karim Hamdi')).toBeInTheDocument();
  });

  it('does not render author when absent', () => {
    const noAuthor: Article = { ...fullArticle, author: undefined };
    renderCard(noAuthor);
    expect(screen.queryByText('Karim Hamdi')).not.toBeInTheDocument();
  });

  it('renders image when imageUrl is provided', () => {
    renderCard();
    const img = screen.getByRole('presentation');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders placeholder when imageUrl is absent', () => {
    const noImage: Article = { ...fullArticle, imageUrl: undefined };
    renderCard(noImage);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('links to the correct detail route', () => {
    renderCard();
    const links = screen.getAllByRole('link');
    const expectedPath = `/article/guardian/${encodeURIComponent(fullArticle.id)}`;
    const matchingLink = links.find(
      (link) => link.getAttribute('href') === expectedPath,
    );
    expect(matchingLink).toBeDefined();
  });

  it('renders the category badge when provided', () => {
    renderCard();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders with newsapi source label', () => {
    const newsapiArticle: Article = { ...fullArticle, source: 'newsapi' };
    renderCard(newsapiArticle);
    expect(screen.getByText('NewsAPI')).toBeInTheDocument();
  });

  it('renders with nyt source label', () => {
    const nytArticle: Article = { ...fullArticle, source: 'nyt' };
    renderCard(nytArticle);
    expect(screen.getByText('New York Times')).toBeInTheDocument();
  });
});
