import api from "./axios";

export interface UserDashboardData {
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

// Get user dashboard data
export const getUserDashboard = async (): Promise<UserDashboardData> => {
  const response = await api.get("/users/dashboard");
  return response.data.data;
};

export const userApi = {
  getUserDashboard,
};
