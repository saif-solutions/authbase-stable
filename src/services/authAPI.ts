import axios from "axios";
import {
  User,
  LoginCredentials,
  CreateUserData,
  UpdateUserData,
  Session,
  Analytics,
} from "@/types/api";

// Use production backend URL - this will work for both development and production
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://authbase-pro.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Authentication
  login: (credentials: LoginCredentials) =>
    api.post<{ token: string; user: User }>("/auth/login", credentials),

  logout: () => api.post("/auth/logout"),

  refreshToken: () => api.post<{ token: string }>("/auth/refresh"),

  // Users
  getUsers: () => api.get<{ users: User[] }>("/users"),

  getUser: (id: string) => api.get<{ user: User }>(`/users/${id}`),

  createUser: (userData: CreateUserData) =>
    api.post<{ user: User }>("/users", userData),

  updateUser: (id: string, userData: UpdateUserData) =>
    api.put<{ user: User }>(`/users/${id}`, userData),

  deleteUser: (id: string) => api.delete(`/users/${id}`),

  // Sessions
  getSessions: () => api.get<{ sessions: Session[] }>("/sessions"),

  revokeSession: (sessionId: string) => api.delete(`/sessions/${sessionId}`),

  // Analytics
  getAnalytics: () => api.get<Analytics>("/analytics"),
};

export default api;
