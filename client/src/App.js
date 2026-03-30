import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Fetch tasks
  const fetchTasks = () => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = () => {
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title: input })
    }).then(() => {
      setInput("");
      fetchTasks();
    });
  };

  // Delete task
  const deleteTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE"
    }).then(fetchTasks);
  };

  // Toggle complete
  const toggleTask = (id) => {
    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT"
    }).then(fetchTasks);
  };

  return (
    <div>
      <h1>Study Tasks</h1>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter task"
      />
      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              onClick={() => toggleTask(task._id)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer"
              }}
            >
              {task.title}
            </span>

            <button onClick={() => deleteTask(task._id)}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;