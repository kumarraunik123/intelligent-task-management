
import { useEffect, useRef, useState } from "react";

function TaskForm({
  onTaskCreated,
  editingTask,
  onTaskUpdated,
  onCancelEdit,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Prevent duplicate submissions immediately.
  const submissionLock = useRef(false);

  const isEditing = Boolean(editingTask);

  useEffect(() => {
    if (!editingTask) {
      resetForm();
      return;
    }

    setTitle(editingTask.title || "");
    setDescription(editingTask.description || "");
    setPriority(editingTask.priority || "medium");
    setStatus(editingTask.status || "pending");

    if (editingTask.dueDate) {
      const date = new Date(editingTask.dueDate);

      if (Number.isNaN(date.getTime())) {
        setDueDate("");
      } else {
        const localDate = new Date(
          date.getTime() -
            date.getTimezoneOffset() * 60 * 1000
        );

        setDueDate(localDate.toISOString().slice(0, 10));
      }
    } else {
      setDueDate("");
    }

    setError("");
    setSuccess("");
  }, [editingTask]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("pending");
    setDueDate("");
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    // Synchronously block duplicate submissions.
    if (submissionLock.current) return;
    submissionLock.current = true;

    setError("");
    setSuccess("");

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      submissionLock.current = false;
      return;
    }

    if (trimmedTitle.length > 150) {
      setError("Task title cannot exceed 150 characters.");
      submissionLock.current = false;
      return;
    }

    if (trimmedDescription.length > 1000) {
      setError("Description cannot exceed 1000 characters.");
      submissionLock.current = false;
      return;
    }

    if (!["low", "medium", "high"].includes(priority)) {
      setError("Please select a valid priority.");
      submissionLock.current = false;
      return;
    }

    if (!["pending", "in-progress", "completed"].includes(status)) {
      setError("Please select a valid status.");
      submissionLock.current = false;
      return;
    }

    if (dueDate) {
      const selectedDate = new Date(`${dueDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (Number.isNaN(selectedDate.getTime())) {
        setError("Please enter a valid due date.");
        submissionLock.current = false;
        return;
      }

      if (selectedDate < today) {
        setError("Due date cannot be in the past.");
        submissionLock.current = false;
        return;
      }
    }

    setSubmitting(true);

    try {
      const taskData = {
        title: trimmedTitle,
        description: trimmedDescription,
        priority,
        status,
        dueDate: dueDate || null,
      };

      if (isEditing) {
        if (typeof onTaskUpdated !== "function") {
          throw new Error("Task update handler is not connected.");
        }

        await onTaskUpdated(editingTask._id, taskData);
        setSuccess("Task updated successfully!");
      } else {
        if (typeof onTaskCreated !== "function") {
          throw new Error("Task creation handler is not connected.");
        }

        await onTaskCreated(taskData);
        resetForm();
        setSuccess("Task created successfully!");
      }
    } catch (err) {
      setError(
        err.message ||
          `Unable to ${isEditing ? "update" : "create"} task. Please try again.`
      );
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
    }
  }

  function handleCancel() {
    if (submissionLock.current) return;

    resetForm();

    if (typeof onCancelEdit === "function") {
      onCancelEdit();
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? "Edit Task" : "Create a Task"}</h2>

      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="form-success">
          {success}
        </p>
      )}

      <label htmlFor="task-title">Task title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          setError("");
          setSuccess("");
        }}
        placeholder="Enter task title"
        maxLength={150}
        required
      />

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
          setError("");
          setSuccess("");
        }}
        placeholder="Enter task description"
        maxLength={1000}
      />

      <label htmlFor="task-priority">Priority</label>
      <select
        id="task-priority"
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <label htmlFor="task-status">Status</label>
      <select
        id="task-status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <label htmlFor="task-due-date">Due date</label>
      <input
        id="task-due-date"
        type="date"
        value={dueDate}
        onChange={(event) => {
          setDueDate(event.target.value);
          setError("");
          setSuccess("");
        }}
      />

      <button type="submit" disabled={submitting}>
        {submitting
          ? isEditing
            ? "Updating..."
            : "Adding..."
          : isEditing
            ? "Save Changes"
            : "Add Task"}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={handleCancel}
          disabled={submitting}
        >
          Cancel Edit
        </button>
      )}
    </form>
  );
}

export default TaskForm;  

  



