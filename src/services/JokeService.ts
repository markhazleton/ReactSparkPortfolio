import axios, { AxiosError } from "axios";

export interface Joke {
  error: boolean;
  type: "single" | "twopart";
  joke?: string;
  setup?: string;
  delivery?: string;
  category: string;
  flags?: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  id: number;
  safe?: boolean;
  lang?: string;
}

class JokeService {
  private static instance: JokeService;
  private cache: Map<string, { data: Joke; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  private constructor() {}

  public static getInstance(): JokeService {
    if (!JokeService.instance) {
      JokeService.instance = new JokeService();
    }
    return JokeService.instance;
  }

  /**
   * Get the appropriate API URL based on environment
   */
  private getApiUrl(): string {
    // In development, use the Vite proxy
    if (import.meta.env.DEV) {
      return "/api/joke";
    }
    // In production, use the Azure Function
    return "/api/proxy-joke";
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Get cache key for the request
   */
  private getCacheKey(
    category: string = "Any",
    safeMode: boolean = true
  ): string {
    return `${category}-${safeMode}`;
  }

  /**
   * Fetch a random joke
   */
  public async fetchJoke(
    category: string = "Any",
    safeMode: boolean = true
  ): Promise<Joke> {
    // Don't use cache for jokes - we want fresh jokes each time
    // But we could implement a short cache to prevent spam requests

    try {
      const url = this.getApiUrl();
      const params = new URLSearchParams();

      if (category !== "Any") {
        params.append("category", category);
      }
      if (!safeMode) {
        params.append("safeMode", "false");
      }

      const queryString = params.toString();
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      console.log(`Fetching joke from: ${fullUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await axios.get(fullUrl, {
        signal: controller.signal,
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent": "ReactSparkPortfolio/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (!response.data) {
        throw new Error("No data received from joke API");
      }

      if (response.data.error) {
        throw new Error(
          `Joke API error: ${response.data.message || "Unknown error"}`
        );
      }

      const joke: Joke = response.data;
      console.log(
        `Successfully fetched joke: ${joke.type} joke in ${joke.category} category`
      );

      return joke;
    } catch (error) {
      console.error("Error fetching joke:", error);

      // Return a fallback joke
      const fallbackJoke: Joke = {
        error: false,
        category: "Programming",
        type: "single",
        joke: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
        flags: {
          nsfw: false,
          religious: false,
          political: false,
          racist: false,
          sexist: false,
          explicit: false,
        },
        id: Math.floor(Math.random() * 1000000), // Random ID for fallback
        safe: true,
        lang: "en",
      };

      if (error instanceof AxiosError) {
        if (error.code === "ECONNABORTED") {
          console.log("Joke request timed out, using fallback");
        } else if (error.response?.status) {
          console.log(
            `Joke API responded with status ${error.response.status}, using fallback`
          );
        } else {
          console.log("Network error fetching joke, using fallback");
        }
      }

      return fallbackJoke;
    }
  }

  /**
   * Get available joke categories
   */
  public getCategories(): string[] {
    return [
      "Any",
      "Programming",
      "Miscellaneous",
      "Dark",
      "Pun",
      "Spooky",
      "Christmas",
    ];
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
    console.log("Joke cache cleared");
  }
}

export default JokeService.getInstance();
