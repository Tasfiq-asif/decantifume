"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { User, ShoppingBag, MapPin, Settings, Package } from "lucide-react";
import { Loading } from "@/components/ui/loading";

interface UserDashboardData {
  totalOrders: number;
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    productName: string;
    amount: number;
    status: string;
    date: string;
  }>;
}

interface OrderFromAPI {
  orderNumber: string;
  items: Array<{
    productName: string;
  }>;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

// API calls to get order statistics and recent orders
const getUserOrderStats = async () => {
  try {
    const authToken = await getAuthToken();
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

    // Get order statistics
    const statsResponse = await fetch(`${apiUrl}/orders/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Get recent orders
    const ordersResponse = await fetch(
      `${apiUrl}/orders/my-orders?limit=5&sortBy=createdAt&sortOrder=desc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!statsResponse.ok || !ordersResponse.ok) {
      throw new Error("Failed to fetch order data");
    }

    const statsData = await statsResponse.json();
    const ordersData = await ordersResponse.json();

    // Combine the data
    return {
      totalOrders: statsData.data?.totalOrders || 0,
      pendingOrders:
        (statsData.data?.pendingOrders || 0) +
        (statsData.data?.confirmedOrders || 0) +
        (statsData.data?.processingOrders || 0),
      recentOrders:
        ordersData.data?.map((order: OrderFromAPI) => ({
          id: order.orderNumber,
          productName:
            order.items?.length > 1
              ? `${order.items[0]?.productName} +${order.items.length - 1} more`
              : order.items[0]?.productName || "Order Items",
          amount: order.totalAmount,
          status: order.orderStatus,
          date: new Date(order.createdAt).toLocaleDateString(),
        })) || [],
    };
  } catch (error) {
    console.error("Error fetching order data:", error);
    // Return default data if API fails
    return {
      totalOrders: 0,
      pendingOrders: 0,
      recentOrders: [],
    };
  }
};

// Helper function to get auth token
const getAuthToken = async () => {
  if (typeof window !== "undefined") {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    return session?.accessToken || "";
  }
  return "";
};

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't redirect while authentication is still loading
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role === "admin") {
      router.push("/dashboard/admin");
      return;
    }

    // Fetch order statistics
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserOrderStats();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        // Set default data
        setDashboardData({
          totalOrders: 0,
          pendingOrders: 0,
          recentOrders: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user?.role, authLoading]);

  if (loading) {
    return <Loading fullscreen message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipping":
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
        <p className="text-lavender-200">
          Welcome back, {user?.name}! Manage your orders and profile.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Button
          onClick={() => router.push("/dashboard/user/orders")}
          className="bg-lavender-600 hover:bg-lavender-700 text-white h-16 text-lg"
        >
          <ShoppingBag className="h-6 w-6 mr-3" />
          <div className="text-left">
            <div className="font-semibold">My Orders</div>
            <div className="text-sm opacity-90">View and track orders</div>
          </div>
        </Button>
        <Button
          onClick={() => router.push("/dashboard/user/profile")}
          className="bg-dark-purple-600 hover:bg-dark-purple-700 text-white h-16 text-lg"
        >
          <User className="h-6 w-6 mr-3" />
          <div className="text-left">
            <div className="font-semibold">Profile & Addresses</div>
            <div className="text-sm opacity-90">Manage personal info</div>
          </div>
        </Button>
      </div>

      {/* Recent Orders Section */}
      <div className="mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentOrders.length > 0 ? (
                dashboardData.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/user/orders/${order.id}`)
                    }
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
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-lavender-300 mx-auto mb-4" />
                  <p className="text-lavender-300 mb-4">
                    No orders yet. Start shopping to see your orders here!
                  </p>
                  <Button
                    onClick={() => router.push("/products")}
                    className="bg-lavender-600 hover:bg-lavender-700 text-white"
                  >
                    Browse Products
                  </Button>
                </div>
              )}
            </div>
            {dashboardData.recentOrders.length > 0 && (
              <Button
                variant="ghost"
                className="w-full mt-4 text-lavender-300 hover:text-white hover:bg-white/10"
                onClick={() => router.push("/dashboard/user/orders")}
              >
                View All Orders
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profile Management Section */}
      <div className="mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Account Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="ghost"
                className="h-20 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center justify-center p-4"
                onClick={() => router.push("/dashboard/user/profile")}
              >
                <User className="h-8 w-8 mb-2 text-lavender-300" />
                <span className="font-medium">Personal Information</span>
                <span className="text-xs text-lavender-300">
                  Name, email, phone
                </span>
              </Button>
              <Button
                variant="ghost"
                className="h-20 bg-white/5 hover:bg-white/10 text-white flex flex-col items-center justify-center p-4"
                onClick={() => router.push("/dashboard/user/addresses")}
              >
                <MapPin className="h-8 w-8 mb-2 text-lavender-300" />
                <span className="font-medium">Shipping Addresses</span>
                <span className="text-xs text-lavender-300">
                  Manage delivery locations
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
