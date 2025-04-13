import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Import Bootstrap Icons CSS for proper rendering of icons
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
