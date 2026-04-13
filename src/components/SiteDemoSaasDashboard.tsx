import { useEffect, useState } from "react";
import { useSEO } from "../contexts/useSEO";

const invoices = [
  { id: "INV-3021", customer: "Northstar Labs", amount: "$12,420", status: "Paid" },
  { id: "INV-3019", customer: "Apex Data", amount: "$8,740", status: "Pending" },
  { id: "INV-3015", customer: "BlueOrbit", amount: "$5,190", status: "Overdue" },
  { id: "INV-3011", customer: "MarketPulse", amount: "$3,840", status: "Paid" },
];

const kpiCards = [
  { label: "MRR", value: "$128,400", delta: "+8.4%", color: "success" },
  { label: "Net Revenue Retention", value: "118%", delta: "+2.1%", color: "primary" },
  { label: "Active Organizations", value: "312", delta: "+26", color: "info" },
  { label: "Support SLA", value: "99.2%", delta: "On target", color: "secondary" },
];

const health = [
  { name: "Enterprise", value: 78, color: "primary" },
  { name: "Mid-Market", value: 63, color: "success" },
  { name: "SMB", value: 86, color: "info" },
  { name: "Self-Serve", value: 54, color: "warning" },
];

const SiteDemoSaasDashboard: React.FC = () => {
  const { setTitle, setDescription } = useSEO();
  const [range, setRange] = useState("30d");

  useEffect(() => {
    setTitle("SaaS Dashboard | BootstrapSpark");
    setDescription(
      "A SaaS-style Bootstrap dashboard demo with KPI cards, activity feed, and tables."
    );
  }, [setDescription, setTitle]);

  return (
    <section className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="mb-1">SaaS Dashboard</h1>
          <p className="text-body-secondary mb-0">
            A full admin shell demonstrating Bootstrap data density and interaction patterns.
          </p>
        </div>
        <div className="d-flex gap-2">
          <div className="btn-group" role="group" aria-label="Date range selector">
            {[
              { id: "7d", label: "7D" },
              { id: "30d", label: "30D" },
              { id: "90d", label: "90D" },
            ].map((option) => (
              <button
                key={option.id}
                className={`btn btn-sm ${range === option.id ? "btn-primary" : "btn-outline-primary"}`}
                type="button"
                onClick={() => setRange(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#dashboardPanel"
          >
            Quick Actions
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {kpiCards.map((card) => (
          <div className="col-md-3 col-6" key={card.label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-body-secondary mb-1 small text-uppercase">{card.label}</p>
                <h2 className="h4 mb-2">{card.value}</h2>
                <span className={`badge bg-${card.color}-subtle text-${card.color}`}>
                  {card.delta}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Performance</h2>
              <span className="badge bg-primary-subtle text-primary">
                Range: {range.toUpperCase()}
              </span>
            </div>
            <div className="card-body">
              <ul className="nav nav-tabs mb-3" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#perf-overview"
                    type="button"
                  >
                    Overview
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#perf-revenue"
                    type="button"
                  >
                    Revenue
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#perf-retention"
                    type="button"
                  >
                    Retention
                  </button>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="perf-overview">
                  {health.map((item) => (
                    <div className="mb-3" key={item.name}>
                      <div className="d-flex justify-content-between">
                        <span>{item.name}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="progress">
                        <div
                          className={`progress-bar bg-${item.color}`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tab-pane fade" id="perf-revenue">
                  <div className="alert alert-info mb-3">
                    Revenue expanded 8.4% period-over-period with strongest lift in Enterprise.
                  </div>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                      <thead>
                        <tr>
                          <th>Segment</th>
                          <th>ARR</th>
                          <th>Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Enterprise</td>
                          <td>$1.82M</td>
                          <td className="text-success">+11.2%</td>
                        </tr>
                        <tr>
                          <td>Mid-Market</td>
                          <td>$940K</td>
                          <td className="text-success">+7.1%</td>
                        </tr>
                        <tr>
                          <td>SMB</td>
                          <td>$410K</td>
                          <td className="text-success">+4.8%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="tab-pane fade" id="perf-retention">
                  <p className="mb-2">
                    NRR is above target with expansion revenue outpacing contraction.
                  </p>
                  <div className="accordion" id="retentionAccordion">
                    <div className="accordion-item">
                      <h3 className="accordion-header">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#retentionDetails"
                        >
                          Retention Notes
                        </button>
                      </h3>
                      <div
                        id="retentionDetails"
                        className="accordion-collapse collapse show"
                        data-bs-parent="#retentionAccordion"
                      >
                        <div className="accordion-body">
                          Upsell bundles in analytics and automations drove an 18% lift in expansion
                          MRR.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <h2 className="h5 mb-0">Invoices</h2>
              <button
                className="btn btn-sm btn-primary"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#newInvoiceModal"
              >
                New Invoice
              </button>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td>{invoice.id}</td>
                      <td>{invoice.customer}</td>
                      <td>{invoice.amount}</td>
                      <td>
                        <span
                          className={`badge ${
                            invoice.status === "Paid"
                              ? "bg-success-subtle text-success"
                              : invoice.status === "Pending"
                                ? "bg-warning-subtle text-warning"
                                : "bg-danger-subtle text-danger"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-transparent">
              <h2 className="h5 mb-0">Recent Activity</h2>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Northstar Labs upgraded to Scale plan.</li>
              <li className="list-group-item">Sync completed: HubSpot + Salesforce.</li>
              <li className="list-group-item">Three trial accounts converted today.</li>
              <li className="list-group-item">SLA alert resolved in under 12 minutes.</li>
            </ul>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent">
              <h2 className="h5 mb-0">Operational Checklist</h2>
            </div>
            <div className="card-body">
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" defaultChecked id="check1" />
                <label className="form-check-label" htmlFor="check1">
                  Review expansion opportunities
                </label>
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" defaultChecked id="check2" />
                <label className="form-check-label" htmlFor="check2">
                  Resolve priority support tickets
                </label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="check3" />
                <label className="form-check-label" htmlFor="check3">
                  Prepare board summary
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-end" id="dashboardPanel" tabIndex={-1}>
        <div className="offcanvas-header">
          <h2 className="offcanvas-title h5">Quick Actions</h2>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body d-grid gap-2">
          <button className="btn btn-primary" type="button">
            Create account brief
          </button>
          <button className="btn btn-outline-secondary" type="button">
            Export revenue snapshot
          </button>
          <button className="btn btn-outline-secondary" type="button">
            Open incident timeline
          </button>
        </div>
      </div>

      <div className="modal fade" id="newInvoiceModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="h5 modal-title">Create Invoice</h2>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label" htmlFor="invoiceCustomer">
                  Customer
                </label>
                <input id="invoiceCustomer" className="form-control" placeholder="Customer name" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="invoiceAmount">
                  Amount
                </label>
                <input id="invoiceAmount" className="form-control" placeholder="$0.00" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary">Save Draft</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteDemoSaasDashboard;
