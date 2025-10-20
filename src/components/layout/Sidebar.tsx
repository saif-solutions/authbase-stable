import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  BarChart3,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/users", icon: Users },
  { name: "Sessions", href: "/sessions", icon: Shield },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800 px-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-white">AuthBase Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href === "/dashboard" && location.pathname === "/");

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                )}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-400 truncate">admin@authbase.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
