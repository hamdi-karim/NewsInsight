import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3001,
  newsApiKey: process.env.NEWSAPI_KEY ?? '',
  guardianApiKey: process.env.GUARDIAN_API_KEY ?? '',
  nytApiKey: process.env.NYT_API_KEY ?? '',
} as const;
