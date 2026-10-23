 
import { useState, useEffect } from "react";
import "./App.css";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";
import TaskSummary from "./components/TaskSummary";

import useTasks from "./hooks/useTasks";
import useTaskFilters from "./hooks/useTaskFilters";

function App() {
  const {
    tasks,
    loading,
    error,
    setError,
    addTask,
    editTask,
    removeTask,
    loadTasks,
    currentPage,
    totalPages,
    totalTasks,
  } = useTasks();

  const {
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
    clearFilters,
  } = useTaskFilters(tasks);

  const [editingTask, setEditingTask] = useState(null);

  const filters = {
    searchTerm,
    statusFilter,
    priorityFilter,
    dueDateFilter,
    sortBy,
  };

  // Load tasks when filters or sorting change.
  useEffect(() => {
    loadTasks(1, filters);
  }, [
    searchTerm,
    statusFilter,
    priorityFilter,
    dueDateFilter,
    sortBy,
    loadTasks,
  ]);

  // Handle pagination.
  async function handlePageChange(page) {
    if (page < 1 || page > totalPages || loading) {
      return;
    }

    await loadTasks(page, filters);
  }

  // Create a task and allow errors to reach TaskForm.
  async function handleTaskCreated(taskData) {
    setError("");
    await addTask(taskData);
  }

  // Keep edit mode open if updating fails.
  async function handleTaskUpdated(taskId, updates) {
    setError("");
    await editTask(taskId, updates);
    setEditingTask(null);
  }

  // Handle task status updates.
  async function handleStatusChange(taskId, updates) {
    setError("");

    try {
      await editTask(taskId, updates);
    } catch {
      // The useTasks hook records the API error.
    }
  }

  // Delete a task only after confirmation.
  async function handleTaskDelete(taskId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await removeTask(taskId);

      if (editingTask?._id === taskId) {
        setEditingTask(null);
      }
    } catch {
      // The useTasks hook records the API error.
    }
  }

  // Clear filters.
  function handleClearFilters() {
    clearFilters();
    setError("");
  }

  // Retry loading the current page with the active filters.
  async function handleRetry() {
    await loadTasks(currentPage, filters);
  }

  return (
    <main>
      <h1>Intelligent Task Management</h1>

      {/* Show the global error only when tasks exist.
          TaskList displays loading errors when the list is empty. */}
      {error && tasks.length > 0 && (
        <div className="app-error" role="alert">
          <p>{error}</p>
          <button
            type="button"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      <TaskSummary tasks={tasks} />

      <TaskForm
        onTaskCreated={handleTaskCreated}
        editingTask={editingTask}
        onTaskUpdated={handleTaskUpdated}
        onCancelEdit={() => setEditingTask(null)}
      />

      <h2>Your Tasks ({totalTasks})</h2>

      <TaskFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        dueDateFilter={dueDateFilter}
        setDueDateFilter={setDueDateFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onClearFilters={handleClearFilters}
      />

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onStatusChange={handleStatusChange}
        onTaskDelete={handleTaskDelete}
        onEditTask={setEditingTask}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}

export default App;  

 




     
   
  
 

   


