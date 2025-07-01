"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  fetchAllOrders,
  updateOrderStatus as updateOrderStatusAction,
} from "@/redux/slices/adminSlice";
import {
  selectAllOrdersAdmin,
  selectAllOrdersAdminLoading,
  selectAllOrdersAdminError,
  selectAllOrdersPagination,
} from "@/redux/selectors";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Icons
import {
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  DollarSign,
  Calendar,
  User,
  RefreshCw,
  FileText,
} from "lucide-react";

// Types
interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    decantSize: string;
    price: number;
    totalPrice: number;
  }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    phone?: string;
  };
}

interface OrderFilters {
  search: string;
  orderStatus: string;
  paymentStatus: string;
  dateRange: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

const DATE_RANGES = [
  { value: "", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
];

export default function AdminOrdersPage() {
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const orders = useSelector(selectAllOrdersAdmin) as Order[];
  const loading = useSelector(selectAllOrdersAdminLoading);
  const error = useSelector(selectAllOrdersAdminError);
  const pagination = useSelector(selectAllOrdersPagination);

  // Local state
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    orderStatus: "",
    paymentStatus: "",
    dateRange: "",
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Fetch orders when filters change
  useEffect(() => {
    const fetchOrders = () => {
      const queryParams: Record<string, string | number> = {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      if (filters.search) {
        queryParams.search = filters.search;
      }
      if (filters.orderStatus) {
        queryParams.orderStatus = filters.orderStatus;
      }
      if (filters.paymentStatus) {
        queryParams.paymentStatus = filters.paymentStatus;
      }
      if (filters.dateRange) {
        const now = new Date();
        let startDate: Date;

        switch (filters.dateRange) {
          case "today":
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case "week":
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case "month":
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case "quarter":
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
          default:
            startDate = new Date(0);
        }

        if (filters.dateRange !== "") {
          queryParams.startDate = startDate.toISOString();
        }
      }

      dispatch(fetchAllOrders(queryParams));
    };

    fetchOrders();
  }, [dispatch, filters]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (key: keyof OrderFilters, value: string | number) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        page: key !== "page" ? 1 : (value as number), // Reset page when other filters change
      }));
    },
    []
  );

  // Handle order status update
  const handleStatusUpdate = useCallback(
    async (orderId: string, newStatus: string) => {
      try {
        setUpdatingStatus(orderId);
        await dispatch(
          updateOrderStatusAction({ orderId, status: newStatus })
        ).unwrap();

        // Refresh orders after update
        const queryParams = {
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        };
        dispatch(fetchAllOrders(queryParams));
      } catch (error) {
        console.error("Failed to update order status:", error);
      } finally {
        setUpdatingStatus(null);
      }
    },
    [dispatch, filters]
  );

  // Status color helper
  const getStatusColor = useCallback(
    (status: string, type: "order" | "payment") => {
      if (type === "order") {
        switch (status) {
          case "delivered":
            return "bg-green-100 text-green-800 border-green-200";
          case "shipped":
            return "bg-blue-100 text-blue-800 border-blue-200";
          case "processing":
          case "confirmed":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "pending":
            return "bg-gray-100 text-gray-800 border-gray-200";
          case "cancelled":
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      } else {
        switch (status) {
          case "paid":
            return "bg-green-100 text-green-800 border-green-200";
          case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "failed":
          case "refunded":
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      }
    },
    []
  );

  // Format date helper
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Order details modal
  const OrderDetailsModal = useMemo(() => {
    if (!selectedOrder) return null;

    return (
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-dark-purple-900 border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-lavender-300" />
              Order Details - {selectedOrder.orderNumber}
            </DialogTitle>
            <DialogDescription className="text-lavender-300">
              Comprehensive order information and management
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Information */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Package className="h-4 w-4 text-lavender-300" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-lavender-300">
                    Order Number:
                  </span>
                  <span className="text-white">
                    {selectedOrder.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-lavender-300">Status:</span>
                  <Badge
                    className={getStatusColor(
                      selectedOrder.orderStatus,
                      "order"
                    )}
                  >
                    {selectedOrder.orderStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-lavender-300">
                    Payment Status:
                  </span>
                  <Badge
                    className={getStatusColor(
                      selectedOrder.paymentStatus,
                      "payment"
                    )}
                  >
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-lavender-300">
                    Total Amount:
                  </span>
                  <span className="font-bold text-green-400">
                    ${selectedOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-lavender-300">
                    Order Date:
                  </span>
                  <span className="text-white">
                    {formatDate(selectedOrder.createdAt)}
                  </span>
                </div>
                {selectedOrder.updatedAt !== selectedOrder.createdAt && (
                  <div className="flex justify-between">
                    <span className="font-medium text-lavender-300">
                      Last Updated:
                    </span>
                    <span className="text-white">
                      {formatDate(selectedOrder.updatedAt)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <User className="h-4 w-4 text-lavender-300" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-lavender-300">Name:</span>
                  <span className="text-white">{selectedOrder.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-lavender-300">Email:</span>
                  <span className="text-white">{selectedOrder.user.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium text-white">
                  {selectedOrder.shippingAddress.fullName}
                </p>
                <p className="text-lavender-200">
                  {selectedOrder.shippingAddress.address}
                </p>
                <p className="text-lavender-200">
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.country}
                </p>
                <p className="text-lavender-200">
                  {selectedOrder.shippingAddress.zipCode}
                </p>
                {selectedOrder.shippingAddress.phone && (
                  <p className="text-lavender-200">
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-lg text-white">
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {item.productName}
                        </p>
                        <p className="text-sm text-lavender-300">
                          Size: {item.decantSize} • Qty: {item.quantity}
                        </p>
                        <p className="text-sm text-lavender-300">
                          Unit Price: ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-400">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Update Section */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Update Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {ORDER_STATUSES.map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={
                      selectedOrder.orderStatus === status
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      handleStatusUpdate(selectedOrder._id, status)
                    }
                    disabled={updatingStatus === selectedOrder._id}
                    className="capitalize"
                  >
                    {updatingStatus === selectedOrder._id ? (
                      <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                    ) : null}
                    {status}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOrderDetails(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }, [
    selectedOrder,
    showOrderDetails,
    getStatusColor,
    formatDate,
    handleStatusUpdate,
    updatingStatus,
  ]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-lavender-600" />
          <p className="text-white">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-400"
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
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Failed to Load Orders
              </h3>
              <p className="text-lavender-300 mb-4">{error}</p>
              <Button
                onClick={() => {
                  const queryParams = {
                    page: filters.page,
                    limit: filters.limit,
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder,
                  };
                  dispatch(fetchAllOrders(queryParams));
                }}
                className="bg-lavender-600 hover:bg-lavender-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-purple-900 via-lavender-900 to-dark-purple-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Order Management
          </h1>
          <p className="text-lavender-200">
            Manage and track all customer orders
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search orders, customers..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-lavender-300"
                  />
                </div>
              </div>

              {/* Order Status Filter */}
              <select
                value={filters.orderStatus}
                onChange={(e) =>
                  handleFilterChange("orderStatus", e.target.value)
                }
                className="px-3 py-2 bg-black/20 border border-white/10 rounded-md text-sm text-white focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
              >
                <option value="">All Order Status</option>
                {ORDER_STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="capitalize bg-dark-purple-900 text-white"
                  >
                    {status}
                  </option>
                ))}
              </select>

              {/* Payment Status Filter */}
              <select
                value={filters.paymentStatus}
                onChange={(e) =>
                  handleFilterChange("paymentStatus", e.target.value)
                }
                className="px-3 py-2 bg-black/20 border border-white/10 rounded-md text-sm text-white focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
              >
                <option value="">All Payment Status</option>
                {PAYMENT_STATUSES.map((status) => (
                  <option
                    key={status}
                    value={status}
                    className="capitalize bg-dark-purple-900 text-white"
                  >
                    {status}
                  </option>
                ))}
              </select>

              {/* Date Range Filter */}
              <select
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
                className="px-3 py-2 bg-black/20 border border-white/10 rounded-md text-sm text-white focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
              >
                {DATE_RANGES.map((range) => (
                  <option
                    key={range.value}
                    value={range.value}
                    className="bg-dark-purple-900 text-white"
                  >
                    {range.label}
                  </option>
                ))}
              </select>

              {/* Sort By */}
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-");
                  handleFilterChange("sortBy", sortBy);
                  handleFilterChange("sortOrder", sortOrder);
                }}
                className="px-3 py-2 bg-black/20 border border-white/10 rounded-md text-sm text-white focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
              >
                <option
                  value="createdAt-desc"
                  className="bg-dark-purple-900 text-white"
                >
                  Newest First
                </option>
                <option
                  value="createdAt-asc"
                  className="bg-dark-purple-900 text-white"
                >
                  Oldest First
                </option>
                <option
                  value="totalAmount-desc"
                  className="bg-dark-purple-900 text-white"
                >
                  Highest Amount
                </option>
                <option
                  value="totalAmount-asc"
                  className="bg-dark-purple-900 text-white"
                >
                  Lowest Amount
                </option>
                <option
                  value="orderNumber-asc"
                  className="bg-dark-purple-900 text-white"
                >
                  Order Number
                </option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5" />
                Orders ({pagination.total})
              </CardTitle>
              <Button
                onClick={() => {
                  const queryParams = {
                    page: filters.page,
                    limit: filters.limit,
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder,
                  };
                  dispatch(fetchAllOrders(queryParams));
                }}
                variant="outline"
                size="sm"
                className="text-white border-white/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto mb-4 text-lavender-300" />
                <p className="text-lavender-200 text-lg">No orders found</p>
                <p className="text-lavender-300 text-sm">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-lavender-200">
                          Order #
                        </TableHead>
                        <TableHead className="text-lavender-200">
                          Customer
                        </TableHead>
                        <TableHead className="text-lavender-200">
                          Amount
                        </TableHead>
                        <TableHead className="text-lavender-200">
                          Order Status
                        </TableHead>
                        <TableHead className="text-lavender-200">
                          Payment
                        </TableHead>
                        <TableHead className="text-lavender-200">
                          Date
                        </TableHead>
                        <TableHead className="text-lavender-200">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id} className="border-white/10">
                          <TableCell className="text-white font-medium">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell className="text-white">
                            <div>
                              <p className="font-medium">{order.user.name}</p>
                              <p className="text-sm text-lavender-300">
                                {order.user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4 text-green-400" />
                              {order.totalAmount.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(
                                order.orderStatus,
                                "order"
                              )}
                            >
                              {order.orderStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(
                                order.paymentStatus,
                                "payment"
                              )}
                            >
                              {order.paymentStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-lavender-300" />
                              {formatDate(order.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowOrderDetails(true);
                                }}
                                className="text-lavender-300 hover:text-white hover:bg-white/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <select
                                value={order.orderStatus}
                                onChange={(e) =>
                                  handleStatusUpdate(order._id, e.target.value)
                                }
                                disabled={updatingStatus === order._id}
                                className="px-2 py-1 bg-black/20 border border-white/10 rounded text-xs text-white focus:ring-2 focus:ring-lavender-500 focus:border-lavender-500"
                              >
                                {ORDER_STATUSES.map((status) => (
                                  <option
                                    key={status}
                                    value={status}
                                    className="capitalize bg-dark-purple-900 text-white"
                                  >
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-lavender-300">
                      Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                      {Math.min(filters.page * filters.limit, pagination.total)}{" "}
                      of {pagination.total} orders
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleFilterChange("page", filters.page - 1)
                        }
                        disabled={filters.page <= 1}
                        className="text-white border-white/30"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-white px-3 py-1">
                        Page {filters.page} of {pagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleFilterChange("page", filters.page + 1)
                        }
                        disabled={filters.page >= pagination.totalPages}
                        className="text-white border-white/30"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        {OrderDetailsModal}
      </div>
    </div>
  );
}
