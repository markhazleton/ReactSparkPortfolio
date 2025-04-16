import fs from "fs";
import path from "path";
import AppConfig from "../config/AppConfig";

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

// Run directly if this script is executed directly
if (require.main === module) {
  generateRobotsTxt();
}
