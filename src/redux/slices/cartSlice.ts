import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  isOpen: boolean;
  isHydrated: boolean; // Track if cart has been loaded from localStorage
}

// localStorage utilities with SSR safety
const CART_STORAGE_KEY = "decantifume_cart";

const loadCartFromStorage = (): Partial<CartState> => {
  if (typeof window === "undefined") {
    return {}; // SSR safety
  }

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Validate the structure
      if (parsedCart && Array.isArray(parsedCart.items)) {
        return {
          items: parsedCart.items,
          totalQuantity: parsedCart.totalQuantity || 0,
          totalAmount: parsedCart.totalAmount || 0,
        };
      }
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
  }

  return {};
};

const saveCartToStorage = (cartState: CartState) => {
  if (typeof window === "undefined") {
    return; // SSR safety
  }

  try {
    const cartToSave = {
      items: cartState.items,
      totalQuantity: cartState.totalQuantity,
      totalAmount: cartState.totalAmount,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

// Initial state should be empty to match server render
const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  isOpen: false,
  isHydrated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.size === action.payload.size &&
          item.variant === action.payload.variant
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ id: string; size?: string; variant?: string }>
    ) => {
      const { id, size, variant } = action.payload;
      state.items = state.items.filter(
        (item) =>
          !(item.id === id && item.size === size && item.variant === variant)
      );
      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
        size?: string;
        variant?: string;
      }>
    ) => {
      const { id, quantity, size, variant } = action.payload;
      const item = state.items.find(
        (item) =>
          item.id === id && item.size === size && item.variant === variant
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (item) =>
              !(
                item.id === id &&
                item.size === size &&
                item.variant === variant
              )
          );
        } else {
          item.quantity = quantity;
        }
      }

      cartSlice.caseReducers.calculateTotals(state);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      saveCartToStorage(state);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
      // Don't save isOpen state to localStorage as it should reset on refresh
    },
    openCart: (state) => {
      state.isOpen = true;
      // Don't save isOpen state to localStorage as it should reset on refresh
    },
    closeCart: (state) => {
      state.isOpen = false;
      // Don't save isOpen state to localStorage as it should reset on refresh
    },
    calculateTotals: (state) => {
      state.totalQuantity = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    // Hydrate cart from localStorage after client-side mount
    hydrateCart: (state) => {
      const persistedCart = loadCartFromStorage();
      if (persistedCart.items) {
        state.items = persistedCart.items;
        state.totalQuantity = persistedCart.totalQuantity || 0;
        state.totalAmount = persistedCart.totalAmount || 0;
      }
      state.isHydrated = true;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  calculateTotals,
  hydrateCart,
} = cartSlice.actions;

export default cartSlice.reducer;
