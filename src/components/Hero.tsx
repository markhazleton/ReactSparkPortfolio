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
    const pageDescription = `${profile.name} - ${profile.profession}. ${profile.introduction}`;
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
                  <a href="https://github.com/markhazleton/ReactSparkPortfolio" 
                    className="btn btn-outline-light d-inline-flex align-items-center border-2" 
                    target="_blank" rel="noopener noreferrer"
                    aria-label="View ReactSpark on GitHub">
                    <Github className="me-2" /> View on GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/markhazleton/" 
                    className="btn btn-outline-light d-inline-flex align-items-center border-2" 
                    target="_blank" rel="noopener noreferrer"
                    aria-label="Connect with Mark Hazleton (Creator)">
                    <Linkedin className="me-2" /> Connect with Creator
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Technology Stack (Full width) */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title h4 mb-3 d-flex align-items-center">
                  <CodeSquare className="text-primary me-2" /> Frontend Stack & Cloud Architecture
                </h3>
                <p className="text-muted mb-3">ReactSpark is built with modern web technologies and deployed on Azure cloud infrastructure:</p>
                
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h5 className="h6 mb-2">Core Technologies</h5>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-information d-flex align-items-center p-2">
                        <Braces className="me-1" /> React 18+
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

                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item border-0 px-0">
                        <strong>React 18:</strong> Utilizing the latest React features including concurrent rendering, automatic batching, and transitions
                      </li>
                      <li className="list-group-item border-0 px-0">
                        <strong>TypeScript:</strong> Full type safety across the entire codebase for improved developer experience and fewer runtime errors
                      </li>
                      <li className="list-group-item border-0 px-0">
                        <strong>Vite:</strong> Lightning-fast build tool with Hot Module Replacement (HMR) for rapid development cycles
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-6">
                    <h5 className="h6 mb-2">Azure Deployment</h5>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <span className="badge bg-primary d-flex align-items-center p-2">
                        <Gear className="me-1" /> Azure Static Web Apps
                      </span>
                      <span className="badge bg-danger d-flex align-items-center p-2">
                        <LightningCharge className="me-1" /> Azure Functions
                      </span>
                      <span className="badge bg-dark d-flex align-items-center p-2">
                        <Github className="me-1" /> GitHub Actions
                      </span>
                    </div>

                    <ul className="list-group list-group-flush mb-3">
                      <li className="list-group-item border-0 px-0">
                        <strong>Azure Static Web Apps:</strong> Fully managed hosting service optimized for modern web apps with global distribution via Azure CDN
                      </li>
                      <li className="list-group-item border-0 px-0">
                        <strong>Built-in API Backend:</strong> Serverless Azure Functions for secure backend capabilities without managing infrastructure
                      </li>
                      <li className="list-group-item border-0 px-0">
                        <strong>CI/CD Pipeline:</strong> Automated deployments through GitHub Actions triggered on code commits
                      </li>
                      <li className="list-group-item border-0 px-0">
                        <strong>Authentication:</strong> Easy integration with Azure AD B2C, GitHub, or other identity providers
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="card bg-light">
                  <div className="card-body">
                    <h5 className="h6 mb-2">Azure Static Web Apps Benefits</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="mb-0">
                          <li className="mb-2">
                            <strong>Global CDN:</strong> Content delivered from edge locations closest to users
                          </li>
                          <li className="mb-2">
                            <strong>Free SSL Certificates:</strong> Automatic HTTPS with managed certificates
                          </li>
                          <li className="mb-2">
                            <strong>Staging Environments:</strong> Preview deployments for pull requests
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="mb-0">
                          <li className="mb-2">
                            <strong>Route Customization:</strong> Advanced routing via staticwebapp.config.json
                          </li>
                          <li className="mb-2">
                            <strong>Serverless API:</strong> Easy backend integration with Azure Functions
                          </li>
                          <li className="mb-2">
                            <strong>Cost Efficiency:</strong> Free tier available for personal projects
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <a href="https://learn.microsoft.com/en-us/azure/static-web-apps/" 
                    className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
                    target="_blank" rel="noopener noreferrer">
                    <JournalText className="me-1" /> Learn About Azure Static Web Apps
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
        
        {/* Row 3: WebSpark Ecosystem (Full Width) */}
        <div className="row">
          <div className="col-12">
            <div className="card border shadow-sm">
              <div className="card-body">
                <h3 className="card-title h4 mb-3 d-flex align-items-center">
                  <CodeSquare className="text-primary me-2" /> WebSpark Ecosystem
                </h3>
                
                <p className="mb-4">
                  ReactSpark is a key component of the WebSpark suite—a collection of interconnected web applications
                  that demonstrate different aspects of modern web development. Each app in the suite focuses on specific technologies
                  while sharing data and services with other components.
                </p>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="card mb-3 shadow-sm h-100">
                      <div className="card-header bg-light d-flex align-items-center">
                        <Gear className="text-primary me-2" /> <strong>WebSpark Components</strong>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          <div className="list-group-item border-0 px-0">
                            <h5 className="h6 mb-1">ReactSpark <span className="badge bg-primary">Frontend</span></h5>
                            <p className="small mb-0 text-muted">Dynamic React frontend powered by WebSpark APIs</p>
                          </div>
                          <div className="list-group-item border-0 px-0">
                            <h5 className="h6 mb-1">PromptSpark <span className="badge bg-info text-dark">AI</span></h5>
                            <p className="small mb-0 text-muted">LLM prompt engineering and management system</p>
                          </div>
                          <div className="list-group-item border-0 px-0">
                            <h5 className="h6 mb-1">AsyncSpark <span className="badge bg-success">Backend</span></h5>
                            <p className="small mb-0 text-muted">Asynchronous processing system with message queues</p>
                          </div>
                          <div className="list-group-item border-0 px-0">
                            <h5 className="h6 mb-1">DataSpark <span className="badge bg-warning text-dark">Data</span></h5>
                            <p className="small mb-0 text-muted">Data analysis and transformation services</p>
                          </div>
                          <div className="list-group-item border-0 px-0">
                            <h5 className="h6 mb-1">TriviaSpark <span className="badge bg-secondary">Content</span></h5>
                            <p className="small mb-0 text-muted">Interactive quiz and trivia engine</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card mb-3 shadow-sm h-100">
                      <div className="card-header bg-light d-flex align-items-center">
                        <Github className="text-primary me-2" /> <strong>Integration Features</strong>
                      </div>
                      <div className="card-body">
                        <ul className="mb-4">
                          <li className="mb-2">
                            <strong>API-First Architecture:</strong>
                            <p className="small mb-0 text-muted">
                              All WebSpark components expose and consume RESTful APIs, allowing them to work together 
                              while remaining independently deployable.
                            </p>
                          </li>
                          <li className="mb-2">
                            <strong>Shared Data Models:</strong>
                            <p className="small mb-0 text-muted">
                              Common TypeScript interfaces and C# models ensure type safety across the frontend and backend.
                            </p>
                          </li>
                          <li className="mb-2">
                            <strong>Unified Authentication:</strong>
                            <p className="small mb-0 text-muted">
                              Single sign-on across all WebSpark applications for seamless user experience.
                            </p>
                          </li>
                          <li className="mb-2">
                            <strong>Real-time Updates:</strong>
                            <p className="small mb-0 text-muted">
                              SignalR connections provide push notifications from backend services to ReactSpark.
                            </p>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card mt-3 shadow-sm">
                  <div className="card-header bg-light d-flex align-items-center">
                    <CodeSquare className="text-primary me-2" /> <strong>Future Roadmap</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <h5 className="h6 mb-3">Integration Enhancements</h5>
                        <ul className="small mb-4">
                          <li className="mb-2">
                            <strong>Support for real-time updates via SignalR</strong> leveraging WebSpark's backend infrastructure
                          </li>
                          <li className="mb-2">
                            <strong>Theming and layout switching</strong> based on user preferences stored in WebSpark APIs
                          </li>
                          <li className="mb-2">
                            <strong>Admin mode for live editing</strong> of content blocks with instant previews
                          </li>
                        </ul>
                      </div>
                      
                      <div className="col-md-6">
                        <h5 className="h6 mb-3">New Features</h5>
                        <ul className="small mb-4">
                          <li className="mb-2">
                            <strong>Integration with PromptSpark GPTs</strong> for conversational components throughout the UI
                          </li>
                          <li className="mb-2">
                            <strong>DataSpark visualization components</strong> for displaying live data transformations
                          </li>
                          <li className="mb-2">
                            <strong>TriviaSpark interactive quizzes</strong> embedded in relevant content sections
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a href="https://markhazleton.com/webspark" 
                    className="btn btn-primary d-inline-flex align-items-center me-2"
                    target="_blank" rel="noopener noreferrer">
                    <JournalText className="me-1" /> Learn About WebSpark
                  </a>
                  <a href="https://github.com/markhazleton/ReactSparkPortfolio" 
                    className="btn btn-outline-secondary d-inline-flex align-items-center"
                    target="_blank" rel="noopener noreferrer">
                    <Github className="me-1" /> View ReactSpark Source
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