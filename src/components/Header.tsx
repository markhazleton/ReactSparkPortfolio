import { Link, useLocation } from 'react-router-dom';
import { House, Person, Briefcase, JournalText, EmojiLaughing, Cloud, CpuFill } from 'react-bootstrap-icons';

const Header: React.FC = () => {
  const location = useLocation();
  
  // Function to check if route is active
  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src="/PromptSpark.svg" alt="Logo" height="30" className="me-2" />
          <span className="fw-bold">Mark Hazleton</span>
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
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <House className="me-1" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/about')}`} to="/about">
                <Person className="me-1" /> About
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/projects')}`} to="/projects">
                <Briefcase className="me-1" /> Projects
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/articles')}`} to="/articles">
                <JournalText className="me-1" /> Articles
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/joke')}`} to="/joke">
                <EmojiLaughing className="me-1" /> Joke
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/weather')}`} to="/weather">
                <Cloud className="me-1" /> Weather
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/variant')}`} to="/variant">
                <CpuFill className="me-1" /> PromptSpark
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;