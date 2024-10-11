import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        // Here you could integrate an API to send form data
    };
    return (_jsxs("section", { id: "contact", children: [_jsx("h2", { children: "Contact Me" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "text", name: "name", placeholder: "Name", onChange: handleChange }), _jsx("input", { type: "email", name: "email", placeholder: "Email", onChange: handleChange }), _jsx("textarea", { name: "message", placeholder: "Message", onChange: handleChange }), _jsx("button", { type: "submit", children: "Send" })] })] }));
};
export default Contact;
