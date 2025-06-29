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
