"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  User,
  Heart,
  MapPin,
  CreditCard,
  LogOut,
  Home,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAdminRoute = pathname.startsWith("/dashboard/admin");

  // Admin navigation items
  const adminNavItems = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/dashboard/admin/products",
      label: "Products",
      icon: Package,
    },
    {
      href: "/dashboard/admin/orders",
      label: "Orders",
      icon: ShoppingCart,
    },
    {
      href: "/dashboard/admin/users",
      label: "Users",
      icon: Users,
    },
    {
      href: "/dashboard/admin/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      href: "/dashboard/admin/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  // User navigation items
  const userNavItems = [
    {
      href: "/dashboard/user",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/dashboard/user/orders",
      label: "My Orders",
      icon: ShoppingCart,
    },
    {
      href: "/dashboard/user/wishlist",
      label: "Wishlist",
      icon: Heart,
    },
    {
      href: "/dashboard/user/profile",
      label: "Profile",
      icon: User,
    },
    {
      href: "/dashboard/user/addresses",
      label: "Addresses",
      icon: MapPin,
    },
    {
      href: "/dashboard/user/payment",
      label: "Payment Methods",
      icon: CreditCard,
    },
  ];

  const navItems = isAdminRoute ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-black/20 backdrop-blur-sm border-r border-white/10">
          <div className="p-6">
            {/* Logo/Brand */}
            <Link href="/" className="block mb-8">
              <h2 className="text-2xl font-bold text-white">DECANT</h2>
              <p className="text-lavender-300 text-sm">
                {isAdminRoute ? "Admin Panel" : "My Account"}
              </p>
            </Link>

            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-lavender-600 text-white"
                        : "text-lavender-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Info & Logout */}
            <div className="mt-auto pt-8">
              <Card className="bg-white/5 border-white/10 p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-lavender-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-lavender-300 text-sm">{user?.email}</p>
                  </div>
                </div>
              </Card>

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full text-lavender-300 hover:text-white hover:bg-red-600/20 justify-start"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
