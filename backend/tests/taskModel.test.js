
const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");

const Task = require("../models/Task");

function createValidTask(overrides = {}) {
  return new Task({
    owner: new mongoose.Types.ObjectId(),
    title: "Learn automated testing",
    description: "Practice Node.js testing",
    ...overrides,
  });
}

test("Valid task should pass validation", async () => {
  await assert.doesNotReject(createValidTask().validate());
});

test("Task title is required", async () => {
  const task = createValidTask({ title: undefined });

  await assert.rejects(
    task.validate(),
    (error) => Boolean(error.errors.title)
  );
});

test("Empty task title should be rejected", async () => {
  const task = createValidTask({ title: "   " });

  await assert.rejects(
    task.validate(),
    (error) => Boolean(error.errors.title)
  );
});

test("Task title cannot exceed 150 characters", async () => {
  const task = createValidTask({ title: "A".repeat(151) });

  await assert.rejects(
    task.validate(),
    (error) => Boolean(error.errors.title)
  );
});

test("Invalid priority should be rejected", async () => {
  const task = createValidTask({ priority: "urgent" });

  await assert.rejects(
    task.validate(),
    (error) => Boolean(error.errors.priority)
  );
});

test("Invalid status should be rejected", async () => {
  const task = createValidTask({ status: "started" });

  await assert.rejects(
    task.validate(),
    (error) => Boolean(error.errors.status)
  );
});

test("Default priority and status should be applied", () => {
  const task = createValidTask();

  assert.equal(task.priority, "medium");
  assert.equal(task.status, "pending");
});

test("Task owner is required", async () => {
  const task = createValidTask({ owner: undefined });

  await assert.rejects(
    task.validate(),
    (error) => Boolean(error.errors.owner)
  );
});  

