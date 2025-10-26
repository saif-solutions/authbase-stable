import React, { useState } from "react";
import twoFactorService from "../../services/twoFactorService";

const TwoFASetup: React.FC = () => {
  const [step, setStep] = useState<"initial" | "qr" | "verify" | "success">(
    "initial"
  );
  const [secret, setSecret] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const startSetup = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await twoFactorService.setup2FA();
      setSecret(response.secret);
      setQrCode(response.qrCode);
      setStep("qr");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(
          axiosError.response?.data?.error || "Failed to start 2FA setup"
        );
      } else {
        setError("Failed to start 2FA setup");
      }
    }
  };

  const enable2FA = async () => {
    if (!verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await twoFactorService.enable2FA(verificationCode);
      setBackupCodes(response.backupCodes);
      setStep("success");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const axiosError = err as { response?: { data?: { error?: string } } };
        setError(
          axiosError.response?.data?.error || "Failed to start 2FA setup"
        );
      } else {
        setError("Failed to start 2FA setup");
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (step === "initial") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          Enable Two-Factor Authentication
        </h2>
        <p className="text-gray-600 mb-6">
          Add an extra layer of security to your account by enabling two-factor
          authentication. You'll need to scan a QR code with an authenticator
          app.
        </p>
        <button
          onClick={startSetup}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Setting up..." : "Start Setup"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  if (step === "qr") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
        <p className="text-gray-600 mb-4">
          Scan this QR code with your authenticator app (Google Authenticator,
          Authy, etc.)
        </p>

        <div className="flex justify-center mb-6">
          <img src={qrCode} alt="QR Code" className="border rounded-lg" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or enter this secret manually:
          </label>
          <div className="flex">
            <input
              type="text"
              value={secret}
              readOnly
              className="flex-1 border border-gray-300 rounded-l px-3 py-2 bg-gray-50"
            />
            <button
              onClick={() => copyToClipboard(secret)}
              className="bg-gray-200 px-3 py-2 rounded-r hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter verification code from your app:
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) =>
              setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="123456"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
          />
        </div>

        <button
          onClick={enable2FA}
          disabled={loading || verificationCode.length !== 6}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Enable 2FA"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          2FA Enabled Successfully!
        </h2>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6">
          <h3 className="font-bold text-yellow-800 mb-2">
            Important: Save Your Backup Codes
          </h3>
          <p className="text-yellow-700 text-sm mb-4">
            These codes can be used to access your account if you lose your
            authenticator device. Each code can only be used once.
          </p>

          <div className="bg-white border border-yellow-300 rounded p-3 mb-4">
            {backupCodes.map((code, index) => (
              <div key={index} className="font-mono text-sm py-1">
                {code}
              </div>
            ))}
          </div>

          <button
            onClick={() => copyToClipboard(backupCodes.join("\n"))}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
          >
            Copy All Codes
          </button>
        </div>

        <p className="text-gray-600 text-center">
          Two-factor authentication is now enabled for your account.
        </p>
      </div>
    );
  }

  return null;
};

export default TwoFASetup;
