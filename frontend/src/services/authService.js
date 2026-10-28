
const API_URL = "/api/auth";

// Register a new user
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Registration failed");
  }

  if (result.token) {
    localStorage.setItem("token", result.token);
  }

  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result;
}

// Log in an existing user
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Login failed");
  }

  if (result.token) {
    localStorage.setItem("token", result.token);
  }

  if (result.user) {
    localStorage.setItem("user", JSON.stringify(result.user));
  }

  return result;
}

// Log out the current user
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Get the saved user
export function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

// Check whether a token is saved
export function isLoggedIn() {
  return Boolean(localStorage.getItem("token"));
}
