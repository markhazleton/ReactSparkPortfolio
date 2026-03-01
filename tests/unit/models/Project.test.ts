import { describe, it, expect, vi, beforeEach } from "vitest";
import Project, { ProjectDataSchema, ProjectDataArraySchema } from "../../../src/models/Project";
import * as ProjectService from "../../../src/services/ProjectService";

describe("ProjectDataSchema", () => {
  it("should validate valid project data", () => {
    const validProject = {
      id: 1,
      image: "/img/project.png",
      p: "Test Project",
      d: "Test Description",
      h: "https://example.com",
    };

    expect(() => ProjectDataSchema.parse(validProject)).not.toThrow();
  });

  it("should reject negative project ID", () => {
    const invalidProject = {
      id: -1,
      image: "/img/project.png",
      p: "Test Project",
      d: "Test Description",
      h: "https://example.com",
    };

    expect(() => ProjectDataSchema.parse(invalidProject)).toThrow(
      "Project ID must be a positive integer"
    );
  });

  it("should reject zero project ID", () => {
    const invalidProject = {
      id: 0,
      image: "/img/project.png",
      p: "Test Project",
      d: "Test Description",
      h: "https://example.com",
    };

    expect(() => ProjectDataSchema.parse(invalidProject)).toThrow();
  });

  it("should reject fractional project ID", () => {
    const invalidProject = {
      id: 1.5,
      image: "/img/project.png",
      p: "Test Project",
      d: "Test Description",
      h: "https://example.com",
    };

    expect(() => ProjectDataSchema.parse(invalidProject)).toThrow();
  });

  it("should reject empty image path", () => {
    const invalidProject = {
      id: 1,
      image: "",
      p: "Test Project",
      d: "Test Description",
      h: "https://example.com",
    };

    expect(() => ProjectDataSchema.parse(invalidProject)).toThrow(
      "Project image path cannot be empty"
    );
  });

  it("should reject empty project title", () => {
    const invalidProject = {
      id: 1,
      image: "/img/project.png",
      p: "",
      d: "Test Description",
      h: "https://example.com",
    };

    expect(() => ProjectDataSchema.parse(invalidProject)).toThrow("Project title cannot be empty");
  });

  it("should reject empty project description", () => {
    const invalidProject = {
      id: 1,
      image: "/img/project.png",
      p: "Test Project",
      d: "",
      h: "https://example.com",
    };

    expect(() => ProjectDataSchema.parse(invalidProject)).toThrow(
      "Project description cannot be empty"
    );
  });

  it("should reject invalid URL in project link", () => {
    const invalidProject = {
      id: 1,
      image: "/img/project.png",
      p: "Test Project",
      d: "Test Description",
      h: "not-a-url",
    };

    expect(() => ProjectDataSchema.parse(invalidProject)).toThrow(
      "Project link must be a valid URL"
    );
  });

  it("should reject missing required fields", () => {
    const invalidProject = {
      id: 1,
      image: "/img/project.png",
    };

    expect(() => ProjectDataSchema.parse(invalidProject)).toThrow();
  });
});

describe("ProjectDataArraySchema", () => {
  it("should validate array of valid projects", () => {
    const validProjects = [
      {
        id: 1,
        image: "/img/project1.png",
        p: "Project 1",
        d: "Description 1",
        h: "https://example.com/1",
      },
      {
        id: 2,
        image: "/img/project2.png",
        p: "Project 2",
        d: "Description 2",
        h: "https://example.com/2",
      },
    ];

    expect(() => ProjectDataArraySchema.parse(validProjects)).not.toThrow();
  });

  it("should reject empty array", () => {
    expect(() => ProjectDataArraySchema.parse([])).toThrow("Projects array cannot be empty");
  });

  it("should reject array with invalid project", () => {
    const invalidProjects = [
      {
        id: 1,
        image: "/img/project1.png",
        p: "Project 1",
        d: "Description 1",
        h: "https://example.com/1",
      },
      {
        id: -1, // Invalid ID
        image: "/img/project2.png",
        p: "Project 2",
        d: "Description 2",
        h: "https://example.com/2",
      },
    ];

    expect(() => ProjectDataArraySchema.parse(invalidProjects)).toThrow();
  });
});

