const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "tasks.json");

// Read tasks
const getTasks = () => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Save tasks
const saveTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Home
app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

// GET all tasks
app.get("/tasks", (req, res) => {
  const tasks = getTasks();
  res.json(tasks);
});

// GET single task
app.get("/tasks/:id", (req, res) => {
  const tasks = getTasks();

  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.json(task);
});

// POST task
app.post("/tasks", (req, res) => {
  const tasks = getTasks();

  const newTask = {
    id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
    title: req.body.title,
    completed: req.body.completed || false,
  };

  tasks.push(newTask);

  saveTasks(tasks);

  res.status(201).json(newTask);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  const tasks = getTasks();

  const id = Number(req.params.id);

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  saveTasks(tasks);

  res.json({
    message: "Task deleted successfully",
    task: deletedTask,
  });
});

// PUT task
app.put("/tasks/:id", (req, res) => {
  const tasks = getTasks();

  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  task.title = req.body.title;
  task.completed = req.body.completed;

  saveTasks(tasks);

  res.json({
    message: "Task updated successfully",
    task: task,
  });
});

app.listen(PORT, () => {
  console.log(`server is running... at: ${PORT}`);
});

