import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AppConfig from "../config/AppConfig.js";

// Get current file path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the routes in your application
const routes = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/projects", priority: 0.8, changefreq: "monthly" },
  { path: "/articles", priority: 0.8, changefreq: "weekly" },
  { path: "/joke", priority: 0.6, changefreq: "daily" },
  { path: "/weather", priority: 0.6, changefreq: "daily" },
  { path: "/variant", priority: 0.5, changefreq: "monthly" },
];

// Get domain from AppConfig
const domain = AppConfig.hostedUrl;

// Current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split("T")[0];

// Generate sitemap XML
function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${domain}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  // Write to public folder at the root level
  fs.writeFileSync(path.join(__dirname, "../../public/sitemap.xml"), sitemap);

  console.log("Sitemap generated successfully!");
}

// Export the function for use in build scripts
export default generateSitemap;

// Run directly if this is the main module
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  generateSitemap();
}
