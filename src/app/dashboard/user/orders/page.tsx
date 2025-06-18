"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

import {
  Search,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  trackingNumber?: string;
}

export default function UserOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    // Mock data - replace with actual API calls
    setTimeout(() => {
      setOrders([
        {
          id: "ORD001",
          orderNumber: "DEC-2024-001",
          date: "2024-01-15",
          status: "delivered",
          total: 259.98,
          trackingNumber: "1Z999AA1234567890",
          items: [
            {
              id: "ITEM001",
              productName: "Chanel No. 5 - 50ml",
              quantity: 2,
              price: 129.99,
            },
          ],
          shippingAddress: {
            street: "123 Main St",
            city: "New York",
            state: "NY",
            zipCode: "10001",
          },
        },
        {
          id: "ORD002",
          orderNumber: "DEC-2024-002",
          date: "2024-01-12",
          status: "shipped",
          total: 189.5,
          trackingNumber: "1Z999AA1234567891",
          items: [
            {
              id: "ITEM002",
              productName: "Dior Sauvage - 100ml",
              quantity: 1,
              price: 89.5,
            },
            {
              id: "ITEM003",
              productName: "Tom Ford Sample Set",
              quantity: 1,
              price: 100.0,
            },
          ],
          shippingAddress: {
            street: "456 Oak Ave",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210",
          },
        },
        {
          id: "ORD003",
          orderNumber: "DEC-2024-003",
          date: "2024-01-10",
          status: "processing",
          total: 75.0,
          items: [
            {
              id: "ITEM004",
              productName: "Versace Eros - 30ml",
              quantity: 1,
              price: 75.0,
            },
          ],
          shippingAddress: {
            street: "789 Pine St",
            city: "Chicago",
            state: "IL",
            zipCode: "60601",
          },
        },
        {
          id: "ORD004",
          orderNumber: "DEC-2024-004",
          date: "2024-01-08",
          status: "cancelled",
          total: 199.99,
          items: [
            {
              id: "ITEM005",
              productName: "Limited Edition Set",
              quantity: 1,
              price: 199.99,
            },
          ],
          shippingAddress: {
            street: "321 Elm St",
            city: "Miami",
            state: "FL",
            zipCode: "33101",
          },
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <RefreshCw className="h-4 w-4" />;
      case "processing":
        return <ShoppingBag className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-lavender-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Orders</h1>
        <p className="text-lavender-200">Track and manage your order history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-lavender-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{orders.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Delivered
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {orders.filter((o) => o.status === "delivered").length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              In Transit
            </CardTitle>
            <Truck className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {
                orders.filter((o) =>
                  ["shipped", "processing"].includes(o.status)
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Spent
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              $
              {orders
                .filter((o) => o.status !== "cancelled")
                .reduce((sum, order) => sum + order.total, 0)
                .toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lavender-300 h-4 w-4" />
                <Input
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-lavender-300"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md text-white"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <Card
            key={order.id}
            className="bg-white/10 backdrop-blur-sm border-white/20"
          >
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order #{order.orderNumber}
                  </CardTitle>
                  <p className="text-lavender-300 text-sm mt-1">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                  <span className="text-white font-semibold">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Order Items */}
              <div className="mb-4">
                <h4 className="text-lavender-300 text-sm font-medium mb-2">
                  Items Ordered:
                </h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {item.productName}
                        </p>
                        <p className="text-lavender-300 text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <span className="text-white font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <div>
                  <h4 className="text-lavender-300 text-sm font-medium mb-1">
                    Shipping Address:
                  </h4>
                  <p className="text-white text-sm">
                    {order.shippingAddress.street}
                    <br />
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                </div>

                {order.trackingNumber && (
                  <div>
                    <h4 className="text-lavender-300 text-sm font-medium mb-1">
                      Tracking Number:
                    </h4>
                    <p className="text-white text-sm font-mono">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {order.status === "delivered" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </Button>
                )}
                {order.trackingNumber && (
                  <Button
                    size="sm"
                    className="bg-lavender-600 hover:bg-lavender-700 text-white"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Track Package
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="text-center py-12">
            <ShoppingBag className="h-16 w-16 text-lavender-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              No orders found
            </h3>
            <p className="text-lavender-300 mb-6">
              {searchTerm || selectedStatus !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't placed any orders yet"}
            </p>
            <Button
              onClick={() => (window.location.href = "/collections")}
              className="bg-lavender-600 hover:bg-lavender-700 text-white"
            >
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
