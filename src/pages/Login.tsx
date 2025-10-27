import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import TwoFAVerify from "@/components/TwoFactorAuth/TwoFAVerify";

type AuthMode = "login" | "register" | "forgot-password";

interface TwoFAState {
  required: boolean;
  userEmail: string;
}

export function Login() {
  const [activeTab, setActiveTab] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFA, setTwoFA] = useState<TwoFAState | null>(null);

  const { login, register, verify2FA } = useAuth();
  const navigate = useNavigate();

  // Social Login Handlers
  const handleGoogleLogin = () => {
    const backendUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleGitHubLogin = () => {
    const backendUrl =
      import.meta.env.VITE_API_URL?.replace("/api", "") ||
      "http://localhost:5000";
    window.location.href = `${backendUrl}/api/auth/github`;
  };

  // ... rest of your existing validation functions remain exactly the same
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    return {
      isValid:
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar &&
        isLongEnough,
      requirements: {
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        isLongEnough,
      },
    };
  };

  // ... all your existing handler functions remain exactly the same
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error && error.message === "2FA_REQUIRED") {
        const pendingUserEmail = localStorage.getItem("pendingUserEmail");
        setTwoFA({
          required: true,
          userEmail: pendingUserEmail || email,
        });
      } else {
        toast.error("Login failed. Please check your credentials.");
        console.error("Login error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASuccess = async (token: string) => {
    setIsLoading(true);
    try {
      await verify2FA(token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("2FA verification failed. Please try again.");
      console.error("2FA verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setTwoFA(null);
    localStorage.removeItem("temp2FAToken");
    localStorage.removeItem("pendingUserEmail");
    localStorage.removeItem("pendingUserId");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const missingRequirements = [];
      if (!passwordValidation.requirements.hasUpperCase)
        missingRequirements.push("uppercase letter");
      if (!passwordValidation.requirements.hasLowerCase)
        missingRequirements.push("lowercase letter");
      if (!passwordValidation.requirements.hasNumbers)
        missingRequirements.push("number");
      if (!passwordValidation.requirements.hasSpecialChar)
        missingRequirements.push("special character");
      if (!passwordValidation.requirements.isLongEnough)
        missingRequirements.push("8 characters minimum");

      toast.error(`Password must contain: ${missingRequirements.join(", ")}`);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name);
      toast.success(
        "Registration successful! Please check your email for verification."
      );
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        toast.success("Password reset instructions sent to your email");
        setActiveTab("login");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to send reset instructions");
      }
    } catch (error) {
      toast.error("Failed to send reset instructions. Please try again.");
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    switch (activeTab) {
      case "login":
        return handleLogin(e);
      case "register":
        return handleRegister(e);
      case "forgot-password":
        return handleForgotPassword(e);
    }
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {activeTab === "login" && "Signing in..."}
          {activeTab === "register" && "Creating account..."}
          {activeTab === "forgot-password" && "Sending instructions..."}
        </>
      );
    }

    switch (activeTab) {
      case "login":
        return "Sign In";
      case "register":
        return "Create Account";
      case "forgot-password":
        return "Send Reset Instructions";
    }
  };

  // If 2FA is required, show verification component
  if (twoFA?.required) {
    return (
      <TwoFAVerify
        temp2FAToken={localStorage.getItem("temp2FAToken") || ""}
        userEmail={twoFA.userEmail}
        onVerificationSuccess={handle2FASuccess}
        onBack={handleBackToLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold dark:text-white">
            AuthBase Pro
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Secure authentication system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as AuthMode)}
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot-password">Reset</TabsTrigger>
            </TabsList>

            {/* Social Login Buttons - Only show for login and register tabs */}
            {(activeTab === "login" || activeTab === "register") && (
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full"
                    type="button"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleGitHubLogin}
                    className="w-full"
                    type="button"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field - Common to all tabs */}
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Name Field - Register only */}
              {activeTab === "register" && (
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Password Fields - Login and Register */}
              {(activeTab === "login" || activeTab === "register") && (
                <>
                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {activeTab === "login" && (
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => setActiveTab("forgot-password")}
                          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password - Register only */}
                  {activeTab === "register" && (
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Password must contain: uppercase, lowercase, number,
                        special character, and be at least 8 characters long.
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Forgot Password Instructions */}
              {activeTab === "forgot-password" && (
                <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  Enter your email address and we'll send you instructions to
                  reset your password.
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {getSubmitButtonText()}
              </Button>
            </form>

            {/* Tab-specific footer messages */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              {activeTab === "login" && (
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-blue-600 hover:text-blue-500 font-medium dark:text-blue-400"
                  >
                    Sign up
                  </button>
                </p>
              )}
              {activeTab === "register" && (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-blue-600 hover:text-blue-500 font-medium dark:text-blue-400"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {activeTab === "forgot-password" && (
                <p>
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-blue-600 hover:text-blue-500 font-medium dark:text-blue-400"
                  >
                    Back to login
                  </button>
                </p>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
