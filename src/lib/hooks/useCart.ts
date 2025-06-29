import { useAppSelector } from "./reduxHooks";
import {
  selectCartItems,
  selectCartTotal,
  selectCartTotalQuantity,
  selectCartIsOpen,
  selectCartIsHydrated,
} from "@/redux/selectors";

export function useCart() {
  const items = useAppSelector(selectCartItems);
  const totalAmount = useAppSelector(selectCartTotal);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const isOpen = useAppSelector(selectCartIsOpen);
  const isHydrated = useAppSelector(selectCartIsHydrated);

  return {
    items,
    totalAmount,
    totalQuantity,
    isOpen,
    isHydrated,
    // Helper computed values
    isEmpty: items.length === 0,
    isReady: isHydrated, // Cart is ready to display accurate data
  };
}
