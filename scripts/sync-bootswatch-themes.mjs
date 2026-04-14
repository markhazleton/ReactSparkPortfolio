import fs from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const sourceRoot = path.join(workspaceRoot, "node_modules", "bootswatch", "dist");
const publicThemesRoot = path.join(workspaceRoot, "public", "themes");

if (!fs.existsSync(sourceRoot)) {
  console.warn("Bootswatch dist folder not found; skipping theme sync.");
  process.exit(0);
}

const stripGoogleFontsImports = (cssContent) =>
  cssContent.replace(/@import\s+url\(https:\/\/fonts\.googleapis\.com\/[^)]+\);?/g, "");

const themeDirectories = fs
  .readdirSync(sourceRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory());

for (const themeDirectory of themeDirectories) {
  const sourceCssPath = path.join(sourceRoot, themeDirectory.name, "bootstrap.min.css");
  if (!fs.existsSync(sourceCssPath)) {
    continue;
  }

  const destinationDirectory = path.join(publicThemesRoot, themeDirectory.name);
  const destinationCssPath = path.join(destinationDirectory, "bootstrap.min.css");

  fs.mkdirSync(destinationDirectory, { recursive: true });

  const cssContent = fs.readFileSync(sourceCssPath, "utf8");
  const sanitizedCssContent = stripGoogleFontsImports(cssContent);

  fs.writeFileSync(destinationCssPath, sanitizedCssContent, "utf8");
}

console.log(`Synchronized ${themeDirectories.length} Bootswatch themes into public/themes.`);