export const config = {
  newsApiKey: process.env.NEWSAPI_KEY ?? '',
  guardianApiKey: process.env.GUARDIAN_API_KEY ?? '',
  nytApiKey: process.env.NYT_API_KEY ?? '',
} as const;
