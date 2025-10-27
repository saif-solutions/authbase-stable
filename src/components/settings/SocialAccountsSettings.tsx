import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2, Link, CheckCircle, Github } from "lucide-react";
import {
  socialAccountService,
  SocialAccount,
} from "@/services/socialAccountService";
import { toast } from "sonner";

export function SocialAccountsSettings() {
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlinking, setUnlinking] = useState<string | null>(null);

  useEffect(() => {
    loadSocialAccounts();
  }, []);

  const loadSocialAccounts = async () => {
    try {
      setLoading(true);
      const data = await socialAccountService.getSocialAccounts();
      setSocialAccounts(data.socialAccounts);
    } catch (error) {
      console.error("Failed to load social accounts:", error);
      toast.error("Failed to load connected accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlinkAccount = async (provider: string) => {
    try {
      setUnlinking(provider);
      await socialAccountService.unlinkSocialAccount(provider);

      // Remove from local state
      setSocialAccounts((prev) =>
        prev.filter((account) => account.provider !== provider)
      );

      toast.success(
        `${getProviderName(provider)} account unlinked successfully`
      );
    } catch (error: unknown) {
      console.error("Unlink error:", error);

      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("last authentication method") ||
          errorMessage.includes("last_auth_method")
        ) {
          toast.error(
            "Cannot unlink your only authentication method. Set a password first."
          );
        } else {
          toast.error("Failed to unlink account");
        }
      } else {
        toast.error("Failed to unlink account");
      }
    } finally {
      setUnlinking(null);
    }
  };

  const getProviderName = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return (
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
        );
      case "github":
        return <Github className="w-4 h-4 mr-2" />;
      default:
        return <Link className="w-4 h-4 mr-2" />;
    }
  };

  const availableProviders = [
    {
      id: "google",
      name: "Google",
      connected: socialAccounts.some((acc) => acc.provider === "google"),
    },
    {
      id: "github",
      name: "GitHub",
      connected: socialAccounts.some((acc) => acc.provider === "github"),
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your social login accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-lg">Loading connected accounts...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>
          Manage your social login accounts and link new ones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Connected Accounts */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Connected Accounts</h3>

          {socialAccounts.length === 0 ? (
            <div className="flex items-center p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
              <span className="text-yellow-800 dark:text-yellow-300">
                No social accounts connected. Link an account for faster login.
              </span>
            </div>
          ) : (
            <div className="space-y-3">
              {socialAccounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    {getProviderIcon(account.provider)}
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {getProviderName(account.provider)}
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Connected{" "}
                        {new Date(account.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnlinkAccount(account.provider)}
                    disabled={unlinking === account.provider}
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    {unlinking === account.provider ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1" />
                    )}
                    Unlink
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Providers to Link */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Link New Accounts</h3>
          <div className="space-y-3">
            {availableProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getProviderIcon(provider.id)}
                  <div className="font-medium">{provider.name}</div>
                </div>

                {provider.connected ? (
                  <Badge variant="outline" className="bg-gray-100">
                    Already Connected
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `http://localhost:5000/api/auth/${provider.id}`)
                    }
                  >
                    <Link className="w-4 h-4 mr-1" />
                    Link Account
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <AlertCircle className="w-4 h-4 mr-2 text-blue-600" />
          <span className="text-blue-800 dark:text-blue-300 text-sm">
            <strong>Security Note:</strong> You can unlink social accounts at
            any time. If you unlink your only authentication method, make sure
            you have a password set.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
