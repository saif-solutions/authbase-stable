import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardService, DashboardData } from "@/services/dashboardService";

export function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plan Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Current Plan
              <Badge variant="secondary">{data.plan.name}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Monthly Cost</span>
              <span className="font-semibold">
                ${(data.plan.priceMonthly / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rate Limit</span>
              <span className="font-semibold">
                {data.plan.rateLimit.toLocaleString()}/hr
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Max Tokens</span>
              <span className="font-semibold">{data.plan.maxTokens}</span>
            </div>
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
                  {data.usage.tokensUsed} / {data.usage.tokensLimit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (data.usage.tokensUsed / data.usage.tokensLimit) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-600 text-center">
                {data.usage.tokensLimit - data.usage.tokensUsed} tokens
                remaining
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
              {data.usage.totalRequests.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Total Requests (30 days)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tokens List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          {data.tokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No API tokens created yet
            </div>
          ) : (
            <div className="space-y-4">
              {data.tokens.map((token) => (
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
                      {token.permissions.map((permission) => (
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
                      {token.recentUsage.toLocaleString()} requests
                    </div>
                    <div className="text-xs text-gray-600">
                      Total: {token.usageCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600">
                      Created: {new Date(token.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
