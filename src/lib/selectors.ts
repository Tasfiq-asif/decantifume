import { RootState } from "./store";
import { CartItem } from "./slices/cartSlice";

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Cart selectors
export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalQuantity = (state: RootState) =>
  state.cart.totalQuantity;
export const selectCartTotalAmount = (state: RootState) =>
  state.cart.totalAmount;
export const selectCartIsOpen = (state: RootState) => state.cart.isOpen;

// Memoized selectors for derived data
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce(
    (total: number, item: CartItem) => total + item.quantity,
    0
  );

export const selectCartSubtotal = (state: RootState) =>
  state.cart.items.reduce(
    (total: number, item: CartItem) => total + item.price * item.quantity,
    0
  );

// UI selectors
export const selectUI = (state: RootState) => state.ui;
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectMobileMenuOpen = (state: RootState) =>
  state.ui.mobileMenuOpen;
export const selectSearchOpen = (state: RootState) => state.ui.searchOpen;
export const selectUILoading = (state: RootState) => state.ui.loading;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectTheme = (state: RootState) => state.ui.theme;
