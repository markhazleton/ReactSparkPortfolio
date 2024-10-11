import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import profile from '../data/profile.json'; // Adjust the path according to where you place profile.json
const Hero = () => {
    return (_jsx("section", { id: "hero", className: "bg-secondary text-white text-center py-5", children: _jsx("div", { className: "container", children: _jsx("div", { className: "row justify-content-center", children: _jsxs("div", { className: "col-md-8", children: [_jsx("h1", { className: "display-4", children: profile.name }), _jsx("p", { className: "lead", children: profile.introduction }), _jsx("a", { href: profile.ctaLink, className: "btn btn-primary btn-lg mt-4", children: profile.ctaText })] }) }) }) }));
};
export default Hero;
