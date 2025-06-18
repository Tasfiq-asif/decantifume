// src/redux/selectors/index.ts
import { RootState } from "../store";

// User selectors
export const selectUser = (state: RootState) => state.user.user;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;

// Existing selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.totalAmount;

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

// Derived selectors
export const selectFilteredProducts = (state: RootState) => {
  const products = selectProducts(state);
  const filters = selectProductFilters(state);

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
};

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

export const selectAvailableCategories = (state: RootState) => {
  const products = selectProducts(state);
  const categories = [...new Set(products.map((product) => product.category))];
  return categories.sort();
};

export const selectAvailableBrands = (state: RootState) => {
  const products = selectProducts(state);
  const brands = [...new Set(products.map((product) => product.brand))];
  return brands.sort();
};
