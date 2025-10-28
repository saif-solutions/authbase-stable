import React, { useState, useEffect, useCallback } from "react";
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
import { Key, Package, TrendingUp, Star, Clock, User } from "lucide-react";

/**
 * @interface CommercialSummary
 * @description Defines commercial summary data structure
 */
interface CommercialSummary {
  purchases: Array<{
    product_name: string;
    package_name: string;
    final_price: number;
    currency: string;
    billingInterval: string;
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

/**
 * @interface CustomerDashboard
 * @description Defines customer dashboard data structure
 */
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

/**
 * @interface CustomerPortalState
 * @description Defines component state structure
 */
interface CustomerPortalState {
  dashboard: CustomerDashboard | null;
  loading: boolean;
  error: string | null;
  userEmail: string | null;
}

/**
 * @constant AUTH_STORAGE_KEYS
 * @description Defines localStorage keys used for authentication data
 */
const AUTH_STORAGE_KEYS = {
  USER_EMAIL: "userEmail",
  USER_DATA: "userData",
  PENDING_USER_EMAIL: "pendingUserEmail",
} as const;

/**
 * @type ActiveTab
 * @description Defines available tab types
 */
type ActiveTab = "owned" | "available" | "upcoming";

/**
 * @component CustomerPortal
 * @description Customer product dashboard with authentication integration
 * @version 2.0.2
 */
const CustomerPortal: React.FC = () => {
  const [state, setState] = useState<CustomerPortalState>({
    dashboard: null,
    loading: true,
    error: null,
    userEmail: null,
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>("owned");

  /**
   * @function getUserEmail
   * @description Retrieves user email from authentication storage
   * @returns {string | null} User email or null if not found
   */
  const getUserEmail = useCallback((): string | null => {
    // Priority 1: Direct user email storage
    const userEmail = localStorage.getItem(AUTH_STORAGE_KEYS.USER_EMAIL);
    if (userEmail) {
      console.log("✅ Using authenticated user email:", userEmail);
      return userEmail;
    }

    // Priority 2: User data object
    const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData?.email) {
          console.log("✅ Using user data email:", parsedData.email);
          return parsedData.email;
        }
      } catch (parseError) {
        console.error("❌ Failed to parse userData:", parseError);
      }
    }

    // Priority 3: Pending user email (OAuth flow)
    const pendingEmail = localStorage.getItem(
      AUTH_STORAGE_KEYS.PENDING_USER_EMAIL
    );
    if (pendingEmail) {
      console.log("✅ Using pending user email:", pendingEmail);
      return pendingEmail;
    }

    console.warn("⚠️ No user email available - user may need to log in");
    return null;
  }, []);

  /**
   * @function fetchCustomerDashboard
   * @description Fetches customer dashboard data for authenticated user
   * @returns {Promise<void>}
   */
  const fetchCustomerDashboard = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const userEmail = getUserEmail();

      if (!userEmail) {
        setState((prev) => ({
          ...prev,
          error: "Authentication required to access customer portal",
          loading: false,
          userEmail: null,
        }));
        return;
      }

      console.log("🔄 Fetching customer dashboard for:", userEmail);

      const response = await productService.getCustomerDashboard(userEmail);

      if (response.success) {
        console.log("✅ Customer dashboard loaded successfully");
        setState((prev) => ({
          ...prev,
          dashboard: response.data,
          userEmail: userEmail,
          error: null,
        }));
      } else {
        const errorMessage = "Failed to load customer dashboard data";
        console.error("❌", errorMessage);
        setState((prev) => ({ ...prev, error: errorMessage }));
      }
    } catch (error) {
      const errorMessage =
        "Failed to fetch customer dashboard. Please try again.";
      console.error("❌ Customer dashboard error:", error);
      setState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [getUserEmail]);

