"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { loginUser, logoutUser } from "@/lib/api/authApi";
import {
  addToCart,
  removeFromCart,
  toggleCart,
  CartItem,
} from "@/redux/slices/cartSlice";
import { addNotification, toggleSidebar } from "@/lib/slices/uiSlice";
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
} from "@/lib/selectors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ReduxExample() {
  const dispatch = useAppDispatch();

  // Auth state
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);

  // Cart state
  const cartItems = useAppSelector((state) => state.cart.items);
  const cartTotal = useAppSelector((state) => state.cart.totalAmount);

  // UI state
  const notifications = useAppSelector((state) => state.ui.notifications);

  // Local form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: "1",
        name: "Sample Perfume",
        price: 29.99,
        image: "/placeholder.jpg",
        size: "10ml",
      })
    );

    dispatch(
      addNotification({
        type: "success",
        title: "Added to Cart",
        message: "Sample Perfume has been added to your cart",
      })
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart({ id: itemId }));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Redux Store Example</h2>

      {/* Auth Section */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Authentication</h3>

        {!isAuthenticated ? (
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-sm text-muted-foreground">
              Use: test@example.com / password
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>Welcome, {user?.name}!</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        )}
      </div>

      {/* Cart Section */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Shopping Cart</h3>

        <div className="space-y-3">
          <Button onClick={handleAddToCart}>Add Sample Item to Cart</Button>

          <div>
            <p className="font-medium">Cart Items: {cartItems.length}</p>
            <p className="text-sm text-muted-foreground">
              Total: ${cartTotal.toFixed(2)}
            </p>
          </div>

          {cartItems.length > 0 && (
            <div className="space-y-2">
              {cartItems.map((item: CartItem) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <span>
                    {item.name} ({item.size})
                  </span>
                  <div className="flex items-center gap-2">
                    <span>${item.price}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button onClick={() => dispatch(toggleCart())} variant="outline">
            Toggle Cart Sidebar
          </Button>
        </div>
      </div>

      {/* UI Section */}
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">UI Controls</h3>

        <div className="space-y-3">
          <Button onClick={() => dispatch(toggleSidebar())} variant="outline">
            Toggle Sidebar
          </Button>

          <Button
            onClick={() =>
              dispatch(
                addNotification({
                  type: "info",
                  title: "Test Notification",
                  message: "This is a test notification from Redux!",
                })
              )
            }
            variant="outline"
          >
            Add Notification
          </Button>

          {notifications.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium">Recent Notifications:</p>
              {notifications.slice(-3).map((notification) => (
                <div
                  key={notification.id}
                  className="p-2 bg-blue-50 rounded text-sm"
                >
                  <strong>{notification.title}</strong>: {notification.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
