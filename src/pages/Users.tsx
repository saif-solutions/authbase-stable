import { useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Users as UsersIcon,
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

const mockUsers = [
  {
    id: "1",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-15T10:30:00Z",
    createdAt: "2024-01-10T14:20:00Z",
    verified: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    phone: "+1 (555) 987-6543",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-14T16:45:00Z",
    createdAt: "2024-01-12T09:15:00Z",
    verified: true,
  },
  {
    id: "3",
    name: "Mike Chen",
    email: "mike@startup.io",
    phone: "+1 (555) 456-7890",
    role: "User",
    status: "Inactive",
    lastLogin: "2024-01-05T11:20:00Z",
    createdAt: "2024-01-03T13:40:00Z",
    verified: false,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@techcorp.com",
    phone: "+1 (555) 234-5678",
    role: "Moderator",
    status: "Active",
    lastLogin: "2024-01-15T08:15:00Z",
    createdAt: "2024-01-08T10:30:00Z",
    verified: true,
  },
];

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const verifiedUsers = users.filter((u) => u.verified).length;
  const adminUsers = users.filter((u) => u.role === "Admin").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor all registered users in your system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalUsers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Users
              </div>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg dark:bg-blue-900/50">
              <UsersIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {activeUsers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Users
              </div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg dark:bg-green-900/50">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {verifiedUsers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Verified
              </div>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg dark:bg-purple-900/50">
              <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {adminUsers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Admins
              </div>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg dark:bg-orange-900/50">
              <Filter className="h-5 w-5 text-orange-600 dark:text-orange-400" />
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
              Showing {filteredUsers.length} of {totalUsers} users
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-gray-200 shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="bg-gray-50/50 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 dark:text-white">
            Users
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
            >
              {filteredUsers.length}
            </Badge>
          </CardTitle>
          <CardDescription className="dark:text-gray-400">
            Manage user accounts, roles, and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50 dark:bg-gray-800/80 dark:hover:bg-gray-800">
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    User
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    Role
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4">
                    Last Login
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white py-4 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-gray-50/50 border-b border-gray-100 dark:hover:bg-gray-700/50 dark:border-gray-700"
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                          <span className="text-sm font-semibold text-white">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {user.verified ? (
                              <CheckCircle className="h-3 w-3 text-green-500 dark:text-green-400" />
                            ) : (
                              <XCircle className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            )}
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant="outline"
                        className={
                          user.role === "Admin"
                            ? "border-blue-200 bg-blue-50 text-blue-700 font-medium dark:border-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                            : user.role === "Moderator"
                            ? "border-purple-200 bg-purple-50 text-purple-700 font-medium dark:border-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                            : "border-gray-200 bg-gray-50 text-gray-700 font-medium dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge
                        variant={
                          user.status === "Active" ? "default" : "secondary"
                        }
                        className={
                          user.status === "Active"
                            ? "font-medium dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                            : "font-medium dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(user.lastLogin)}
                      </div>
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
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm dark:hover:bg-gray-700">
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
