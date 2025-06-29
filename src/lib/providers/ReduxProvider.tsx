"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks/reduxHooks";
import { hydrateCart } from "@/redux/slices/cartSlice";

// Component to handle cart hydration
function CartHydration() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate cart from localStorage after client-side mount
    dispatch(hydrateCart());
  }, [dispatch]);

  return null; // This component doesn't render anything
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <CartHydration />
      {children}
    </Provider>
  );
}
