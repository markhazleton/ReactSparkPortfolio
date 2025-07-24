// Simple Express server for CRUD on projects.json (ESM version)
import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsPath = path.join(__dirname, '../src/data/projects.json');

console.log('Projects file path:', projectsPath);
console.log('File exists:', fs.existsSync(projectsPath));

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, '../public')));

// Get available images
app.get('/api/images', (req, res) => {
  const imagesPath = path.join(__dirname, '../public/assets/img');
  fs.readdir(imagesPath, (err, files) => {
    if (err) return res.status(500).json({ error: err.message });
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file));
    res.json(imageFiles.map(file => `assets/img/${file}`));
  });
});

// Get all projects
app.get('/api/projects', (req, res) => {
  fs.readFile(projectsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(JSON.parse(data));
  });
});

// Add a new project
app.post('/api/projects', (req, res) => {
  const newProject = req.body;
  fs.readFile(projectsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    const projects = JSON.parse(data);
    projects.push(newProject);
    fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(newProject);
    });
  });
});

// Update a project
app.put('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updated = req.body;
  fs.readFile(projectsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    let projects = JSON.parse(data);
    projects = projects.map(p => (p.id === id ? updated : p));
    fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(updated);
    });
  });
});

// Delete a project
app.delete('/api/projects/:id', (req, res) => {
  const id = parseInt(req.params.id);
  fs.readFile(projectsPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    let projects = JSON.parse(data);
    projects = projects.filter(p => p.id !== id);
    fs.writeFile(projectsPath, JSON.stringify(projects, null, 2), err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
  });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Admin API running on port ${PORT}`));
