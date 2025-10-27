import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for cookies and CSRF tokens
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to include Auth token and CSRF token
api.interceptors.request.use(
  async (config) => {
    // Get authentication token from localStorage
    const getAuthToken = () => {
      return (
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("token")
      );
    };

    // Get CSRF token from cookie or localStorage
    const getCsrfToken = () => {
      return (
        localStorage.getItem("csrfToken") ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("csrfToken="))
          ?.split("=")[1]
      );
    };

    const authToken = getAuthToken();
    const csrfToken = getCsrfToken();

    // Add Authorization header if token exists
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Add CSRF token for non-GET requests
    if (csrfToken && config.method !== "get") {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    console.log(
      `🔐 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      {
        hasAuth: !!authToken,
        hasCSRF: !!csrfToken,
      }
    );

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      `❌ API Error: ${error.response?.status} ${error.config?.url}`,
      error.response?.data
    );

    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("userEmail");
      sessionStorage.removeItem("token");

      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
