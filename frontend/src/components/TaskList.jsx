
import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  loading,
  error,
  onRetry,
  onStatusChange,
  onTaskDelete,
  onEditTask,
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Loading state
  if (loading) {
    return (
      <p className="task-list-message" role="status">
        Loading tasks...
      </p>
    );
  }

  // Error state with Retry button
  if (error) {
    return (
      <div className="task-list-error" role="alert">
        <h3>Unable to load tasks</h3>
        <p>{error}</p>

        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <h3>No tasks found</h3>
        <p>
          Try changing your search or filters, or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div>
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onStatusChange={onStatusChange}
            onTaskDelete={onTaskDelete}
            onEditTask={onEditTask}
          />
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskList;  






