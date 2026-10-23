
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

  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (due < today) {
    return { label: "Overdue", className: "due-overdue" };
  }

  if (due.getTime() === today.getTime()) {
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

  function handleEdit() {
    console.log("EDIT BUTTON CLICKED", task);

    if (typeof onEditTask !== "function") {
      console.error("onEditTask is missing from TaskList.jsx");
      return;
    }

    onEditTask(task);
  }

  return (
    <li className="task-item">
      <h3>{task.title}</h3>

      <p>{task.description || "No description provided."}</p>

      <p>
        <strong>Priority:</strong>{" "}
        {task.priority
          ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
          : "Medium"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {task.status === "in-progress"
          ? "In Progress"
          : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
      </p>

      <p>
        <strong>Due date:</strong> {formatDueDate(task.dueDate)}
      </p>

      <span className={`due-badge ${dueDateStatus.className}`}>
        {dueDateStatus.label}
      </span>

      <div className="task-actions">
        <label htmlFor={`status-${task._id}`}>Change status</label>

        <select
          id={`status-${task._id}`}
          value={task.status}
          onChange={(event) =>
            onStatusChange(task._id, { status: event.target.value })
          }
          aria-label={`Change status for ${task.title}`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button type="button" onClick={handleEdit}>
          Edit Task
        </button>

        <button
          type="button"
          onClick={() => onTaskDelete(task._id)}
        >
          Delete Task
        </button>
      </div>
    </li>
  );
}

export default TaskItem;  


 


