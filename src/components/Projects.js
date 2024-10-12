import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Project from '../models/Project';
function Projects() {
    const projects = Project.loadProjects(); // Load projects using the class method
    if (projects.length === 0) {
        return _jsx("p", { children: "No projects available at the moment." });
    }
    return (_jsx("section", { id: "projects", className: "py-5", children: _jsxs("div", { className: "container", children: [_jsx("h2", { children: "My Projects" }), _jsxs("div", { id: "projectCarousel", className: "carousel slide", "data-bs-ride": "carousel", children: [_jsx("div", { className: "carousel-inner", children: projects.map((project, index) => (_jsxs("div", { className: `carousel-item ${index === 0 ? 'active' : ''}`, children: [_jsx("img", { src: project.image, className: "d-block w-100", alt: project.formatTitle() }), _jsxs("div", { className: "carousel-caption d-none d-md-block", children: [_jsx("h5", { children: project.formatTitle() }), _jsx("p", { children: project.formatDescription() }), _jsx("a", { href: project.formatLink(), className: "btn btn-primary", target: "_blank", rel: "noopener noreferrer", children: "View Project" })] })] }, project.id))) }), _jsxs("button", { className: "carousel-control-prev", type: "button", "data-bs-target": "#projectCarousel", "data-bs-slide": "prev", children: [_jsx("span", { className: "carousel-control-prev-icon", "aria-hidden": "true" }), _jsx("span", { className: "visually-hidden", children: "Previous" })] }), _jsxs("button", { className: "carousel-control-next", type: "button", "data-bs-target": "#projectCarousel", "data-bs-slide": "next", children: [_jsx("span", { className: "carousel-control-next-icon", "aria-hidden": "true" }), _jsx("span", { className: "visually-hidden", children: "Next" })] })] })] }) }));
}
export default Projects;
