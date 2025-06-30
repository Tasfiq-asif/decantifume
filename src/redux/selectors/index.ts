// src/redux/selectors/index.ts
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

// User selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

// Cart selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.totalAmount;
export const selectCartTotalQuantity = (state: RootState) =>
  state.cart.totalQuantity;
export const selectCartIsOpen = (state: RootState) => state.cart.isOpen;
export const selectCartIsHydrated = (state: RootState) => state.cart.isHydrated;

// Product selectors
export const selectProducts = (state: RootState) => state.products.products;
export const selectFeaturedProducts = (state: RootState) =>
  state.products.featuredProducts;
export const selectCurrentProduct = (state: RootState) =>
  state.products.currentProduct;
export const selectRelatedProducts = (state: RootState) =>
  state.products.relatedProducts;
export const selectProductsLoading = (state: RootState) =>
  state.products.loading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductFilters = (state: RootState) =>
  state.products.filters;
export const selectProductPagination = (state: RootState) =>
  state.products.pagination;

// Order selectors
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrderFilters = (state: RootState) => state.orders.filters;
export const selectOrderPagination = (state: RootState) =>
  state.orders.pagination;
export const selectPaymentIntent = (state: RootState) =>
  state.orders.paymentIntent;
export const selectPaymentLoading = (state: RootState) =>
  state.orders.paymentLoading;
export const selectPaymentError = (state: RootState) =>
  state.orders.paymentError;
export const selectOrderCreation = (state: RootState) =>
  state.orders.orderCreation;

// FIXED: Memoized derived selectors using createSelector
export const selectFilteredProducts = createSelector(
  [selectProducts, selectProductFilters],
  (products, filters) => {
    return products.filter((product) => {
      // Apply filters
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      if (filters.category && product.category !== filters.category) {
        return false;
      }

      if (
        filters.brand &&
        !product.brand.toLowerCase().includes(filters.brand.toLowerCase())
      ) {
        return false;
      }

      if (filters.status && product.status !== filters.status) {
        return false;
      }

      // Price filtering (using minimum price from decant sizes)
      if (filters.minPrice || filters.maxPrice) {
        const minPrice = Math.min(
          ...product.decantSizes.map((size) => size.price)
        );
        if (filters.minPrice && minPrice < filters.minPrice) return false;
        if (filters.maxPrice && minPrice > filters.maxPrice) return false;
      }

      return true;
    });
  }
);

export const selectProductsByCategory =
  (category: string) => (state: RootState) => {
    return selectProducts(state).filter(
      (product) => product.category === category
    );
  };

export const selectProductsByBrand = (brand: string) => (state: RootState) => {
  return selectProducts(state).filter((product) =>
    product.brand.toLowerCase().includes(brand.toLowerCase())
  );
};

// FIXED: Memoized available categories selector
export const selectAvailableCategories = createSelector(
  [selectProducts],
  (products) => {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];
    return categories.sort();
  }
);

// FIXED: Memoized available brands selector
export const selectAvailableBrands = createSelector(
  [selectProducts],
  (products) => {
    const brands = [...new Set(products.map((product) => product.brand))];
    return brands.sort();
  }
);

// Order derived selectors
export const selectOrdersByStatus = (status: string) => (state: RootState) => {
  return selectOrders(state).filter((order) => order.orderStatus === status);
};

export const selectOrdersByPaymentStatus =
  (status: string) => (state: RootState) => {
    return selectOrders(state).filter(
      (order) => order.paymentStatus === status
    );
  };

export const selectPendingOrders = (state: RootState) => {
  return selectOrders(state).filter((order) => order.orderStatus === "pending");
};

// FIXED: Memoized recent orders selector
export const selectRecentOrders = createSelector([selectOrders], (orders) => {
  return orders
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
});

// Admin selectors
export const selectAdminStats = (state: RootState) => state.admin.stats;
export const selectAdminStatsLoading = (state: RootState) =>
  state.admin.statsLoading;
export const selectAdminStatsError = (state: RootState) =>
  state.admin.statsError;

export const selectUserStats = (state: RootState) => state.admin.userStats;
export const selectUserStatsLoading = (state: RootState) =>
  state.admin.userStatsLoading;
export const selectUserStatsError = (state: RootState) =>
  state.admin.userStatsError;

export const selectRecentOrdersAdmin = (state: RootState) =>
  state.admin.recentOrders;
export const selectRecentOrdersAdminLoading = (state: RootState) =>
  state.admin.recentOrdersLoading;
export const selectRecentOrdersAdminError = (state: RootState) =>
  state.admin.recentOrdersError;

export const selectTopProducts = (state: RootState) => state.admin.topProducts;
export const selectTopProductsLoading = (state: RootState) =>
  state.admin.topProductsLoading;
export const selectTopProductsError = (state: RootState) =>
  state.admin.topProductsError;

export const selectAllUsers = (state: RootState) => state.admin.users;
export const selectAllUsersLoading = (state: RootState) =>
  state.admin.usersLoading;
export const selectAllUsersError = (state: RootState) => state.admin.usersError;
export const selectUsersPagination = (state: RootState) =>
  state.admin.usersPagination;

export const selectAllOrdersAdmin = (state: RootState) => state.admin.allOrders;
export const selectAllOrdersAdminLoading = (state: RootState) =>
  state.admin.allOrdersLoading;
export const selectAllOrdersAdminError = (state: RootState) =>
  state.admin.allOrdersError;
export const selectAllOrdersPagination = (state: RootState) =>
  state.admin.allOrdersPagination;

// Admin derived selectors
export const selectAdminDashboardStats = createSelector(
  [selectAdminStats, selectProducts],
  (stats, products) => {
    if (!stats) return null;

    return {
      ...stats,
      totalProducts: products.length, // Use actual product count from products slice
    };
  }
);

export const selectFormattedRecentOrders = createSelector(
  [selectRecentOrdersAdmin],
  (orders) => {
    return orders.map((order) => ({
      id: order.orderNumber,
      customerName: order.user.name,
      amount: order.totalAmount,
      status: order.orderStatus,
      date: new Date(order.createdAt).toLocaleDateString(),
    }));
  }
);

export const selectFormattedTopProducts = createSelector(
  [selectTopProducts],
  (products) => {
    return products.map((product) => ({
      id: product._id,
      name: `${product.name} (${product.decantSize})`,
      sales: product.totalOrders,
      revenue: product.totalRevenue,
      quantity: product.totalQuantity,
      brand: product.brand,
    }));
  }
);
