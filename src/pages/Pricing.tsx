import React, { useState, useEffect } from "react";
import { paymentService } from "../services/paymentService";
import { productService, Product } from "../services/productService";

const Pricing: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productService.getCustomerDashboard(
        "test@example.com"
      );

      // The response has success field and data wrapper
      if (response.success && response.data) {
        const allProducts = [
          ...response.data.product_catalog.owned_products,
          ...response.data.product_catalog.available_products,
          ...response.data.product_catalog.upcoming_products,
        ];
        setProducts(allProducts);
      } else {
        setError("Failed to load products: Invalid response format");
      }
    } catch (err) {
      setError("Failed to load products");
      console.error("Error fetching products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handlePurchase = async (productName: string) => {
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    setLoading(productName);
    try {
      // Map product to appropriate tier for payment service
      let tier: "test" | "basic" | "pro" | "enterprise" = "basic";

      if (productName.toLowerCase().includes("test")) {
        tier = "test";
      } else if (
        productName.toLowerCase().includes("pro") ||
        productName.toLowerCase().includes("gateway")
      ) {
        tier = "pro";
      } else if (productName.toLowerCase().includes("enterprise")) {
        tier = "enterprise";
      }

      await paymentService.createCheckoutSession(tier, email);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error starting checkout process. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const getTierColor = (productName: string) => {
    if (productName.toLowerCase().includes("test")) return "border-gray-300";
    if (
      productName.toLowerCase().includes("basic") ||
      productName.toLowerCase().includes("authbase")
    )
      return "border-blue-500 ring-2 ring-blue-500";
    if (
      productName.toLowerCase().includes("pro") ||
      productName.toLowerCase().includes("gateway")
    )
      return "border-purple-500 ring-2 ring-purple-500";
    if (productName.toLowerCase().includes("enterprise"))
      return "border-green-500 ring-2 ring-green-500";
    return "border-gray-300";
  };

  const getPriceDisplay = (basePrice: string) => {
    const price = parseFloat(basePrice);
    if (price === 0) return "Free";
    return `$${price}`;
  };

  if (productsLoading) {
    return (
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
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Our Products
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Choose the perfect solution for your needs
          </p>
        </div>

        {/* Email Input */}
        <div className="mt-8 max-w-md mx-auto">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Your Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <div className="mt-4 max-w-md mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="mt-8 space-y-4 sm:mt-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className={`border rounded-lg shadow-sm divide-y divide-gray-200 ${getTierColor(
                product.name
              )}`}
            >
              <div className="p-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  {product.name}
                </h2>
                <p className="mt-4 text-sm text-gray-500">
                  {product.description}
                </p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {getPriceDisplay(product.base_price)}
                  </span>
                  {product.base_price !== "0.00" && (
                    <span className="text-base font-medium text-gray-500">
                      /{product.billing_interval}
                    </span>
                  )}
                </p>
                <button
                  onClick={() => handlePurchase(product.name)}
                  disabled={
                    loading === product.name ||
                    !email ||
                    product.status !== "active"
                  }
                  className={`mt-8 block w-full bg-gray-800 border border-gray-800 rounded-md py-3 text-sm font-semibold text-white text-center hover:bg-gray-900 transition-colors ${
                    loading === product.name || product.status !== "active"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading === product.name ? (
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
                  {product.features.map((feature) => (
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
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
