
function TaskSummary({ tasks }) {
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.status === "completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);

    if (Number.isNaN(dueDate.getTime())) {
      return false;
    }

    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
  }).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const summaries = [
    {
      label: "Total Tasks",
      value: totalTasks,
      style: "total",
      description: "Tasks on this page",
    },
    {
      label: "Pending",
      value: pendingTasks,
      style: "pending",
      description: "Waiting to start",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      style: "in-progress",
      description: "Currently working",
    },
    {
      label: "Completed",
      value: completedTasks,
      style: "completed",
      description: "Successfully finished",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      style: "overdue",
      description: "Past their due date",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      style: "completion",
      description: "Completed on this page",
    },
  ];

  return (
    <section className="task-summary" aria-labelledby="overview-heading">
      <div className="section-heading">
        <div>
          <p className="section-eyebrow">YOUR WORKSPACE</p>
          <h2 id="overview-heading">Task Overview</h2>
          <p className="section-description">
            Track your tasks and monitor your progress.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        {summaries.map((summary) => (
          <article
            className={`summary-card summary-card-${summary.style}`}
            key={summary.label}
          >
            <div className="summary-card-top">
              <h3>{summary.label}</h3>
              <span
                className={`summary-indicator summary-indicator-${summary.style}`}
                aria-hidden="true"
              />
            </div>

            <p className="summary-value">{summary.value}</p>

            <p className="summary-description">
              {summary.description}
            </p>
          </article>
        ))}
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <div>
            <h3>Overall Progress</h3>
            <p>Keep going — every completed task counts.</p>
          </div>

          <span className="progress-percentage">
            {completionRate}%
          </span>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label="Task completion progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionRate}
        >
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p className="progress-caption">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>
    </section>
  );
}

export default TaskSummary;
