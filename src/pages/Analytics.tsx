import {
  TrendingUp,
  Users,
  Shield,
  Activity,
  Eye,
  Clock,
  BarChart3,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Analytics() {
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

  const chartData = [
    { day: "Mon", users: 120, sessions: 85, requests: 4200 },
    { day: "Tue", users: 145, sessions: 92, requests: 4800 },
    { day: "Wed", users: 132, sessions: 78, requests: 4500 },
    { day: "Thu", users: 168, sessions: 105, requests: 5200 },
    { day: "Fri", users: 156, sessions: 98, requests: 4900 },
    { day: "Sat", users: 142, sessions: 88, requests: 4600 },
    { day: "Sun", users: 128, sessions: 82, requests: 4400 },
  ];

  const topEvents = [
    { event: "User Login", count: 1248, trend: "up" },
    { event: "Password Reset", count: 342, trend: "down" },
    { event: "Session Created", count: 892, trend: "up" },
    { event: "API Call", count: 24800, trend: "up" },
    { event: "Failed Login", count: 45, trend: "down" },
  ];

  const maxRequests = Math.max(...chartData.map((d) => d.requests));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
          >
            <Eye className="h-3 w-3 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Requests Chart */}
        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <BarChart3 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              API Requests (Last 7 Days)
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Daily API request volume and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-40">
                {chartData.map((day) => (
                  <div
                    key={day.day}
                    className="flex flex-col items-center space-y-2 flex-1"
                  >
                    <div
                      className="w-8 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-700"
                      style={{
                        height: `${(day.requests / maxRequests) * 100}%`,
                      }}
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {day.day}
                    </div>
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {day.requests.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Activity className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Top Events
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Most frequent authentication events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEvents.map((event) => (
                <div
                  key={event.event}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        event.trend === "up"
                          ? "bg-green-50 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-400"
                      }`}
                    >
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {event.event}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {event.count.toLocaleString()} events
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={
                      event.trend === "up"
                        ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                        : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
                    }
                  >
                    {event.trend === "up" ? "↑" : "↓"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm dark:text-white">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  New Users
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  +124
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Active Rate
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  74%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Retention
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  89%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm dark:text-white">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              Security Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Failed Logins
                </span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  45
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Suspicious Activity
                </span>
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  12
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Security Score
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  98%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm dark:text-white">
              <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Response Time
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  42ms
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Uptime
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  99.9%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Peak Load
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  2.4K RPM
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
