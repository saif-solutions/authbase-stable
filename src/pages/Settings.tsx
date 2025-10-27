import { useState } from "react";
import { User, Save, Bell, Shield, Database, Globe, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialAccountsSettings } from "@/components/settings/SocialAccountsSettings";
import { toast } from "sonner";

export function Settings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "AuthBase Pro",
    supportEmail: "support@authbase.com",
    timezone: "UTC",

    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordPolicy: "strong",
    ipWhitelist: "",

    // Notification Settings
    emailNotifications: true,
    slackNotifications: false,
    securityAlerts: true,
    weeklyReports: true,

    // API Settings
    apiRateLimit: 1000,
    webhookUrl: "",
    enableWebhooks: false,
  });

  const handleSave = () => {
    // Show success message
    toast.success("Settings saved successfully!");
    console.log("Saving settings:", settings);
  };

  const handleInputChange = (key: string, value: string | number | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your AuthBase Pro instance
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="general"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-700"
          >
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-700"
          >
            <User className="h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-700"
          >
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-700"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-700"
          >
            <Database className="h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                General Settings
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Configure basic application settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="dark:text-gray-300">
                    Site Name
                  </Label>
                  <input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) =>
                      handleInputChange("siteName", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail" className="dark:text-gray-300">
                    Support Email
                  </Label>
                  <input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      handleInputChange("supportEmail", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="dark:text-gray-300">
                  Timezone
                </Label>
                <input
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) =>
                    handleInputChange("timezone", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Account Settings
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Manage your personal account settings and connected services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium dark:text-white">
                  Profile Information
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="dark:text-gray-300">
                      Display Name
                    </Label>
                    <input
                      id="displayName"
                      placeholder="Your display name"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-300">
                      Email Address
                    </Label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Accounts Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium dark:text-white">
                  Connected Accounts
                </h3>
                <SocialAccountsSettings />
              </div>

              {/* Account Actions Section */}
              <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium dark:text-white">
                  Account Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Security Settings
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Configure authentication and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth" className="dark:text-gray-300">
                    Two-Factor Authentication
                  </Label>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Require 2FA for all users
                  </div>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    handleInputChange("twoFactorAuth", checked)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="dark:text-gray-300">
                  Session Timeout (minutes)
                </Label>
                <input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    handleInputChange(
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordPolicy" className="dark:text-gray-300">
                  Password Policy
                </Label>
                <div className="flex gap-2">
                  {["basic", "strong", "very-strong"].map((policy) => (
                    <Button
                      key={policy}
                      variant={
                        settings.passwordPolicy === policy
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        handleInputChange("passwordPolicy", policy)
                      }
                      className="capitalize dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {policy.replace("-", " ")}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist" className="dark:text-gray-300">
                  IP Whitelist
                </Label>
                <input
                  id="ipWhitelist"
                  placeholder="192.168.1.1, 10.0.0.1"
                  value={settings.ipWhitelist}
                  onChange={(e) =>
                    handleInputChange("ipWhitelist", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Comma-separated list of allowed IP addresses
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                Notification Settings
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Configure how you receive alerts and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  id: "emailNotifications",
                  label: "Email Notifications",
                  description: "Receive important alerts via email",
                },
                {
                  id: "slackNotifications",
                  label: "Slack Notifications",
                  description: "Send alerts to your Slack channel",
                },
                {
                  id: "securityAlerts",
                  label: "Security Alerts",
                  description: "Get notified about security events",
                },
                {
                  id: "weeklyReports",
                  label: "Weekly Reports",
                  description: "Receive weekly analytics reports",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id} className="dark:text-gray-300">
                      {item.label}
                    </Label>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                  <Switch
                    id={item.id}
                    checked={
                      settings[item.id as keyof typeof settings] as boolean
                    }
                    onCheckedChange={(checked) =>
                      handleInputChange(item.id, checked)
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                API Settings
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Configure API rate limits and webhook integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiRateLimit" className="dark:text-gray-300">
                  API Rate Limit (requests/minute)
                </Label>
                <input
                  id="apiRateLimit"
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) =>
                    handleInputChange("apiRateLimit", parseInt(e.target.value))
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="enableWebhooks"
                    className="dark:text-gray-300"
                  >
                    Enable Webhooks
                  </Label>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Send events to external services
                  </div>
                </div>
                <Switch
                  id="enableWebhooks"
                  checked={settings.enableWebhooks}
                  onCheckedChange={(checked) =>
                    handleInputChange("enableWebhooks", checked)
                  }
                />
              </div>

              {settings.enableWebhooks && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl" className="dark:text-gray-300">
                    Webhook URL
                  </Label>
                  <input
                    id="webhookUrl"
                    placeholder="https://api.example.com/webhook"
                    value={settings.webhookUrl}
                    onChange={(e) =>
                      handleInputChange("webhookUrl", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <Label className="dark:text-gray-300">API Keys</Label>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Manage your API keys for integration
                </div>
                <Button
                  variant="outline"
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Generate New API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
