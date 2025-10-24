import { Bell, Search, ChevronDown, LogOut, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();

  const getUserDisplayName = () => {
    return user?.name || user?.email?.split("@")[0] || "User";
  };

  const getUserInitial = () => {
    return (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Page title */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Welcome back, {getUserDisplayName()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Pricing Link */}
        <Link to="/pricing">
          <Button variant="outline" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Pricing
          </Button>
        </Link>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 pl-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <p className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </p>
            </div>
            <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
              <p className="font-medium text-gray-900 dark:text-white">
                New user registered
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                john@example.com just signed up
              </p>
              <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-white">
                  {getUserInitial()}
                </span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || "No email"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 dark:bg-gray-800 dark:border-gray-700"
          >
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 dark:hover:bg-gray-700">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {getUserInitial()}
                </span>
              </div>
              <div>
                <p className="font-medium dark:text-white">
                  {getUserDisplayName()}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || "No email"}
                </p>
              </div>
            </DropdownMenuItem>
            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-gray-700 dark:text-gray-300">
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer dark:hover:bg-gray-700 dark:text-gray-300">
              Billing & Plan
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 dark:hover:bg-gray-700"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
