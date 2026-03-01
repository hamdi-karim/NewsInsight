import { Router } from "express";
import { config } from "../config.js";
import {
  buildSearchParams,
  formatProxyError,
  toNytDate,
  validateApiKey,
} from "../utils/api-helpers.js";
import type { NytResponse } from "../types/provider-responses.js";

const NYT_BASE = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

const NYT_CATEGORY_MAP: Record<string, string> = {
  business: 'desk:"Business" OR section.name:"Business"',
  entertainment: 'section.name:"Arts" OR desk:("Arts&Leisure", "Culture")',
  environment: 'section.name:"Climate" OR desk:"Climate"',
  health: 'section.name:"Health"',
  politics: 'desk:"Politics" OR section.name:"U.S."',
  science: 'section.name:"Science" OR desk:"Science"',
  sport: 'section.name:"Sports" OR desk:"Sports"',
  technology: 'desk:"Technology"',
  world: 'section.name:"World" OR desk:"Foreign"',
};

const router = Router();

router.get("/articles", async (req, res) => {
  try {
    validateApiKey(config.nytApiKey, "nyt");

    const { q, from, to, category, page } = req.query as Record<
      string,
      string | undefined
    >;

    const nytPage = page ? Math.max(0, Number(page) - 1) : undefined;

    const fq = category ? NYT_CATEGORY_MAP[category] : undefined;

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const nytEndDate = to ? toNytDate(to) : undefined;

    const params = buildSearchParams({
      q,
      begin_date: from ? toNytDate(from) : undefined,
      end_date: nytEndDate && nytEndDate < today ? nytEndDate : undefined,
      fq,
      page: nytPage,
      "api-key": config.nytApiKey,
    });

    console.log('[nyt] GET', `${NYT_BASE}?${params}`);

    const response = await fetch(`${NYT_BASE}?${params}`, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const nytBody = body as {
        fault?: { faultstring?: string };
        errors?: string[];
      } | null;
      const message =
        nytBody?.fault?.faultstring ??
        nytBody?.errors?.[0] ??
        `NYT API returned ${response.status}`;
      res
        .status(response.status)
        .json(formatProxyError("nyt", message, response.status));
      return;
    }

    const data: NytResponse = await response.json();
    if (!data.response.docs) {
      data.response.docs = [];
    }
    console.log('[nyt] status=%d docs=%d', response.status, data.response.docs.length);
    res.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("aborted") ? 504 : 500;
    res.status(status).json(formatProxyError("nyt", message));
  }
});

export default router;
