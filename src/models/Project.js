// src/models/Project.ts
import projectsData from '../data/projects.json'; // Adjust the path accordingly
class Project {
    id;
    image;
    p; // Title
    d; // Description
    h; // Link (href)
    constructor(id, image, p, d, h) {
        this.id = id;
        this.image = image;
        this.p = p;
        this.d = d;
        this.h = h;
    }
    static loadProjects() {
        if (!projectsData || projectsData.length === 0) {
            console.warn('Projects file is empty or not available.');
            return [];
        }
        return projectsData.map((proj) => new Project(proj.id, proj.image, proj.p, proj.d, proj.h));
    }
    formatTitle() {
        return this.p.trim() !== '' ? this.p : 'Untitled Project';
    }
    formatDescription() {
        return this.d.trim() !== '' ? this.d : 'No description available.';
    }
    formatLink() {
        return this.h.trim() !== '' ? this.h : '#';
    }
}
export default Project;
