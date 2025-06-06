import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as dotenv from "dotenv";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "fs";
import strip from "@rollup/plugin-strip";

// Load environment variables based on the current NODE_ENV or default to `.env`
const envFileName = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFileName });

// Get the current date-time during the build
const buildDate = new Date().toISOString();

console.log("VITE_BASE_URL:", process.env.VITE_BASE_URL); // Add this to debug

// Function to create .nojekyll file
const createNoJekyllFile = () => {
  return {
    name: "create-nojekyll-file",
    closeBundle: () => {
      fs.writeFileSync("docs/.nojekyll", "");
    },
  };
};

export default defineConfig({
  // Set base path explicitly to "/" for Azure Static Web Apps
  // This ensures assets are served from the correct location
  base: "/",
  build: {
    outDir: "docs",
  },
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  resolve: {
    alias: {
      "react-native": "react-native-web", // Alias for react-native-web
      "@webfonts": "/webfonts", // Alias for webfonts
    },
  },
  plugins: [
    react(),
    createNoJekyllFile(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/fontawesome-free/webfonts/*", // Ensure all FontAwesome fonts are copied
          dest: "webfonts", // Copy to 'docs/webfonts'
        },
        {
          src: "src/data/rss.xml",
          dest: "src/data", // Copy RSS file to the build output
        },
      ],
    }),
    strip({
      include: "**/*.js",
      functions: ["console.*", "assert.*"],
    }),
  ],
  server: {
    port: 3000,
    proxy: {
      "/rss-feed": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss-feed/, "/rss.xml"),
        secure: true,
      },
    },
  },
  esbuild: {
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
});
