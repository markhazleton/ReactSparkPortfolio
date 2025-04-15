import { Link, useLocation } from 'react-router-dom';
import { House, Person, Briefcase, JournalText, EmojiLaughing, Cloud, CpuFill, SunFill, MoonFill } from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  // Function to check if route is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Determine correct path for the logo
  const logoPath = window.location.hostname === 'localhost' 
    ? '/PromptSpark.svg' 
    : '/ReactSparkPortfolio/PromptSpark.svg';

  return (
    <>
      <a href="#main-content" className="visually-hidden-focusable">Skip to main content</a>
      <nav className={`navbar navbar-expand-lg navbar-${theme} bg-${theme === 'light' ? 'light' : 'dark'} border-bottom`}>
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <div className="logo-container me-2 d-flex align-items-center justify-content-center icon-circle-sm">
              <img 
                src={logoPath}
                alt="ReactSpark Logo" 
                className="img-fluid"
              />
            </div>
            <div>
              <span className="fw-bold">ReactSpark</span>
              <small className="d-block text-muted" style={{fontSize: '0.7rem'}}>by Mark Hazleton</small>
            </div>
          </Link>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/') ? 'active fw-semibold' : ''}`} to="/" aria-label="Home page">
                  <House className="me-1" /> Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/about') ? 'active fw-semibold' : ''}`} to="/about" aria-label="About page">
                  <Person className="me-1" /> About
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/projects') ? 'active fw-semibold' : ''}`} to="/projects" aria-label="Projects page">
                  <Briefcase className="me-1" /> Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/articles') ? 'active fw-semibold' : ''}`} to="/articles" aria-label="Articles page">
                  <JournalText className="me-1" /> Articles
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/joke') ? 'active fw-semibold' : ''}`} to="/joke" aria-label="Joke page">
                  <EmojiLaughing className="me-1" /> Joke
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/weather') ? 'active fw-semibold' : ''}`} to="/weather" aria-label="Weather page">
                  <Cloud className="me-1" /> Weather
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/variant') ? 'active fw-semibold' : ''}`} to="/variant" aria-label="PromptSpark page">
                  <CpuFill className="me-1" /> PromptSpark
                </Link>
              </li>
              <li className="nav-item ms-2 d-flex align-items-center">
                <button 
                  className={`btn btn-sm ${theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'} rounded-circle d-flex align-items-center justify-content-center icon-circle`}
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? <MoonFill size={16} /> : <SunFill size={16} />}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;