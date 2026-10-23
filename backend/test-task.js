
require("dotenv").config();

const mongoose = require("mongoose");
const Task = require("./models/Task");

async function testTask() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const task = await Task.create({
      title: "Learn MongoDB Atlas",
      description: "Connect MongoDB to my Express backend",
      priority: "high",
      status: "in-progress",
    });

    console.log("SUCCESS: Task saved to MongoDB!");
    console.log(task.toObject());

    await Task.deleteOne({ _id: task._id });
    console.log("TEST CLEANUP: Temporary task deleted.");
  } catch (error) {
    console.error("TEST FAILED:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

testTask(); 
