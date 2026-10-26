
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../db");
const Task = require("../models/Task");
const User = require("../models/User");

// Migration target: your test account
const USER_ID = "6adb471bfe09e841bf6bebe2";

// Match tasks that have no owner yet
const unassignedFilter = {
  $or: [
    { owner: { $exists: false } },
    { owner: null },
  ],
};

async function migrateLegacyTasks() {
  try {
    await connectDB();

    // Verify that the target user exists
    const user = await User.findById(USER_ID).select("_id");

    if (!user) {
      throw new Error("Migration stopped: target user was not found.");
    }

    // Safety check: expect exactly six legacy tasks
    const unassignedCount = await Task.countDocuments(
      unassignedFilter
    );

    console.log("Unassigned tasks found:", unassignedCount);

    if (unassignedCount !== 6) {
      throw new Error(
        `Migration stopped: expected 6 unassigned tasks, found ${unassignedCount}. No tasks were changed.`
      );
    }

    // Assign the six tasks to the verified user
    const result = await Task.updateMany(
      unassignedFilter,
      { $set: { owner: user._id } }
    );

    console.log("Tasks matched:", result.matchedCount);
    console.log("Tasks modified:", result.modifiedCount);

    // Verify the migration
    const remainingUnassigned = await Task.countDocuments(
      unassignedFilter
    );

    const ownedTaskCount = await Task.countDocuments({
      owner: user._id,
    });

    console.log("Remaining unassigned tasks:", remainingUnassigned);
    console.log("Tasks owned by test account:", ownedTaskCount);

    if (remainingUnassigned !== 0 || ownedTaskCount !== 7) {
      throw new Error(
        "Migration completed, but verification did not match expectations. Please inspect the database before retrying."
      );
    }

    console.log("Migration and verification completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

migrateLegacyTasks();
