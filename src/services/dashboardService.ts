import api from "./api";

export interface DashboardData {
  user?: {
    email: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    authType: string;
    isOAuthUser: boolean;
  };
  subscription?: {
    status: string;
    plan: string;
    name: string;
    price: number;
    rateLimit: number;
    maxTokens: number;
    permissions: string[];
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  };
  usage?: {
    totalTokens: number;
    activeTokens: number;
    totalRequests: number;
    tokensLimit: number;
    tokensUsed?: number;
  };
  tokens?: Array<{
    id: string;
    name: string;
    prefix: string;
    permissions: string[];
    rateLimit: number;
    lastUsedAt: string | null;
    usageCount: number;
    recentUsage?: number;
    isActive: boolean;
    createdAt: string;
  }>;
  plan?: {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    rateLimit: number;
    maxTokens: number;
    permissions: string[];
  };
  // Fallback indicator
  _fallback?: boolean;
  _message?: string;
}

export const dashboardService = {
  async getOverview(): Promise<DashboardData> {
    const response = await api.get("/dashboard/overview");
    return response.data;
  },

  async getBillingPlans() {
    const response = await api.get("/billing/plans");
    return response.data;
  },

  async getUsageStats() {
    const response = await api.get("/billing/usage");
    return response.data;
  },

  async getSubscription() {
    const response = await api.get("/billing/subscription");
    return response.data;
  },
};
