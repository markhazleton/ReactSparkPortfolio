import React from 'react';
import { Github, Calendar3, EnvelopeFill, Linkedin, Clock } from 'react-bootstrap-icons';

// Using the injected build date constant
const buildDate = __BUILD_DATE__;

// Format the build date and time in Central Standard Time
const formatBuildDateTime = () => {
  try {
    const date = new Date(buildDate);
    
    // Format to Central Standard Time (UTC-6)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Chicago',
      timeZoneName: 'short'
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting build date:', error);
    return buildDate;
  }
};

const Footer: React.FC = () => {
  return (
    <div className="container py-3">
      <div className="row align-items-center">
        {/* Copyright and Build Date */}
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="text-md-start text-center">
            <p className="mb-0">© 2025 <a href="https://markhazleton.com" className="text-decoration-none">ReactSpark</a> by Mark Hazleton</p>
            <small className="text-body-secondary d-flex align-items-center justify-content-md-start justify-content-center">
              <Calendar3 className="me-1" /> <Clock className="ms-2 me-1" /> Build: {formatBuildDateTime()}
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