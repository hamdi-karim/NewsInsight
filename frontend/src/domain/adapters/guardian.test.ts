import { describe, expect, it } from "vitest";
import { adaptGuardianArticles } from "./guardian";
import type { GuardianRawArticle } from "../types";

const fullArticle: GuardianRawArticle = {
  id: "world/2026/feb/20/story",
  webTitle: "Guardian Story",
  webUrl: "https://theguardian.com/world/story",
  webPublicationDate: "2026-02-20T08:30:00Z",
  sectionName: "World news",
  fields: {
    trailText: "A trail text summary.",
    thumbnail: "https://media.guardian.com/thumb.jpg",
    byline: "Karim Hamdi",
  },
};

describe("adaptGuardianArticles", () => {
  it("maps all fields to normalized Article shape", () => {
    const [article] = adaptGuardianArticles([fullArticle]);

    expect(article).toEqual({
      id: "world/2026/feb/20/story",
      source: "guardian",
      title: "Guardian Story",
      summary: "A trail text summary.",
      url: "https://theguardian.com/world/story",
      imageUrl: "https://media.guardian.com/thumb.jpg",
      publishedAt: "2026-02-20T08:30:00Z",
      author: "Karim Hamdi",
      category: "World news",
    });
  });

  it("handles missing fields object", () => {
    const minimal: GuardianRawArticle = {
      id: "uk/2026/minimal",
      webTitle: "Minimal",
      webUrl: "https://theguardian.com/uk/minimal",
      webPublicationDate: "2026-01-01T00:00:00Z",
    };

    const [article] = adaptGuardianArticles([minimal]);

    expect(article.summary).toBeUndefined();
    expect(article.imageUrl).toBeUndefined();
    expect(article.author).toBeUndefined();
  });

  it("handles missing sectionName", () => {
    const noSection: GuardianRawArticle = {
      ...fullArticle,
      sectionName: undefined,
    };

    const [article] = adaptGuardianArticles([noSection]);
    expect(article.category).toBeUndefined();
  });

  it("returns an empty array for empty input", () => {
    expect(adaptGuardianArticles([])).toEqual([]);
  });

  it("normalizes HTML in trailText", () => {
    const withHtml: GuardianRawArticle = {
      ...fullArticle,
      fields: {
        ...fullArticle.fields,
        trailText: "<strong>Bold</strong> &amp; italic",
      },
    };

    const [article] = adaptGuardianArticles([withHtml]);
    expect(article.summary).toBe("Bold & italic");
  });
});
