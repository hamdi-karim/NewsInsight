import type { Source } from '../../domain/types';

export const SOURCE_LABELS: Record<Source, string> = {
  newsapi: 'NewsAPI',
  guardian: 'The Guardian',
  nyt: 'NYT',
};

export const SOURCE_COLORS: Record<Source, string> = {
  newsapi: 'bg-blue-100 text-blue-800',
  guardian: 'bg-yellow-100 text-yellow-800',
  nyt: 'bg-green-100 text-green-800',
};
