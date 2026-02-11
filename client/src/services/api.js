import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

// Use environment variable for backend URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://tasklist-crn1.onrender.com/api",
});

/* ================= REQUEST INTERCEPTOR ================= */
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ================= AUTHENTICATION APIS ================= */
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

/* ================= PROFILE APIS ================= */
export const fetchProfile = () => API.get("/users/me");
export const updateProfile = (data) => API.put("/users/me", data);

/* ================= TASK APIS ================= */
export const getTasks = () => API.get("/tasks");
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (taskId, data) => API.put(`/tasks/${taskId}`, data);
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}`);

/* ================= EXPORT AXIOS INSTANCE ================= */
export default API;
