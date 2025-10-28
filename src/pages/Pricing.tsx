import React, { useState, useEffect, useCallback } from "react";
import { paymentService } from "../services/paymentService";
import { productService, Product } from "../services/productService";

/**
 * @interface ProductTier
 * @description Defines valid product tier types
 */
type ProductTier = "test" | "basic" | "pro" | "enterprise";

/**
 * @interface PricingState
 * @description Defines the component state structure
 */
interface PricingState {
  loading: string | null;
  products: Product[];
  productsLoading: boolean;
  error: string | null;
}

/**
 * @interface UserData
 * @description Defines user data structure from storage
 */
interface UserData {
  email?: string;
  name?: string;
  id?: string;
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
 * @component Pricing
 * @description Product pricing and purchase component with authentication integration
 * @version 2.0.3
 */
const Pricing: React.FC = () => {
  const [state, setState] = useState<PricingState>({
    loading: null,
    products: [],
    productsLoading: true,
    error: null,
  });

  /**
   * @function getUserEmail
   * @description Retrieves user email from authentication storage
   * @returns {string} User email address
   */
  const getUserEmail = useCallback((): string => {
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
        const parsedData: UserData = JSON.parse(userData);
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
    return "";
  }, []);

  /**
   * @function fetchProducts
   * @description Fetches products for the authenticated user
   * @returns {Promise<void>}
   */
  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, productsLoading: true, error: null }));

      const userEmail = getUserEmail();

      if (!userEmail) {
        setState((prev) => ({
          ...prev,
          error: "Please log in to view products",
          productsLoading: false,
        }));
        return;
      }

      console.log("🔄 Fetching products for user:", userEmail);

      const response = await productService.getCustomerDashboard(userEmail);

      console.log("📥 Products API Response:", response);

      if (response.success && response.data) {
        const allProducts = [
          ...response.data.product_catalog.owned_products,
          ...response.data.product_catalog.available_products,
          ...response.data.product_catalog.upcoming_products,
        ];

        console.log("📊 Products Summary:", {
          owned: response.data.product_catalog.owned_products.length,
          available: response.data.product_catalog.available_products.length,
          upcoming: response.data.product_catalog.upcoming_products.length,
          total: allProducts.length,
        });

        setState((prev) => ({
          ...prev,
          products: allProducts,
          error: null,
        }));
      } else {
        const errorMessage = "Failed to load products: Invalid response format";
        console.error("❌", errorMessage);
        setState((prev) => ({ ...prev, error: errorMessage }));
      }
    } catch (err) {
      const errorMessage = "Failed to load products. Please try again.";
      console.error("❌ Error fetching products:", err);
      setState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setState((prev) => ({ ...prev, productsLoading: false }));
    }
  }, [getUserEmail]);

  /**
   * @function determineProductTier
   * @description Maps product name to appropriate payment tier
   * @param {string} productName - The name of the product
   * @returns {ProductTier} Corresponding product tier
   */
  const determineProductTier = useCallback(
    (productName: string): ProductTier => {
      const lowerName = productName.toLowerCase();

      if (lowerName.includes("test")) return "test";
      if (lowerName.includes("enterprise")) return "enterprise";
      if (lowerName.includes("pro") || lowerName.includes("gateway"))
        return "pro";

      return "basic"; // Default tier
    },
    []
  );

  /**
   * @function handlePurchase
   * @description Handles product purchase flow
   * @param {string} productName - The name of the product to purchase
   * @returns {Promise<void>}
   */
  const handlePurchase = useCallback(
    async (productName: string): Promise<void> => {
      const userEmail = getUserEmail();

      if (!userEmail) {
        alert("Please log in to make a purchase");
        return;
      }

      setState((prev) => ({ ...prev, loading: productName }));

      try {
        const tier = determineProductTier(productName);

        console.log("🔄 Starting purchase flow:", {
          productName,
          tier,
          userEmail,
        });

        await paymentService.createCheckoutSession(tier, userEmail);

        console.log("✅ Purchase flow initiated successfully");
      } catch (error) {
        console.error("❌ Payment error:", error);
        alert("Error starting checkout process. Please try again.");
      } finally {
        setState((prev) => ({ ...prev, loading: null }));
      }
    },
    [getUserEmail, determineProductTier]
  );

  /**
   * @function getTierColor
   * @description Determines CSS classes based on product tier
   * @param {string} productName - The name of the product
   * @returns {string} Tailwind CSS classes for styling
   */
  const getTierColor = useCallback((productName: string): string => {
    const lowerName = productName.toLowerCase();

    if (lowerName.includes("test")) return "border-gray-300";
    if (lowerName.includes("basic") || lowerName.includes("authbase")) {
      return "border-blue-500 ring-2 ring-blue-500";
    }
    if (lowerName.includes("pro") || lowerName.includes("gateway")) {
      return "border-purple-500 ring-2 ring-purple-500";
    }
    if (lowerName.includes("enterprise")) {
      return "border-green-500 ring-2 ring-green-500";
    }

    return "border-gray-300";
  }, []);

  /**
   * @function getPriceDisplay
   * @description Formats price for display
   * @param {string} basePrice - The base price as string
   * @returns {string} Formatted price display
   */
  const getPriceDisplay = useCallback((basePrice: string): string => {
    const price = parseFloat(basePrice);
    if (price === 0) return "Free";
    return `$${price}`;
  }, []);

  /**
   * @effect Products Fetching Effect
   * @description Fetches products when component mounts
   */
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // =========================================================================
  // RENDER COMPONENTS
  // =========================================================================

  /**
   * @component LoadingState
   * @description Displays loading state during products fetch
   */
  const LoadingState: React.FC = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * @component UserNotLoggedInState
   * @description Displays when user is not authenticated
   */
  const UserNotLoggedInState: React.FC = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
            <svg
              className="h-10 w-10 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view our products and pricing.
          </p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );

  /**
   * @component ProductCard
   * @description Individual product card component
   */
  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const isDisabled =
      state.loading === product.name || product.status !== "active";
    const userEmail = getUserEmail();

    return (
      <div
        className={`border rounded-lg shadow-sm divide-y divide-gray-200 ${getTierColor(
          product.name
        )}`}
      >
        <div className="p-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            {product.name}
          </h2>
          <p className="mt-4 text-sm text-gray-500">{product.description}</p>
          <p className="mt-8">
            <span className="text-4xl font-extrabold text-gray-900">
              {getPriceDisplay(product.basePrice)}
            </span>
            {product.basePrice !== "0.00" && (
              <span className="text-base font-medium text-gray-500">
                /{product.billingInterval}
              </span>
            )}
          </p>
          <button
            onClick={() => handlePurchase(product.name)}
            disabled={isDisabled || !userEmail}
            className={`mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-3 text-sm font-semibold text-white text-center hover:bg-gray-900 transition-colors ${
              isDisabled || !userEmail ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {state.loading === product.name ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : product.status === "active" ? (
              "Buy Now"
            ) : (
              "Coming Soon"
            )}
          </button>
        </div>
        <div className="pt-6 pb-8 px-6">
          <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
            Features
          </h3>
          <ul className="mt-4 space-y-3">
            {product.features && product.features.length > 0 ? (
              product.features.map((feature) => (
                <li key={feature} className="flex space-x-3">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">{feature}</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-400">No features listed</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  // =========================================================================
  // MAIN RENDER LOGIC
  // =========================================================================

  if (state.productsLoading) {
    return <LoadingState />;
  }

  if (!getUserEmail()) {
    return <UserNotLoggedInState />;
  }

  const userEmail = getUserEmail();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Products
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the perfect solution for your needs
          </p>

          {/* User Welcome */}
          {userEmail && (
            <div className="mt-4 inline-block bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <p className="text-sm text-blue-700">
                Welcome, <span className="font-medium">{userEmail}</span>
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {state.error && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
              <p className="text-red-700 font-medium">{state.error}</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mt-8 space-y-4 sm:mt-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {state.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {state.products.length === 0 &&
          !state.productsLoading &&
          !state.error && (
            <div className="mt-12 text-center">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No Products Available
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  There are no products available at the moment. Please check
                  back later.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Pricing;
