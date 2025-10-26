import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for cookies and CSRF tokens
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to include CSRF token
api.interceptors.request.use(
  async (config) => {
    // Try to get CSRF token from cookie or localStorage
    const getCsrfToken = () => {
      return (
        localStorage.getItem("csrfToken") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrfToken="))
          ?.split("=")[1]
      );
    };

    const csrfToken = getCsrfToken();
    if (csrfToken && config.method !== "get") {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
