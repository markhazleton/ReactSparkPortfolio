import 'bootstrap/dist/css/bootstrap.min.css';   // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS (required for dropdowns, modals, etc.)


import { HashRouter, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';

const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Articles = lazy(() => import('./components/Articles'));
const Joke = lazy(() => import('./components/Joke'));

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="d-flex flex-column min-vh-100">
        <Header  />

        <main className="flex-grow-1 pt-5 mt-5 container">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<Hero />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/joke" element={<Joke />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
