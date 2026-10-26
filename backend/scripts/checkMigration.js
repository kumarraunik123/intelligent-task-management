
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../db");
const Task = require("../models/Task");
const User = require("../models/User");

const USER_ID = "6adb471bfe09e841bf6bebe2";

async function checkMigration() {
  try {
    await connectDB();

    if (!mongoose.isValidObjectId(USER_ID)) {
      throw new Error("Target user ID is not a valid MongoDB ObjectId.");
    }

    const user = await User.findById(USER_ID).select("_id");

    if (!user) {
      console.log("Target user exists: NO");
      return;
    }

    const unassignedCount = await Task.countDocuments({
      $or: [
        { owner: { $exists: false } },
        { owner: null },
      ],
    });

    const ownedTaskCount = await Task.countDocuments({
      owner: user._id,
    });

    console.log("Target user exists: YES");
    console.log("Unassigned tasks:", unassignedCount);
    console.log("Tasks already owned by target user:", ownedTaskCount);
    console.log("Expected tasks after migration:", ownedTaskCount + unassignedCount);
    console.log("READ-ONLY CHECK: No tasks were modified.");
  } catch (error) {
    console.error("Check failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

checkMigration();
