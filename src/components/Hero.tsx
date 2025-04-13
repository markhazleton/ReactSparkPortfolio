import React from 'react';
import { ArrowRightCircle, Github, Linkedin, EnvelopeFill } from 'react-bootstrap-icons';
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
            <div className="bg-primary text-white rounded-3 p-4 p-md-5 shadow-lg" style={{ position: 'relative' }}>
              {/* Background overlay for better text contrast */}
              <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.15)',
                borderRadius: 'inherit',
                zIndex: 1
              }}></div>
              
              {/* Content with improved visibility */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h1 className="display-4 fw-bold mb-3" style={{ 
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '0.5px'
                }}>{profile.name}</h1>
                
                <h2 className="h3 mb-3 fw-light" style={{ 
                  textShadow: '1px 1px 3px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '0.5px'
                }}>{profile.profession}</h2>
                
                <p className="lead mb-4" style={{ 
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                  fontWeight: '400',
                  lineHeight: '1.6'
                }}>{profile.introduction}</p>
                
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <a href={profile.ctaLink} 
                    className="btn btn-light btn-lg d-inline-flex align-items-center">
                    {profile.ctaText} <ArrowRightCircle className="ms-2" />
                  </a>
                  <a href="https://github.com/markhazleton" 
                    className="btn btn-outline-light d-inline-flex align-items-center" 
                    target="_blank" rel="noopener noreferrer"
                    style={{ borderWidth: '2px' }}>
                    <Github className="me-2" /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/markhazleton/" 
                    className="btn btn-outline-light d-inline-flex align-items-center" 
                    target="_blank" rel="noopener noreferrer"
                    style={{ borderWidth: '2px' }}>
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
                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-person"></i>
                    </span>
                    Learn more about me
                  </a>
                  <a href="/projects" className="list-group-item list-group-item-action d-flex align-items-center border-0">
                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-briefcase"></i>
                    </span>
                    View my projects
                  </a>
                  <a href="/articles" className="list-group-item list-group-item-action d-flex align-items-center border-0">
                    <span className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px' }}>
                      <i className="bi bi-journal-text"></i>
                    </span>
                    Read my articles
                  </a>
                  <a href="mailto:contact@markhazleton.com" className="list-group-item list-group-item-action d-flex align-items-center border-0">
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