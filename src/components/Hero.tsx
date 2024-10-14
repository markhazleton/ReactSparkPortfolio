import React from 'react';
import { ArrowRightCircle } from 'react-bootstrap-icons'; // Import Bootstrap Icons
import defaultProfile from '../data/profile.json'; // Adjust the path according to your project structure

interface Profile {
  name: string;
  introduction: string;
  ctaLink: string;
  ctaText: string;
}

const renderHero = (profileData?: Profile) => {
  const profile = profileData || defaultProfile;

  // Check if profile is null or empty
  if (!profile || Object.keys(profile).length === 0) {
    return (
      <section id="hero" className="bg-danger text-white text-center py-5">
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
    <section id="hero" className="bg-primary text-white text-center py-5">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-8">
            <h1 className="display-3 text-white fw-bold">{profile.name}</h1>
            <p className="lead fs-4">{profile.introduction}</p>
            <a href={profile.ctaLink} className="btn btn-info btn-lg mt-4 d-inline-flex align-items-center">
              {profile.ctaText} <ArrowRightCircle className="ms-2" size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Hero: React.FC<{ profileData?: Profile }> = ({ profileData }) => {
  return renderHero(profileData);
};

export default Hero;
