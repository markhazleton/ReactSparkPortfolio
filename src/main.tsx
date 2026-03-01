import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./utils/clearServiceWorker"; // Clear any cached service workers in development

// Import Bootstrap Icons CSS for proper rendering of icons
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
