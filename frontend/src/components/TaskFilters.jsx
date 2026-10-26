
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
    <section
      className="task-filters-section"
      aria-label="Search and filter tasks"
    >
      <div className="filters-heading">
        <div>
          <h3>Find your tasks</h3>
          <p>Search, filter, and organize your work.</p>
        </div>

        <button
          className="clear-filters-button"
          type="button"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      </div>

      <div className="task-filters">
        <div className="filter-field search-field">
          <label htmlFor="task-search">Search tasks</label>
          <input
            id="task-search"
            name="search"
            type="search"
            placeholder="Search by task title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="status-filter">Status</label>
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
        </div>

        <div className="filter-field">
          <label htmlFor="priority-filter">Priority</label>
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
        </div>

        <div className="filter-field">
          <label htmlFor="due-date-filter">Due date</label>
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
        </div>

        <div className="filter-field">
          <label htmlFor="sort-by">Sort by</label>
          <select
            id="sort-by"
            name="sortBy"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="dueDate">Due date (earliest first)</option>
            <option value="priority">Priority (high to low)</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>
      </div>
    </section>
  );
}

export default TaskFilters;
