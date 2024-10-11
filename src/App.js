import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS (for components like modals, dropdowns, etc.)
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
const App = () => {
    // State to keep track of which section is active
    const [activeSection, setActiveSection] = useState('home');
    // Handler to update the active section based on navigation clicks
    const handleSectionChange = (section) => {
        setActiveSection(section);
    };
    return (_jsxs("div", { className: "d-flex flex-column min-vh-100", children: [_jsx(Header, { onSectionChange: handleSectionChange }), _jsx("main", { className: "flex-grow-1 pt-5 mt-5 container", children: _jsx("div", { className: "row justify-content-center", children: _jsxs("div", { className: "col-md-10", children: [activeSection === 'home' && _jsx(Hero, {}), activeSection === 'about' && _jsx(About, {}), activeSection === 'projects' && _jsx(Projects, {}), activeSection === 'contact' && _jsx(Contact, {})] }) }) }), _jsx(Footer, {})] }));
};
export default App;
