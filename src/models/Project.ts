// src/models/Project.ts
import { z } from "zod";
import { fetchProjectsData } from "../services/ProjectService";

/**
 * Validation schema for individual project data from external API
 */
export const ProjectDataSchema = z.object({
  id: z.number().int().positive({
    message: "Project ID must be a positive integer",
  }),
  image: z.string().min(1, {
    message: "Project image path cannot be empty",
  }),
  p: z.string().min(1, {
    message: "Project title cannot be empty",
  }),
  d: z.string().min(1, {
    message: "Project description cannot be empty",
  }),
  h: z.string().url({
    message: "Project link must be a valid URL",
  }),
});

/**
 * Validation schema for array of projects from API endpoint
 */
export const ProjectDataArraySchema = z.array(ProjectDataSchema).min(1, {
  message: "Projects array cannot be empty",
});

// Inferred TypeScript types
export type ProjectData = z.infer<typeof ProjectDataSchema>;
export type ProjectDataArray = z.infer<typeof ProjectDataArraySchema>;

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
        console.warn("Projects data is empty or not available.");
        return [];
      }

      return projectsData.map(
        (proj: ProjectData) => new Project(proj.id, proj.image, proj.p, proj.d, proj.h)
      );
    } catch (error) {
      console.error("Error loading projects:", error);
      return [];
    }
  }

  formatTitle(): string {
    return this.p.trim() !== "" ? this.p : "Untitled Project";
  }

  formatDescription(): string {
    return this.d.trim() !== "" ? this.d : "No description available.";
  }

  formatLink(): string {
    return this.h.trim() !== "" ? this.h : "#";
  }
}

export default Project;
