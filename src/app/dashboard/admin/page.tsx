"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Plus,
  BarChart3,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyGrowth: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    amount: number;
    status: string;
    date: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't redirect if user is still loading
    if (user === null) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/dashboard/user");
      return;
    }

    // Load dashboard data - replace with actual API calls
    const loadDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        setStats({
          totalUsers: 1234,
          totalProducts: 89,
          totalOrders: 456,
          totalRevenue: 45600,
          monthlyGrowth: 12.5,
          recentOrders: [
            {
              id: "ORD001",
              customerName: "John Doe",
              amount: 129.99,
              status: "completed",
              date: "2024-01-15",
            },
            {
              id: "ORD002",
              customerName: "Jane Smith",
              amount: 89.5,
              status: "pending",
              date: "2024-01-15",
            },
            {
              id: "ORD003",
              customerName: "Mike Johnson",
              amount: 199.99,
              status: "processing",
              date: "2024-01-14",
            },
          ],
          topProducts: [
            {
              id: "PROD001",
              name: "Premium Cologne",
              sales: 45,
              revenue: 2250,
            },
            { id: "PROD002", name: "Luxury Perfume", sales: 38, revenue: 1900 },
            {
              id: "PROD003",
              name: "Eau de Toilette",
              sales: 32,
              revenue: 1600,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, user, router]);

  if (loading || user === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lavender-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-lavender-200">
          Welcome back, {user?.name}! Here&apos;s what&apos;s happening with
          your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-lavender-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-lavender-300">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-lavender-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalProducts}
            </div>
            <p className="text-xs text-lavender-300">+3 new this week</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-lavender-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.totalOrders}
            </div>
            <p className="text-xs text-lavender-300">+23 from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-lavender-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-lavender-300 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{stats.monthlyGrowth}%
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <Button
          onClick={() => router.push("/dashboard/admin/products/new")}
          className="bg-lavender-600 hover:bg-lavender-700 text-white h-12"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
        <Button
          onClick={() => router.push("/dashboard/admin/users")}
          className="bg-dark-purple-600 hover:bg-dark-purple-700 text-white h-12"
        >
          <Users className="h-4 w-4 mr-2" />
          Manage Users
        </Button>
        <Button
          onClick={() => router.push("/dashboard/admin/orders")}
          className="bg-gold hover:bg-gold/90 text-dark-purple-900 h-12"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Orders
        </Button>
        <Button
          onClick={() => router.push("/dashboard/admin/analytics")}
          className="bg-white/20 hover:bg-white/30 text-white h-12 backdrop-blur-sm"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">
                      {order.customerName}
                    </p>
                    <p className="text-lavender-300 text-sm">
                      {order.id} • {order.date}
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
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-lavender-300 text-sm">
                      {product.sales} sales
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">${product.revenue}</p>
                    <p className="text-lavender-300 text-sm">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
