import React, { useEffect } from 'react';
import { ArrowRightCircle, Github, Linkedin, EnvelopeFill, JournalText, Braces, Bootstrap, Person, Briefcase, FileEarmarkCode, LightningCharge, CupHot, CodeSquare, Gear } from 'react-bootstrap-icons';
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
        {/* Row 1: Main Information Section (Centered, Full Width) */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="bg-information text-white rounded-3 p-4 p-md-5 shadow-lg position-relative text-center">
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
                
                <p className="lead mb-4 text-shadow-sm mx-auto" style={{maxWidth: "800px"}}>
                  {profile.introduction}
                </p>
                
                <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
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
        </div>

        {/* Row 2: Quick Links and Technology Stack in 2 columns */}
        <div className="row mb-5">
          {/* Quick Links Column */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="card border shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title h4 mb-3 d-flex align-items-center">
                  <Briefcase className="text-primary me-2" /> Quick Links
                </h3>
                <div className="list-group list-group-flush">
                  <a href="/about" className="list-group-item list-group-item-action d-flex align-items-center border-0">
                    <span className="bg-information text-white rounded-circle d-flex align-items-center justify-content-center me-3 icon-circle">
                      <Person />
                    </span>
                    Learn more about me
                  </a>
                  <a href="/projects" className="list-group-item list-group-item-action d-flex align-items-center border-0">
                    <span className="bg-information text-white rounded-circle d-flex align-items-center justify-content-center me-3 icon-circle">
                      <Briefcase />
                    </span>
                    View my projects
                  </a>
                  <a href="/articles" className="list-group-item list-group-item-action d-flex align-items-center border-0">
                    <span className="bg-information text-white rounded-circle d-flex align-items-center justify-content-center me-3 icon-circle">
                      <JournalText />
                    </span>
                    Read my articles
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Technology Stack Column */}
          <div className="col-lg-6">
            <div className="card border shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title h4 mb-3 d-flex align-items-center">
                  <CodeSquare className="text-primary me-2" /> Built With
                </h3>
                <p className="text-muted mb-3">This portfolio is built using modern web technologies:</p>
                
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-information d-flex align-items-center p-2">
                    <Braces className="me-1" /> React 19
                  </span>
                  <span className="badge bg-info text-dark d-flex align-items-center p-2">
                    <FileEarmarkCode className="me-1" /> TypeScript
                  </span>
                  <span className="badge bg-success d-flex align-items-center p-2">
                    <LightningCharge className="me-1" /> Vite
                  </span>
                  <span className="badge bg-secondary d-flex align-items-center p-2">
                    <Bootstrap className="me-1" /> Bootstrap 5
                  </span>
                  <span className="badge bg-warning text-dark d-flex align-items-center p-2">
                    <CupHot className="me-1" /> SCSS
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
        
        {/* Row 3: GitHub Pages Deployment (Full Width) */}
        <div className="row">
          <div className="col-12">
            <div className="card border shadow-sm">
              <div className="card-body">
                <h3 className="card-title h4 mb-3 d-flex align-items-center">
                  <Github className="text-primary me-2" /> GitHub Pages Deployment Guide
                </h3>
                
                <p className="mb-4">
                  Deploying a React Vite application to GitHub Pages requires several specific steps to ensure
                  it functions correctly in the GitHub.io environment. Here's a detailed guide on how this portfolio
                  was created and deployed:
                </p>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-3 shadow-sm">
                      <div className="card-header bg-light d-flex align-items-center">
                        <Gear className="text-primary me-2" /> <strong>Setup & Configuration</strong>
                      </div>
                      <div className="card-body">
                        <ol className="mb-0 ps-3 small">
                          <li className="mb-2">
                            <strong>Create a Vite React project:</strong>
                            <code className="d-block mt-1 p-2 bg-light rounded">npm create vite@latest ReactSparkPortfolio --template react-ts</code>
                          </li>
                          <li className="mb-2">
                            <strong>Configure the base URL in vite.config.ts:</strong>
                            <code className="d-block mt-1 p-2 bg-light rounded">base: '/ReactSparkPortfolio/'</code>
                          </li>
                          <li className="mb-2">
                            <strong>Update build output directory to 'docs':</strong>
                            <code className="d-block mt-1 p-2 bg-light rounded">build: {`{ outDir: 'docs' }`}</code>
                          </li>
                          <li className="mb-2">
                            <strong>Add dynamic path resolution:</strong>
                            <p className="mt-1 mb-0">Implement detection of GitHub Pages environment to adjust asset paths</p>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card mb-3 shadow-sm">
                      <div className="card-header bg-light d-flex align-items-center">
                        <Github className="text-primary me-2" /> <strong>Deployment Process</strong>
                      </div>
                      <div className="card-body">
                        <ol className="mb-0 ps-3 small">
                          <li className="mb-2">
                            <strong>Build the project:</strong>
                            <code className="d-block mt-1 p-2 bg-light rounded">npm run build</code>
                          </li>
                          <li className="mb-2">
                            <strong>Configure GitHub repository:</strong>
                            <p className="mt-1 mb-0">
                              Set repository settings to deploy from the 'docs' folder in the main branch
                            </p>
                          </li>
                          <li className="mb-2">
                            <strong>Add a custom 404.html:</strong>
                            <p className="mt-1 mb-0">
                              Create a 404 page that redirects to index.html to support SPA routing
                            </p>
                          </li>
                          <li className="mb-2">
                            <strong>Fix path-specific issues:</strong>
                            <p className="mt-1 mb-0">
                              Update components to handle GitHub Pages subpath context for resources
                            </p>
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card mt-3 shadow-sm">
                  <div className="card-header bg-light d-flex align-items-center">
                    <CodeSquare className="text-primary me-2" /> <strong>Challenges & Solutions</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h5 className="h6 mb-3">Resource Loading Issues</h5>
                        <ul className="small mb-4">
                          <li className="mb-2">
                            <strong>Problem:</strong> RSS feed and static assets failing to load on GitHub Pages
                          </li>
                          <li className="mb-2">
                            <strong>Solution:</strong> Implemented environment detection to use correct paths:
                            <code className="d-block mt-1 p-2 bg-light rounded">
                              const isGitHubPages = window.location.hostname !== 'localhost';<br/>
                              const path = isGitHubPages ? '/ReactSparkPortfolio/asset.ext' : '/asset.ext';
                            </code>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="col-md-6">
                        <h5 className="h6 mb-3">Icon Rendering Failures</h5>
                        <ul className="small mb-4">
                          <li className="mb-2">
                            <strong>Problem:</strong> Bootstrap icon fonts not loading correctly in GitHub Pages environment
                          </li>
                          <li className="mb-2">
                            <strong>Solution:</strong> Replaced font-based icons with React Bootstrap Icon components:
                            <code className="d-block mt-1 p-2 bg-light rounded">
                              // Instead of this:<br/>
                              &lt;i className="bi bi-github"&gt;&lt;/i&gt;<br/>
                              <br/>
                              // Use this:<br/>
                              &lt;Github /&gt;
                            </code>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a href="https://github.com/markhazleton/ReactSparkPortfolio/issues" 
                    className="btn btn-primary d-inline-flex align-items-center me-2"
                    target="_blank" rel="noopener noreferrer">
                    <Github className="me-1" /> View GitHub Project
                  </a>
                  <a href="https://vitejs.dev/guide/static-deploy.html#github-pages" 
                    className="btn btn-outline-secondary d-inline-flex align-items-center"
                    target="_blank" rel="noopener noreferrer">
                    <JournalText className="me-1" /> Vite Deployment Docs
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