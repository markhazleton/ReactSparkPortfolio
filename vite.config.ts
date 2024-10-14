import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Get the current date-time during the build
const buildDate = new Date().toISOString();



export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  build: {
    outDir: "docs",
  },
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',  // Alias for react-native-web
    },
  },
  plugins: [react()],
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
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});
