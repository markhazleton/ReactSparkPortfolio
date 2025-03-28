import React from 'react';
import { 
  Award, 
  JournalText, 
  Tools, 
  GeoAlt, 
  BriefcaseFill, 
  CodeSlash,
  BookmarkStar,
  Mortarboard,
  Calendar3
} from 'react-bootstrap-icons';
import profile from '../data/profile.json';

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
                    <div className="ratio ratio-1x1 rounded-circle overflow-hidden bg-light mb-3 mx-auto" style={{ width: '150px' }}>
                      <img 
                        src="/assets/img/profile.jpg" 
                        alt="Mark Hazleton" 
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/150?text=MH';
                        }}
                        className="img-fluid"
                      />
                    </div>
                    <span className="position-absolute bottom-0 end-0 badge bg-primary rounded-circle p-2 border border-white">
                      <BriefcaseFill size={16} />
                    </span>
                  </div>
                </div>
                
                <h1 className="h3 mb-1">{profile.name}</h1>
                <p className="text-muted mb-3">{profile.profession}</p>
                
                <div className="d-flex justify-content-center mb-4">
                  <a href="https://github.com/markhazleton" className="btn btn-sm btn-outline-dark mx-1" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/markhazleton/" className="btn btn-sm btn-outline-primary mx-1" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-linkedin"></i>
                  </a>
                  <a href="https://markhazleton.com" className="btn btn-sm btn-outline-info mx-1" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-globe"></i>
                  </a>
                </div>
                
                <div className="card mb-3">
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center mb-2">
                      <Mortarboard className="text-primary me-2" size={20} />
                      <h6 className="mb-0">Education</h6>
                    </div>
                    <div className="ps-4">
                      <p className="mb-0 small text-muted">{profile.education.program}</p>
                      <p className="mb-0 small">{profile.education.institution}</p>
                      <p className="mb-0 small text-muted d-flex align-items-center">
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
                    <div className="small text-muted">Dallas, TX</div>
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
                <p className="lead mb-2">{profile.introduction}</p>
                <p>{profile.about}</p>
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
                      {profile.skills
                        .filter(skill => ['JavaScript', 'TypeScript', 'React', 'Node.js', '.NET', 'ASP.NET Core'].includes(skill))
                        .map((skill: string, index: number) => (
                          <span key={index} className="skill-badge">
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h4 className="h6 mb-3 d-flex align-items-center">
                      <i className="bi bi-database text-primary me-2"></i> Database & Cloud
                    </h4>
                    <div>
                      {profile.skills
                        .filter(skill => ['PostgreSQL', 'Docker', 'Azure', 'Kusto', 'GitHub Actions'].includes(skill))
                        .map((skill: string, index: number) => (
                          <span key={index} className="skill-badge">
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h4 className="h6 mb-3 d-flex align-items-center">
                      <i className="bi bi-front text-primary me-2"></i> Frontend
                    </h4>
                    <div>
                      {profile.skills
                        .filter(skill => ['React', 'Vite', 'PUG', 'Static Web Apps'].includes(skill))
                        .map((skill: string, index: number) => (
                          <span key={index} className="skill-badge">
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <h4 className="h6 mb-3 d-flex align-items-center">
                      <i className="bi bi-graph-up text-primary me-2"></i> Data Analysis
                    </h4>
                    <div>
                      {profile.skills
                        .filter(skill => ['Data Science', 'Polly', 'Kusto'].includes(skill))
                        .map((skill: string, index: number) => (
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
                  {profile.articles.map((article: any, index: number) => (
                    <a 
                      key={index} 
                      href={article.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 px-0 py-3"
                    >
                      <div className="d-flex align-items-center">
                        <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                          {index + 1}
                        </span>
                        <div>
                          <h5 className="h6 mb-0">{article.title}</h5>
                          <small className="text-muted">markhazleton.com</small>
                        </div>
                      </div>
                      <i className="bi bi-arrow-right text-primary"></i>
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