const Task = require("./models/Task");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); 

const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/vantage-buddy")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// 🧠 Temporary storage


/* =========================
   📌 ROOT ROUTE (for testing)
========================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* =========================
   📌 GET all tasks
========================= */
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

/* =========================
   📌 ADD a task
========================= */
app.post("/tasks", async (req, res) => {
  const { title } = req.body;

  const newTask = new Task({ title });

  await newTask.save();

  res.json({
    message: "Task saved to DB",
    task: newTask
  });
});

/* =========================
   ❌ DELETE task
========================= */
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  await Task.findByIdAndDelete(id);

  res.json({ message: "Task deleted" });
});

/* =========================
   ✅ TOGGLE COMPLETE
========================= */
app.put("/tasks/:id", async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);

  task.completed = !task.completed;

  await task.save();

  res.json(task);
});

/* =========================
   🔐 SIGNUP
========================= */
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    password: hashedPassword
  });

  await user.save();

  res.json({ message: "User created" });
});

/* =========================
   🔐 LOGIN
========================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Wrong password" });
  }

  const token = jwt.sign({ userId: user._id }, "secretkey");

  res.json({ token });
});
/* =========================
   🚀 START SERVER
========================= */
app.listen(5000, () => {
  console.log("Server running on port 5000");
});