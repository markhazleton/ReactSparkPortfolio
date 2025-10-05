/**
 * Service for fetching Projects data with fallback to local file
 */
import projectsData from "../data/projects.json";

// Define a type for Project items matching the JSON structure
export interface ProjectData {
  id: number;
  image: string;
  p: string; // Title
  d: string; // Description
  h: string; // Link (href)
}

/**
 * Fetches the projects data with fallback to local file
 * @returns Array of project data
 */
export const fetchProjectsData = async (): Promise<ProjectData[]> => {
  // Determine if we're in development mode
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // Use proxy in development, direct URL in production
  const projectsSourceUrl = isDevelopment
    ? "/api/projects" // Use Vite proxy in development
    : "/api/proxy-projects"; // Use Azure Function proxy in production

  try {
    let projectsJsonData: ProjectData[];
    let sourceDescription: string;

    // Check cache first to avoid unnecessary network requests
    const cachedData = localStorage.getItem("cachedProjectsData");
    const lastUpdated = localStorage.getItem("projectsLastUpdated");
    const cacheAge = lastUpdated
      ? Date.now() - new Date(lastUpdated).getTime()
      : Infinity;
    const maxCacheAge = 1000 * 60 * 60; // 1 hour cache for projects

    // Use cache if it's fresh (less than 1 hour old)
    if (cachedData && cacheAge < maxCacheAge) {
      console.log("Using fresh cached Projects data");
      const projects = JSON.parse(cachedData);
      console.log(
        `Successfully loaded ${projects.length} projects from cached data`
      );
      return projects;
    }

    try {
      console.log("Attempting to fetch Projects directly from source...");

      // Try direct fetch with CORS mode and shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(projectsSourceUrl, {
        headers: {
          Accept: "application/json, */*",
          "Cache-Control": "no-cache",
        },
        mode: "cors",
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(
          `Direct fetch failed: ${response.status} ${response.statusText}`
        );
        throw new Error(
          `Failed to fetch Projects: ${response.status} ${response.statusText}`
        );
      }

      projectsJsonData = await response.json();
      sourceDescription = "remote";
      console.log("Successfully fetched Projects data from remote source");
    } catch (directError) {
      console.warn("Direct fetch failed, checking cache:", directError);

      // Check if we have any cached version (even if stale)
      if (cachedData) {
        console.log(
          "Using cached Projects data from localStorage (potentially stale)"
        );
        projectsJsonData = JSON.parse(cachedData);
        sourceDescription = "cache";
      } else {
        console.warn("No cache available, using local file");
        // Last resort: use the local file data
        console.log("Using embedded local projects data");
        projectsJsonData = projectsData as ProjectData[];
        sourceDescription = "local file";
        console.log("Successfully loaded Projects data from local file");
      }
    }

    // Validate the data structure
    if (!Array.isArray(projectsJsonData)) {
      console.error("Projects data is not an array:", projectsJsonData);
      throw new Error("Invalid projects data format");
    }

    // Validate each project has required fields and transform image URLs
    const validatedProjects = projectsJsonData.filter((project) => {
      if (
        typeof project.id === "number" &&
        typeof project.image === "string" &&
        typeof project.p === "string" &&
        typeof project.d === "string" &&
        typeof project.h === "string"
      ) {
        // Transform relative image URLs to absolute URLs pointing to markhazleton.com
        if (project.image && !project.image.startsWith("http")) {
          // Remove leading slash if present, then add the base URL
          const imagePath = project.image.startsWith("/")
            ? project.image.substring(1)
            : project.image;
          project.image = `https://markhazleton.com/${imagePath}`;
        }
        return true;
      } else {
        console.warn("Invalid project data structure:", project);
        return false;
      }
    });

    console.log(
      `Successfully validated ${validatedProjects.length} projects from ${sourceDescription}`
    );

    // Store in localStorage for future fallback (only if from remote source)
    if (sourceDescription === "remote") {
      try {
        localStorage.setItem(
          "cachedProjectsData",
          JSON.stringify(validatedProjects)
        );
        localStorage.setItem("projectsLastUpdated", new Date().toISOString());
        localStorage.setItem(
          "projectsCount",
          validatedProjects.length.toString()
        );
        localStorage.setItem("projectsSource", sourceDescription);
      } catch (storageError) {
        console.warn("Failed to cache Projects data:", storageError);
      }
    }

    return validatedProjects;
  } catch (error) {
    console.error("All Projects fetching methods failed:", error);

    // Final fallback to embedded local data
    console.log("Using final fallback to embedded local projects data");
    return projectsData as ProjectData[];
  }
};

/**
 * Clears the projects cache
 */
export const clearProjectsCache = (): void => {
  try {
    localStorage.removeItem("cachedProjectsData");
    localStorage.removeItem("projectsLastUpdated");
    localStorage.removeItem("projectsCount");
    localStorage.removeItem("projectsSource");
    console.log("Projects cache cleared successfully");
  } catch (error) {
    console.warn("Failed to clear projects cache:", error);
  }
};

/**
 * Gets cache information
 */
export const getProjectsCacheInfo = () => {
  const lastUpdated = localStorage.getItem("projectsLastUpdated");
  const count = localStorage.getItem("projectsCount");
  const source = localStorage.getItem("projectsSource");

  return {
    lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
    count: count ? parseInt(count, 10) : 0,
    source: source || "unknown",
    hasCache: !!localStorage.getItem("cachedProjectsData"),
  };
};
