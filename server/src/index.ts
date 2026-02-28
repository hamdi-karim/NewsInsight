import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import newsapiRouter from './routes/newsapi.js';
import guardianRouter from './routes/guardian.js';
import nytRouter from './routes/nyt.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/newsapi', newsapiRouter);
app.use('/api/guardian', guardianRouter);
app.use('/api/nyt', nytRouter);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
