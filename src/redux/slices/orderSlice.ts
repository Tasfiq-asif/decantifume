import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api/axios";

// Order interfaces
export interface OrderItem {
  product: string;
  productName: string;
  productImage: string;
  decantSize: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: "stripe" | "paypal" | "cash_on_delivery";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  paymentIntentId?: string;
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  promoCode?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount?: number;
  totalAmount: number;
  paymentMethod: "stripe" | "paypal" | "cash_on_delivery";
  promoCode?: string;
  notes?: string;
}

export interface PaymentIntentData {
  amount: number;
  currency?: string;
  orderId: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface OrderFilters {
  orderStatus?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  filters: OrderFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  // Payment state
  paymentIntent: PaymentIntentResponse | null;
  paymentLoading: boolean;
  paymentError: string | null;
  // Order creation state
  orderCreation: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

// Error interface for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  paymentIntent: null,
  paymentLoading: false,
  paymentError: null,
  orderCreation: {
    loading: false,
    error: null,
    success: false,
  },
};

// Async Thunks
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: CreateOrderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/orders", orderData);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (filters: OrderFilters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/orders/my-orders?${params.toString()}`);
      return {
        orders: response.data.data,
        pagination: response.data.meta,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  "orders/fetchOrderByNumber",
  async (orderNumber: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/order-number/${orderNumber}`);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  "orders/createPaymentIntent",
  async (paymentData: PaymentIntentData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/orders/payment/create-intent",
        paymentData
      );
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to create payment intent"
      );
    }
  }
);

export const confirmPayment = createAsyncThunk(
  "orders/confirmPayment",
  async (paymentIntentId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/orders/payment/confirm/${paymentIntentId}`
      );
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to confirm payment"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<OrderFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
      state.paymentError = null;
      state.orderCreation.error = null;
    },
    clearPaymentIntent: (state) => {
      state.paymentIntent = null;
      state.paymentError = null;
    },
    resetOrderCreation: (state) => {
      state.orderCreation = {
        loading: false,
        error: null,
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderCreation.loading = true;
        state.orderCreation.error = null;
        state.orderCreation.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderCreation.loading = false;
        state.orderCreation.success = true;
        state.currentOrder = action.payload;
        // Add to orders list if it exists
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderCreation.loading = false;
        state.orderCreation.error = action.payload as string;
      });

    // Fetch My Orders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Order by Number
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Payment Intent
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload as string;
      });

    // Confirm Payment
    builder
      .addCase(confirmPayment.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(confirmPayment.fulfilled, (state) => {
        state.paymentLoading = false;
        // Update the current order with payment confirmation
        if (state.currentOrder) {
          state.currentOrder.paymentStatus = "paid";
          state.currentOrder.orderStatus = "confirmed";
        }
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentOrder,
  clearError,
  clearPaymentIntent,
  resetOrderCreation,
} = orderSlice.actions;

export default orderSlice.reducer;
