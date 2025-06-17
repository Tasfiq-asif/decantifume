"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  Package,
  CreditCard,
  Star,
} from "lucide-react";

interface UserDashboardData {
  totalOrders: number;
  pendingOrders: number;
  wishlistCount: number;
  recentOrders: Array<{
    id: string;
    productName: string;
    amount: number;
    status: string;
    date: string;
    image?: string;
  }>;
  wishlistItems: Array<{
    id: string;
    name: string;
    price: number;
    image?: string;
  }>;
}

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role === "admin") {
      router.push("/dashboard/admin");
      return;
    }

    // Mock data - replace with actual API calls
    setTimeout(() => {
      setDashboardData({
        totalOrders: 12,
        pendingOrders: 2,
        wishlistCount: 5,
        recentOrders: [
          {
            id: "ORD001",
            productName: "Premium Cologne Set",
            amount: 129.99,
            status: "delivered",
            date: "2024-01-10",
          },
          {
            id: "ORD002",
            productName: "Luxury Perfume",
            amount: 89.5,
            status: "shipping",
            date: "2024-01-12",
          },
          {
            id: "ORD003",
            productName: "Travel Size Collection",
            amount: 45.0,
            status: "processing",
            date: "2024-01-14",
          },
        ],
        wishlistItems: [
          { id: "WISH001", name: "Rose Garden Perfume", price: 95.0 },
          { id: "WISH002", name: "Ocean Breeze Cologne", price: 75.0 },
          { id: "WISH003", name: "Midnight Essence", price: 120.0 },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lavender-600"></div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipping":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
          <p className="text-lavender-200">
            Welcome back, {user?.name}! Manage your account and orders.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-lavender-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {dashboardData.totalOrders}
              </div>
              <p className="text-xs text-lavender-300">All time purchases</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Pending Orders
              </CardTitle>
              <Package className="h-4 w-4 text-lavender-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {dashboardData.pendingOrders}
              </div>
              <p className="text-xs text-lavender-300">Being processed</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Wishlist Items
              </CardTitle>
              <Heart className="h-4 w-4 text-lavender-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {dashboardData.wishlistCount}
              </div>
              <p className="text-xs text-lavender-300">Saved for later</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={() => router.push("/dashboard/user/profile")}
            className="bg-lavender-600 hover:bg-lavender-700 text-white h-12"
          >
            <User className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            onClick={() => router.push("/dashboard/user/orders")}
            className="bg-dark-purple-600 hover:bg-dark-purple-700 text-white h-12"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            My Orders
          </Button>
          <Button
            onClick={() => router.push("/dashboard/user/wishlist")}
            className="bg-gold hover:bg-gold/90 text-dark-purple-900 h-12"
          >
            <Heart className="h-4 w-4 mr-2" />
            Wishlist
          </Button>
          <Button
            onClick={() => router.push("/dashboard/user/addresses")}
            className="bg-white/20 hover:bg-white/30 text-white h-12 backdrop-blur-sm"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Addresses
          </Button>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {order.productName}
                      </p>
                      <p className="text-lavender-300 text-sm">
                        Order #{order.id} • {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${order.amount}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-lavender-300 hover:text-white hover:bg-white/10"
                onClick={() => router.push("/dashboard/user/orders")}
              >
                View All Orders
              </Button>
            </CardContent>
          </Card>

          {/* Wishlist */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Heart className="h-5 w-5 mr-2" />
                My Wishlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-lavender-600/20 rounded-lg flex items-center justify-center mr-3">
                        <Star className="h-6 w-6 text-lavender-300" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-lavender-300 text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-lavender-600 hover:bg-lavender-700 text-white"
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-lavender-300 hover:text-white hover:bg-white/10"
                onClick={() => router.push("/dashboard/user/wishlist")}
              >
                View Full Wishlist
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Account Settings Section */}
        <div className="mt-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="ghost"
                  className="h-16 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center"
                  onClick={() => router.push("/dashboard/user/profile")}
                >
                  <User className="h-6 w-6 mb-1" />
                  <span className="text-sm">Profile Settings</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-16 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center"
                  onClick={() => router.push("/dashboard/user/payment")}
                >
                  <CreditCard className="h-6 w-6 mb-1" />
                  <span className="text-sm">Payment Methods</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-16 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center"
                  onClick={() => router.push("/dashboard/user/addresses")}
                >
                  <MapPin className="h-6 w-6 mb-1" />
                  <span className="text-sm">Manage Addresses</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
