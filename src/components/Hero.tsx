import React from 'react';
import profile from '../data/profile.json'; // Adjust the path according to where you place profile.json

const Hero: React.FC = () => {
  return (
    <section id="hero" className="bg-secondary text-white text-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="display-4">{profile.name}</h1>
            <p className="lead">{profile.introduction}</p>
            <a href={profile.ctaLink} className="btn btn-primary btn-lg mt-4">
              {profile.ctaText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
