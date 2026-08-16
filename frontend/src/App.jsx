
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  const API_URL = "https://task-management-ten-fawn.vercel.app";

  // GET tasks
  useEffect(() => {
    fetch(`${API_URL}/tasks`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.log("GET tasks error:", error);
      });
  }, []);

  // POST - Add Task
  const addTask = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const newTask = {
      title: title,
      completed: completed,
    };

    fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks((prevTasks) => [...prevTasks, data]);
        setTitle("");
        setCompleted(false);
      })
      .catch((error) => {
        console.log("POST task error:", error);
      });
  };

  // Start Editing
  const editTask = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditCompleted(task.completed);
  };

  // PUT - Update Task
  const updateTask = (e) => {
    e.preventDefault();

    if (!editTitle.trim()) {
      return;
    }

    const updatedTask = {
      title: editTitle,
      completed: editCompleted,
    };

    fetch(`${API_URL}/tasks/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === editingId ? data.task : task
          )
        );

        setEditingId(null);
        setEditTitle("");
        setEditCompleted(false);
      })
      .catch((error) => {
        console.log("PUT task error:", error);
      });
  };

  // DELETE - Delete Task
  const deleteTask = (id) => {
    fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== id)
        );
      })
      .catch((error) => {
        console.log("DELETE task error:", error);
      });
  };

  return (
    <div className="app">
      <div className="container">

        {/* Header */}
        <div className="header">
          <h1>Task Manager</h1>
          <p>Manage your daily tasks easily</p>
        </div>

        {/* Add Task Form */}
        <form className="task-form" onSubmit={addTask}>
          <input
            className="task-input"
            type="text"
            placeholder="What do you need to do?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Completed
          </label>

          <button className="add-btn" type="submit">
            + Add Task
          </button>
        </form>

        {/* Update Form */}
        {editingId !== null && (
          <form className="edit-form" onSubmit={updateTask}>
            <h2>Edit Task</h2>

            <input
              className="task-input"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={editCompleted}
                onChange={(e) => setEditCompleted(e.target.checked)}
              />
              Completed
            </label>

            <div className="edit-buttons">
              <button className="update-btn" type="submit">
                Update Task
              </button>

              <button
                className="cancel-btn"
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setEditTitle("");
                  setEditCompleted(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Tasks */}
        <div className="tasks-section">
          <div className="tasks-header">
            <h2>My Tasks</h2>

            <span className="task-count">
              {tasks.length} Tasks
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="empty">
              <p>No tasks yet.</p>
              <span>Add your first task above.</span>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div className="task-card" key={task._id}>

                  <div className="task-info">
                    <h3>{task.title}</h3>

                    <span
                      className={
                        task.completed
                          ? "status completed"
                          : "status pending"
                      }
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button
                      className="edit-btn"
                      onClick={() => editTask(task)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
