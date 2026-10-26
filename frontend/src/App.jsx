
import { useState, useEffect } from "react";
import "./App.css";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";
import TaskSummary from "./components/TaskSummary";
import AuthForm from "./components/AuthForm";

import useTasks from "./hooks/useTasks";
import useTaskFilters from "./hooks/useTaskFilters";

import {
  getCurrentUser,
  isLoggedIn,
  logoutUser,
} from "./services/authService";

function App() {
  const [user, setUser] = useState(() =>
    isLoggedIn() ? getCurrentUser() : null
  );

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

  useEffect(() => {
    if (!user || !isLoggedIn()) {
      return;
    }

    loadTasks(1, filters);

    // Reload tasks when filters or sorting change.
  }, [
    user,
    searchTerm,
    statusFilter,
    priorityFilter,
    dueDateFilter,
    sortBy,
    loadTasks,
  ]);

  function handleAuthenticated(authenticatedUser) {
    setUser(authenticatedUser || getCurrentUser());
    setEditingTask(null);
    clearFilters();
    setError("");
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setEditingTask(null);
    setError("");
    clearFilters();
  }

  async function handlePageChange(page) {
    if (page < 1 || page > totalPages || loading) {
      return;
    }

    await loadTasks(page, filters);
  }

  async function handleTaskCreated(taskData) {
    setError("");
    await addTask(taskData);
  }

  async function handleTaskUpdated(taskId, updates) {
    setError("");
    await editTask(taskId, updates);
    setEditingTask(null);
  }

  async function handleStatusChange(taskId, updates) {
    setError("");

    try {
      await editTask(taskId, updates);
    } catch {
      // useTasks records the API error.
    }
  }

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
      // useTasks records the API error.
    }
  }

  function handleClearFilters() {
    clearFilters();
    setError("");
  }

  async function handleRetry() {
    await loadTasks(currentPage, filters);
  }

  if (!user || !isLoggedIn()) {
    return <AuthForm onAuthenticated={handleAuthenticated} />;
  }

  return (
    <main>
      <header className="app-header">
        <div>
          <h1>Intelligent Task Management</h1>
          <p>
            Welcome, {user.name || user.email || "User"}
          </p>
        </div>

        <button type="button" onClick={handleLogout}>
          Log Out
        </button>
      </header>

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
