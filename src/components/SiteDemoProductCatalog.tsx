import { useEffect, useMemo, useState } from "react";
import { useSEO } from "../contexts/useSEO";

const products = [
  {
    id: 1,
    name: "Starter Bundle",
    category: "Templates",
    price: 29,
    stock: "In Stock",
    rating: 4.6,
  },
  {
    id: 2,
    name: "Analytics Kit",
    category: "Extensions",
    price: 59,
    stock: "Low Stock",
    rating: 4.8,
  },
  { id: 3, name: "Commerce Theme", category: "Themes", price: 79, stock: "In Stock", rating: 4.9 },
  { id: 4, name: "Admin Pack", category: "Templates", price: 49, stock: "In Stock", rating: 4.3 },
  {
    id: 5,
    name: "API Connectors",
    category: "Extensions",
    price: 99,
    stock: "Out of Stock",
    rating: 4.7,
  },
  {
    id: 6,
    name: "Marketing Kit",
    category: "Templates",
    price: 39,
    stock: "In Stock",
    rating: 4.4,
  },
  {
    id: 7,
    name: "Inventory Theme",
    category: "Themes",
    price: 89,
    stock: "Low Stock",
    rating: 4.5,
  },
  {
    id: 8,
    name: "Automation Suite",
    category: "Extensions",
    price: 119,
    stock: "In Stock",
    rating: 4.9,
  },
];

const SiteDemoProductCatalog: React.FC = () => {
  const { setTitle, setDescription } = useSEO();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | "Templates" | "Extensions" | "Themes">("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  useEffect(() => {
    setTitle("Product Catalog | BootstrapSpark");
    setDescription("A product catalog demo with filters, cards, and responsive table views.");
  }, [setDescription, setTitle]);

  const filtered = useMemo(() => {
    const base = products.filter((product) => {
      const queryMatch =
        !query.trim() ||
        `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase());
      const categoryMatch = category === "All" || product.category === category;
      return queryMatch && categoryMatch;
    });

    return [...base].sort((left, right) => {
      if (sortBy === "price") {
        return left.price - right.price;
      }
      if (sortBy === "rating") {
        return right.rating - left.rating;
      }
      return left.name.localeCompare(right.name);
    });
  }, [query, category, sortBy]);

  const stockBadge = (stock: string) => {
    if (stock === "In Stock") {
      return "bg-success-subtle text-success";
    }
    if (stock === "Low Stock") {
      return "bg-warning-subtle text-warning";
    }
    return "bg-danger-subtle text-danger";
  };

  return (
    <section className="py-4">
      <h1 className="mb-4">Product Catalog</h1>

      <div id="catalogHero" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-inner rounded-4 shadow-sm overflow-hidden">
          <div className="carousel-item active">
            <div className="p-4 p-md-5 bg-primary text-white">
              <h2 className="h3">Build Storefronts Faster</h2>
              <p className="mb-0">
                Composable Bootstrap kits for e-commerce, dashboards, and admin experiences.
              </p>
            </div>
          </div>
          <div className="carousel-item">
            <div className="p-4 p-md-5 bg-dark text-white">
              <h2 className="h3">Design + Data + Delivery</h2>
              <p className="mb-0">
                Mix themes, templates, and extensions with clean upgrade paths.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <input
            className="form-control"
            placeholder="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="col-lg-3">
          <select
            className="form-select"
            value={category}
            onChange={(event) => setCategory(event.target.value as typeof category)}
          >
            <option value="All">All Categories</option>
            <option value="Templates">Templates</option>
            <option value="Extensions">Extensions</option>
            <option value="Themes">Themes</option>
          </select>
        </div>
        <div className="col-lg-3">
          <select
            className="form-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
          >
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="rating">Sort: Rating</option>
          </select>
        </div>
        <div className="col-lg-2 d-flex justify-content-lg-end gap-2">
          <button
            className={`btn btn-sm ${viewMode === "cards" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setViewMode("cards")}
            type="button"
          >
            Cards
          </button>
          <button
            className={`btn btn-sm ${viewMode === "table" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setViewMode("table")}
            type="button"
          >
            Table
          </button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="row g-3 mb-4">
          {filtered.map((product) => (
            <div className="col-md-6 col-xl-4" key={product.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary">{product.category}</span>
                    <span className={`badge ${stockBadge(product.stock)}`}>{product.stock}</span>
                  </div>
                  <h2 className="h5">{product.name}</h2>
                  <p className="text-body-secondary mb-3">
                    Production-ready Bootstrap foundation with modular sections and utility
                    patterns.
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <div>
                      <strong>${product.price}</strong>
                      <div className="small text-body-secondary">
                        {product.rating.toFixed(1)} / 5 rating
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-primary"
                      type="button"
                      data-bs-toggle="modal"
                      data-bs-target="#catalogModal"
                    >
                      Quick View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="table-responsive mb-4">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>{product.rating.toFixed(1)}</td>
                  <td>
                    <span className={`badge ${stockBadge(product.stock)}`}>{product.stock}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="accordion" id="catalogFaq">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#catalogShipping"
            >
              Licensing & Delivery
            </button>
          </h2>
          <div
            id="catalogShipping"
            className="accordion-collapse collapse show"
            data-bs-parent="#catalogFaq"
          >
            <div className="accordion-body small">
              All demo catalog items include source code files and can be customized for commercial
              use under the repository license.
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="catalogModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5">Demo Product Preview</h2>
              <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className="mb-2">
                This modal demonstrates catalog quick-view behavior using pure Bootstrap components.
              </p>
              <ul className="mb-0">
                <li>Theme token overrides</li>
                <li>Composable sections and card primitives</li>
                <li>Responsive table + card dual mode</li>
              </ul>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button className="btn btn-primary">Add to Demo Cart</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteDemoProductCatalog;
