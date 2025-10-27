import api from "./api";

export interface DashboardData {
  plan: {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceYearly: number;
    rateLimit: number;
    maxTokens: number;
    permissions: string[];
  };
  tokens: Array<{
    id: string;
    name: string;
    prefix: string;
    permissions: string[];
    rateLimit: number;
    lastUsedAt: string | null;
    usageCount: number;
    recentUsage: number;
    isActive: boolean;
    createdAt: string;
  }>;
  usage: {
    totalRequests: number;
    tokensUsed: number;
    tokensLimit: number;
  };
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
