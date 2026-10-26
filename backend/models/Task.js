
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    // User who owns this task
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minLength: [1, "Task title cannot be empty"],
      maxlength: [150, "Task title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    dueDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          return (
            value === null ||
            (value instanceof Date && !Number.isNaN(value.getTime()))
          );
        },
        message: "Due date must be a valid date",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
