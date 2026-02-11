import { useEffect, useState } from "react";
import API, { fetchProfile, updateProfile } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ✅ PROFILE STATES */
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const [darkMode, setDarkMode] =
    useState(localStorage.getItem("theme") === "dark");

  /* ================= DARK MODE ================= */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  /* ================= FETCH USER ✅ ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetchProfile();

        setUser(res.data);

        setProfileForm({
          name: res.data.name,
          email: res.data.email,
        });
      } catch {
        logout();
      }
    };

    fetchUser();
  }, []);

  /* ================= FETCH TASKS ================= */

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await API.get("/tasks");

        setTasks(res.data);
        setFilteredTasks(res.data);
      } catch (err) {
        if (err.response?.status === 401) logout();
        else setError("Failed to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  /* ================= SEARCH ================= */

  useEffect(() => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredTasks(filtered);
  }, [search, tasks]);

  /* ================= ANALYTICS ================= */

  const chartData = tasks
    .filter((task) => task.createdAt)
    .reduce((acc, task) => {
      const date = new Date(task.createdAt).toLocaleDateString();

      const existing = acc.find((item) => item.date === date);

      if (existing) existing.count += 1;
      else acc.push({ date, count: 1 });

      return acc;
    }, []);

  /* ================= ADD TASK ================= */

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      const res = await API.post("/tasks", { title: newTask });

      setTasks((prev) => [...prev, res.data]);
      setNewTask("");
    } catch {
      setError("Failed to add task.");
    }
  };

  /* ================= DELETE TASK ================= */

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);

      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch {
      setError("Failed to delete task.");
    }
  };

  /* ================= EDIT TASK ================= */

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    try {
      const res = await API.put(`/tasks/${id}`, {
        title: editText,
      });

      setTasks((prev) =>
        prev.map((task) => (task._id === id ? res.data : task))
      );

      setEditingId(null);
      setEditText("");
    } catch {
      setError("Failed to update task.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  /* ================= UPDATE PROFILE ✅🔥 ================= */

  const handleProfileUpdate = async () => {
    try {
      const res = await updateProfile(profileForm);

      setUser(res.data);
      setEditingProfile(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-all">
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* HEADER */}
        <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-lg mb-8">
          <div>
            <h1 className="text-3xl font-bold">Task Dashboard</h1>
            <p className="text-sm mt-1">
              Welcome back, {user?.name || "User"} 👋
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-white/20 px-4 py-2 rounded-lg"
            >
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* PROFILE SECTION */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">User Profile</h2>

          {editingProfile ? (
            <div className="space-y-3">

              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="w-full border p-3 rounded-lg dark:bg-gray-700"
              />

              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="w-full border p-3 rounded-lg dark:bg-gray-700"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleProfileUpdate}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setEditingProfile(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={() => setEditingProfile(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* ANALYTICS */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Task Analytics (Daily)
          </h2>

          {chartData.length === 0 ? (
            <div className="text-center text-gray-400 mt-20">
              No analytics data yet 📊
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* TASKS */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 dark:bg-gray-700"
          />

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="flex-1 border p-3 rounded-lg dark:bg-gray-700"
            />
            <button
              onClick={addTask}
              className="bg-indigo-600 text-white px-5 py-3 rounded-lg"
            >
              Add Task
            </button>
          </div>

          {loading && (
            <div className="flex justify-center h-40 items-center">
              <Oval height={45} width={45} color="#6366f1" />
            </div>
          )}

          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                {editingId === task._id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 border p-2 rounded dark:bg-gray-600"
                    />
                    <button
                      onClick={() => saveEdit(task._id)}
                      className="bg-green-500 text-white px-3 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-3 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{task.title}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEdit(task)}
                        className="text-blue-500 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
