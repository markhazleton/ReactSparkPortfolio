import React from 'react';
import { Award, JournalText, Tools } from 'react-bootstrap-icons'; // Import Bootstrap Icons
import profile from '../data/profile.json'; // Adjust path to your profile.json location

const About: React.FC = () => {
  return (
    <section id="about" className="py-5">
      <div className="container">
        {/* About Me Section */}
        <div className="mb-5">
          <h2 className="mb-4 text-center">About Mark Hazleton</h2>
          <p className="lead text-center">{profile.about}</p>
        </div>

        {/* Skills Section */}
        <div className="mt-5">
          <h3 className="mb-4">
            <Tools className="me-2" /> Skills
          </h3>
          <div className="d-flex flex-wrap">
            {profile.skills.map((skill: string, index: number) => (
              <span key={index} className="badge bg-primary mx-1 my-1 p-2">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Articles Section */}
        <div className="mt-5">
          <h3 className="mb-4">
            <JournalText className="me-2" /> Articles
          </h3>
          <ul className="list-group">
            {profile.articles.map((article: any, index: number) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none"
                >
                  {article.title}
                </a>
                <span className="badge bg-secondary">Read</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Education Section */}
        <div className="mt-5">
          <h3 className="mb-4">
            <Award className="me-2" /> Education
          </h3>
          <div className="card">
            <div className="card-body">
              <p>
                <strong>Program:</strong> {profile.education.program} <br />
                <strong>Institution:</strong> {profile.education.institution} <br />
                <strong>Duration:</strong> {profile.education.duration}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
