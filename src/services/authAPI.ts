import { User } from "../contexts/AuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://authbase-pro.onrender.com/api";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

// Helper function to get authorization headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  // Store tokens from response
  if (data.accessToken && data.refreshToken) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return data.user;
};

export const register = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, confirmPassword: password, name }),
  });

  const data = await handleResponse(response);

  // Store tokens from response
  if (data.accessToken && data.refreshToken) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  return data.user;
};

export const logout = async (): Promise<void> => {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers,
    });
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    // Always clear tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      return null;
    }

    const data = await handleResponse(response);
    return data.user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

// Session interface
export interface Session {
  id: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
}

// Analytics interface
export interface Analytics {
  totalUsers: number;
  activeSessions: number;
  newUsersThisWeek: number;
  loginRate: number;
}

// User management methods
export const getUsers = async (): Promise<{ users: User[] }> => {
  const authHeaders = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: authHeaders,
  });

  return handleResponse(response);
};

export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
}): Promise<{ user: User }> => {
  const authHeaders = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const updateUser = async (
  id: string,
  userData: { email?: string; name?: string }
): Promise<{ user: User }> => {
  const authHeaders = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const deleteUser = async (id: string): Promise<void> => {
  const authHeaders = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }
};

// Sessions methods
export const getSessions = async (): Promise<{ sessions: Session[] }> => {
  const authHeaders = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: "GET",
    headers: authHeaders,
  });

  return handleResponse(response);
};

export const revokeSession = async (sessionId: string): Promise<void> => {
  const authHeaders = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: "DELETE",
    headers: authHeaders,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }
};

// Analytics methods
export const getAnalytics = async (): Promise<Analytics> => {
  const authHeaders = getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/analytics`, {
    method: "GET",
    headers: authHeaders,
  });

  return handleResponse(response);
};

// Legacy API object for compatibility with existing code
export const authAPI = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    login(credentials.email, credentials.password).then((user) => ({
      data: { user, token: "jwt-token" },
    })),

  logout: () => logout().then(() => ({ data: { message: "Logged out" } })),

  getCurrentUser: () =>
    getCurrentUser().then((user) => ({
      data: { user },
    })),

  refreshToken: () => Promise.resolve({ data: { token: "refreshed" } }),

  // Users
  getUsers: () => getUsers().then((data) => ({ data })),

  createUser: (userData: { email: string; password: string; name: string }) =>
    createUser(userData).then((data) => ({ data })),

  updateUser: (id: string, userData: { email?: string; name?: string }) =>
    updateUser(id, userData).then((data) => ({ data })),

  deleteUser: (id: string) =>
    deleteUser(id).then(() => ({ data: { message: "User deleted" } })),

  // Sessions
  getSessions: () => getSessions().then((data) => ({ data })),

  revokeSession: (sessionId: string) =>
    revokeSession(sessionId).then(() => ({
      data: { message: "Session revoked" },
    })),

  // Analytics
  getAnalytics: () => getAnalytics().then((data) => ({ data })),
};
