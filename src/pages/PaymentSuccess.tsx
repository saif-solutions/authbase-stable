import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";

/**
 * @interface License
 * @description Defines the structure of a license object
 */
interface License {
  key: string;
  tier: string;
  expiresAt: string;
  customerEmail?: string;
  customerName?: string;
}

/**
 * @interface PaymentVerificationResponse
 * @description Defines the response structure from payment verification API
 */
interface PaymentVerificationResponse {
  success: boolean;
  paid: boolean;
  license?: License;
  customer?: {
    email: string;
    amount: number;
    tier: string;
  };
  error?: string;
}

/**
 * @interface AuthDataDebugInfo
 * @description Defines structure for authentication data debugging
 */
interface AuthDataDebugInfo {
  key: string;
  value: string | null;
  exists: boolean;
}

/**
 * @constant AUTH_STORAGE_KEYS
 * @description Defines all possible localStorage keys used for authentication data
 */
const AUTH_STORAGE_KEYS = {
  USER_EMAIL: "userEmail",
  USER_DATA: "userData",
  PENDING_USER_EMAIL: "pendingUserEmail",
  PENDING_USER_ID: "pendingUserId",
  USER: "user",
  USER_INFO: "user_info",
} as const;

/**
 * @type AuthStorageKey
 * @description Union type of all possible authentication storage keys
 */
type AuthStorageKey =
  (typeof AUTH_STORAGE_KEYS)[keyof typeof AUTH_STORAGE_KEYS];

/**
 * @component PaymentSuccess
 * @description Handles payment verification and license display after successful payment
 * @version 2.0.2
 */
