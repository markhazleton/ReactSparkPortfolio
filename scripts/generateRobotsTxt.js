/**
 * Simple robots.txt generator (ES modules version)
 * This file is meant to be executed directly with Node.js
 * Following Azure best practices for error handling and reliability
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generates a robots.txt file with hardcoded values for reliability
 * Following Azure best practices for error handling and reliability
 */
function generateRobotsTxt() {
  // Hardcode the URL to avoid import issues
  const sitemapUrl = process.env.SITE_URL || "https://reactspark.markhazleton.com";
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /assets/

Sitemap: ${sitemapUrl}/sitemap.xml`;

  try {
    // Get project root (1 level up from this file in scripts/)
    const projectRoot = path.resolve(__dirname, "..");
    
    // Target both the docs directory (build output) and public directory (dev mode)
    const targetDirs = [
      path.join(projectRoot, "docs"),
      path.join(projectRoot, "public"),
      path.join(projectRoot, "src", "public")
    ];
    
    console.log("Project root:", projectRoot);
    console.log("Target directories:", targetDirs);
    
    // Ensure directories exist and write files with proper error handling
    let success = false;
    for (const dir of targetDirs) {
      try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(dir)) {
          try {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
          } catch (mkdirError) {
            console.error(`Cannot create directory ${dir}: ${mkdirError.message}`);
            continue; // Skip this directory and try the next one
          }
        }
        
        // Write the file with proper error handling
        try {
          fs.writeFileSync(path.join(dir, "robots.txt"), robotsTxt);
          console.log(`robots.txt generated successfully in ${dir}`);
          success = true;
        } catch (writeError) {
          console.error(`Cannot write to ${dir}/robots.txt: ${writeError.message}`);
        }
      } catch (dirError) {
        console.error(`Error processing directory ${dir}: ${dirError.message}`);
      }
    }
    
    if (!success) {
      console.error("Failed to write robots.txt to any directory");
      // Don't throw to prevent build process from failing
    } else {
      console.log("robots.txt generation completed successfully");
    }
  } catch (error) {
    console.error(`Error generating robots.txt: ${error.message}`);
    // Log error but don't exit process with error code
  }
}

// Run the function immediately
generateRobotsTxt();

// Export for potential use in build scripts
export default generateRobotsTxt;