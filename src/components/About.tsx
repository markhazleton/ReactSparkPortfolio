import React from 'react';
import { 
  JournalText, 
  Tools, 
  CodeSlash,
  BookmarkStar,
  Github,
  Database,
  Front,
  GraphUp,
  ArrowRight,
  LightningCharge,
  Braces,
  FileEarmarkCode,
  Gear
} from 'react-bootstrap-icons';
import profile from '../data/profile.json';
import '../styles/About.css'; // Import the external CSS file

const About: React.FC = () => {
  return (
    <section className="py-5">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h1 className="display-5 fw-bold mb-3">{profile.name}</h1>
            <p className="lead text-muted mb-4 mx-auto" style={{ maxWidth: '800px' }}>
              {profile.introduction}
            </p>
            <div className="d-flex justify-content-center gap-2 mb-4">
              <a href="https://github.com/markhazleton/ReactSparkPortfolio" 
                className="btn btn-outline-primary d-inline-flex align-items-center"
                target="_blank" rel="noopener noreferrer">
                <Github className="me-2" size={18} /> View on GitHub
              </a>
              <a href="https://markhazleton.com/webspark" 
                className="btn btn-outline-secondary d-inline-flex align-items-center"
                target="_blank" rel="noopener noreferrer">
                <JournalText className="me-2" size={18} /> WebSpark Suite
              </a>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Left Column */}
          <div className="col-lg-6 mb-4">
            {/* About Section */}
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h2 className="h4 mb-4 d-flex align-items-center border-bottom pb-3">
                  <BookmarkStar className="text-primary me-2" /> About ReactSpark
                </h2>
                <p className="lead mb-3">ReactSpark is the latest addition to the WebSpark suite—an elegant, high-performance single-page application (SPA) built with React that showcases how dynamic web frontends can be powered by robust APIs.</p>
                
                <p className="mb-4">This app demonstrates how modern React development practices can be used to build dynamic, maintainable, and extensible web applications. ReactSpark consumes data and services from the existing .NET-powered WebSpark APIs, offering a seamless integration between frontend and backend technologies.</p>
                
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h3 className="h5 mb-3">🔍 Purpose</h3>
                    <p className="mb-2">ReactSpark bridges the gap between backend services and rich user experiences. While WebSpark's previous apps demonstrate server-side capabilities, ReactSpark focuses on:</p>
                    <ul className="mb-0">
                      <li>Demonstrating real-time data binding and dynamic routing</li>
                      <li>Showcasing React + Vite for rapid frontend development</li>
                      <li>Utilizing modern React libraries and state management</li>
                      <li>Surfacing data from various WebSpark APIs</li>
                    </ul>
                  </div>
                </div>
                
                <div className="card bg-light">
                  <div className="card-body">
                    <h3 className="h5 mb-3">💡 Design Philosophy</h3>
                    <p className="mb-3">ReactSpark follows a clean separation of concerns:</p>
                    <ul className="mb-3">
                      <li>UI logic lives entirely in the React frontend</li>
                      <li>Data access, business rules, and caching are handled by the WebSpark API</li>
                      <li>Layout and navigation are declaratively defined and driven by data</li>
                    </ul>
                    <p className="mb-0">It reflects the core philosophy of WebSpark: <strong>"Show, not just tell."</strong> ReactSpark is built to be dissected, forked, and extended for your own projects.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="col-lg-6">
            {/* Technical Highlights Section */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h3 className="h4 mb-4 d-flex align-items-center border-bottom pb-3">
                  <Gear className="text-primary me-2" /> Technical Highlights
                </h3>
                
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h4 className="h6 mb-2">Frontend Stack:</h4>
                        <ul className="mb-0 small">
                          <li>React 18+</li>
                          <li>Vite for ultra-fast bundling</li>
                          <li>TypeScript</li>
                          <li>React Router</li>
                          <li>Axios for API communication</li>
                        </ul>
                      </div>
                      <div className="col-md-6 mb-3">
                        <h4 className="h6 mb-2">Backend Integration:</h4>
                        <ul className="mb-0 small">
                          <li>RESTful APIs from WebSpark</li>
                          <li>Shared data models</li>
                          <li>Dynamic content rendering</li>
                          <li>SignalR for real-time updates</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <span className="badge bg-primary d-flex align-items-center p-2">
                    <Braces className="me-1" /> React 18+
                  </span>
                  <span className="badge bg-info text-dark d-flex align-items-center p-2">
                    <FileEarmarkCode className="me-1" /> TypeScript
                  </span>
                  <span className="badge bg-success d-flex align-items-center p-2">
                    <LightningCharge className="me-1" /> Vite
                  </span>
                  <span className="badge bg-secondary d-flex align-items-center p-2">
                    <CodeSlash className="me-1" /> API Integration
                  </span>
                </div>
                
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h3 className="h5 mb-3">🎯 Use Cases</h3>
                    <p className="mb-0">ReactSpark is ideal for:</p>
                    <ul className="mb-0">
                      <li>Developers looking to see how to consume .NET APIs in a React app</li>
                      <li>Teams modernizing legacy frontends with React while preserving .NET backends</li>
                      <li>Students and professionals learning modern frontend integration patterns</li>
                    </ul>
                  </div>
                </div>
                
                {/* Articles Section */}
                <h3 className="h5 mb-3 border-top pt-4">Featured Resources</h3>
                <div className="list-group list-group-flush">
                  {[
                    { title: 'Building React SPAs with .NET Backend APIs', link: 'https://markhazleton.com/articles/react-dotnet-integration' },
                    { title: 'WebSpark: A Modern Web Development Ecosystem', link: 'https://markhazleton.com/webspark' },
                    { title: 'API-First Architecture for Modern Web Apps', link: 'https://markhazleton.com/articles/api-first-architecture' }
                  ].map((article, index) => (
                    <a 
                      key={index} 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-0 py-2"
                      title={article.title}
                    >
                      <div className="d-flex align-items-center">
                        <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center me-3" style={{ width: '28px', height: '28px', minWidth: '28px' }}>
                          {index + 1}
                        </span>
                        <div>
                          <h5 className="h6 mb-0 small">{article.title}</h5>
                        </div>
                      </div>
                      <ArrowRight className="text-primary" size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;