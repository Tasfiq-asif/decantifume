import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (
      state,
      action: PayloadAction<Omit<WishlistItem, "id" | "addedAt">>
    ) => {
      const existingItem = state.items.find(
        (item) => item.productId === action.payload.productId
      );
      if (!existingItem) {
        const newItem: WishlistItem = {
          ...action.payload,
          id: Date.now().toString(),
          addedAt: new Date().toISOString(),
        };
        state.items.push(newItem);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
  setLoading,
  setError,
  clearError,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
