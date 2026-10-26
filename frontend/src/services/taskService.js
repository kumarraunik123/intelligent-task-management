
const API_URL = "http://localhost:5000/api/tasks";

// Get the JWT token saved after login.
function getAuthHeaders(includeJson = false) {
  const token = localStorage.getItem("token");

  const headers = {};

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

// GET tasks with server-side filtering and pagination
export async function getTasks(
  page = 1,
  limit = 5,
  filters = {}
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: filters.searchTerm || "",
    status: filters.statusFilter || "all",
    priority: filters.priorityFilter || "all",
    dueDate: filters.dueDateFilter || "all",
    sortBy: filters.sortBy || "newest",
  });

  const response = await fetch(
    `${API_URL}?${params.toString()}`,
    {
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch tasks");
  }

  return {
    tasks: result.data,
    totalTasks: result.totalTasks,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    limit: result.limit,
  };
}

// CREATE a new task
export async function createTask(taskData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(taskData),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to create task");
  }

  return result.data;
}

// UPDATE an existing task
export async function updateTask(taskId, updates) {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(updates),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to update task");
  }

  return result.data;
}

// DELETE a task
export async function deleteTask(taskId) {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to delete task");
  }

  return result;
}
