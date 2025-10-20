import { useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  Filter,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockSessions = [
  {
    id: "1",
    userId: "user1",
    userName: "John Smith",
    userAgent: "Chrome on Windows",
    deviceType: "desktop",
    ipAddress: "192.168.1.100",
    location: "New York, US",
    lastActivity: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-15T08:15:00Z",
    status: "active",
  },
  {
    id: "2",
    userId: "user2",
    userName: "Sarah Johnson",
    userAgent: "Safari on iPhone",
    deviceType: "mobile",
    ipAddress: "192.168.1.101",
    location: "San Francisco, US",
    lastActivity: "2024-01-15T09:45:00Z",
    createdAt: "2024-01-14T16:30:00Z",
    status: "active",
  },
];

export function Sessions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sessions] = useState(mockSessions);

  const filteredSessions = sessions.filter(
    (session) =>
      session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.ipAddress.includes(searchTerm) ||
      session.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "desktop":
        return <Laptop className="h-4 w-4" />;
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const activeSessions = sessions.filter((s) => s.status === "active").length;
  const totalSessions = sessions.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Session Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage active user sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300"
          >
            <Filter className="h-4 w-4" />
            Export Logs
          </Button>
          <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
            <Trash2 className="h-4 w-4" />
            Revoke All
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Sessions
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/50">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {activeSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Now
              </div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg dark:bg-green-900/50">
              <Laptop className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {totalSessions - activeSessions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Expired
              </div>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg dark:bg-orange-900/50">
              <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400 z-10" />
                <input
                  type="text"
                  placeholder="Search by user, IP, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-fallback focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Showing {filteredSessions.length} of {totalSessions} sessions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card className="border-gray-200 shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="bg-gray-50/50 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 dark:text-white">
            Active Sessions
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
            >
              {filteredSessions.length}
            </Badge>
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Monitor and manage user authentication sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50 dark:bg-gray-800/80 dark:hover:bg-gray-800">
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    User & Device
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    Location
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    Last Activity
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    Session Started
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSessions.map((session) => (
                  <TableRow
                    key={session.id}
                    className="hover:bg-gray-50/50 border-b border-gray-100 dark:hover:bg-gray-700/50 dark:border-gray-700"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700">
                          {getDeviceIcon(session.deviceType)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {session.userName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {session.userAgent}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {session.ipAddress}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {session.location}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        {getTimeAgo(session.lastActivity)}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(session.lastActivity)}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(session.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          session.status === "active" ? "default" : "secondary"
                        }
                        className={
                          session.status === "active"
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100 font-medium dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                            : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100 font-medium dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        }
                      >
                        {session.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 dark:bg-gray-800 dark:border-gray-700"
                        >
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm dark:hover:bg-gray-700 dark:text-gray-300">
                            <Edit className="h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm text-red-600 focus:text-red-600 dark:hover:bg-gray-700">
                            <Trash2 className="h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
