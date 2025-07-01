import api from "./axios";

export interface UserDashboardData {
  totalOrders: number;
  pendingOrders: number;
  wishlistCount: number;
  recentOrders: Array<{
    id: string;
    productName: string;
    amount: number;
    status: string;
    date: string;
  }>;
  wishlistItems: Array<{
    id: string;
    name: string;
    price: number;
    image?: string;
  }>;
}

export interface WishlistItem {
  _id: string;
  user: string;
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Get user dashboard data
export const getUserDashboard = async (): Promise<UserDashboardData> => {
  const response = await api.get("/users/dashboard");
  return response.data.data;
};

// Wishlist APIs
export const addToWishlist = async (productId: string) => {
  const response = await api.post("/users/wishlist", { productId });
  return response.data.data;
};

export const removeFromWishlist = async (productId: string) => {
  const response = await api.delete(`/users/wishlist/${productId}`);
  return response.data.data;
};

export const getUserWishlist = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await api.get("/users/wishlist", { params });
  return response.data;
};

export const userApi = {
  getUserDashboard,
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
};
