// src/services/analyticsAPI.ts - FRONTEND ANALYTICS API CLIENT

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Enhanced BusinessMetrics interface to match backend
export interface EnhancedBusinessMetrics {
  totalRevenue: number;
  activeLicenses: number;
  totalCustomers: number;
  successRate: number;
  systemUptime: number;
  dailyRevenue: number;
  licenseTiers: {
    pro: number;
    enterprise: number;
    elite: number;
  };
  revenueTrend: "up" | "down" | "stable";
  kpis: {
    mrr: number;
    arr: number;
    churnRate: number;
    customerLifetimeValue: number;
  };
  timestamp: string;
  timeRange: string;
}

export interface CustomerInsights {
  acquisitionTrends: Array<{
    signup_date: string;
    new_customers: number;
    new_licenses: number;
  }>;
  topCustomers: Array<{
    customerEmail: string;
    total_licenses: number;
    total_spent: number;
    first_purchase_date: string;
    last_purchase_date: string;
  }>;
  totalAnalyzedCustomers: number;
  averageCustomerValue: number;
  timeRange: string;
}

export interface SystemPerformance {
  performanceTrends: Array<{
    generation_date: string;
    licenses_generated: number;
    unique_customers: number;
    avg_revenue_per_day: number;
  }>;
  reliabilityMetrics: {
    total_requests?: number;
    successful_requests?: number;
    success_rate_percentage?: number;
  };
  monitoringPeriod: string;
  estimatedResponseTime: number;
  systemLoad: string;
}

export interface AnalyticsResponse<T> {
  success: boolean;
  data: T;
  generatedAt: string;
  metadata?: {
    version: string;
    source: string;
    cache?: string;
    records?: number;
    period?: string;
  };
}

class AnalyticsAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<AnalyticsResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 401) {
          throw new Error("Authentication required - please log in again");
        } else if (response.status === 403) {
          throw new Error("Access forbidden - insufficient permissions");
        } else if (response.status === 404) {
          throw new Error("Analytics endpoint not found");
        } else if (response.status >= 500) {
          throw new Error("Analytics service temporarily unavailable");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AnalyticsResponse<T> = await response.json();

      if (!data.success) {
        throw new Error("Analytics request failed");
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);

      // Provide fallback data for development
      if (import.meta.env.DEV) {
        console.warn("Using fallback analytics data for development");
        return this.getFallbackResponse<T>(endpoint);
      }

      throw error;
    }
  }

  // Fallback response for development
  private getFallbackResponse<T>(endpoint: string): AnalyticsResponse<T> {
    if (endpoint.includes("business-metrics")) {
      const fallbackMetrics: EnhancedBusinessMetrics = {
        totalRevenue: 291,
        activeLicenses: 3,
        totalCustomers: 1,
        successRate: 100,
        systemUptime: 100,
        dailyRevenue: 97,
        licenseTiers: {
          pro: 3,
          enterprise: 0,
          elite: 0,
        },
        revenueTrend: "up",
        kpis: {
          mrr: 291,
          arr: 3492,
          churnRate: 0,
          customerLifetimeValue: 291,
        },
        timestamp: new Date().toISOString(),
        timeRange: "7d",
      };

      return {
        success: true,
        data: fallbackMetrics as T,
        generatedAt: new Date().toISOString(),
        metadata: {
          version: "2.0.0",
          source: "fallback",
          cache: "static",
        },
      };
    }

    // Generic fallback for other endpoints
    return {
      success: true,
      data: {} as T,
      generatedAt: new Date().toISOString(),
      metadata: {
        version: "2.0.0",
        source: "fallback",
      },
    };
  }

  async getBusinessMetrics(
    timeRange: string = "7d"
  ): Promise<AnalyticsResponse<EnhancedBusinessMetrics>> {
    return this.request<EnhancedBusinessMetrics>(
      `/analytics/business-metrics?range=${timeRange}`
    );
  }

  async getCustomerInsights(
    timeRange: string = "7d"
  ): Promise<AnalyticsResponse<CustomerInsights>> {
    return this.request<CustomerInsights>(
      `/analytics/customer-insights?range=${timeRange}`
    );
  }

  async getSystemPerformance(
    timeRange: string = "7d"
  ): Promise<AnalyticsResponse<SystemPerformance>> {
    return this.request<SystemPerformance>(
      `/analytics/system-performance?range=${timeRange}`
    );
  }

  async getDashboardOverview() {
    return this.request("/analytics/dashboard-overview");
  }

  async healthCheck() {
    return this.request("/health");
  }

  // Test connection to analytics endpoint
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error("Analytics connection test failed:", error);
      return false;
    }
  }
}

export const analyticsAPI = new AnalyticsAPI();
