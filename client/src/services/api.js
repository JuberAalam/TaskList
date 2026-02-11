import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ================= REQUEST INTERCEPTOR ================= */
/* Automatically attach token */

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
/* Auto logout if token expired */

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Session expired. Logging out...");

      localStorage.removeItem("token");

      // redirect safely
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/* ================= PROFILE APIs ================= */

export const fetchProfile = () => API.get("/user/me");

export const updateProfile = (data) => API.put("/user/me", data);

export default API;
