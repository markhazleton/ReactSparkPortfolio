import React from 'react';
import { 
  JournalText, 
  Tools, 
  GeoAlt, 
  BriefcaseFill, 
  CodeSlash,
  BookmarkStar,
  Mortarboard,
  Calendar3,
  PersonCircle,
  Github,
  Linkedin,
  Globe,
  Database,
  Front,
  GraphUp,
  ArrowRight
} from 'react-bootstrap-icons';
import profile from '../data/profile.json';
import '../styles/About.css'; // Import the external CSS file

const About: React.FC = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-4 mb-lg-0">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <div className="mb-4">
                  <div className="position-relative d-inline-block">
                    <div className="ratio ratio-1x1 rounded-circle overflow-hidden bg-body-tertiary mb-3 mx-auto d-flex align-items-center justify-content-center profile-picture">
                      <PersonCircle className="text-primary" size={120} />
                    </div>
                    <span className="position-absolute bottom-0 end-0 badge bg-primary rounded-circle p-2 border border-light-subtle">
                      <BriefcaseFill size={16} />
                    </span>
                  </div>
                </div>
                
                <h1 className="h3 mb-1">{profile.name}</h1>
                <p className="text-body-secondary mb-3">{profile.profession}</p>
                
                <div className="d-flex justify-content-center mb-4">
                  <a 
                    href="https://github.com/markhazleton" 
                    className="btn btn-sm btn-outline-secondary mx-1 d-flex align-items-center justify-content-center btn-circle" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="GitHub Profile"
                  >
                    <Github size={16} />
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/markhazleton/" 
                    className="btn btn-sm btn-outline-primary mx-1 d-flex align-items-center justify-content-center btn-circle" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={16} />
                  </a>
                  <a 
                    href="https://markhazleton.com" 
                    className="btn btn-sm btn-outline-info mx-1 d-flex align-items-center justify-content-center btn-circle" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="Personal Website"
                  >
                    <Globe size={16} />
                  </a>
                </div>
                
                <div className="card mb-3">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center mb-2">
                      <Mortarboard className="text-primary me-2" size={20} />
                      <h6 className="mb-0">Education</h6>
                    </div>
                    <div className="ps-4">
                      <p className="mb-0 small text-body-secondary">{profile.education.program}</p>
                      <p className="mb-0 small">{profile.education.institution}</p>
                      <p className="mb-0 small text-body-secondary d-flex align-items-center">
                        <Calendar3 size={12} className="me-1" /> {profile.education.duration || "2024-2025"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center mb-2">
                      <GeoAlt className="text-primary me-2" size={20} />
                      <h6 className="mb-0">Location</h6>
                    </div>
                    <div className="small text-body-secondary">Wichita, KS</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-8">
            {/* About Me Section */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h2 className="h4 mb-4 d-flex align-items-center border-bottom pb-3">
                  <BookmarkStar className="text-primary me-2" /> Biography
                </h2>
                <p className="lead mb-2">As a Solutions Architect and lifelong learner, I create solutions that make technology work for businesses. With a focus on tangible benefits, I avoid getting sidetracked by sizzle that does not deliver. My extensive experience spans developing solutions for both on-premises and cloud-based providers, working with organizations of all sizes to deliver successful outcomes.</p>
                <p>I am passionate about hiking, city exploration, and culinary adventures. Exploring new surroundings broadens my perspective, while outdoor cooking allows me to experiment with smoking and grilling techniques, fostering connections through the love of food.</p>
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h3 className="h4 mb-4 d-flex align-items-center border-bottom pb-3">
                  <Tools className="text-primary me-2" /> Skills
                </h3>
                
                {/* Group skills by category */}
                <div className="row g-4">
                  <div className="col-md-6">
                    <h4 className="h6 mb-3 d-flex align-items-center">
                      <CodeSlash className="text-primary me-2" /> Development
                    </h4>
                    <div>
                      {['JavaScript', 'TypeScript', 'React', 'Node.js', '.NET', 'ASP.NET Core', 'Bootstrap', 'jQuery'].map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h4 className="h6 mb-3 d-flex align-items-center">
                      <Database className="text-primary me-2" /> Database & Cloud
                    </h4>
                    <div>
                      {['PostgreSQL', 'Docker', 'Azure', 'Kusto', 'GitHub Actions', 'Amazon Web Services'].map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h4 className="h6 mb-3 d-flex align-items-center">
                      <Front className="text-primary me-2" /> Frontend
                    </h4>
                    <div>
                      {['React', 'Vite', 'PUG', 'Static Web Apps', 'HTML', 'CSS'].map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h4 className="h6 mb-3 d-flex align-items-center">
                      <GraphUp className="text-primary me-2" /> Data Analysis
                    </h4>
                    <div>
                      {['Data Science', 'Polly', 'Kusto', 'Power BI'].map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Articles Section */}
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h3 className="h4 mb-4 d-flex align-items-center border-bottom pb-3">
                  <JournalText className="text-primary me-2" /> Featured Articles
                </h3>
                <div className="list-group list-group-flush">
                  {[
                    { title: 'Pedernales Cellars Winery in Texas Hill Country', link: 'https://markhazleton.com/articles/pedernales-cellars' },
                    { title: 'The Impact of Input Case on LLM Categorization', link: 'https://markhazleton.com/articles/llm-categorization' },
                    { title: 'AI-Assisted Development: Claude and GitHub Copilot', link: 'https://markhazleton.com/articles/ai-assisted-development' }
                  ].map((article, index) => (
                    <a 
                      key={index} 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-0 py-3"
                      title={article.title}
                    >
                      <div className="d-flex align-items-center">
                        <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3 article-number">
                          {index + 1}
                        </span>
                        <div>
                          <h5 className="h6 mb-0">{article.title}</h5>
                          <small className="text-body-secondary">markhazleton.com</small>
                        </div>
                      </div>
                      <ArrowRight className="text-primary" />
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