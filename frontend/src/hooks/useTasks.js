
import { useCallback, useRef, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [limit] = useState(5);

  // Keep the latest filters without recreating loadTasks.
  const activeFiltersRef = useRef({
    searchTerm: "",
    statusFilter: "all",
    priorityFilter: "all",
    dueDateFilter: "all",
    sortBy: "newest",
  });

  const loadTasks = useCallback(
    async (page = 1, filters = activeFiltersRef.current) => {
      try {
        setLoading(true);
        setError("");

        activeFiltersRef.current = filters;

        const result = await getTasks(page, limit, filters);

        setTasks(result.tasks);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
        setTotalTasks(result.totalTasks);

        return true;
      } catch (err) {
        setError(err.message || "Failed to load tasks");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  async function addTask(taskData) {
    setError("");

    try {
      await createTask(taskData);
    } catch (err) {
      setError(err.message || "Failed to create task");
      throw err;
    }

    const refreshed = await loadTasks(
      currentPage,
      activeFiltersRef.current
    );

    if (!refreshed) {
      setError(
        "Task created successfully, but the task list could not be refreshed. Please reload."
      );
    }
  }

  async function editTask(taskId, updates) {
    try {
      setError("");

      const updatedTask = await updateTask(taskId, updates);

      const refreshed = await loadTasks(
        currentPage,
        activeFiltersRef.current
      );

      if (!refreshed) {
        setError(
          "Task updated successfully, but the task list could not be refreshed. Please reload."
        );
      }

      return updatedTask;
    } catch (err) {
      setError(err.message || "Failed to update task");
      throw err;
    }
  }

  async function removeTask(taskId) {
    try {
      setError("");

      await deleteTask(taskId);

      const refreshed = await loadTasks(
        currentPage,
        activeFiltersRef.current
      );

      // Move back if deleting the last task on this page.
      if (refreshed && currentPage > 1 && tasks.length === 1) {
        await loadTasks(
          currentPage - 1,
          activeFiltersRef.current
        );
      }
    } catch (err) {
      setError(err.message || "Failed to delete task");
      throw err;
    }
  }

  return {
    tasks,
    loading,
    error,
    setError,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    currentPage,
    totalPages,
    totalTasks,
    limit,
  };
}

export default useTasks;  
   


