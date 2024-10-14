import React from 'react';
import Project from '../models/Project';
import { ArrowRightCircle } from 'react-bootstrap-icons'; // Import Bootstrap Icons

function Projects() {
  const projects = Project.loadProjects(); // Load projects using the class method

  if (projects.length === 0) {
    return <p className="text-center mt-5">No projects available at the moment.</p>;
  }

  return (
    <section id="projects" className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5">My Projects</h2>

        {/* Carousel with auto-rotation and visible navigation controls */}
        <div
          id="projectCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
          data-bs-interval="3000" // 3 seconds auto-rotation interval
        >
          <div className="carousel-inner">
            {projects.map((project: Project, index: number) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={project.id}>
                {/* Image container with overlay to prevent text from overlapping */}
                <div className="position-relative">
                  <img src={project.image} className="d-block w-100 img-fluid rounded" alt={project.formatTitle()} />
                  <div className="carousel-caption d-md-block text-bg-dark p-3 rounded-3" style={{ bottom: '20px', left: '10%', right: '10%' }}>
                    <h5 className="text-white">{project.formatTitle()}</h5>
                    <p className="text-white">{project.formatDescription()}</p>
                    <a
                      href={project.formatLink()}
                      className="btn btn-primary btn-lg d-inline-flex align-items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project <ArrowRightCircle className="ms-2" size={20} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visible Carousel controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#projectCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#projectCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Projects;