  /**
   * @function getStatusBadge
   * @description Returns appropriate badge for product status
   * @param {Product} product - The product to get badge for
   * @returns Status badge component
   */
  const getStatusBadge = useCallback((product: Product) => {
    if (product.is_purchased) {
      return <Badge className="bg-green-100 text-green-800">Owned</Badge>;
    }
    if (product.status === "upcoming") {
      return <Badge className="bg-blue-100 text-blue-800">Coming Soon</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Available</Badge>;
  }, []);

  /**
   * @function getProductsByTab
   * @description Filters products based on active tab
   * @returns {Product[]} Filtered products array
   */
  const getProductsByTab = useCallback((): Product[] => {
    if (!state.dashboard) return [];

    switch (activeTab) {
      case "owned":
        return state.dashboard.product_catalog.owned_products;
      case "available":
        return state.dashboard.product_catalog.available_products;
      case "upcoming":
        return state.dashboard.product_catalog.upcoming_products;
      default:
        return [];
    }
  }, [state.dashboard, activeTab]);

  /**
   * @function handleRetry
   * @description Handles retry action for failed requests
   */
  const handleRetry = useCallback((): void => {
    console.log("🔄 Retrying customer dashboard fetch...");
    fetchCustomerDashboard();
  }, [fetchCustomerDashboard]);

  /**
   * @function handleTabChange
   * @description Handles tab change with proper typing
   * @param {ActiveTab} tab - The tab to switch to
   */
  const handleTabChange = useCallback((tab: ActiveTab): void => {
    setActiveTab(tab);
    console.log(`📊 Switched to ${tab} products tab`);
  }, []);

  /**
   * @effect Initial Data Fetching
   * @description Fetches customer dashboard on component mount
   */
  useEffect(() => {
    fetchCustomerDashboard();
  }, [fetchCustomerDashboard]);

  // =========================================================================
  // RENDER COMPONENTS
  // =========================================================================

  /**
   * @component LoadingState
   * @description Displays loading state during data fetch
   */
  const LoadingState: React.FC = () => (
    <div className="container mx-auto p-6 space-y-6">
      <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );

  /**
   * @component AuthenticationRequiredState
   * @description Displays when user is not authenticated
   */
  const AuthenticationRequiredState: React.FC = () => (
    <div className="container mx-auto p-6">
      <EmptyState
        icon={User}
        title="Authentication Required"
        description="Please log in to access your customer portal and view your products."
        action={{
          label: "Go to Login",
          onClick: () => (window.location.href = "/login"),
        }}
      />
    </div>
  );

  /**
   * @component ErrorState
   * @description Displays error state with retry option
   */
  const ErrorState: React.FC = () => (
    <div className="container mx-auto p-6">
      <EmptyState
        icon={Package}
        title="Unable to Load Dashboard"
        description={state.error || "An unexpected error occurred."}
        action={{
          label: "Try Again",
          onClick: handleRetry,
        }}
      />
    </div>
  );

  /**
   * @component UserWelcome
   * @description Displays user welcome section
   */
  const UserWelcome: React.FC = () => (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Product Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your products and discover new solutions
        </p>
        {state.userEmail && (
          <div className="mt-2 flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1" />
            Signed in as:{" "}
            <span className="font-medium ml-1">{state.userEmail}</span>
          </div>
        )}
      </div>

      {/* Engagement Score */}
      {state.dashboard?.engagement_metrics && (
        <Card className="w-64">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Engagement Score
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.dashboard.engagement_metrics.product_adoption_score}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              {state.dashboard.engagement_metrics.customer_tier} Tier
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );

  /**
   * @component TabNavigation
   * @description Displays tab navigation component
   */
  const TabNavigation: React.FC = () => {
    const tabs: { key: ActiveTab; label: string; count: number }[] = [
      {
        key: "owned",
        label: "Owned Products",
        count: state.dashboard?.product_catalog.owned_products.length || 0,
      },
      {
        key: "available",
        label: "Available Products",
        count: state.dashboard?.product_catalog.available_products.length || 0,
      },
      {
        key: "upcoming",
        label: "Coming Soon",
        count: state.dashboard?.product_catalog.upcoming_products.length || 0,
      },
    ];

    return (
      <div className="flex space-x-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>
    );
  };

  /**
   * @component ProductCard
   * @description Individual product card component with safe feature handling
   */
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    // Safely handle features array - ensure it's always an array
    const safeFeatures = Array.isArray(product.features)
      ? product.features
      : [];
    const displayFeatures = safeFeatures.slice(0, 3);
    const additionalFeaturesCount =
      safeFeatures.length > 3 ? safeFeatures.length - 3 : 0;

    return (
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
                ${product.basePrice}
              </span>
              <span className="text-sm text-gray-500">
                /{product.billingInterval}
              </span>
            </div>

            {/* Features */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Features
              </h4>
              <ul className="space-y-1">
                {displayFeatures.length > 0 ? (
                  <>
                    {displayFeatures.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <Star className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                    {additionalFeaturesCount > 0 && (
                      <li className="text-sm text-gray-500">
                        +{additionalFeaturesCount} more features
                      </li>
                    )}
                  </>
                ) : (
                  <li className="text-sm text-gray-400">No features listed</li>
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
    );
  };

  /**
   * @component ProductsGrid
   * @description Displays products grid based on active tab
   */
  const ProductsGrid: React.FC = () => {
    const products = getProductsByTab();

    if (products.length === 0) {
      return (
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
                  onClick: () => handleTabChange("available"),
                }
              : undefined
          }
        />
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  };

  // =========================================================================
  // MAIN RENDER LOGIC
  // =========================================================================

  if (state.loading) {
    return <LoadingState />;
  }

  if (!state.userEmail) {
    return <AuthenticationRequiredState />;
  }

  if (state.error && !state.dashboard) {
    return <ErrorState />;
  }

  if (!state.dashboard) {
    return (
      <EmptyState
        icon={Package}
        title="No Dashboard Data"
        description="We couldn't load your product dashboard."
        action={{
          label: "Try Again",
          onClick: handleRetry,
        }}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <UserWelcome />
      <TabNavigation />
      <ProductsGrid />
    </div>
  );
};

export default CustomerPortal;
