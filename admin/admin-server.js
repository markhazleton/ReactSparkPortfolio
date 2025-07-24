// Simple HTTP server to serve the admin interface on port 8000
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Proxy requests for /public/* to the API server on port 3001
app.use('/public', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true
}));

// Proxy requests for /assets/* to the API server's /public/assets/*
app.use('/assets', createProxyMiddleware({
  target: 'http://localhost:3001/public',
  changeOrigin: true
}));

// Serve static files from the admin directory
app.use(express.static(__dirname));

// Serve the admin interface at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Admin interface running on http://localhost:${PORT}`);
  console.log('Make sure the API server is running on port 3001');
  console.log('Image proxy: /assets/* -> http://localhost:3001/public/assets/*');
  console.log('Image proxy: /public/* -> http://localhost:3001/public/*');
});
