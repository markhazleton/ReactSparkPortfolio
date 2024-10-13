import React from 'react';
import profile from '../data/profile.json'; // Adjust path to your profile.json location

const About: React.FC = () => {
  return (
    <section id="about" className="py-5">
      <div className="container">
        {/* About Me Section */}
        <h2 className="mb-4">About Mark Hazleton</h2>
        <p>{profile.about}</p>

        {/* Skills Section */}
        <div className="mt-5">
          <h3>Skills</h3>
          <ul className="list-inline">
            {profile.skills.map((skill: string, index: number) => (
              <li key={index} className="list-inline-item badge bg-primary mx-1 my-1">
                {skill}
              </li>
            ))}
          </ul>
        </div>

        {/* Articles Section */}
        <div className="mt-5">
          <h3>Articles</h3>
          <ul className="list-unstyled">
            {profile.articles.map((article: any, index: number) => (
              <li key={index} className="mb-2">
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                  {article.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Education Section */}
        <div className="mt-5">
          <h3>Education</h3>
          <p>
            <strong>Program:</strong> {profile.education.program} <br />
            <strong>Institution:</strong> {profile.education.institution} <br />
            <strong>Duration:</strong> {profile.education.duration}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
