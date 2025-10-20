export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "Admin" | "User" | "Moderator";
  status: "Active" | "Inactive";
  lastLogin: string;
  createdAt: string;
  verified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "Admin" | "User" | "Moderator";
  phone?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "Admin" | "User" | "Moderator";
  status?: "Active" | "Inactive";
  phone?: string;
}

export interface Session {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  lastActivity: string;
  createdAt: string;
}

export interface Analytics {
  totalUsers: number;
  activeSessions: number;
  dailyRequests: number;
  successRate: number;
}
