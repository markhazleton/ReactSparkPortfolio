import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  build: {
    outDir: "docs",
  },
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/rss-feed": {
        target: "https://markhazleton.com", // Target RSS feed domain
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rss-feed/, "/rss.xml"), // Rewrite to the RSS path
        secure: true, // Set to true if you are using https
      },
    },
  },
});
