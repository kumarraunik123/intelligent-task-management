
import { useState } from "react";
import {
  loginUser,
  registerUser,
} from "../services/authService";

function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;

      if (mode === "register") {
        result = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });
      } else {
        result = await loginUser({
          email: email.trim(),
          password,
        });
      }

      if (!result.token) {
        throw new Error(
          "Authentication succeeded, but no token was returned."
        );
      }

      onAuthenticated(result.user);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((current) =>
      current === "login" ? "register" : "login"
    );
    setError("");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Intelligent Task Management</h1>

        <h2>
          {mode === "login" ? "Welcome Back" : "Create Your Account"}
        </h2>

        <p>
          {mode === "login"
            ? "Log in to manage your tasks."
            : "Register to start managing your tasks."}
        </p>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full name</label>
              <input
                id="auth-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email address</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={8}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Log In"
                : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            className="auth-switch-button"
            onClick={switchMode}
            disabled={loading}
          >
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default AuthForm;
