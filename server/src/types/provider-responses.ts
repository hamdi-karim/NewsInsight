export type Source = 'newsapi' | 'guardian' | 'nyt';

// ---- NewsAPI ----

export interface NewsApiRawArticle {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  author?: string;
  source: { name: string };
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiRawArticle[];
}

// ---- Guardian ----

export interface GuardianRawArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionName?: string;
  fields?: {
    trailText?: string;
    thumbnail?: string;
    byline?: string;
  };
}

export interface GuardianResponse {
  response: {
    status: string;
    total: number;
    results: GuardianRawArticle[];
  };
}

// ---- New York Times ----

export interface NytRawArticle {
  _id: string;
  headline: { main: string };
  abstract?: string;
  web_url: string;
  multimedia: { url: string }[];
  pub_date: string;
  byline?: { original?: string };
  section_name?: string;
}

export interface NytResponse {
  status: string;
  response: {
    docs: NytRawArticle[];
  };
}
