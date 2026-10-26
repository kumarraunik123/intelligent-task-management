
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
      <div className="task-list-state" role="status">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading your tasks...</p>
      </div>
    );
  }

  // Error state with Retry button
  if (error) {
    return (
      <div className="task-list-error" role="alert">
        <h3>Unable to load tasks</h3>
        <p>{error}</p>
        <button
          className="primary-button"
          type="button"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-state-icon" aria-hidden="true">
          ✓
        </div>
        <h3>No tasks found</h3>
        <p>
          Try changing your search or filters, or create a new task
          to get started.
        </p>
      </div>
    );
  }

  return (
    <section className="task-list-section" aria-label="Task results">
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
        <nav className="pagination" aria-label="Task list pagination">
          <button
            className="pagination-button"
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            ← Previous
          </button>

          <span className="pagination-info">
            Page <strong>{currentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </span>

          <button
            className="pagination-button"
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            Next →
          </button>
        </nav>
      )}
    </section>
  );
}

export default TaskList;
