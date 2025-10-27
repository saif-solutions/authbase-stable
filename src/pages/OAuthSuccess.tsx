import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        if (!token || !email) {
          setStatus("error");
          setMessage("Missing authentication data");
          return;
        }

        // Store the token in multiple places for redundancy
        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", token);
        sessionStorage.setItem("token", token);

        // Also store email for immediate display
        localStorage.setItem("userEmail", email);

        // Set token in AuthContext
        if (setToken) {
          setToken(token);
        }

        // Create a simple user object for immediate use
        const tempUser = {
          id: "oauth-user",
          email: email,
          name: email.split("@")[0],
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("userData", JSON.stringify(tempUser));

        // Try to fetch user data from backend with proper headers
        try {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem(
              "userData",
              JSON.stringify(userData.user || userData)
            );
            console.log("✅ User data fetched successfully");
          } else {
            console.log("⚠️ User data fetch failed, using temp data");
          }
        } catch (error) {
          console.log("User data fetch failed, using temp data:", error);
        }

        setStatus("success");
        setMessage(`Successfully signed in as ${email}`);

        // Redirect to dashboard after 1 second (shorter delay)
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1000);
      } catch (error) {
        console.error("OAuth success error:", error);
        setStatus("error");
        setMessage("Failed to complete authentication");
      }
    };

    handleOAuthSuccess();
  }, [token, email, navigate, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === "success" ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : status === "error" ? (
              <AlertCircle className="h-6 w-6 text-red-600" />
            ) : null}
            OAuth Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {status === "loading" && (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Completing authentication...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-3">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Success
              </Badge>
              <p className="text-gray-700">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Error
              </Badge>
              <p className="text-gray-700">{message}</p>
              <Button onClick={() => navigate("/login")}>Back to Login</Button>
            </div>
          )}

          {email && (
            <div className="text-sm text-gray-500">
              Authenticated as: <strong>{email}</strong>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
