import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  fetchProducts,
  fetchFeaturedProducts,
  fetchProductById,
  fetchProductBySlug,
  fetchRelatedProducts,
  fetchProductsByBrand,
  setFilters,
  clearFilters,
  clearCurrentProduct,
  clearRelatedProducts,
  clearError,
  type ProductFilters,
} from "@/redux/slices/productSlice";
import {
  selectProducts,
  selectFeaturedProducts,
  selectCurrentProduct,
  selectRelatedProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductFilters,
  selectProductPagination,
  selectFilteredProducts,
  selectAvailableCategories,
  selectAvailableBrands,
} from "@/redux/selectors";

export const useProducts = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const products = useAppSelector(selectProducts);
  const featuredProducts = useAppSelector(selectFeaturedProducts);
  const currentProduct = useAppSelector(selectCurrentProduct);
  const relatedProducts = useAppSelector(selectRelatedProducts);
  const loading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const filters = useAppSelector(selectProductFilters);
  const pagination = useAppSelector(selectProductPagination);
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const availableCategories = useAppSelector(selectAvailableCategories);
  const availableBrands = useAppSelector(selectAvailableBrands);

  // Actions
  const loadProducts = (filters?: ProductFilters) => {
    return dispatch(fetchProducts(filters || {}));
  };

  const loadFeaturedProducts = (limit?: number) => {
    return dispatch(fetchFeaturedProducts(limit || 8));
  };

  const loadProductById = (id: string) => {
    return dispatch(fetchProductById(id));
  };

  const loadProductBySlug = (slug: string) => {
    return dispatch(fetchProductBySlug(slug));
  };

  const loadRelatedProducts = (
    id: string,
    category: string,
    limit?: number
  ) => {
    return dispatch(fetchRelatedProducts({ id, category, limit }));
  };

  const loadProductsByBrand = (brand: string, limit?: number) => {
    return dispatch(fetchProductsByBrand({ brand, limit }));
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  const clearProduct = () => {
    dispatch(clearCurrentProduct());
  };

  const clearRelated = () => {
    dispatch(clearRelatedProducts());
  };

  const clearErrors = () => {
    dispatch(clearError());
  };

  // Helper methods
  const searchProducts = (searchTerm: string) => {
    updateFilters({ searchTerm, page: 1 });
    return loadProducts({ ...filters, searchTerm, page: 1 });
  };

  const filterByCategory = (category: string) => {
    updateFilters({ category, page: 1 });
    return loadProducts({ ...filters, category, page: 1 });
  };

  const filterByBrand = (brand: string) => {
    updateFilters({ brand, page: 1 });
    return loadProducts({ ...filters, brand, page: 1 });
  };

  const sortProducts = (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
    updateFilters({ sortBy, sortOrder, page: 1 });
    return loadProducts({ ...filters, sortBy, sortOrder, page: 1 });
  };

  const changePage = (page: number) => {
    updateFilters({ page });
    return loadProducts({ ...filters, page });
  };

  const changeLimit = (limit: number) => {
    updateFilters({ limit, page: 1 });
    return loadProducts({ ...filters, limit, page: 1 });
  };

  const filterByPriceRange = (minPrice: number, maxPrice: number) => {
    updateFilters({ minPrice, maxPrice, page: 1 });
    return loadProducts({ ...filters, minPrice, maxPrice, page: 1 });
  };

  return {
    // State
    products,
    featuredProducts,
    currentProduct,
    relatedProducts,
    loading,
    error,
    filters,
    pagination,
    filteredProducts,
    availableCategories,
    availableBrands,

    // Actions
    loadProducts,
    loadFeaturedProducts,
    loadProductById,
    loadProductBySlug,
    loadRelatedProducts,
    loadProductsByBrand,
    updateFilters,
    resetFilters,
    clearProduct,
    clearRelated,
    clearErrors,

    // Helper methods
    searchProducts,
    filterByCategory,
    filterByBrand,
    sortProducts,
    changePage,
    changeLimit,
    filterByPriceRange,
  };
};
