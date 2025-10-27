import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  Shield,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";

export function Dashboard() {
  const { user } = useAuth();

  const metrics = [
    {
      title: "Total Users",
      value: "1,248",
      change: "+12%",
      description: "From last month",
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/50",
    },
    {
      title: "Active Sessions",
      value: "342",
      change: "+8%",
      description: "From last week",
      icon: Shield,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/50",
    },
    {
      title: "API Requests",
      value: "24.8K",
      change: "+23%",
      description: "From yesterday",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/50",
    },
    {
      title: "Success Rate",
      value: "99.8%",
      change: "+0.2%",
      description: "System stability",
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/50",
    },
  ];

  const recentActivity = [
    {
      action: "User registered",
      user: "john@example.com",
      time: "2 minutes ago",
      status: "success",
    },
    {
      action: "Password reset",
      user: "sarah@company.com",
      time: "15 minutes ago",
      status: "success",
    },
    {
      action: "Failed login attempt",
      user: "unknown@ip.com",
      time: "1 hour ago",
      status: "warning",
    },
    {
      action: "API key generated",
      user: user?.email || "admin@authbase.com",
      time: "2 hours ago",
      status: "success",
    },
  ];

  const getUserDisplayName = () => {
    return user?.name || user?.email?.split("@")[0] || "User";
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {getUserDisplayName()}
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
        >
          Live Data
        </Badge>
      </div>

      {/* API Usage Dashboard */}
      <DashboardOverview />

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card
            key={metric.title}
            className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {metric.change}
                </span>{" "}
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div
                  className={`p-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                      : "bg-orange-50 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400"
                  }`}
                >
                  {activity.status === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.user}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </p>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      activity.status === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                    }`}
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
