import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardService } from "@/services/dashboardService";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlexibleData = any;

export function DashboardOverview() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<FlexibleData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const dashboardData = await dashboardService.getOverview();
      setData(dashboardData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  // Safe data access with fallbacks - handle both old and new data formats
  const subscription = data.subscription ||
    data.plan || {
      name: "Free Plan",
      price: 0,
      priceMonthly: 0,
      rateLimit: 1000,
      maxTokens: 3,
    };

  const usage = data.usage || {
    tokensUsed: data.tokens?.length || 0,
    tokensLimit: subscription.maxTokens || 3,
    totalRequests: 0,
  };

  const tokens = data.tokens || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Plan
              <Badge variant="secondary">{subscription.name}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monthly Cost</span>
              <span className="font-semibold">
                $
                {(
                  (subscription.price || subscription.priceMonthly || 0) / 100
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rate Limit</span>
              <span className="font-semibold">
                {(subscription.rateLimit || 1000).toLocaleString()}/hr
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Max Tokens</span>
              <span className="font-semibold">{subscription.maxTokens}</span>
            </div>
            {data.user?.isOAuthUser && (
              <div className="pt-2 border-t">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Social Login User
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle>API Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tokens Used</span>
                <span className="font-semibold">
                  {usage.tokensUsed} / {usage.tokensLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (usage.tokensUsed / usage.tokensLimit) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-600 text-center">
                {usage.tokensLimit - usage.tokensUsed} tokens remaining
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {usage.totalRequests?.toLocaleString() || "0"}
            </div>
            <p className="text-sm text-gray-600 mt-2">Total Requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Tokens List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          {tokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No API tokens created yet
              <p className="text-sm mt-2">
                {data.features?.hasServiceTokens
                  ? "Create your first API token to get started"
                  : "API tokens feature is not available yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {tokens.map((token: any) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="font-medium">{token.name}</div>
                      {!token.isActive && (
                        <Badge variant="outline" className="bg-gray-100">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Prefix: {token.prefix}...
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(token.permissions || []).map((permission: string) => (
                        <Badge
                          key={permission}
                          variant="secondary"
                          className="text-xs"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-sm font-semibold">
                      {(token.usageCount || 0).toLocaleString()} requests
                    </div>
                    <div className="text-xs text-gray-600">
                      Created: {new Date(token.createdAt).toLocaleDateString()}
                    </div>
                    {token.lastUsedAt && (
                      <div className="text-xs text-gray-600">
                        Last used:{" "}
                        {new Date(token.lastUsedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fallback indicator */}
      {data._fallback && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-800 text-sm">
              <strong>Note:</strong> Displaying demo data. Some features may not
              be fully configured yet.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
