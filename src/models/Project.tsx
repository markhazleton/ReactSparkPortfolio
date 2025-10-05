// src/models/Project.ts
import { fetchProjectsData, ProjectData } from '../services/ProjectService';

class Project {
  id: number;
  image: string;
  p: string; // Title
  d: string; // Description
  h: string; // Link (href)

  constructor(id: number, image: string, p: string, d: string, h: string) {
    this.id = id;
    this.image = image;
    this.p = p;
    this.d = d;
    this.h = h;
  }

  static async loadProjects(): Promise<Project[]> {
    try {
      const projectsData = await fetchProjectsData();
      
      if (!projectsData || projectsData.length === 0) {
        console.warn('Projects data is empty or not available.');
        return [];
      }

      return projectsData.map(
        (proj: ProjectData) =>
          new Project(proj.id, proj.image, proj.p, proj.d, proj.h)
      );
    } catch (error) {
      console.error('Error loading projects:', error);
      return [];
    }
  }

  formatTitle(): string {
    return this.p.trim() !== '' ? this.p : 'Untitled Project';
  }

  formatDescription(): string {
    return this.d.trim() !== '' ? this.d : 'No description available.';
  }

  formatLink(): string {
    return this.h.trim() !== '' ? this.h : '#';
  }
}

export default Project;
