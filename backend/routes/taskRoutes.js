
const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");

const router = express.Router();

// Helper: format validation errors
 /**function handleTaskError(error, res, defaultMessage) {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Invalid task data. Please check your input.",
      errors: Object.values(error.errors).map(
        (item) => item.message
      ),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid value provided for a task field.",
      errors: [error.message],
    });
  }

  console.error(defaultMessage, error.message);

  return res.status(500).json({
    success: false,
    message: defaultMessage,
  });
} 
**/ 

function handleTaskError(error, res, next, defaultMessage) {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Invalid task data. Please check your input.",
      errors: Object.values(error.errors).map(
        (item) => item.message
      ),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid value provided for a task field.",
      errors: [error.message],
    });
  }

  // Send unexpected errors to centralized error middleware
  error.message = `${defaultMessage}: ${error.message}`;
  return next(error);
}  

// CREATE a task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);

    return res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleTaskError(
      error,
      res,
      "Failed to create task"
    );
  }
});

// GET tasks with search, filters, sorting, and pagination
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 5);

    const search = req.query.search ?? "";
    const status = req.query.status ?? "all";
    const priority = req.query.priority ?? "all";
    const dueDate = req.query.dueDate ?? "all";
    const sortBy = req.query.sortBy ?? "newest";

    // Validate query parameter types
    if (
      typeof search !== "string" ||
      typeof status !== "string" ||
      typeof priority !== "string" ||
      typeof dueDate !== "string" ||
      typeof sortBy !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid search or filter parameters.",
      });
    }

    // Validate pagination
    if (
      !Number.isSafeInteger(page) ||
      !Number.isSafeInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100 ||
      !Number.isSafeInteger((page - 1) * limit)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Page must be a positive integer and limit must be between 1 and 100.",
      });
    }

    // Validate filter values
    if (
      !["all", "pending", "in-progress", "completed"].includes(status) ||
      !["all", "high", "medium", "low"].includes(priority) ||
      !["all", "overdue", "today", "upcoming"].includes(dueDate) ||
      !["newest", "dueDate", "priority", "title"].includes(sortBy)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid filter or sorting value.",
      });
    }

    // Build the MongoDB filter
    const filter = {};

    // Search by title, ignoring letter case
    if (search.trim()) {
      const escapedSearch = search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.title = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    if (status !== "all") {
      filter.status = status;
    }

    if (priority !== "all") {
      filter.priority = priority;
    }

    // Calculate the current date in India Standard Time
    const dateParts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());

    const dateValues = Object.fromEntries(
      dateParts.map((part) => [part.type, part.value])
    );

    const todayString =
      `${dateValues.year}-${dateValues.month}-${dateValues.day}`;

    const todayStart = new Date(
      `${todayString}T00:00:00+05:30`
    );

    const tomorrowStart = new Date(
      todayStart.getTime() + 24 * 60 * 60 * 1000
    );

    // Apply due-date filtering before pagination
    if (dueDate === "overdue") {
      filter.dueDate = { $lt: todayStart };

      // Overdue tasks must not be completed
      filter.status =
        status === "all"
          ? { $ne: "completed" }
          : status === "completed"
            ? { $in: [] }
            : status;
    } else if (dueDate === "today") {
      filter.dueDate = {
        $gte: todayStart,
        $lt: tomorrowStart,
      };
    } else if (dueDate === "upcoming") {
      filter.dueDate = { $gte: tomorrowStart };
    }

    // Sorting rules
    const sortOptions = {
      newest: { createdAt: -1, _id: -1 },
      dueDate: { dueDate: 1, _id: 1 },
      priority: { priority: -1, _id: 1 },
      title: { title: 1, _id: 1 },
    };

    const skip = (page - 1) * limit;

    let tasks;

    if (sortBy === "dueDate") {
      // Tasks without a due date appear last
      tasks = await Task.aggregate([
        { $match: filter },
        {
          $addFields: {
            dueDateMissing: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$dueDate", null] },
                    { $not: ["$dueDate"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
        {
          $sort: {
            dueDateMissing: 1,
            dueDate: 1,
            _id: 1,
          },
        },
        { $skip: skip },
        { $limit: limit },
        { $project: { dueDateMissing: 0 } },
      ]);
    } else {
      tasks = await Task.find(filter)
        .sort(sortOptions[sortBy])
        .skip(skip)
        .limit(limit);
    }

    // Count only matching tasks
    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      totalTasks,
      totalPages,
      currentPage: page,
      limit,
      data: tasks,
    });
  } catch (error) {
    return handleTaskError(
      error,
      res,
      "Failed to fetch tasks"
    );
  }
});

// GET one task by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleTaskError(
      error,
      res,
      "Failed to fetch task"
    );
  }
});

// UPDATE a task
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    return handleTaskError(
      error,
      res,
      "Failed to update task"
    );
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return handleTaskError(
      error,
      res,
      "Failed to delete task"
    );
  }
});

module.exports = router;  
  


