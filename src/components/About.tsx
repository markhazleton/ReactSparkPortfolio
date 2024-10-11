import React from 'react';
import profile from '../data/profile.json'; // Adjust path to your profile.json location

const About: React.FC = () => {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <h2>About Me</h2>
        <p>
          {profile.about}
        </p>
      </div>
    </section>
  );
};

export default About;
