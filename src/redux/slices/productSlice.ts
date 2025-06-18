import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api/axios";

// Product interfaces based on backend schema
export interface DecantSize {
  size: string;
  price: number;
  stock: number;
  isAvailable: boolean;
}

export interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  decantSizes: DecantSize[];
  images: string[];
  thumbnail?: string;
  status: string;
  isDeleted: boolean;
  totalStock: number;
  slug: string;
  tags: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  searchTerm?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  currentProduct: Product | null;
  relatedProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: {
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
  };
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  relatedProducts: [],
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
};

// Async Thunks for API calls
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters: ProductFilters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`/v1/products?${params.toString()}`);
      return {
        products: response.data.data,
        pagination: response.data.meta,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",
  async (limit: number = 8, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/products/featured?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch featured products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/products/${id}`);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/v1/products/slug/${slug}`);
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (
    {
      id,
      category,
      limit = 6,
    }: { id: string; category: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/v1/products/${id}/related?category=${category}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch related products"
      );
    }
  }
);

export const fetchProductsByBrand = createAsyncThunk(
  "products/fetchProductsByBrand",
  async (
    { brand, limit = 10 }: { brand: string; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get(
        `/v1/products/brand/${brand}?limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.response?.data?.message || "Failed to fetch products by brand"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 12,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearRelatedProducts: (state) => {
      state.relatedProducts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Featured Products
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Product by ID/Slug
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Product by Slug
    builder
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Related Products
    builder
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Fetch Products by Brand
    builder
      .addCase(fetchProductsByBrand.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByBrand.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByBrand.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  clearCurrentProduct,
  clearRelatedProducts,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;
