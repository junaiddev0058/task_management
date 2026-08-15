import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompleted, setEditCompleted] = useState(false);

  // GET tasks
  useEffect(() => {
    fetch("http://localhost:4000/tasks")
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
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

    fetch("http://localhost:4000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks([...tasks, data]);
        setTitle("");
        setCompleted(false);
      });
  };

  // Start Editing
  const editTask = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditCompleted(task.completed);
  };

  // PUT - Update Task
  const updateTask = (e) => {
    e.preventDefault();

    const updatedTask = {
      title: editTitle,
      completed: editCompleted,
    };

    fetch(`http://localhost:4000/tasks/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then((data) => {
        setTasks(
          tasks.map((task) =>
            task.id === editingId ? data.task : task
          )
        );

        setEditingId(null);
        setEditTitle("");
        setEditCompleted(false);
      });
  };

  // DELETE - Delete Task
  const deleteTask = (id) => {
    fetch(`http://localhost:4000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
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
                onClick={() => setEditingId(null)}
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

                <div className="task-card" key={task.id}>

                  <div className="task-info">

                    <h3>{task.title}</h3>

                    <span
                      className={
                        task.completed
                          ? "status completed"
                          : "status pending"
                      }
                    >
                      {task.completed
                        ? "Completed"
                        : "Pending"}
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
                      onClick={() => deleteTask(task.id)}
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