import { Router } from 'express';

const router = Router();

router.get('/articles', (_req, res) => {
  res.json({ items: [], meta: { source: 'newsapi' } });
});

export default router;
