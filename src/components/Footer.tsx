import React from 'react';
import { Github, Calendar3, EnvelopeFill, Linkedin } from 'react-bootstrap-icons';

// Using the injected build date constant
const buildDate = __BUILD_DATE__;

const Footer: React.FC = () => {
  return (
    <div className="container py-3">
      <div className="row align-items-center">
        {/* Copyright and Build Date */}
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="text-md-start text-center">
            <p className="mb-0">© 2024 Mark Hazleton</p>
            <small className="text-body-secondary d-flex align-items-center justify-content-md-start justify-content-center">
              <Calendar3 className="me-1" /> Build: {buildDate.substring(0, 10)}
            </small>
          </div>
        </div>

        {/* Social Links */}
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="d-flex justify-content-center gap-3">
            <a href="https://github.com/markhazleton" target="_blank" rel="noopener noreferrer" 
               className="link-secondary" aria-label="GitHub" title="GitHub">
              <Github size={22} />
            </a>
            <a href="https://www.linkedin.com/in/markhazleton/" target="_blank" rel="noopener noreferrer" 
               className="link-secondary" aria-label="LinkedIn" title="LinkedIn">
              <Linkedin size={22} />
            </a>
            <a href="mailto:contact@markhazleton.com" className="link-secondary" 
               aria-label="Email" title="Email">
              <EnvelopeFill size={22} />
            </a>
          </div>
        </div>

        {/* GitHub Repo Link */}
        <div className="col-md-4 text-md-end text-center">
          <a href="https://github.com/markhazleton/ReactSparkPortfolio" 
             className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center" 
             target="_blank" rel="noopener noreferrer">
            <Github className="me-1" /> View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;