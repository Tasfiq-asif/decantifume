import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import {
  createOrder,
  fetchMyOrders,
  fetchOrderById,
  fetchOrderByNumber,
  createPaymentIntent,
  confirmPayment,
  setFilters,
  clearFilters,
  clearCurrentOrder,
  clearError,
  clearPaymentIntent,
  resetOrderCreation,
  type CreateOrderData,
  type PaymentIntentData,
  type OrderFilters,
} from "@/redux/slices/orderSlice";
import { clearCart } from "@/redux/slices/cartSlice";
import { RootState } from "@/redux/store";

// Order selectors
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.loading;
export const selectOrdersError = (state: RootState) => state.orders.error;
export const selectOrderFilters = (state: RootState) => state.orders.filters;
export const selectOrderPagination = (state: RootState) =>
  state.orders.pagination;
export const selectPaymentIntent = (state: RootState) =>
  state.orders.paymentIntent;
export const selectPaymentLoading = (state: RootState) =>
  state.orders.paymentLoading;
export const selectPaymentError = (state: RootState) =>
  state.orders.paymentError;
export const selectOrderCreation = (state: RootState) =>
  state.orders.orderCreation;

export const useOrders = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const orders = useAppSelector(selectOrders);
  const currentOrder = useAppSelector(selectCurrentOrder);
  const loading = useAppSelector(selectOrdersLoading);
  const error = useAppSelector(selectOrdersError);
  const filters = useAppSelector(selectOrderFilters);
  const pagination = useAppSelector(selectOrderPagination);
  const paymentIntent = useAppSelector(selectPaymentIntent);
  const paymentLoading = useAppSelector(selectPaymentLoading);
  const paymentError = useAppSelector(selectPaymentError);
  const orderCreation = useAppSelector(selectOrderCreation);

  // Actions
  const placeOrder = async (orderData: CreateOrderData) => {
    const result = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(result)) {
      // Clear cart on successful order creation
      dispatch(clearCart());
      return result.payload;
    }
    throw new Error(result.payload as string);
  };

  const loadMyOrders = (filters?: OrderFilters) => {
    return dispatch(fetchMyOrders(filters || {}));
  };

  const loadOrderById = (orderId: string) => {
    return dispatch(fetchOrderById(orderId));
  };

  const loadOrderByNumber = (orderNumber: string) => {
    return dispatch(fetchOrderByNumber(orderNumber));
  };

  const initializePayment = async (paymentData: PaymentIntentData) => {
    const result = await dispatch(createPaymentIntent(paymentData));
    if (createPaymentIntent.fulfilled.match(result)) {
      return result.payload;
    }
    throw new Error(result.payload as string);
  };

  const confirmOrderPayment = (paymentIntentId: string) => {
    return dispatch(confirmPayment(paymentIntentId));
  };

  const updateFilters = (newFilters: Partial<OrderFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  const clearOrder = () => {
    dispatch(clearCurrentOrder());
  };

  const clearErrors = () => {
    dispatch(clearError());
  };

  const clearPayment = useCallback(() => {
    dispatch(clearPaymentIntent());
  }, [dispatch]);

  const resetCreation = useCallback(() => {
    dispatch(resetOrderCreation());
  }, [dispatch]);

  // Helper methods
  const filterByStatus = (status: string) => {
    updateFilters({ orderStatus: status, page: 1 });
    return loadMyOrders({ ...filters, orderStatus: status, page: 1 });
  };

  const filterByPaymentStatus = (status: string) => {
    updateFilters({ paymentStatus: status, page: 1 });
    return loadMyOrders({ ...filters, paymentStatus: status, page: 1 });
  };

  const changePage = (page: number) => {
    updateFilters({ page });
    return loadMyOrders({ ...filters, page });
  };

  const changeLimit = (limit: number) => {
    updateFilters({ limit, page: 1 });
    return loadMyOrders({ ...filters, limit, page: 1 });
  };

  const sortOrders = (sortBy: string, sortOrder: "asc" | "desc" = "desc") => {
    updateFilters({ sortBy, sortOrder, page: 1 });
    return loadMyOrders({ ...filters, sortBy, sortOrder, page: 1 });
  };

  const filterByDateRange = (startDate: string, endDate: string) => {
    updateFilters({ startDate, endDate, page: 1 });
    return loadMyOrders({ ...filters, startDate, endDate, page: 1 });
  };

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    filters,
    pagination,
    paymentIntent,
    paymentLoading,
    paymentError,
    orderCreation,

    // Actions
    placeOrder,
    loadMyOrders,
    loadOrderById,
    loadOrderByNumber,
    initializePayment,
    confirmOrderPayment,
    updateFilters,
    resetFilters,
    clearOrder,
    clearErrors,
    clearPayment,
    resetCreation,

    // Helper methods
    filterByStatus,
    filterByPaymentStatus,
    changePage,
    changeLimit,
    sortOrders,
    filterByDateRange,
  };
};
