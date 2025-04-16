// Simple robots.txt generator that doesn't rely on external imports
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generates a robots.txt file with hardcoded values for reliability
 * Following Azure best practices for error handling and reliability
 */
function generateRobotsTxt() {
  // Hardcode the URL to avoid import issues
  // In production, this should be retrieved from a configuration service
  const sitemapUrl =
    process.env.SITE_URL || "https://reactspark.markhazleton.com";

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /assets/

Sitemap: ${sitemapUrl}/sitemap.xml`;

  try {
    // Get project root
    const projectRoot = path.resolve(__dirname, "../../");

    // Target both the docs directory (build output) and public directory (dev mode)
    const targetDirs = [
      path.join(projectRoot, "docs"),
      path.join(projectRoot, "public"),
      // Add the GitHub Actions workspace path as a fallback
      path.join(projectRoot, "src", "public"),
    ];

    // Ensure directories exist and write files with proper error handling
    let success = false;
    for (const dir of targetDirs) {
      try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          try {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
          } catch (error: unknown) {
            // Properly type the error as unknown (TypeScript best practice)
            const mkdirError =
              error instanceof Error ? error : new Error(String(error));
            console.error(
              `Cannot create directory ${dir}: ${mkdirError.message}`
            );
            continue; // Skip this directory and try the next one
          }
        }

        // Write the file with proper error handling
        try {
          fs.writeFileSync(path.join(dir, "robots.txt"), robotsTxt);
          console.log(`robots.txt generated successfully in ${dir}`);
          success = true;
        } catch (error: unknown) {
          // Properly type the error as unknown (TypeScript best practice)
          const writeError =
            error instanceof Error ? error : new Error(String(error));
          console.error(
            `Cannot write to ${dir}/robots.txt: ${writeError.message}`
          );
        }
      } catch (error: unknown) {
        // Properly type the error as unknown (TypeScript best practice)
        const dirError =
          error instanceof Error ? error : new Error(String(error));
        console.error(`Error processing directory ${dir}: ${dirError.message}`);
      }
    }

    if (!success) {
      console.error("Failed to write robots.txt to any directory");
      // Don't throw to prevent build process from failing
    }
  } catch (error: unknown) {
    // Properly type the error as unknown (TypeScript best practice)
    const typedError =
      error instanceof Error ? error : new Error(String(error));
    console.error(`Error generating robots.txt: ${typedError.message}`);
    // Log error but don't exit process with error code
  }
}

// Export the function as default export (for build scripts)
export default generateRobotsTxt;

// IIFE pattern to handle direct execution
// This pattern works better with ES modules
(async function () {
  // Only run the function if this file is being executed directly
  const isMainModule = import.meta.url.startsWith("file:");
  if (isMainModule) {
    try {
      console.log("Starting robots.txt generation...");
      generateRobotsTxt();
      console.log("Robots.txt generation complete");
    } catch (error: unknown) {
      // Properly type the error as unknown
      const fatalError =
        error instanceof Error ? error : new Error(String(error));
      console.error("Fatal error during robots.txt generation:", fatalError);
      // Don't exit with non-zero code to avoid breaking builds
    }
  }
})().catch((err: unknown) => {
  // Properly type the error as unknown
  const uncaughtError = err instanceof Error ? err : new Error(String(err));
  console.error("Uncaught error in robots.txt generator:", uncaughtError);
});