describe("Project Class", () => {
  it("should create project instance with valid data", () => {
    const project = new Project(1, "/img/test.png", "Test", "Description", "https://example.com");

    expect(project.id).toBe(1);
    expect(project.image).toBe("/img/test.png");
    expect(project.p).toBe("Test");
    expect(project.d).toBe("Description");
    expect(project.h).toBe("https://example.com");
  });

  describe("formatTitle", () => {
    it("should return title when valid", () => {
      const project = new Project(
        1,
        "/img/test.png",
        "Test Project",
        "Description",
        "https://example.com"
      );
      expect(project.formatTitle()).toBe("Test Project");
    });

    it('should return "Untitled Project" for empty title', () => {
      const project = new Project(1, "/img/test.png", "", "Description", "https://example.com");
      expect(project.formatTitle()).toBe("Untitled Project");
    });

    it('should return "Untitled Project" for whitespace-only title', () => {
      const project = new Project(1, "/img/test.png", "   ", "Description", "https://example.com");
      expect(project.formatTitle()).toBe("Untitled Project");
    });

    it("should return title as-is when non-empty after trim", () => {
      const project = new Project(
        1,
        "/img/test.png",
        "  Test  ",
        "Description",
        "https://example.com"
      );
      expect(project.formatTitle()).toBe("  Test  ");
    });
  });

  describe("formatDescription", () => {
    it("should return description when valid", () => {
      const project = new Project(
        1,
        "/img/test.png",
        "Title",
        "Test Description",
        "https://example.com"
      );
      expect(project.formatDescription()).toBe("Test Description");
    });

    it('should return "No description available." for empty description', () => {
      const project = new Project(1, "/img/test.png", "Title", "", "https://example.com");
      expect(project.formatDescription()).toBe("No description available.");
    });

    it('should return "No description available." for whitespace-only description', () => {
      const project = new Project(1, "/img/test.png", "Title", "   ", "https://example.com");
      expect(project.formatDescription()).toBe("No description available.");
    });

    it("should return description as-is when non-empty after trim", () => {
      const project = new Project(
        1,
        "/img/test.png",
        "Title",
        "  Description  ",
        "https://example.com"
      );
      expect(project.formatDescription()).toBe("  Description  ");
    });
  });

  describe("formatLink", () => {
    it("should return link when valid", () => {
      const project = new Project(
        1,
        "/img/test.png",
        "Title",
        "Description",
        "https://example.com"
      );
      expect(project.formatLink()).toBe("https://example.com");
    });

    it('should return "#" for empty link', () => {
      const project = new Project(1, "/img/test.png", "Title", "Description", "");
      expect(project.formatLink()).toBe("#");
    });

    it('should return "#" for whitespace-only link', () => {
      const project = new Project(1, "/img/test.png", "Title", "Description", "   ");
      expect(project.formatLink()).toBe("#");
    });

    it("should return link as-is when non-empty after trim", () => {
      const project = new Project(
        1,
        "/img/test.png",
        "Title",
        "Description",
        "  https://example.com  "
      );
      expect(project.formatLink()).toBe("  https://example.com  ");
    });
  });

  describe("loadProjects", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should load projects successfully", async () => {
      const mockData = [
        {
          id: 1,
          image: "/img/project1.png",
          p: "Project 1",
          d: "Description 1",
          h: "https://example.com/1",
        },
        {
          id: 2,
          image: "/img/project2.png",
          p: "Project 2",
          d: "Description 2",
          h: "https://example.com/2",
        },
      ];

      vi.spyOn(ProjectService, "fetchProjectsData").mockResolvedValue(mockData);

      const projects = await Project.loadProjects();

      expect(projects).toHaveLength(2);
      expect(projects[0]).toBeInstanceOf(Project);
      expect(projects[0].id).toBe(1);
      expect(projects[0].p).toBe("Project 1");
      expect(projects[1].id).toBe(2);
    });

    it("should return empty array when no projects available", async () => {
      vi.spyOn(ProjectService, "fetchProjectsData").mockResolvedValue([]);

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const projects = await Project.loadProjects();

      expect(projects).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith("Projects data is empty or not available.");

      consoleWarnSpy.mockRestore();
    });

    it("should return empty array when projects data is null", async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(ProjectService, "fetchProjectsData").mockResolvedValue(null as any);

      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const projects = await Project.loadProjects();

      expect(projects).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalledWith("Projects data is empty or not available.");

      consoleWarnSpy.mockRestore();
    });

    it("should handle fetch errors gracefully", async () => {
      const mockError = new Error("Network error");
      vi.spyOn(ProjectService, "fetchProjectsData").mockRejectedValue(mockError);

      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      const projects = await Project.loadProjects();

      expect(projects).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith("Error loading projects:", mockError);

      consoleErrorSpy.mockRestore();
    });

    it("should map all project properties correctly", async () => {
      const mockData = [
        {
          id: 42,
          image: "/img/special.png",
          p: "Special Project",
          d: "Special Description",
          h: "https://special.example.com",
        },
      ];

      vi.spyOn(ProjectService, "fetchProjectsData").mockResolvedValue(mockData);

      const projects = await Project.loadProjects();

      expect(projects[0].id).toBe(42);
      expect(projects[0].image).toBe("/img/special.png");
      expect(projects[0].p).toBe("Special Project");
      expect(projects[0].d).toBe("Special Description");
      expect(projects[0].h).toBe("https://special.example.com");
    });
  });
});