const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState<boolean>(true);
  const [license, setLicense] = useState<License | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasExecuted = useRef<boolean>(false);

  /**
   * @function getUserEmail
   * @description Retrieves user email from various authentication storage locations
   * @returns {string} User email or fallback value
   */
  const getUserEmail = useCallback((): string => {
    // Priority 1: Direct user email storage
    const userEmail = localStorage.getItem(AUTH_STORAGE_KEYS.USER_EMAIL);
    if (userEmail) {
      console.log("✅ Found user email in userEmail storage");
      return userEmail;
    }

    // Priority 2: User data object
    const userData = localStorage.getItem(AUTH_STORAGE_KEYS.USER_DATA);
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        if (parsedData?.email) {
          console.log("✅ Found user email in userData object");
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
      console.log("✅ Found user email in pendingUserEmail storage");
      return pendingEmail;
    }

    // Priority 4: Legacy user storage
    const legacyUser = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
    if (legacyUser) {
      try {
        const parsedUser = JSON.parse(legacyUser);
        if (parsedUser?.email) {
          console.log("✅ Found user email in legacy user storage");
          return parsedUser.email;
        }
      } catch (parseError) {
        console.error("❌ Failed to parse legacy user storage:", parseError);
      }
    }

    // Priority 5: User info storage
    const userInfo = localStorage.getItem(AUTH_STORAGE_KEYS.USER_INFO);
    if (userInfo) {
      try {
        const parsedInfo = JSON.parse(userInfo);
        if (parsedInfo?.email) {
          console.log("✅ Found user email in user_info storage");
          return parsedInfo.email;
        }
      } catch (parseError) {
        console.error("❌ Failed to parse user_info storage:", parseError);
      }
    }

    console.warn("⚠️ No user email found in authentication storage");
    return "unknown@example.com";
  }, []); // No dependencies needed - AUTH_STORAGE_KEYS is constant

  /**
   * @function debugAuthData
   * @description Provides comprehensive debugging information for authentication data
   * @returns {AuthDataDebugInfo[]} Array of authentication data information
   */
  const debugAuthData = useCallback((): AuthDataDebugInfo[] => {
    const debugInfo: AuthDataDebugInfo[] = [];

    console.group("🔍 AUTHENTICATION DATA DEBUG REPORT");

    // Check all defined authentication keys
    Object.values(AUTH_STORAGE_KEYS).forEach((key) => {
      const value = localStorage.getItem(key);
      const exists = value !== null;

      debugInfo.push({ key, value, exists });

      if (exists) {
        console.log(`✅ ${key}:`, value);
      } else {
        console.log(`❌ ${key}: NOT_FOUND`);
      }
    });

    // Check for any other auth-related keys
    const allStorageKeys = Object.keys(localStorage);
    const otherAuthKeys = allStorageKeys.filter(
      (key: string) =>
        (key.includes("user") ||
          key.includes("auth") ||
          key.includes("token")) &&
        !Object.values(AUTH_STORAGE_KEYS).includes(key as AuthStorageKey)
    );

    if (otherAuthKeys.length > 0) {
      console.group("🔍 ADDITIONAL AUTH-RELATED KEYS");
      otherAuthKeys.forEach((key: string) => {
        const value = localStorage.getItem(key);
        const displayValue = value
          ? value.substring(0, 100) + (value.length > 100 ? "..." : "")
          : null;
        console.log(`📦 ${key}:`, displayValue);
      });
      console.groupEnd();
    }

    console.groupEnd();

    return debugInfo;
  }, []); // No dependencies needed - AUTH_STORAGE_KEYS is constant

  /**
   * @function verifyPayment
   * @description Verifies payment with backend and retrieves license information
   * @param {string} sessionId - Payment session ID
   * @param {string} productTier - Product tier purchased
   * @returns {Promise<void>}
   */
  const verifyPayment = useCallback(
    async (sessionId: string, productTier: string): Promise<void> => {
      try {
        const userEmail = getUserEmail();
        console.log("🔄 Starting payment verification:", {
          sessionId,
          productTier,
          userEmail,
        });

        const requestPayload = {
          sessionId,
          productTier: productTier || "pro",
          customerEmail: userEmail,
        };

        console.log("📤 Sending verification request:", requestPayload);

        const response = await fetch(
          "http://localhost:5000/api/payments/verify-payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestPayload),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data: PaymentVerificationResponse = await response.json();
        console.log("📥 Received verification response:", data);

        if (data.success && data.license) {
          setLicense(data.license);
          console.log("✅ Payment verified successfully");
        } else {
          const errorMessage = data.error || "Payment verification failed";
          setError(errorMessage);
          console.error("❌ Payment verification failed:", errorMessage);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("❌ Payment verification error:", errorMessage);
        setError(`Payment verification failed: ${errorMessage}`);
      } finally {
        setVerifying(false);
      }
    },
    [getUserEmail]
  );

  /**
   * @effect Payment Verification Effect
   * @description Handles payment verification on component mount
   */
  useEffect(() => {
    if (hasExecuted.current) {
      return;
    }

    hasExecuted.current = true;

    // Generate comprehensive debug report
    const authDebugInfo = debugAuthData();
    console.log("🔍 Authentication Debug Summary:", authDebugInfo);

    const sessionId = searchParams.get("session");
    const productTier = searchParams.get("tier");

    console.log("🔍 URL Parameters:", { sessionId, productTier });

    if (!sessionId) {
      const errorMsg = "No session ID found in URL parameters";
      console.error("❌", errorMsg);
      setError(errorMsg);
      setVerifying(false);
      return;
    }

    verifyPayment(sessionId, productTier || "pro");
  }, [searchParams, verifyPayment, debugAuthData]);

  // =========================================================================
  // RENDER COMPONENTS
  // =========================================================================

  /**
   * @component LoadingState
   * @description Displays loading state during payment verification
   */
  const LoadingState: React.FC = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Verifying Your Payment
        </h2>
        <p className="text-gray-600">
          Please wait while we confirm your purchase details.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          <p>This usually takes just a few moments...</p>
        </div>
      </div>
    </div>
  );

  /**
   * @component ErrorState
   * @description Displays error state when payment verification fails
   */
  const ErrorState: React.FC = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verification Failed
          </h1>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 font-medium mb-2">{error}</p>
            <p className="text-red-600 text-sm">
              Please contact our support team if this issue persists.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              to="/pricing"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Back to Pricing
            </Link>
            <Link
              to="/support"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * @component SuccessState
   * @description Displays success state with license information
   */
  const SuccessState: React.FC = () => (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          {license ? (
            <>
              <p className="text-gray-600 mb-2">Thank you for your purchase!</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Your License Details
                </h3>
                <div className="space-y-2 text-left">
                  <div>
                    <label className="text-sm font-medium text-green-700">
                      License Key
                    </label>
                    <code className="block text-green-800 bg-green-100 px-3 py-2 rounded text-sm font-mono mt-1 break-all">
                      {license.key}
                    </code>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-green-700">
                      Plan Tier:
                    </span>
                    <span className="text-green-800 font-medium capitalize">
                      {license.tier}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-green-700">
                      Expires:
                    </span>
                    <span className="text-green-800">
                      {new Date(license.expiresAt).toLocaleDateString()}
                    </span>
                  </div>

                  {license.customerEmail && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-green-700">
                        Customer Email:
                      </span>
                      <span className="text-green-800 text-sm">
                        {license.customerEmail}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mb-4">
              Thank you for your purchase of AuthBase Pro.
            </p>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Check your email for license details
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Access your dashboard to get started
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Documentation available in settings
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/customer-portal"
              className="block w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm"
            >
              Access Customer Portal
            </Link>
            <Link
              to="/pricing"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              View Other Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );

  // =========================================================================
  // MAIN RENDER LOGIC
  // =========================================================================

  if (verifying) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return <SuccessState />;
};

export default PaymentSuccess;
