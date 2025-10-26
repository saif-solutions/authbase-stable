import React, { useState } from "react";

interface TwoFAVerifyProps {
  temp2FAToken: string;
  userEmail: string;
  onVerificationSuccess: (token: string) => void;
  onBack: () => void;
}

const TwoFAVerify: React.FC<TwoFAVerifyProps> = ({
  userEmail,
  onVerificationSuccess,
  onBack,
}) => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleVerify = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Pass the verification code to parent component
      onVerificationSuccess(verificationCode);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUseBackupCode = () => {
    // We'll implement backup code functionality later
    setError("Backup code functionality coming soon");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Two-Factor Authentication Required
      </h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          Please enter the 6-digit code from your authenticator app for:
        </p>
        <p className="font-medium text-gray-800">{userEmail}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code
        </label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) =>
            setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          onKeyPress={handleKeyPress}
          placeholder="123456"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
          maxLength={6}
          autoFocus
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={loading || verificationCode.length !== 6}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 mb-3"
      >
        {loading ? "Verifying..." : "Verify & Continue"}
      </button>

      <div className="text-center space-y-2">
        <button
          onClick={handleUseBackupCode}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Use backup code instead
        </button>

        <button
          onClick={onBack}
          className="block w-full text-gray-600 hover:text-gray-800 text-sm"
        >
          Back to login
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-700 text-sm">
          <strong>Tip:</strong> Open your authenticator app (Google
          Authenticator, Authy, etc.) to get your current verification code.
        </p>
      </div>
    </div>
  );
};

export default TwoFAVerify;
