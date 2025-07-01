import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api/axios";

// Admin interfaces
export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminUsers: number;
  regularUsers: number;
}

export interface RecentOrder {
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
  createdAt: string;
  items: Array<{
    productName: string;
    quantity: number;
    decantSize: string;
  }>;
}

export interface TopProduct {
  _id: string;
  name: string;
  decantSize: string;
  brand: string;
  category: string;
  image: string;
  totalQuantity: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderQuantity: number;
  pricePerUnit: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AdminState {
  // Dashboard stats
  stats: AdminStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // User stats
  userStats: UserStats | null;
  userStatsLoading: boolean;
  userStatsError: string | null;

  // Recent orders
  recentOrders: RecentOrder[];
  recentOrdersLoading: boolean;
  recentOrdersError: string | null;

  // Top products (from backend analytics)
  topProducts: TopProduct[];
  topProductsLoading: boolean;
  topProductsError: string | null;

  // All users management
  users: AdminUser[];
  usersLoading: boolean;
  usersError: string | null;
  usersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  // All orders management
  allOrders: RecentOrder[];
  allOrdersLoading: boolean;
  allOrdersError: string | null;
  allOrdersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error interface for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

const handleApiError = (error: unknown): string => {
  const apiError = error as ApiError;

  // Handle rate limit errors specifically
  if (apiError.response?.status === 429) {
    return "Too many requests. The server is currently busy. Please wait a moment and try again.";
  }

  return apiError.response?.data?.message || "An unexpected error occurred";
};

const initialState: AdminState = {
  stats: null,
  statsLoading: false,
  statsError: null,

  userStats: null,
  userStatsLoading: false,
  userStatsError: null,

  recentOrders: [],
  recentOrdersLoading: false,
  recentOrdersError: null,

  topProducts: [],
  topProductsLoading: false,
  topProductsError: null,

  users: [],
  usersLoading: false,
  usersError: null,
  usersPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  allOrders: [],
  allOrdersLoading: false,
  allOrdersError: null,
  allOrdersPagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
};

// Async Thunks
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/orders/stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "admin/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/stats");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchRecentOrders = createAsyncThunk(
  "admin/fetchRecentOrders",
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/orders?limit=${limit}&sortBy=createdAt&sortOrder=desc`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  "admin/fetchTopProducts",
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/top-products?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      isActive?: boolean;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        role,
        isActive,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = params;

      // Build query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) queryParams.append("search", search);
      if (role) queryParams.append("role", role);
      if (typeof isActive === "boolean")
        queryParams.append("isActive", isActive.toString());

      const response = await api.get(`/users?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      orderStatus?: string;
      paymentStatus?: string;
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        orderStatus,
        paymentStatus,
        startDate,
        endDate,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = params;

      // Build query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) queryParams.append("search", search);
      if (orderStatus) queryParams.append("orderStatus", orderStatus);
      if (paymentStatus) queryParams.append("paymentStatus", paymentStatus);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const response = await api.get(`/orders?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "admin/updateUserStatus",
  async (
    params: { userId: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/users/${params.userId}`, {
        isActive: params.isActive,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async (
    params: { userId: string; role: "user" | "admin" },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/users/${params.userId}/role`, {
        role: params.role,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return { userId, ...response.data.data };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async (params: { orderId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/orders/${params.orderId}/status`, {
        orderStatus: params.status,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.statsError = null;
      state.recentOrdersError = null;
      state.topProductsError = null;
      state.usersError = null;
      state.allOrdersError = null;
    },
    setUsersPage: (state, action: PayloadAction<number>) => {
      state.usersPagination.page = action.payload;
    },
    setAllOrdersPage: (state, action: PayloadAction<number>) => {
      state.allOrdersPagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Admin Stats
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.payload as string;
      });

    // Fetch User Stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.userStatsLoading = true;
        state.userStatsError = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStatsLoading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.userStatsLoading = false;
        state.userStatsError = action.payload as string;
      });

    // Fetch Recent Orders
    builder
      .addCase(fetchRecentOrders.pending, (state) => {
        state.recentOrdersLoading = true;
        state.recentOrdersError = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.recentOrdersLoading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.recentOrdersLoading = false;
        state.recentOrdersError = action.payload as string;
      });

    // Fetch Top Products
    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.topProductsLoading = true;
        state.topProductsError = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.topProductsLoading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.topProductsLoading = false;
        state.topProductsError = action.payload as string;
      });

    // Fetch All Users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.data;
        state.usersPagination = action.payload.meta || state.usersPagination;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload as string;
      });

    // Fetch All Orders
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.allOrdersLoading = true;
        state.allOrdersError = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrders = action.payload.data;
        state.allOrdersPagination =
          action.payload.meta || state.allOrdersPagination;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.allOrdersLoading = false;
        state.allOrdersError = action.payload as string;
      });

    // Update User Status
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex(
        (user) => user._id === updatedUser._id
      );
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    });

    // Update User Role
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex(
        (user) => user._id === updatedUser._id
      );
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    });

    // Delete User
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(
        (user) => user._id !== action.payload.userId
      );
    });

    // Update Order Status
    builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
      const updatedOrder = action.payload;
      const index = state.allOrders.findIndex(
        (order) => order._id === updatedOrder._id
      );
      if (index !== -1) {
        state.allOrders[index] = updatedOrder;
      }
      // Also update in recent orders if present
      const recentIndex = state.recentOrders.findIndex(
        (order) => order._id === updatedOrder._id
      );
      if (recentIndex !== -1) {
        state.recentOrders[recentIndex] = updatedOrder;
      }
    });
  },
});

export const { clearAdminError, setUsersPage, setAllOrdersPage } =
  adminSlice.actions;
export default adminSlice.reducer;
