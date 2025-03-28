import React from 'react';
import { ArrowRightCircle, Github, Linkedin, EnvelopeFill } from 'react-bootstrap-icons';
import defaultProfile from '../data/profile.json';

interface Profile {
  name: string;
  profession: string;
  introduction: string;
  ctaLink: string;
  ctaText: string;
}

const Hero: React.FC<{ profileData?: Profile }> = ({ profileData }) => {
  const profile = profileData || defaultProfile;

  // Check if profile is null or empty
  if (!profile || Object.keys(profile).length === 0) {
    return (
      <section className="bg-danger text-white text-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <h1 className="display-4">Error</h1>
              <p className="lead">Profile data is missing or unavailable.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="bg-primary text-white rounded-3 p-4 p-md-5 shadow">
              <h1 className="display-4 fw-bold">{profile.name}</h1>
              <h2 className="h4 mb-3 fw-light">{profile.profession}</h2>
              <p className="lead mb-4">{profile.introduction}</p>
              <div className="d-flex flex-wrap gap-2 mb-4">
                <a href={profile.ctaLink} 
                   className="btn btn-light d-inline-flex align-items-center">
                  {profile.ctaText} <ArrowRightCircle className="ms-2" />
                </a>
                <a href="https://github.com/markhazleton" 
                   className="btn btn-outline-light d-inline-flex align-items-center" 
                   target="_blank" rel="noopener noreferrer">
                  <Github className="me-2" /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/markhazleton/" 
                   className="btn btn-outline-light d-inline-flex align-items-center" 
                   target="_blank" rel="noopener noreferrer">
                  <Linkedin className="me-2" /> LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="card-title h4 mb-3">Quick Links</h3>
                <div className="list-group list-group-flush">
                  <a href="/about" className="list-group-item list-group-item-action d-flex align-items-center">
                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-person"></i>
                    </span>
                    Learn more about me
                  </a>
                  <a href="/projects" className="list-group-item list-group-item-action d-flex align-items-center">
                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-briefcase"></i>
                    </span>
                    View my projects
                  </a>
                  <a href="/articles" className="list-group-item list-group-item-action d-flex align-items-center">
                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-journal-text"></i>
                    </span>
                    Read my articles
                  </a>
                  <a href="mailto:contact@markhazleton.com" className="list-group-item list-group-item-action d-flex align-items-center">
                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <EnvelopeFill size={16} />
                    </span>
                    Contact me
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;