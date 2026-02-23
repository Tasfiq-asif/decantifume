"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import { Loading } from "@/components/ui/loading";

// Redux imports
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchAdminStats,
  fetchRecentOrders,
  fetchTopProducts,
  fetchUserStats,
} from "@/redux/slices/adminSlice";
import {
  selectAdminDashboardStats,
  selectFormattedRecentOrders,
  selectFormattedTopProducts,
  selectAdminStatsError,
  selectUserStats,
  selectUserStatsLoading,
  selectUserStatsError,
} from "@/redux/selectors";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const stats = useSelector(selectAdminDashboardStats);
  const recentOrders = useSelector(selectFormattedRecentOrders);
  const topProducts = useSelector(selectFormattedTopProducts);

  // Error states
  const statsError = useSelector(selectAdminStatsError);

  // User stats
  const userStats = useSelector(selectUserStats);
  const userStatsLoading = useSelector(selectUserStatsLoading);
  const userStatsError = useSelector(selectUserStatsError);

  const [loading, setLoading] = useState(true);
  const hasLoadedData = useRef(false);
  const isLoadingData = useRef(false);
  const authStateStable = useRef(false);

  // Memoized data loading function to prevent re-creation on every render
  const loadDashboardData = useCallback(async () => {
    // Multiple protection layers
    if (hasLoadedData.current || isLoadingData.current) {
      console.log("⏩ Skipping data load - already loaded or loading");
      return;
    }

    console.log("🔄 Loading admin dashboard data..."); // Debug log
    isLoadingData.current = true;

    try {
      hasLoadedData.current = true;

      // Fetch all admin data in parallel
      await Promise.all([
        dispatch(fetchAdminStats()),
        dispatch(fetchRecentOrders(5)),
        dispatch(fetchTopProducts(3)),
        dispatch(fetchUserStats()),
      ]);

      console.log("✅ Admin dashboard data loaded successfully"); // Debug log
    } catch (error) {
      console.error("❌ Failed to load dashboard data:", error);
      hasLoadedData.current = false; // Allow retry on error
    } finally {
      setLoading(false);
      isLoadingData.current = false;
    }
  }, [dispatch]);

  // Separate effect to handle authentication and data loading
  useEffect(() => {
    console.log("🏃 AdminDashboard useEffect running", {
      isAuthenticated,
      user: user?.role,
      hasLoadedData: hasLoadedData.current,
      isLoadingData: isLoadingData.current,
    });

    // Wait for user to be determined
    if (user === null) {
      console.log("⏸️ Waiting for user authentication...");
      return;
    }

    // Handle authentication redirects
    if (!isAuthenticated) {
      console.log("🔄 Redirecting to login...");
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      console.log("🔄 Redirecting to user dashboard...");
      router.push("/dashboard/user");
      return;
    }

    // Only load data if auth is stable and we haven't loaded yet
    if (!authStateStable.current) {
      authStateStable.current = true;
      console.log("✅ Auth state stabilized, loading data...");
      // Add a small delay to ensure auth state is fully settled
      setTimeout(() => {
        loadDashboardData();
      }, 100);
    }
  }, [isAuthenticated, user, router, loadDashboardData]);

  // Manual retry function that resets all flags
  const handleRetry = useCallback(() => {
    console.log("🔄 Manual retry triggered");
    hasLoadedData.current = false;
    isLoadingData.current = false;
    authStateStable.current = false;
    setLoading(true);
    setTimeout(() => {
      loadDashboardData();
    }, 100);
  }, [loadDashboardData]);

  // Simplified loading condition - only check local loading state
  if (loading || user === null) {
    return <Loading fullscreen message="Loading Admin Dashboard..." />;
  }

  // Show error state with more specific messaging
  if (statsError) {
    const errorMessage = statsError;
    const isRateLimit = errorMessage?.includes("Too many requests");

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            {isRateLimit ? (
              <svg
                className="w-8 h-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 8.5c-.77.833-.192 2.5 1.338 2.5z"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isRateLimit ? "Server Busy" : "Failed to Load Dashboard"}
          </h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <Button
            onClick={handleRetry}
            className="bg-lavender-600 hover:bg-lavender-700"
          >
            {isRateLimit ? "Try Again" : "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  // Early return if stats are not loaded yet
  if (!stats) {
    return <Loading fullscreen message="Loading dashboard data..." />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
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
              {userStatsLoading ? (
                <div className="animate-pulse bg-white/20 rounded h-8 w-16"></div>
              ) : userStatsError ? (
                "Error"
              ) : (
                userStats?.totalUsers || 0
              )}
            </div>
            <p className="text-xs text-lavender-300">
              {userStatsLoading
                ? "Loading..."
                : userStats
                ? `${userStats.activeUsers} active, ${userStats.adminUsers} admins`
                : "User analytics"}
            </p>
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
            <p className="text-xs text-lavender-300">Active products</p>
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
            <p className="text-xs text-lavender-300">
              {stats.pendingOrders} pending
            </p>
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
              ${stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-lavender-300 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Avg: ${stats.averageOrderValue.toFixed(2)} per order
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
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
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
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-lavender-300 mb-4" />
                  <p className="text-lavender-300">No recent orders found</p>
                </div>
              )}
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
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-lavender-300 text-sm">
                        {product.brand} • {product.quantity} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        ${product.revenue.toFixed(2)}
                      </p>
                      <p className="text-lavender-300 text-sm">
                        {product.sales} orders
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-lavender-300 mb-4" />
                  <p className="text-lavender-300">No product data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
