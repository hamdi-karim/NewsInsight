import type { Source } from '../../domain/types';

export const SOURCE_LABELS: Record<Source, string> = {
  newsapi: 'NewsAPI',
  guardian: 'The Guardian',
  nyt: 'New York Times',
};

export const SOURCE_COLORS: Record<Source, string> = {
  newsapi: 'bg-blue-100 text-blue-800',
  guardian: 'bg-yellow-100 text-yellow-800',
  nyt: 'bg-green-100 text-green-800',
};

export const SOURCE_CARD_BACKGROUNDS: Record<Source, string> = {
  newsapi: 'bg-blue-100',
  guardian: 'bg-yellow-100',
  nyt: 'bg-green-100',
};

interface SourceColorScheme {
  active: string;
  inactive: string;
}

export const SOURCE_COLOR_SCHEMES: Record<Source, SourceColorScheme> = {
  newsapi: {
    active: 'bg-blue-400 text-white',
    inactive: 'bg-blue-50 text-gray-500',
  },
  guardian: {
    active: 'bg-yellow-400 text-black-900',
    inactive: 'bg-yellow-50 text-gray-500',
  },
  nyt: {
    active: 'bg-green-400 text-white',
    inactive: 'bg-green-50 text-gray-500',
  },
};
