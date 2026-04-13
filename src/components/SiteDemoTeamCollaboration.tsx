import { useEffect, useMemo, useState } from "react";
import { useSEO } from "../contexts/useSEO";

type Lane = "Backlog" | "In Progress" | "Review" | "Done";

interface Task {
  id: number;
  lane: Lane;
  title: string;
  assignee: string;
  priority: "Low" | "Medium" | "High";
  due: string;
}

const initialTasks: Task[] = [
  {
    id: 1,
    lane: "Backlog",
    title: "Draft launch checklist",
    assignee: "Maya",
    priority: "Medium",
    due: "Apr 18",
  },
  {
    id: 2,
    lane: "Backlog",
    title: "Audit onboarding copy",
    assignee: "Jon",
    priority: "Low",
    due: "Apr 21",
  },
  {
    id: 3,
    lane: "In Progress",
    title: "Implement project filters",
    assignee: "Priya",
    priority: "High",
    due: "Apr 16",
  },
  {
    id: 4,
    lane: "In Progress",
    title: "Refine mobile nav transitions",
    assignee: "Maya",
    priority: "Medium",
    due: "Apr 17",
  },
  {
    id: 5,
    lane: "Review",
    title: "Accessibility keyboard pass",
    assignee: "Sam",
    priority: "High",
    due: "Apr 15",
  },
  {
    id: 6,
    lane: "Done",
    title: "Update coding standards",
    assignee: "Alex",
    priority: "Low",
    due: "Apr 12",
  },
];

const SiteDemoTeamCollaboration: React.FC = () => {
  const { setTitle, setDescription } = useSEO();
  const [tasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<"All" | "High" | "Medium" | "Low">("All");

  useEffect(() => {
    setTitle("Team Collaboration | BootstrapSpark");
    setDescription(
      "A collaboration workspace demo with kanban board, team members, and threaded updates."
    );
  }, [setDescription, setTitle]);

  const lanes: Lane[] = ["Backlog", "In Progress", "Review", "Done"];
  const visibleTasks = useMemo(
    () => (filter === "All" ? tasks : tasks.filter((task) => task.priority === filter)),
    [tasks, filter]
  );

  const getPriorityClass = (priority: Task["priority"]) => {
    if (priority === "High") {
      return "bg-danger-subtle text-danger";
    }
    if (priority === "Medium") {
      return "bg-warning-subtle text-warning";
    }
    return "bg-success-subtle text-success";
  };

  return (
    <section className="py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="mb-1">Team Collaboration</h1>
          <p className="text-body-secondary mb-0">
            A complete collaboration workspace with planning, communication, and execution surfaces.
          </p>
        </div>
        <div className="d-flex gap-2">
          {(["All", "High", "Medium", "Low"] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`btn btn-sm ${filter === value ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
          <button
            className="btn btn-sm btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#newTaskModal"
          >
            New Task
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-9">
          <div className="row g-3">
            {lanes.map((lane) => (
              <div className="col-md-6 col-xl-3" key={lane}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-header bg-transparent">
                    <h2 className="h6 mb-0 d-flex justify-content-between align-items-center">
                      {lane}
                      <span className="badge bg-secondary-subtle text-secondary">
                        {visibleTasks.filter((task) => task.lane === lane).length}
                      </span>
                    </h2>
                  </div>
                  <div className="card-body d-flex flex-column gap-2">
                    {visibleTasks
                      .filter((task) => task.lane === lane)
                      .map((task) => (
                        <div key={task.id} className="p-2 rounded bg-body-tertiary border small">
                          <div className="fw-semibold mb-1">{task.title}</div>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-body-secondary">
                              {task.assignee} · {task.due}
                            </span>
                            <span className={`badge ${getPriorityClass(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm mt-4">
            <div className="card-header bg-transparent">
              <h2 className="h6 mb-0">Sprint Burndown</h2>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Planned</span>
                  <span>42 points</span>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-primary" style={{ width: "100%" }}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Completed</span>
                  <span>27 points</span>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-success" style={{ width: "64%" }}></div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <span>At risk</span>
                  <span>5 points</span>
                </div>
                <div className="progress">
                  <div className="progress-bar bg-warning" style={{ width: "12%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent">
              <h2 className="h6 mb-0">Team Presence</h2>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                Maya <span className="badge bg-success">Online</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                Jon <span className="badge bg-warning text-dark">Away</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                Priya <span className="badge bg-success">Online</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                Sam <span className="badge bg-secondary">Offline</span>
              </li>
            </ul>
          </div>

          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header bg-transparent">
              <h2 className="h6 mb-0">Discussion Thread</h2>
            </div>
            <div className="card-body">
              <p className="small mb-2">
                <strong>Maya:</strong> Shipping the new dashboard shell this sprint.
              </p>
              <p className="small mb-2">
                <strong>Priya:</strong> I will validate keyboard accessibility this afternoon.
              </p>
              <p className="small mb-0">
                <strong>Jon:</strong> Need final icon set by EOD.
              </p>
            </div>
          </div>

          <div className="accordion" id="teamResources">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#resourceLinks"
                >
                  Team Resources
                </button>
              </h2>
              <div
                id="resourceLinks"
                className="accordion-collapse collapse"
                data-bs-parent="#teamResources"
              >
                <div className="accordion-body small">
                  Design system docs, API contracts, and release checklist are available in the
                  sprint workspace.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="newTaskModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title h5">Create Task</h2>
              <button className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label" htmlFor="taskTitle">
                  Task title
                </label>
                <input id="taskTitle" className="form-control" placeholder="Describe task" />
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label" htmlFor="taskLane">
                    Lane
                  </label>
                  <select id="taskLane" className="form-select" defaultValue="Backlog">
                    {lanes.map((lane) => (
                      <option key={lane}>{lane}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="taskPriority">
                    Priority
                  </label>
                  <select id="taskPriority" className="form-select" defaultValue="Medium">
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary">Create</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiteDemoTeamCollaboration;
