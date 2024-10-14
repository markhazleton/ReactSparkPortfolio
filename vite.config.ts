import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import * as dotenv from "dotenv";
import { viteStaticCopy } from "vite-plugin-static-copy";

// Load environment variables based on the current NODE_ENV or default to `.env`
const envFileName = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFileName });

// Get the current date-time during the build
const buildDate = new Date().toISOString();

console.log("VITE_BASE_URL:", process.env.VITE_BASE_URL); // Add this to debug

export default defineConfig({
  base: process.env.VITE_BASE_URL || "/",
  build: {
    outDir: "docs",
  },
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  resolve: {
    alias: {
      "react-native": "react-native-web", // Alias for react-native-web
      '@webfonts': '/webfonts', // Alias for webfonts
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/fontawesome-free/webfonts/*", // Update this to the correct path for your fonts
          dest: "webfonts", // This will copy to 'dist/webfonts'
        },
      ],
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
