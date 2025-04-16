import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SEOProvider } from './contexts/SEOContext';
import AppConfig from './config/AppConfig';

import './css/styles.css'; // Import the CSS includes bootstrap as part of scss
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JavaScript bundle

// Lazy loaded components for better performance
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const Projects = lazy(() => import('./components/Projects'));
const Articles = lazy(() => import('./components/Articles'));
const Joke = lazy(() => import('./components/Joke'));
const WeatherForecast = lazy(() => import('./components/WeatherForecast'));
const VariantList = lazy(() => import('./components/VariantList'));
const NotFound = lazy(() => import('./components/NotFound'));

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SEOProvider 
          defaultTitle={AppConfig.siteTitle} 
          defaultDescription={AppConfig.siteDescription}
          siteUrl={AppConfig.hostedUrl}
        >
          <div className="d-flex flex-column min-vh-100">
            {/* Sticky Header */}
            <header className="sticky-top">
              <Header />
            </header>

            {/* Main Content with padding to prevent content hiding behind footer */}
            <main id="main-content" className="flex-grow-1 container-fluid py-5 mb-5">
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                  <Suspense fallback={
                    <div className="text-center p-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  }>
                    <Routes>
                      <Route path="/" element={<Hero />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/joke" element={<Joke />} />
                      <Route path="/articles" element={<Articles />} />
                      <Route path="/weather" element={<WeatherForecast />} />
                      <Route path="/variant" element={<VariantList />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </div>
              </div>
            </main>

            {/* Footer that's not fixed to allow scrolling */}
            <footer className="mt-auto border-top">
              <Footer />
            </footer>
          </div>
        </SEOProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;