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
 * Fetches the RSS feed with fallback to local file
 * @returns Array of parsed RSS articles
 */
export const fetchRssFeed = async (): Promise<RssArticle[]> => {
  const rssSourceUrl = "https://markhazleton.com/rss.xml";

  // Determine if we're running on GitHub Pages
  const isGitHubPages =
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";

  // Use the correct path based on the deployment environment
  const localRssPath = isGitHubPages
    ? "/ReactSparkPortfolio/rss.xml" // GitHub Pages path
    : "/rss.xml"; // Local development path

  try {
    let rssData: string;
    let sourceDescription: string;

    try {
      console.log("Attempting to fetch RSS directly from source...");

      // Try direct fetch with CORS mode
      const response = await fetch(rssSourceUrl, {
        headers: {
          Accept: "application/xml, text/xml, application/rss+xml, */*",
          "Cache-Control": "no-cache",
        },
        mode: "cors",
      });

      if (!response.ok) {
        console.error(
          `Direct fetch failed: ${response.status} ${response.statusText}`
        );
        throw new Error(
          `Failed to fetch RSS: ${response.status} ${response.statusText}`
        );
      }

      rssData = await response.text();
      sourceDescription = "remote";
      console.log("Successfully fetched RSS data from remote source");
    } catch (directError) {
      console.warn("Direct fetch failed, checking cache:", directError);

      // Check if we have a cached version
      const cachedData = localStorage.getItem("cachedRssData");
      if (cachedData) {
        console.log("Using cached RSS data from localStorage");
        rssData = cachedData;
        sourceDescription = "cache";
      } else {
        console.warn("No cache available, trying local file");
        // Last resort: use the local file
        console.log(`Fetching from local file: ${localRssPath}`);
        const localResponse = await fetch(localRssPath);
        if (!localResponse.ok) {
          throw new Error(
            `Local RSS file fetch failed: ${localResponse.status}`
          );
        }
        rssData = await localResponse.text();
        sourceDescription = "local file";
        console.log("Successfully fetched RSS data from local file");
      }
    }

    // Parse the RSS data regardless of source
    const articles = parseRssData(rssData);
    console.log(
      `Successfully parsed ${articles.length} articles from RSS data`
    );

    // Store in localStorage for future fallback
    try {
      localStorage.setItem("cachedRssData", rssData);
      localStorage.setItem("rssLastUpdated", new Date().toISOString());
      localStorage.setItem("rssArticleCount", articles.length.toString());
      localStorage.setItem("rssSource", sourceDescription);
    } catch (storageError) {
      console.warn("Failed to cache RSS data:", storageError);
    }

    return articles;
  } catch (error) {
    console.error("All RSS fetching methods failed:", error);
    throw new Error(
      `Unable to load articles: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
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
    console.error(
      "XML parser error:",
      xmlDoc.getElementsByTagName("parsererror")[0].textContent
    );
    throw new Error("Error parsing XML");
  }

  const items = xmlDoc.getElementsByTagName("item");

  if (items.length === 0) {
    console.warn("No items found in RSS feed");
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
