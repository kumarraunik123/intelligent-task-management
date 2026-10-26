
function getDueDateStatus(dueDate, status) {
  if (status === "completed") {
    return { label: "Completed", className: "due-completed" };
  }

  if (!dueDate) {
    return { label: "No due date", className: "no-due-date" };
  }

  const due = new Date(dueDate);

  if (Number.isNaN(due.getTime())) {
    return { label: "Invalid due date", className: "no-due-date" };
  }

  const dueDay = new Date(due);
  const today = new Date();

  dueDay.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (dueDay < today) {
    return { label: "Overdue", className: "due-overdue" };
  }

  if (dueDay.getTime() === today.getTime()) {
    return { label: "Due Today", className: "due-today" };
  }

  return { label: "Upcoming", className: "due-upcoming" };
}

function formatDueDate(dueDate) {
  if (!dueDate) return "No due date";

  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TaskItem({
  task,
  onStatusChange,
  onTaskDelete,
  onEditTask,
}) {
  const dueDateStatus = getDueDateStatus(task.dueDate, task.status);

  const priority = ["low", "medium", "high"].includes(task.priority)
    ? task.priority
    : "medium";

  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  const statusLabel = statusLabels[task.status] || "Pending";

  function handleEdit() {
    if (typeof onEditTask === "function") {
      onEditTask(task);
    }
  }

  return (
    <li className="task-item">
      <div className="task-item-header">
        <div className="task-title-group">
          <h3>{task.title}</h3>
          <span className={`priority-badge priority-${priority}`}>
            {priority} priority
          </span>
        </div>

        <span
          className={`status-badge status-${task.status || "pending"}`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="task-description">
        {task.description || "No description provided."}
      </p>

      <div className="task-metadata">
        <div className="task-metadata-item">
          <span className="metadata-label">Due date</span>
          <span className="metadata-value">
            {formatDueDate(task.dueDate)}
          </span>
        </div>

        <div className="task-metadata-item">
          <span className="metadata-label">Deadline</span>
          <span className={`due-badge ${dueDateStatus.className}`}>
            {dueDateStatus.label}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <div className="task-status-control">
          <label htmlFor={`status-${task._id}`}>
            Update status
          </label>

          <select
            id={`status-${task._id}`}
            value={task.status}
            onChange={(event) =>
              onStatusChange(task._id, {
                status: event.target.value,
              })
            }
            aria-label={`Change status for ${task.title}`}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="task-action-buttons">
          <button
            className="secondary-button"
            type="button"
            onClick={handleEdit}
          >
            Edit task
          </button>

          <button
            className="danger-button"
            type="button"
            onClick={() => onTaskDelete(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
}

export default TaskItem;
