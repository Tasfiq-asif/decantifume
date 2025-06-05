# Redux Store Setup Guide

This project uses Redux Toolkit (RTK) for state management following modern best practices.

## 🏗️ Architecture

### Store Structure

```
src/lib/
├── store.ts              # Main store configuration
├── hooks.ts              # Typed Redux hooks
├── selectors.ts          # State selectors
├── slices/
│   ├── authSlice.ts      # Authentication state
│   ├── cartSlice.ts      # Shopping cart state
│   └── uiSlice.ts        # UI state (sidebar, modals, etc.)
├── api/
│   └── authApi.ts        # Async thunks for API calls
└── providers/
    └── ReduxProvider.tsx # Redux provider wrapper
```

## 🚀 Getting Started

### 1. Store Configuration (`src/lib/store.ts`)

The store is configured with:

- **Redux Toolkit** for simplified Redux setup
- **DevTools** enabled in development
- **TypeScript** support with proper typing

### 2. State Slices

#### Auth Slice (`authSlice.ts`)

Manages user authentication state:

```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

**Actions:**

- `loginStart/Success/Failure`
- `logout`
- `clearError`
- `updateUser`

**Async Thunks:**

- `loginUser`
- `registerUser`
- `logoutUser`
- `refreshUserToken`

#### Cart Slice (`cartSlice.ts`)

Manages shopping cart state:

```typescript
interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  isOpen: boolean;
}
```

**Actions:**

- `addToCart`
- `removeFromCart`
- `updateQuantity`
- `clearCart`
- `toggleCart`

#### UI Slice (`uiSlice.ts`)

Manages UI state:

```typescript
interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  searchOpen: boolean;
  loading: boolean;
  notifications: Notification[];
  theme: "light" | "dark" | "system";
}
```

## 📖 Usage Examples

### 1. Using Typed Hooks

```typescript
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Dispatch actions
  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };
}
```

### 2. Using Selectors

```typescript
import { selectUser, selectCartItems } from "@/lib/selectors";

function MyComponent() {
  const user = useAppSelector(selectUser);
  const cartItems = useAppSelector(selectCartItems);
}
```

### 3. Async Actions

```typescript
import { loginUser } from "@/lib/api/authApi";

function LoginForm() {
  const dispatch = useAppDispatch();

  const handleSubmit = async () => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Success - user logged in
    } catch (error) {
      // Handle error
      console.error("Login failed:", error);
    }
  };
}
```

### 4. Cart Operations

```typescript
import { addToCart, removeFromCart } from "@/lib/slices/cartSlice";

function ProductCard({ product }) {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: selectedSize,
      })
    );
  };
}
```

### 5. UI State Management

```typescript
import { addNotification, toggleSidebar } from "@/lib/slices/uiSlice";

function MyComponent() {
  const dispatch = useAppDispatch();

  const showSuccess = () => {
    dispatch(
      addNotification({
        type: "success",
        title: "Success!",
        message: "Operation completed successfully",
      })
    );
  };

  const toggleMenu = () => {
    dispatch(toggleSidebar());
  };
}
```

## 🔧 Key Features

### 1. Type Safety

- Fully typed store with TypeScript
- Typed hooks (`useAppDispatch`, `useAppSelector`)
- Type-safe action creators and selectors

### 2. Async Operations

- RTK Query-style async thunks
- Proper loading and error handling
- API integration examples

### 3. Persistence Ready

- Easy to add redux-persist for state persistence
- Configured to persist cart and auth data

### 4. Developer Experience

- Redux DevTools integration
- Hot reloading support
- Clear separation of concerns

## 📚 Best Practices

### 1. State Structure

- Keep state normalized
- Separate concerns into different slices
- Use meaningful action names

### 2. Selectors

- Use selectors for computed state
- Memoize expensive calculations
- Keep components decoupled from state shape

### 3. Async Operations

- Use RTK's `createAsyncThunk` for API calls
- Handle loading and error states
- Use `unwrap()` for promise-like behavior

### 4. Performance

- Use `useAppSelector` with specific selectors
- Avoid selecting entire state objects
- Consider using `createSelector` for complex derivations

## 🧪 Testing

### Testing Actions

```typescript
import { store } from "@/lib/store";
import { addToCart } from "@/lib/slices/cartSlice";

test("should add item to cart", () => {
  const item = { id: "1", name: "Test", price: 10, image: "", size: "M" };
  store.dispatch(addToCart(item));

  const state = store.getState();
  expect(state.cart.items).toHaveLength(1);
  expect(state.cart.items[0]).toEqual({ ...item, quantity: 1 });
});
```

### Testing Async Thunks

```typescript
import { loginUser } from "@/lib/api/authApi";

test("should handle successful login", async () => {
  const credentials = { email: "test@example.com", password: "password" };
  const result = await store.dispatch(loginUser(credentials));

  expect(result.type).toBe("auth/login/fulfilled");
  expect(store.getState().auth.isAuthenticated).toBe(true);
});
```

## 🚀 Example Component

Check out `src/components/examples/ReduxExample.tsx` for a complete working example that demonstrates:

- Authentication flow
- Cart management
- UI state control
- Notification system

## 📦 Dependencies

Required packages:

```json
{
  "@reduxjs/toolkit": "^2.8.2",
  "react-redux": "^9.2.0",
  "redux-persist": "^6.0.0" // Optional for persistence
}
```

## 🎯 Next Steps

1. **Add Persistence**: Uncomment redux-persist setup in `store.ts`
2. **Add More Slices**: Create slices for products, orders, etc.
3. **RTK Query**: Consider using RTK Query for advanced API state management
4. **Middleware**: Add custom middleware for logging, analytics, etc.

---

This Redux setup provides a solid foundation for scalable state management in your React application!
