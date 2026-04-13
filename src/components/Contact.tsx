import { useEffect } from "react";
import { useSEO } from "../contexts/useSEO";
import AppConfig from "../config/AppConfig";

const Contact: React.FC = () => {
  const { setTitle, setDescription } = useSEO();

  useEffect(() => {
    setTitle("Community | BootstrapSpark");
    setDescription(
      "Join the BootstrapSpark community with a full contributing guide, support links, and collaboration pathways."
    );
  }, [setDescription, setTitle]);

  return (
    <section id="community" className="py-4 py-lg-5">
      <div
        className="rounded-4 p-4 p-lg-5 mb-4 mb-lg-5 text-white shadow"
        style={{ background: "linear-gradient(135deg, #0d6efd 0%, #198754 100%)" }}
      >
        <div className="row g-4 align-items-center">
          <div className="col-lg-8">
            <p className="text-uppercase small mb-2 fw-semibold opacity-75">Community</p>
            <h1 className="display-5 fw-bold mb-3">Community & Contributing</h1>
            <h2 className="h4 mb-3">Welcome to the BootstrapSpark Community</h2>
            <p className="lead mb-0">
              A collaborative ecosystem for modern web development. BootstrapSpark thrives because
              of its community, and we invite developers at every skill level to build, share, and
              improve together.
            </p>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg">
              <div className="card-body text-dark">
                <h3 className="h5 mb-3">Show Your Support</h3>
                <p className="text-body-secondary mb-3">
                  If this project helps you, star the repository and help more developers discover
                  it.
                </p>
                <div className="d-grid gap-2">
                  <a
                    href={AppConfig.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Star on GitHub
                  </a>
                  <a
                    href={`${AppConfig.githubRepo}/fork`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    Fork & Contribute
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4 mb-lg-5">
        <div className="col-lg-6">
          <div className="card border-0 h-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h4 mb-3">Why Join?</h3>
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0">Learn modern web development practices.</li>
                <li className="list-group-item px-0">Collaborate with experienced developers.</li>
                <li className="list-group-item px-0">
                  Build your portfolio with meaningful contributions.
                </li>
                <li className="list-group-item px-0">
                  Shape the future of a growing open-source project.
                </li>
                <li className="list-group-item px-0">Get feedback on your code from peers.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 h-100 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h4 mb-3">How to Contribute</h3>
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-0">Fix bugs and implement new features.</li>
                <li className="list-group-item px-0">Improve documentation and examples.</li>
                <li className="list-group-item px-0">Create tutorials and blog posts.</li>
                <li className="list-group-item px-0">Help answer questions from other users.</li>
                <li className="list-group-item px-0">Share how you are using the project.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mb-4 mb-lg-5">
        <div className="card-body p-4 p-lg-5">
          <h2 className="h3 mb-3">From Our Community</h2>
          <blockquote className="blockquote mb-0">
            <p className="mb-3">
              "BootstrapSpark saved me hours of setup time and helped me create a professional web
              application with the modern features my clients expect."
            </p>
            <footer className="blockquote-footer mb-0">A community member</footer>
          </blockquote>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="h3 mb-4">Contributing Guide</h2>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h5 mb-3">Getting Started</h3>
                <ol className="mb-0">
                  <li>Fork the repository on GitHub.</li>
                  <li>Clone your fork locally.</li>
                  <li>Create a new branch for your feature.</li>
                  <li>Make your changes.</li>
                  <li>Test your changes thoroughly.</li>
                  <li>Submit a pull request.</li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h5 mb-3">Development Guidelines</h3>
                <ul className="mb-0">
                  <li>Follow the existing code style.</li>
                  <li>Write clear commit messages.</li>
                  <li>Add tests for new features.</li>
                  <li>Update documentation as needed.</li>
                  <li>Keep pull requests focused.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4 mb-lg-5">
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h5 mb-3">First Time Contributing?</h3>
              <p className="mb-3 text-body-secondary">
                Look for issues labeled good first issue or beginner-friendly to get started
                quickly.
              </p>
              <a
                href={`${AppConfig.githubRepo}/blob/main/CONTRIBUTING.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Read Contributing Guide
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h5 mb-3">Need Help?</h3>
              <p className="mb-3 text-body-secondary">
                Ask questions, share ideas, and connect in our GitHub discussions.
              </p>
              <a
                href={`${AppConfig.githubRepo}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Join Discussions
              </a>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="h5 mb-3">Community Events</h3>
              <ul className="mb-3 text-body-secondary small">
                <li>Get help with contributions.</li>
                <li>Learn upcoming features.</li>
                <li>Share your insights and ideas.</li>
                <li>Connect with other contributors.</li>
              </ul>
              <a
                href={`${AppConfig.githubRepo}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Stay Updated
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-4 border bg-body-tertiary p-4 p-lg-5">
        <h2 className="h4 mb-3">Ready to Build With Us?</h2>
        <p className="mb-4 text-body-secondary">
          We are excited to see what you will build with BootstrapSpark. Open an issue, submit a
          pull request, or start a discussion and become part of the momentum.
        </p>
        <div className="d-flex flex-wrap gap-2">
          <a
            href={AppConfig.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Visit Repository
          </a>
          <a
            href={`${AppConfig.githubRepo}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary"
          >
            Report Bug
          </a>
          <a
            href={`${AppConfig.githubRepo}/issues/new`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-primary"
          >
            Suggest Feature
          </a>
          <a
            href="https://markhazleton.github.io/JsBootSpark/community/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-secondary"
          >
            View JsBootSpark Community
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
