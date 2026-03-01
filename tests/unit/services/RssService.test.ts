import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { fetchRssFeed } from "../../../src/services/RssService";

// Mock RSS XML data
const mockRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Test Blog</title>
    <link>https://example.com</link>
    <description>Test Description</description>
    <item>
      <title>Article 1</title>
      <link>https://example.com/article1</link>
      <pubDate>Mon, 01 Mar 2026 12:00:00 GMT</pubDate>
      <category>Technology</category>
      <description>Description for article 1</description>
    </item>
    <item>
      <title>Article 2</title>
      <link>https://example.com/article2</link>
      <pubDate>Sun, 28 Feb 2026 10:00:00 GMT</pubDate>
      <category>Programming</category>
      <description><![CDATA[<p>Description with HTML <img src="https://example.com/image.jpg" /></p>]]></description>
      <media:thumbnail url="https://example.com/thumb.jpg" />
    </item>
  </channel>
</rss>`;

const malformedRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Blog</title>
    <unclosed-tag>
  </channel>
</rss>`;

describe("RssService", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
    // Reset fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should fetch and parse RSS feed successfully", async () => {
    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockRssXml,
    });

    const articles = await fetchRssFeed();

    expect(articles).toBeDefined();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe("Article 1");
    expect(articles[0].link).toBe("https://example.com/article1");
    expect(articles[0].category).toBe("Technology");
    expect(fetch).toHaveBeenCalled();
  });

  it("should cache RSS feed data", async () => {
    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockRssXml,
    });

    await fetchRssFeed();

    // Verify data is cached
    const cachedData = localStorage.getItem("cachedRssData");
    expect(cachedData).toBeTruthy();
    expect(cachedData).toContain("Article 1");

    const lastUpdated = localStorage.getItem("rssLastUpdated");
    expect(lastUpdated).toBeTruthy();

    const articleCount = localStorage.getItem("rssArticleCount");
    expect(articleCount).toBe("2");
  });

  it("should use cached data when fresh", async () => {
    // Setup fresh cache
    localStorage.setItem("cachedRssData", mockRssXml);
    localStorage.setItem("rssLastUpdated", new Date().toISOString());

    // Mock fetch (should not be called)
    global.fetch = vi.fn();

    const articles = await fetchRssFeed();

    expect(articles.length).toBe(2);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("should handle malformed RSS data", async () => {
    // Mock fetch returning malformed XML
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => malformedRssXml,
    });

    // Should throw error for malformed XML
    await expect(fetchRssFeed()).rejects.toThrow();
  });

  it("should fall back to cache when remote fetch fails", async () => {
    // Setup cache
    localStorage.setItem("cachedRssData", mockRssXml);

    // Mock failed fetch
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const articles = await fetchRssFeed();

    // Should use cached data
    expect(articles.length).toBe(2);
    expect(articles[0].title).toBe("Article 1");
  });

  it("should fall back to local file when cache and remote fail", async () => {
    // No cache
    localStorage.clear();

    let callCount = 0;
    // Mock failed remote fetch, then successful local fetch
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // First call (remote) fails
        return Promise.reject(new Error("Network error"));
      } else {
        // Second call (local file) succeeds
        return Promise.resolve({
          ok: true,
          text: async () => mockRssXml,
        });
      }
    });

    const articles = await fetchRssFeed();

    // Should have fetched from local file
    expect(articles).toBeDefined();
    expect(Array.isArray(articles)).toBe(true);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("should parse HTML content in descriptions", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockRssXml,
    });

    const articles = await fetchRssFeed();

    // Article 2 has HTML in description
    const article2 = articles.find((a) => a.title === "Article 2");
    expect(article2).toBeDefined();
    expect(article2?.description).not.toContain("<p>");
    expect(article2?.description).not.toContain("<img");
    // Should have extracted image from HTML
    expect(article2?.imageUrl).toBeTruthy();
  });

  it("should sort articles by date (newest first)", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockRssXml,
    });

    const articles = await fetchRssFeed();

    // Article 1 (Mar 01) should come before Article 2 (Feb 28)
    expect(articles[0].title).toBe("Article 1");
    expect(articles[1].title).toBe("Article 2");

    const date1 = new Date(articles[0].pubDate);
    const date2 = new Date(articles[1].pubDate);
    expect(date1.getTime()).toBeGreaterThan(date2.getTime());
  });

  it("should extract media thumbnails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockRssXml,
    });

    const articles = await fetchRssFeed();

    const article2 = articles.find((a) => a.title === "Article 2");
    expect(article2?.thumbnail).toBe("https://example.com/thumb.jpg");
  });

  it("should reject invalid article data with Zod validation", async () => {
    // Mock RSS with invalid URLs
    const invalidRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Test Blog</title>
    <item>
      <title>Invalid Article</title>
      <link>not-a-valid-url</link>
      <pubDate>Mon, 01 Mar 2026 12:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => invalidRssXml,
    });

    // Should throw error due to validation failure
    await expect(fetchRssFeed()).rejects.toThrow("Invalid RSS article format");
  });
});
