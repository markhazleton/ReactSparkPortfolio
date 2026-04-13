import { useEffect } from "react";
import { useSEO } from "../contexts/useSEO";

const sections = [
  { id: "buttons", title: "Buttons" },
  { id: "typography", title: "Typography" },
  { id: "cards", title: "Cards" },
  { id: "alerts", title: "Alerts" },
  { id: "forms", title: "Forms" },
  { id: "modals", title: "Modals" },
  { id: "tables", title: "Tables" },
  { id: "icons", title: "Icons" },
];

const Components: React.FC = () => {
  const { setTitle, setDescription } = useSEO();

  useEffect(() => {
    setTitle("Components | BootstrapSpark");
    setDescription("Browse Bootstrap 5 basic components with live interactive examples.");
  }, [setDescription, setTitle]);

  return (
    <section className="py-4">
      <h1 className="mb-4">Bootstrap Components</h1>
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="list-group position-sticky top-0">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="list-group-item list-group-item-action"
              >
                {section.title}
              </a>
            ))}
          </div>
        </aside>

        <div className="col-lg-9">
          <article id="buttons" className="mb-5">
            <h2 className="h4">Buttons</h2>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary">
                Primary
              </button>
              <button type="button" className="btn btn-outline-secondary">
                Secondary
              </button>
              <button type="button" className="btn btn-success">
                Success
              </button>
            </div>
          </article>

          <article id="typography" className="mb-5">
            <h2 className="h4">Typography</h2>
            <h3 className="h5">Display Copy</h3>
            <p className="lead">A clean typographic scale gives hierarchy to information.</p>
          </article>

          <article id="cards" className="mb-5">
            <h2 className="h4">Cards</h2>
            <div className="card shadow-sm">
              <div className="card-body">
                <h3 className="h5 card-title">Feature Card</h3>
                <p className="card-text">
                  Cards are ideal for grouping related content and actions.
                </p>
                <button type="button" className="btn btn-sm btn-primary">
                  Action
                </button>
              </div>
            </div>
          </article>

          <article id="alerts" className="mb-5">
            <h2 className="h4">Alerts</h2>
            <div className="alert alert-info" role="alert">
              Info alert with supporting context.
            </div>
            <div className="alert alert-warning" role="alert">
              Warning alert for important notices.
            </div>
          </article>

          <article id="forms" className="mb-5">
            <h2 className="h4">Forms</h2>
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="demo-email">
                  Email
                </label>
                <input
                  id="demo-email"
                  className="form-control"
                  type="email"
                  placeholder="name@example.com"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="demo-select">
                  Topic
                </label>
                <select id="demo-select" className="form-select" defaultValue="feedback">
                  <option value="feedback">Feedback</option>
                  <option value="support">Support</option>
                </select>
              </div>
            </form>
          </article>

          <article id="modals" className="mb-5">
            <h2 className="h4">Modals</h2>
            <button
              type="button"
              className="btn btn-dark"
              data-bs-toggle="modal"
              data-bs-target="#demoModal"
            >
              Open Modal
            </button>
            <div className="modal fade" id="demoModal" tabIndex={-1} aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3 className="modal-title h5">Demo Modal</h3>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">This is a Bootstrap modal example.</div>
                </div>
              </div>
            </div>
          </article>

          <article id="tables" className="mb-5">
            <h2 className="h4">Tables</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Alex</td>
                    <td>Engineer</td>
                    <td>Active</td>
                  </tr>
                  <tr>
                    <td>Jordan</td>
                    <td>Designer</td>
                    <td>Away</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          <article id="icons">
            <h2 className="h4">Icons</h2>
            <div className="d-flex gap-3 fs-3">
              <i className="bi bi-lightning-charge" aria-label="Lightning icon"></i>
              <i className="bi bi-cpu" aria-label="CPU icon"></i>
              <i className="bi bi-bootstrap" aria-label="Bootstrap icon"></i>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Components;
