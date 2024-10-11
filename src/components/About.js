import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import profile from '../data/profile.json'; // Adjust path to your profile.json location
const About = () => {
    return (_jsx("section", { id: "about", className: "py-5", children: _jsxs("div", { className: "container", children: [_jsx("h2", { className: "mb-4", children: "About Me" }), _jsx("p", { children: profile.about }), _jsxs("div", { className: "mt-5", children: [_jsx("h3", { children: "Skills" }), _jsx("ul", { className: "list-inline", children: profile.skills.map((skill, index) => (_jsx("li", { className: "list-inline-item badge bg-primary mx-1 my-1", children: skill }, index))) })] }), _jsxs("div", { className: "mt-5", children: [_jsx("h3", { children: "Articles" }), _jsx("ul", { className: "list-unstyled", children: profile.articles.map((article, index) => (_jsx("li", { className: "mb-2", children: _jsx("a", { href: article.link, target: "_blank", rel: "noopener noreferrer", className: "text-decoration-none", children: article.title }) }, index))) })] }), _jsxs("div", { className: "mt-5", children: [_jsx("h3", { children: "Education" }), _jsxs("p", { children: [_jsx("strong", { children: "Program:" }), " ", profile.education.program, " ", _jsx("br", {}), _jsx("strong", { children: "Institution:" }), " ", profile.education.institution, " ", _jsx("br", {}), _jsx("strong", { children: "Duration:" }), " ", profile.education.duration] })] }), _jsxs("div", { className: "mt-5", children: [_jsx("h3", { children: "Certifications" }), _jsx("ul", { className: "list-unstyled", children: profile.certifications.map((cert, index) => (_jsx("li", { className: "mb-2", children: _jsx("a", { href: cert.link, target: "_blank", rel: "noopener noreferrer", className: "text-decoration-none", children: cert.name }) }, index))) })] })] }) }));
};
export default About;