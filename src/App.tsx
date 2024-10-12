import 'bootstrap/dist/css/bootstrap.min.css';   // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS (for components like modals, dropdowns, etc.)

import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Articles from './components/Articles';   // Import the Articles component
import Footer from './components/Footer';

const App: React.FC = () => {
  // State to keep track of which section is active
  const [activeSection, setActiveSection] = useState<string>('home');

  // Handler to update the active section based on navigation clicks
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header section */}
      <Header onSectionChange={handleSectionChange} />

      {/* Main content area */}
      <main className="flex-grow-1 pt-5 mt-5 container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            {/* Show the Hero section only if "home" is active */}
            {activeSection === 'home' && <Hero />}

            {/* Show the About section only if "about" is active */}
            {activeSection === 'about' && <About />}

            {/* Show the Projects section only if "projects" is active */}
            {activeSection === 'projects' && <Projects />}

            {/* Show the Contact section only if "contact" is active */}
            {activeSection === 'contact' && <Contact />}

            {/* Show the Articles section only if "articles" is active */}
            {activeSection === 'articles' && <Articles />}
          </div>
        </div>
      </main>

      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default App;
