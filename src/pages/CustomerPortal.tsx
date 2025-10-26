import React, { useState, useEffect } from "react";
import { productService, Product } from "../services/productService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { EmptyState } from "../components/ui/EmptyState";
import { Key, Package, TrendingUp, Star, Clock } from "lucide-react";

interface CommercialSummary {
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
}

interface CustomerDashboard {
  commercial_summary: CommercialSummary;
  product_catalog: {
    owned_products: Product[];
    available_products: Product[];
    upcoming_products: Product[];
  };
  personalized_recommendations: Product[];
  engagement_metrics: {
    product_adoption_score: number;
    customer_tier: string;
  };
}

const CustomerPortal: React.FC = () => {
  const [dashboard, setDashboard] = useState<CustomerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "owned" | "available" | "upcoming"
  >("owned");

  useEffect(() => {
    fetchCustomerDashboard();
  }, []);

  const fetchCustomerDashboard = async () => {
    try {
      setLoading(true);
      // In a real app, get email from user context
      const email = "test@example.com";
      const response = await productService.getCustomerDashboard(email);
      if (response.success) {
        setDashboard(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch customer dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (product: Product) => {
    if (product.is_purchased) {
      return <Badge className="bg-green-100 text-green-800">Owned</Badge>;
    }
    if (product.status === "upcoming") {
      return <Badge className="bg-blue-100 text-blue-800">Coming Soon</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Available</Badge>;
  };

  const getProductsByTab = () => {
    if (!dashboard) return [];
    switch (activeTab) {
      case "owned":
        return dashboard.product_catalog.owned_products;
      case "available":
        return dashboard.product_catalog.available_products;
      case "upcoming":
        return dashboard.product_catalog.upcoming_products;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <EmptyState
        icon={Package}
        title="No products found"
        description="We couldn't load your product dashboard."
        action={{
          label: "Try Again",
          onClick: fetchCustomerDashboard,
        }}
      />
    );
  }

  const products = getProductsByTab();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Product Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your products and discover new solutions
          </p>
        </div>

        {/* Engagement Score */}
        {dashboard.engagement_metrics && (
          <Card className="w-64">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Engagement Score
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {dashboard.engagement_metrics.product_adoption_score}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <Badge className="mt-2 bg-purple-100 text-purple-800">
                {dashboard.engagement_metrics.customer_tier} Tier
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab("owned")}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "owned"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Owned Products ({dashboard.product_catalog.owned_products.length})
        </button>
        <button
          onClick={() => setActiveTab("available")}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "available"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Available Products (
          {dashboard.product_catalog.available_products.length})
        </button>
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`pb-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "upcoming"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Coming Soon ({dashboard.product_catalog.upcoming_products.length})
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {product.name}
                    {getStatusBadge(product)}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {product.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Pricing */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.base_price}
                  </span>
                  <span className="text-sm text-gray-500">
                    /{product.billing_interval}
                  </span>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Features
                  </h4>
                  <ul className="space-y-1">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <Star className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                    {product.features.length > 3 && (
                      <li className="text-sm text-gray-500">
                        +{product.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={product.is_purchased ? "outline" : "default"}
                  disabled={product.status !== "active"}
                >
                  {product.is_purchased ? (
                    <>
                      <Key className="h-4 w-4 mr-2" />
                      Manage License
                    </>
                  ) : product.status === "active" ? (
                    "Purchase Now"
                  ) : (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Coming Soon
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <EmptyState
          icon={Package}
          title={`No ${activeTab} products`}
          description={
            activeTab === "owned"
              ? "You haven't purchased any products yet."
              : activeTab === "available"
              ? "All available products are already in your collection."
              : "No upcoming products at the moment."
          }
          action={
            activeTab === "owned"
              ? {
                  label: "Browse Products",
                  onClick: () => setActiveTab("available"),
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default CustomerPortal;
