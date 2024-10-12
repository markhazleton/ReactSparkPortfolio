// src/components/Projects.tsx
import React from 'react';
import Project from '../models/Project';

function Projects() {
  const projects = Project.loadProjects(); // Load projects using the class method

  if (projects.length === 0) {
    return <p>No projects available at the moment.</p>;
  }

  return (
    <section id="projects" className="py-5">
      <div className="container">
        <h2>My Projects</h2>
        <div id="projectCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {projects.map((project: Project, index: number) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={project.id}>
                <img src={project.image} className="d-block w-100" alt={project.formatTitle()} />
                <div className="carousel-caption d-none d-md-block">
                  <h5>{project.formatTitle()}</h5>
                  <p>{project.formatDescription()}</p>
                  <a href={project.formatLink()} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* Carousel controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#projectCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#projectCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Projects;
