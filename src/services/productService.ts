const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Product {
  id: number;
  name: string;
  description: string;
  type: string;
  category: string;
  base_price: string;
  currency: string;
  billing_interval: string;
  features: string[];
  status: string;
  is_purchased?: boolean;
  has_pending_requisition?: boolean;
  recent_purchases?: string;
  available_packages?: string;
}

export interface CommercialMetrics {
  total_purchases: number;
  unique_customers: number;
  average_revenue_per_sale: number | null;
  total_revenue: number | null;
}

export interface EngagementMetrics {
  product_adoption_score: number;
  customer_tier: string;
  next_milestone?: {
    target: number | null;
    reward: string;
  };
}

export interface CustomerDashboard {
  commercial_summary: {
    purchases: Array<{
      product_name: string;
      package_name: string;
      final_price: number;
      currency: string;
      billing_interval: string;
      purchased_at: string;
    }>;
    product_usage: Array<{
      product_name: string;
      packages_purchased: number;
      average_spend: number;
      first_purchase: string;
      last_purchase: string;
    }>;
    requisitions_summary: {
      total_requisitions: number;
      pending_requisitions: number;
      approved_requisitions: number;
      developed_requisitions: number;
    };
    commercial_metrics: {
      customer_lifetime_value: number;
      average_order_value: number;
      product_adoption_rate: number;
      engagement_score: number;
    };
  };
  product_catalog: {
    owned_products: Product[];
    available_products: Product[];
    upcoming_products: Product[];
  };
  personalized_recommendations: Product[];
  announcements: Array<{
    id: number;
    title: string;
    content: string;
    published_at: string;
  }>;
  engagement_metrics: EngagementMetrics;
}

export interface CreateProductData {
  name: string;
  description: string;
  type: string;
  category: string;
  base_price: number;
  status?: string;
  features: string[];
  target_audience: string[];
}

export interface RequisitionData {
  product_name: string;
  description: string;
  desired_features: string[];
  budget_range: {
    min: number;
    max: number;
  };
  urgency: "low" | "medium" | "high" | "critical";
  expected_timeline: string;
  contact_preference: string;
}

export const productService = {
  async getCustomerDashboard(
    email: string
  ): Promise<{ success: boolean; data: CustomerDashboard }> {
    const response = await fetch(
      `${API_URL}/customer/products/dashboard?email=${encodeURIComponent(
        email
      )}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch customer dashboard");
    }
    return response.json();
  },

  async getAdminProducts(adminEmail: string) {
    const response = await fetch(
      `${API_URL}/admin/products/products?admin_email=${encodeURIComponent(
        adminEmail
      )}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  },

  async createProduct(productData: CreateProductData, adminEmail: string) {
    // Get CSRF token first
    const csrfResponse = await fetch(`${API_URL}/csrf-token`, {
      credentials: "include",
    });
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    const response = await fetch(
      `${API_URL}/admin/products/products?admin_email=${encodeURIComponent(
        adminEmail
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create product");
    }
    return response.json();
  },

  async submitRequisition(
    requisitionData: RequisitionData,
    customerEmail: string
  ) {
    const csrfResponse = await fetch(`${API_URL}/csrf-token`, {
      credentials: "include",
    });
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    const response = await fetch(
      `${API_URL}/customer/products/requisitions?email=${encodeURIComponent(
        customerEmail
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(requisitionData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit requisition");
    }
    return response.json();
  },
};
