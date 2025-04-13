/**
 * Service for fetching RSS feed with fallback to local file
 */

// Define a type for RSS Article items
export interface RssArticle {
  title: string;
  link: string;
  pubDate: string;
  category?: string;
  description?: string;
}

/**
 * Fetches the RSS feed from the live URL with fallback to local file
 * @returns Array of parsed RSS articles
 */
export const fetchRssFeed = async (): Promise<RssArticle[]> => {
  try {
    // First attempt: Try to fetch from live URL via proxy
    const response = await fetch("/rss-feed", {
      headers: { "Cache-Control": "no-cache" },
      // Short timeout to prevent long waits if the server is slow
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch live RSS feed: ${response.statusText}`);
    }

    const rssData = await response.text();
    return parseRssData(rssData);
  } catch (error) {
    console.warn(
      "Error fetching live RSS feed, falling back to local version:",
      error
    );

    try {
      // Second attempt: Fallback to local file
      const response = await fetch("/src/data/rss.xml");

      if (!response.ok) {
        throw new Error(
          `Failed to fetch local RSS file: ${response.statusText}`
        );
      }

      const rssData = await response.text();
      return parseRssData(rssData);
    } catch (fallbackError) {
      console.error("Both live and local RSS feeds failed:", fallbackError);
      throw new Error("Unable to load articles. Please try again later.");
    }
  }
};

/**
 * Parses RSS XML data into structured article objects
 * @param rssData The raw XML string from the RSS feed
 * @returns Array of structured article objects
 */
const parseRssData = (rssData: string): RssArticle[] => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(rssData, "application/xml");

  if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Error parsing XML");
  }

  const items = xmlDoc.getElementsByTagName("item");

  if (items.length === 0) {
    return [];
  }

  const parsedArticles: RssArticle[] = [];

  // Process all items from the RSS feed
  for (let i = 0; i < items.length; i++) {
    const titleElement = items[i].getElementsByTagName("title")[0];
    const linkElement = items[i].getElementsByTagName("link")[0];
    const pubDateElement = items[i].getElementsByTagName("pubDate")[0];
    const categoryElements = items[i].getElementsByTagName("category");
    const descriptionElement = items[i].getElementsByTagName("description")[0];

    const title = titleElement?.textContent?.trim() || "";
    const link = linkElement?.textContent?.trim() || "";
    const pubDate = pubDateElement?.textContent?.trim() || "";
    const description = descriptionElement?.textContent?.trim() || "";

    // Extract categories
    let mainCategory = "";
    if (categoryElements.length > 0) {
      mainCategory = categoryElements[0]?.textContent?.trim() || "";
    }

    // Parse the date from RSS pubDate format (RFC 822/2822)
    let validPubDate = new Date().toISOString(); // Default fallback to now
    try {
      if (pubDate) {
        // Convert RSS pubDate to a proper Date object
        const date = new Date(pubDate);

        // Check if the date is valid
        if (!isNaN(date.getTime())) {
          validPubDate = date.toISOString();
        }
      }
    } catch (e) {
      console.error("Error parsing date:", pubDate, e);
    }

    parsedArticles.push({
      title,
      link,
      pubDate: validPubDate,
      category: mainCategory,
      description,
    });
  }

  // Sort articles by publication date (newest first)
  parsedArticles.sort((a, b) => {
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  return parsedArticles;
};
