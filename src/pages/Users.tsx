import { useState, useEffect } from "react";
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
import { authAPI } from "@/services/authAPI";
import { User } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";

// Extended interface for user updates that matches backend expectations
interface UserUpdate {
  role?: string;
  isActive?: boolean;
}

// Edit User Modal Component
const EditUserModal = ({
  user,
  onSave,
  onClose,
}: {
  user: User;
  onSave: (updates: UserUpdate) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    role: user.role,
    status: user.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      role: formData.role,
      isActive: formData.status === "Active",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">
          Edit User
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  role: e.target.value as "Admin" | "User" | "Moderator",
                })
              }
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "Active" | "Inactive",
                })
              }
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { user: currentUser } = useAuth();

  // Fetch real users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await authAPI.getUsers();
        setUsers(response.data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = async (userId: string, updates: UserUpdate) => {
    try {
      const response = await fetch(
        `https://authbase-pro.onrender.com/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updates),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Transform the backend response to match our frontend User type
        const updatedUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role as "Admin" | "User" | "Moderator",
          status: data.user.status as "Active" | "Inactive",
          lastLogin: data.user.lastLogin,
          createdAt: data.user.createdAt,
          verified: data.user.verified,
        };
        setUsers(
          users.map((user) => (user.id === userId ? updatedUser : user))
        );
        setEditingUser(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update user");
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `https://authbase-pro.onrender.com/api/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-2">Error</div>
          <div className="text-gray-600 dark:text-gray-400">{error}</div>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                ) : (
                  totalUsers
                )}
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
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                ) : (
                  activeUsers
                )}
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
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                ) : (
                  verifiedUsers
                )}
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
                {isLoading ? (
                  <div className="h-8 w-12 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                ) : (
                  adminUsers
                )}
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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-fallback focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  disabled={isLoading}
                />
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={isLoading}
              >
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {isLoading
                ? "Loading..."
                : `Showing ${filteredUsers.length} of ${totalUsers} users`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-gray-200 shadow-sm overflow-hidden dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="bg-gray-50/50 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 dark:text-white">
            Users
            {!isLoading && (
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
              >
                {filteredUsers.length}
              </Badge>
            )}
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
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-50/50 border-b border-gray-100 dark:hover:bg-gray-700/50 dark:border-gray-700"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700" />
                          <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                            <div className="h-3 w-32 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-2">
                          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse ml-auto dark:bg-gray-700" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      <div className="text-gray-500 dark:text-gray-400">
                        {searchTerm
                          ? "No users match your search"
                          : "No users found"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50/50 border-b border-gray-100 dark:hover:bg-gray-700/50 dark:border-gray-700"
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                            <span className="text-sm font-semibold text-white">
                              {user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {user.name || "Unnamed User"}
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
                          {user.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
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
                          {user.role || "User"}
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
                          {user.status || "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-3 w-3" />
                          {user.lastLogin
                            ? formatDate(user.lastLogin)
                            : "Never"}
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
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer text-sm dark:hover:bg-gray-700"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center gap-2 cursor-pointer text-sm text-red-600 focus:text-red-600 dark:hover:bg-gray-700"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.id === currentUser?.id}
                            >
                              <Trash2 className="h-4 w-4" />
                              {user.id === currentUser?.id
                                ? "Cannot delete yourself"
                                : "Delete User"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={(updates) => handleEditUser(editingUser.id, updates)}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
