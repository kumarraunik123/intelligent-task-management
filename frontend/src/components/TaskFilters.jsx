
function TaskFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  dueDateFilter,
  setDueDateFilter,
  sortBy,
  setSortBy,
  onClearFilters,
}) {
  return (
    <section className="task-filters">
      <label htmlFor="task-search">Search tasks</label>
      <input
        id="task-search"
        name="search"
        type="search"
        placeholder="Search by task title..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <label htmlFor="status-filter">Filter by status</label>
      <select
        id="status-filter"
        name="status"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <label htmlFor="priority-filter">Filter by priority</label>
      <select
        id="priority-filter"
        name="priority"
        value={priorityFilter}
        onChange={(event) => setPriorityFilter(event.target.value)}
      >
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <label htmlFor="due-date-filter">Filter by due date</label>
      <select
        id="due-date-filter"
        name="dueDate"
        value={dueDateFilter}
        onChange={(event) => setDueDateFilter(event.target.value)}
      >
        <option value="all">All due dates</option>
        <option value="overdue">Overdue tasks</option>
        <option value="today">Due today</option>
        <option value="upcoming">Upcoming tasks</option>
      </select>

      <label htmlFor="sort-by">Sort tasks by</label>
      <select
        id="sort-by"
        name="sortBy"
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
      >
        <option value="newest">Newest first</option>
        <option value="dueDate">Due date (earliest first)</option>
        <option value="priority">Priority (high to low)</option>
        <option value="title">Title (A-Z)</option>
      </select>

      <button type="button" onClick={onClearFilters}>
        Clear Filters
      </button>
    </section>
  );
}

export default TaskFilters;  


  
