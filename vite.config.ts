import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "fs";
import strip from "@rollup/plugin-strip";

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
      "@webfonts": "/webfonts", // Alias for webfonts
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Allow importing from node_modules
        includePaths: ["node_modules"],
      },
    },
  },
  assetsInclude: ["**/*.woff", "**/*.woff2", "**/*.ttf", "**/*.eot"], // Include font files as assets
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
      "/api/rss": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/rss/, "/rss.xml"),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/api/joke": {
        target: "https://v2.jokeapi.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/joke/, "/joke/Any?safe-mode"),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("joke proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(
              "Sending Joke Request to the Target:",
              req.method,
              req.url
            );
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Joke Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/api/projects": {
        target: "https://markhazleton.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/projects/, "/projects.json"),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("projects proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log(
              "Sending Projects Request to the Target:",
              req.method,
              req.url
            );
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Projects Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
  esbuild: {
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
  },
});
