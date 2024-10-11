interface HeaderProps {
  onSectionChange: (section: string) => void; // Function to change the active section
}

const Header: React.FC<HeaderProps> = ({ onSectionChange }) => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#" onClick={() => onSectionChange('home')}>
            My Portfolio
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" href="#" onClick={() => onSectionChange('home')}>
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => onSectionChange('about')}>
                  About
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => onSectionChange('projects')}>
                  Projects
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => onSectionChange('contact')}>
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
