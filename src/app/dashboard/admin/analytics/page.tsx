"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ChevronDown,
} from "lucide-react";
import * as XLSX from "xlsx";
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
} from "@/redux/selectors";

// Mock data for time-based analytics (in a real app, this would come from API)
const generateRevenueData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month) => ({
    month,
    revenue: Math.floor(Math.random() * 50000) + 20000,
    orders: Math.floor(Math.random() * 200) + 50,
    customers: Math.floor(Math.random() * 100) + 30,
  }));
};

const generateDailyData = () => {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return days.map((day) => ({
    day: `Day ${day}`,
    revenue: Math.floor(Math.random() * 5000) + 1000,
    orders: Math.floor(Math.random() * 50) + 10,
    visitors: Math.floor(Math.random() * 200) + 50,
  }));
};

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const stats = useSelector(selectAdminDashboardStats);
  const recentOrders = useSelector(selectFormattedRecentOrders);
  const topProducts = useSelector(selectFormattedTopProducts);
  const userStats = useSelector(selectUserStats);

  const statsError = useSelector(selectAdminStatsError);

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("12months");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const hasLoadedData = useRef(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Generate analytics data
  const revenueData = generateRevenueData();
  const dailyData = generateDailyData();

  // Order status distribution data
  const orderStatusData = stats
    ? [
        { name: "Pending", value: stats.pendingOrders, color: "#fbbf24" },
        { name: "Confirmed", value: stats.confirmedOrders, color: "#10b981" },
        { name: "Processing", value: stats.processingOrders, color: "#3b82f6" },
        { name: "Shipped", value: stats.shippedOrders, color: "#8b5cf6" },
        { name: "Delivered", value: stats.deliveredOrders, color: "#06b6d4" },
        { name: "Cancelled", value: stats.cancelledOrders, color: "#ef4444" },
      ]
    : [];

  // Load data
  const loadAnalyticsData = useCallback(async () => {
    if (hasLoadedData.current) return;

    try {
      hasLoadedData.current = true;
      await Promise.all([
        dispatch(fetchAdminStats()),
        dispatch(fetchRecentOrders(10)),
        dispatch(fetchTopProducts(6)),
        dispatch(fetchUserStats()),
      ]);
    } catch (error) {
      console.error("Failed to load analytics data:", error);
      hasLoadedData.current = false;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user === null) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/dashboard/user");
      return;
    }

    loadAnalyticsData();
  }, [isAuthenticated, user, router, loadAnalyticsData]);

  // Handle click outside export menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target as Node)
      ) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showExportMenu]);

  if (loading || user === null) {
    return <Loading fullscreen message="Loading Analytics..." />;
  }

  if (statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Failed to Load Analytics
          </h3>
          <p className="text-lavender-200 mb-4">{statsError}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-lavender-600 hover:bg-lavender-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Calculate percentage changes (mock data for demo)
  const revenueChange = 15.3;
  const ordersChange = 8.7;
  const customersChange = 12.1;
  const avgOrderChange = -2.4;

  // Export functions
  const exportToCSV = (
    data: Record<string, string | number>[],
    filename: string
  ) => {
    const csvContent = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (
    data: Record<string, string | number>[],
    filename: string
  ) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics Data");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleExportAll = (format: "csv" | "excel") => {
    // Combine all analytics data into comprehensive export
    const allData = [
      // Summary Stats
      {
        Type: "SUMMARY",
        Metric: "Total Revenue",
        Value: stats?.totalRevenue || 0,
        Change: `+${revenueChange}%`,
      },
      {
        Type: "SUMMARY",
        Metric: "Total Orders",
        Value: stats?.totalOrders || 0,
        Change: `+${ordersChange}%`,
      },
      {
        Type: "SUMMARY",
        Metric: "Total Customers",
        Value: userStats?.totalUsers || 0,
        Change: `+${customersChange}%`,
      },
      {
        Type: "SUMMARY",
        Metric: "Average Order Value",
        Value: stats?.averageOrderValue || 0,
        Change: `${avgOrderChange}%`,
      },

      // Spacer
      { Type: "", Metric: "", Value: "", Change: "" },

      // Top Products
      {
        Type: "TOP PRODUCTS",
        Metric: "Rank",
        Value: "Product Name",
        Change: "Revenue",
      },
      ...topProducts.slice(0, 5).map((product, index) => ({
        Type: "PRODUCT",
        Metric: index + 1,
        Value: `${product.name} (${product.brand})`,
        Change: product.revenue,
      })),

      // Spacer
      { Type: "", Metric: "", Value: "", Change: "" },

      // Recent Orders
      {
        Type: "RECENT ORDERS",
        Metric: "Order ID",
        Value: "Customer",
        Change: "Amount",
      },
      ...recentOrders.slice(0, 5).map((order) => ({
        Type: "ORDER",
        Metric: order.id,
        Value: order.customerName,
        Change: order.amount,
      })),
    ];

    const filename = `analytics-report-${
      new Date().toISOString().split("T")[0]
    }`;

    if (format === "csv") {
      exportToCSV(allData, filename);
    } else {
      exportToExcel(allData, filename);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-lavender-200">
                Comprehensive insights into your ecommerce performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-dark-purple-800/50 border border-lavender-600/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-lavender-500"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="12months">Last 12 months</option>
                <option value="1year">This year</option>
              </select>
              <div className="relative" ref={exportMenuRef}>
                <Button
                  className="bg-lavender-600 hover:bg-lavender-700 text-white"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-dark-purple-800 border border-lavender-600/30 rounded-lg shadow-lg z-[9999]">
                    <div className="p-2">
                      <button
                        onClick={() => handleExportAll("csv")}
                        className="w-full text-left px-3 py-2 text-white hover:bg-lavender-600/20 rounded flex items-center"
                      >
                        📄 Export CSV
                      </button>
                      <button
                        onClick={() => handleExportAll("excel")}
                        className="w-full text-left px-3 py-2 text-white hover:bg-lavender-600/20 rounded flex items-center"
                      >
                        📊 Export Excel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lavender-200 text-sm font-medium">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">
                    ${stats?.totalRevenue.toLocaleString() || "0"}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">
                      +{revenueChange}%
                    </span>
                  </div>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lavender-200 text-sm font-medium">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">
                    {stats?.totalOrders.toLocaleString() || "0"}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-blue-400 text-sm">
                      +{ordersChange}%
                    </span>
                  </div>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lavender-200 text-sm font-medium">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold">
                    {userStats?.totalUsers.toLocaleString() || "0"}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 text-purple-400 mr-1" />
                    <span className="text-purple-400 text-sm">
                      +{customersChange}%
                    </span>
                  </div>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border border-white/20 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lavender-200 text-sm font-medium">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold">
                    ${stats?.averageOrderValue.toFixed(2) || "0.00"}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                    <span className="text-red-400 text-sm">
                      {avgOrderChange}%
                    </span>
                  </div>
                </div>
                <div className="bg-red-500/20 p-3 rounded-full">
                  <Activity className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2" />
                Order Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Performance */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                Daily Performance (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products Performance */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                Top Products by Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="revenue" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Table */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.slice(0, 5).map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-dark-purple-800/30 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-lavender-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-lavender-300 text-sm">
                          {product.brand}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        ${product.revenue.toLocaleString()}
                      </p>
                      <p className="text-lavender-300 text-sm">
                        {product.quantity} sold
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders Summary */}
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-dark-purple-800/30 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">
                        Order #{order.id}
                      </p>
                      <p className="text-lavender-300 text-sm">
                        {order.customerName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">${order.amount}</p>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          order.status === "delivered"
                            ? "border-green-500 text-green-400"
                            : order.status === "cancelled"
                            ? "border-red-500 text-red-400"
                            : "border-yellow-500 text-yellow-400"
                        }`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
