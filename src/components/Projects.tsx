import React, { useState } from 'react';
import Project from '../models/Project';
import { ArrowRightCircle, Github, Search } from 'react-bootstrap-icons';

function Projects() {
  const projects = Project.loadProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Extract unique categories from project descriptions
  const categories = ['all', ...new Set(projects.map(p => {
    // Extract category-like words from description
    const words = p.d.toLowerCase().split(' ');
    return words.find(w => w.includes('cms')) || 'other';
  }))];
  
  // Filter projects based on search term and category
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.p.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.d.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      project.d.toLowerCase().includes(filter.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  if (projects.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No projects available at the moment.
      </div>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center mb-5">My Projects</h2>
        
        {/* Search and Filter */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <Search />
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="btn-group w-100">
              {categories.map(category => (
                <button
                  key={category}
                  className={`btn ${filter === category ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Project Cards */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredProjects.map((project: Project) => (
            <div className="col" key={project.id}>
              <div className="card h-100 shadow-sm hover-shadow transition">
                <img 
                  src={project.image} 
                  className="card-img-top" 
                  alt={project.formatTitle()}
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{project.formatTitle()}</h5>
                  <p className="card-text small text-muted">
                    {project.formatDescription()}
                  </p>
                </div>
                <div className="card-footer bg-white border-top-0 d-flex justify-content-between">
                  <a 
                    href={project.formatLink()} 
                    className="btn btn-sm btn-outline-primary d-flex align-items-center" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    Visit Site <ArrowRightCircle className="ms-1" />
                  </a>
                  {project.formatLink().includes('github.com') && (
                    <a 
                      href={project.formatLink()} 
                      className="btn btn-sm btn-outline-dark d-flex align-items-center" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Github className="me-1" /> Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="alert alert-warning mt-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            No projects match your search criteria. Try different terms or clear filters.
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;