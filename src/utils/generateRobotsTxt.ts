import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AppConfig from "../config/AppConfig.js";

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a robots.txt file with the correct domain
 */
function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /assets/

Sitemap: ${AppConfig.hostedUrl}/sitemap.xml`;

  // Write to public folder
  fs.writeFileSync(path.join(__dirname, "../public/robots.txt"), robotsTxt);

  console.log("robots.txt generated successfully!");
}

// Export the function for use in build scripts
export default generateRobotsTxt;

// Run directly if this is the main module
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  generateRobotsTxt();
}
