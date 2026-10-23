
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
    { label: "Total Tasks", value: totalTasks },
    { label: "Pending", value: pendingTasks },
    { label: "In Progress", value: inProgressTasks },
    { label: "Completed", value: completedTasks },
    { label: "Overdue", value: overdueTasks },
    { label: "Completion Rate", value: `${completionRate}%` },
  ];

  return (
    <section className="task-summary">
      <h2>Task Overview</h2>

      <div className="summary-grid">
        {summaries.map((summary) => (
          <article className="summary-card" key={summary.label}>
            <h3>{summary.label}</h3>
            <p>{summary.value}</p>
          </article>
        ))}
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <h3>Overall Progress</h3>
          <span>{completionRate}%</span>
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

        <p>
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>
    </section>
  );
}

export default TaskSummary;  

