import { useEffect } from "react";
import { useSEO } from "../contexts/useSEO";

const sections = [
  { id: "accordion", title: "Accordion" },
  { id: "carousel", title: "Carousel" },
  { id: "offcanvas", title: "Offcanvas" },
  { id: "tabs", title: "Tabs" },
  { id: "dropdowns", title: "Dropdowns" },
  { id: "progress", title: "Progress" },
  { id: "spinners", title: "Spinners" },
  { id: "badges", title: "Badges" },
  { id: "breadcrumbs", title: "Breadcrumbs" },
];

const AdvancedComponents: React.FC = () => {
  const { setTitle, setDescription } = useSEO();

  useEffect(() => {
    setTitle("Advanced Components | BootstrapSpark");
    setDescription("Explore advanced Bootstrap 5 components with interactive demos.");
  }, [setDescription, setTitle]);

  return (
    <section className="py-4">
      <h1 className="mb-4">Advanced Components</h1>
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
          <article id="accordion" className="mb-5">
            <h2 className="h4">Accordion</h2>
            <div className="accordion" id="advancedAccordion">
              <div className="accordion-item">
                <h3 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#a1"
                  >
                    Section 1
                  </button>
                </h3>
                <div
                  id="a1"
                  className="accordion-collapse collapse show"
                  data-bs-parent="#advancedAccordion"
                >
                  <div className="accordion-body">Accordion body content.</div>
                </div>
              </div>
            </div>
          </article>

          <article id="carousel" className="mb-5">
            <h2 className="h4">Carousel</h2>
            <div id="demoCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner rounded">
                <div className="carousel-item active">
                  <div className="bg-primary text-white p-5">Slide One</div>
                </div>
                <div className="carousel-item">
                  <div className="bg-success text-white p-5">Slide Two</div>
                </div>
              </div>
            </div>
          </article>

          <article id="offcanvas" className="mb-5">
            <h2 className="h4">Offcanvas</h2>
            <button
              className="btn btn-outline-primary"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasDemo"
            >
              Open Panel
            </button>
            <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasDemo">
              <div className="offcanvas-header">
                <h3 className="offcanvas-title h5">Quick Panel</h3>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">Offcanvas content panel.</div>
            </div>
          </article>

          <article id="tabs" className="mb-5">
            <h2 className="h4">Tabs</h2>
            <ul className="nav nav-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  data-bs-toggle="tab"
                  data-bs-target="#tab-one"
                  type="button"
                >
                  One
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  data-bs-toggle="tab"
                  data-bs-target="#tab-two"
                  type="button"
                >
                  Two
                </button>
              </li>
            </ul>
            <div className="tab-content border border-top-0 p-3">
              <div className="tab-pane fade show active" id="tab-one">
                First tab content.
              </div>
              <div className="tab-pane fade" id="tab-two">
                Second tab content.
              </div>
            </div>
          </article>

          <article id="dropdowns" className="mb-5">
            <h2 className="h4">Dropdowns</h2>
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
              >
                Actions
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" type="button">
                    Open
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" type="button">
                    Archive
                  </button>
                </li>
              </ul>
            </div>
          </article>

          <article id="progress" className="mb-5">
            <h2 className="h4">Progress Bars</h2>
            <div className="progress">
              <div className="progress-bar" style={{ width: "65%" }}>
                65%
              </div>
            </div>
          </article>

          <article id="spinners" className="mb-5">
            <h2 className="h4">Spinners</h2>
            <div className="d-flex gap-3">
              <div className="spinner-border" role="status"></div>
              <div className="spinner-grow" role="status"></div>
            </div>
          </article>

          <article id="badges" className="mb-5">
            <h2 className="h4">Badges</h2>
            <span className="badge bg-primary me-2">New</span>
            <span className="badge bg-warning text-dark">Beta</span>
          </article>

          <article id="breadcrumbs">
            <h2 className="h4">Breadcrumbs</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="#">Library</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Data
                </li>
              </ol>
            </nav>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AdvancedComponents;
