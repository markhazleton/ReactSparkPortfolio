import { useState } from "react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

/**
 * Contact component provides a simple contact form for user inquiries.
 * 
 * Features:
 * - Name, email, and message input fields
 * - Form state management with React hooks
 * - Form submission handling (currently logs to console)
 * 
 * @component
 * @example
 * ```tsx
 * <Contact />
 * ```
 * 
 * @returns {JSX.Element} The rendered Contact form
 * 
 * @todo Integrate with backend API for form submission
 */
const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // Here you could integrate an API to send form data
  };

  return (
    <section id="contact">
      <h2>Contact Me</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <textarea name="message" placeholder="Message" onChange={handleChange}></textarea>
        <button type="submit">Send</button>
      </form>
    </section>
  );
};

export default Contact;
