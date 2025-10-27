import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

interface License {
  key: string;
  tier: string;
  expiresAt: string;
}

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [license, setLicense] = useState<License | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session");
        if (sessionId) {
          // Verify payment and get license
          const response = await fetch(
            "http://localhost:5000/api/payments/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId }),
            }
          );

          const data = await response.json();

          if (data.success && data.license) {
            setLicense(data.license);
            // TODO: Store license in user's account
          } else {
            setError("Failed to verify payment");
          }
        }
        setVerifying(false);
      } catch {
        setError("Payment verification failed");
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
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
                  Your License Key
                </h3>
                <code className="text-green-800 bg-green-100 px-2 py-1 rounded text-sm">
                  {license.key}
                </code>
                <p className="text-green-700 text-sm mt-2">
                  Tier: {license.tier} • Expires:{" "}
                  {new Date(license.expiresAt).toLocaleDateString()}
                </p>
              </div>
            </>
          ) : error ? (
            <p className="text-red-600 mb-4">{error}</p>
          ) : (
            <p className="text-gray-600 mb-4">
              Thank you for your purchase of AuthBase Pro.
            </p>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Check your email for license details</li>
              <li>• Access your dashboard to get started</li>
              <li>• Documentation available in settings</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
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
};

export default PaymentSuccess;
