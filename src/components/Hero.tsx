import React, { useEffect } from 'react';
import { ArrowRightCircle, Github, Linkedin, EnvelopeFill, JournalText, Braces, Bootstrap } from 'react-bootstrap-icons';
import defaultProfile from '../data/profile.json';
import { useTheme } from '../contexts/ThemeContext';

interface Profile {
  name: string;
  profession: string;
  introduction: string;
  ctaLink: string;
  ctaText: string;
}

const Hero: React.FC<{ profileData?: Profile }> = ({ profileData }) => {
  const profile = profileData || defaultProfile;
  const { theme } = useTheme();

  // Update document title and meta description dynamically
  useEffect(() => {
    // Update the document title
    const pageTitle = `${profile.name} | ${profile.profession}`;
    document.title = pageTitle;
    
    // Update meta description
    const pageDescription = `Portfolio website of ${profile.name}, a ${profile.profession.toLowerCase()}. ${profile.introduction}`;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    }
  }, [profile]);

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
    <section className="hero-section py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="bg-information text-white rounded-3 p-4 p-md-5 shadow-lg position-relative">
              {/* Background overlay for better text contrast */}
              <div className="position-absolute top-0 start-0 end-0 bottom-0 bg-overlay rounded-3"></div>
              
              {/* Content with improved visibility */}
              <div className="position-relative z-2">
                <h1 className="display-4 fw-bold mb-3 text-shadow">
                  {profile.name}
                </h1>
                
                <h2 className="h3 mb-3 fw-light text-shadow-sm">
                  {profile.profession}
                </h2>
                
                <p className="lead mb-4 text-shadow-sm">
                  {profile.introduction}
                </p>
                
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <a href={profile.ctaLink} 
                    className="btn btn-light btn-lg d-inline-flex align-items-center"
                    aria-label={profile.ctaText}>
                    {profile.ctaText} <ArrowRightCircle className="ms-2" />
                  </a>
                  <a href="https://github.com/markhazleton" 
                    className="btn btn-outline-light d-inline-flex align-items-center border-2" 
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Visit Mark Hazleton on GitHub">
                    <Github className="me-2" /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/markhazleton/" 
                    className="btn btn-outline-light d-inline-flex align-items-center border-2" 
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Connect with Mark Hazleton on LinkedIn">
                    <Linkedin className="me-2" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border shadow-sm">
              <div className="card-body">
                <h3 className="card-title h4 mb-3">Quick Links</h3>
                <div className="list-group list-group-flush">
                  <a href="/about" className="list-group-item list-group-item-action d-flex align-items-center border-0">
                    <span className="bg-information text-white rounded-circle d-flex align-items-center justify-content-center me-3 icon-circle">
                      <i className="bi bi-person"></i>
                    </span>
                    Learn more about me
                  </a>
                  <a href="/projects" className="list-group-item list-group-item-action d-flex align-items-center border-0">
                    <span className="bg-information text-white rounded-circle d-flex align-items-center justify-content-center me-3 icon-circle">
                      <i className="bi bi-briefcase"></i>
                    </span>
                    View my projects
                  </a>
                  <a href="/articles" className="list-group-item list-group-item-action d-flex align-items-center border-0">
                    <span className="bg-information text-white rounded-circle d-flex align-items-center justify-content-center me-3 icon-circle">
                      <i className="bi bi-journal-text"></i>
                    </span>
                    Read my articles
                  </a>
                </div>
              </div>
            </div>

            {/* Technology Stack Section */}
            <div className="card border shadow-sm mt-4">
              <div className="card-body">
                <h3 className="card-title h4 mb-3">Built With</h3>
                <p className="text-muted mb-3">This portfolio is built using modern web technologies:</p>
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-information d-flex align-items-center p-2">
                    <Braces className="me-1" /> React 19
                  </span>
                  <span className="badge bg-info text-dark d-flex align-items-center p-2">
                    <i className="bi bi-filetype-tsx me-1"></i> TypeScript
                  </span>
                  <span className="badge bg-success d-flex align-items-center p-2">
                    <i className="bi bi-lightning-charge me-1"></i> Vite
                  </span>
                  <span className="badge bg-secondary d-flex align-items-center p-2">
                    <Bootstrap className="me-1" /> Bootstrap 5
                  </span>
                  <span className="badge bg-warning text-dark d-flex align-items-center p-2">
                    <i className="bi bi-cup-hot me-1"></i> SCSS
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <a href="https://markhazleton.com/articles/building-my-first-react-site-using-vite.html" 
                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
                    target="_blank" rel="noopener noreferrer">
                    <JournalText className="me-1" /> Read About This Project
                  </a>
                  
                  <a href="https://github.com/markhazleton/ReactSparkPortfolio" 
                    className="btn btn-sm btn-outline-dark d-inline-flex align-items-center"
                    target="_blank" rel="noopener noreferrer">
                    <Github className="me-1" /> View Source
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