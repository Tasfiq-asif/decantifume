"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/reduxHooks";
import { useOrders } from "@/lib/hooks/useOrders";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  selectCartItems,
  selectCartTotal,
  selectCartTotalQuantity,
} from "@/redux/selectors";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/redux/slices/cartSlice";
import type {
  ShippingAddress,
  CreateOrderData,
  OrderItem,
} from "@/redux/slices/orderSlice";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const cartItems = useAppSelector(selectCartItems);
  const totalAmount = useAppSelector(selectCartTotal);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);

  const {
    placeOrder,
    initializePayment,
    orderCreation,
    paymentIntent,
    paymentLoading,
    paymentError,
    clearPayment,
    resetCreation,
  } = useOrders();

  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState<
    "cart" | "shipping" | "payment"
  >("cart");
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Calculate costs
  const shippingCost = totalAmount > 50 ? 0 : 9.99;
  const tax = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + shippingCost + tax - discount;

  // Reset checkout state when modal closes
  useEffect(() => {
    if (!showCheckoutModal) {
      setCheckoutStep("cart");
      setShippingAddress(null);
      clearPayment();
      resetCreation();
    }
  }, [showCheckoutModal, clearPayment, resetCreation]);

  // Handle successful order creation
  useEffect(() => {
    if (orderCreation.success && !showCheckoutModal) {
      router.push("/dashboard/user/orders");
      toast.success("Order placed successfully!");
    }
  }, [orderCreation.success, showCheckoutModal, router]);

  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    size?: string,
    variant?: string
  ) => {
    dispatch(updateQuantity({ id, quantity, size, variant }));
  };

  const handleRemoveItem = (id: string, size?: string, variant?: string) => {
    dispatch(removeFromCart({ id, size, variant }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleApplyPromo = async () => {
    setIsApplyingPromo(true);
    // Simulate API call for promo code validation
    setTimeout(() => {
      setIsApplyingPromo(false);
      if (promoCode.toUpperCase() === "SAVE10") {
        setDiscount(totalAmount * 0.1); // 10% discount
        toast.success("Promo code applied! 10% discount");
      } else if (promoCode.toUpperCase() === "FREESHIP") {
        setDiscount(shippingCost);
        toast.success("Free shipping applied!");
      } else {
        toast.error("Invalid promo code");
      }
    }, 1000);
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/cart");
      return;
    }
    setCheckoutStep("shipping");
    setShowCheckoutModal(true);
  };

  const handleShippingSubmit = async (address: ShippingAddress) => {
    setShippingAddress(address);

    // Create order items from cart
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      product: item.id,
      productName: item.name,
      productImage: item.image,
      decantSize: item.size || "5ml", // Default to 5ml if not specified
      price: item.price,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity,
    }));

    // Create order data
    const orderData: CreateOrderData = {
      items: orderItems,
      shippingAddress: address,
      subtotal: totalAmount,
      shippingCost,
      tax,
      discount,
      totalAmount: finalTotal,
      paymentMethod: "stripe",
      promoCode: promoCode || undefined,
    };

    try {
      // Create the order first
      const order = await placeOrder(orderData);

      // Initialize payment
      await initializePayment({
        amount: finalTotal,
        currency: "usd",
        orderId: order._id,
        customerEmail: address.email,
        metadata: {
          orderNumber: order.orderNumber,
          customerName: `${address.firstName} ${address.lastName}`,
        },
      });

      setCheckoutStep("payment");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create order";
      toast.error(errorMessage);
    }
  };

  const handlePaymentSuccess = () => {
    setShowCheckoutModal(false);
    toast.success("Payment successful! Redirecting to your orders...");
    setTimeout(() => {
      router.push("/dashboard/user/orders");
    }, 2000);
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
  };

  if (cartItems.length === 0) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your
            cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={`${item.id}-${item.size}-${item.variant}`}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      {item.size && (
                        <p className="text-sm text-muted-foreground">
                          Size: {item.size}
                        </p>
                      )}
                      {item.variant && (
                        <p className="text-sm text-muted-foreground">
                          Variant: {item.variant}
                        </p>
                      )}
                      <p className="text-lg font-semibold mt-2">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.quantity - 1,
                              item.size,
                              item.variant
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="px-4 py-2 text-center min-w-[3rem]">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.id,
                              item.quantity + 1,
                              item.size,
                              item.variant
                            )
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveItem(item.id, item.size, item.variant)
                        }
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" asChild>
                <Link href="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyPromo}
                      disabled={!promoCode || isApplyingPromo}
                    >
                      {isApplyingPromo ? "Applying..." : "Apply"}
                    </Button>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Price Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalQuantity} items)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  {totalAmount < 50 && (
                    <div className="text-sm text-muted-foreground">
                      Add ${(50 - totalAmount).toFixed(2)} more for free
                      shipping
                    </div>
                  )}
                </div>

                <Separator className="mb-4" />

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckoutClick}
                  disabled={orderCreation.loading}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {orderCreation.loading
                    ? "Processing..."
                    : "Proceed to Checkout"}
                </Button>

                {/* Security Notice */}
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>🔒 Secure checkout with SSL encryption</p>
                </div>

                {/* Shipping Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Truck className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Free shipping on orders over $50
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Modal */}
        <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {checkoutStep === "shipping"
                  ? "Shipping Information"
                  : "Payment"}
              </DialogTitle>
            </DialogHeader>

            {checkoutStep === "shipping" && (
              <ShippingForm
                onSubmit={handleShippingSubmit}
                loading={orderCreation.loading || paymentLoading}
                initialData={
                  user
                    ? {
                        firstName: user.name?.split(" ")[0] || "",
                        lastName:
                          user.name?.split(" ").slice(1).join(" ") || "",
                        email: user.email || "",
                      }
                    : {}
                }
              />
            )}

            {checkoutStep === "payment" && paymentIntent && (
              <div className="space-y-6">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-${discount.toFixed(2)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${finalTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Form */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CheckoutForm
                      clientSecret={paymentIntent.clientSecret}
                      orderId={shippingAddress ? "order-id" : ""}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {orderCreation.error && (
              <div className="text-red-600 text-sm mt-2">
                {orderCreation.error}
              </div>
            )}

            {paymentError && (
              <div className="text-red-600 text-sm mt-2">{paymentError}</div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SiteLayout>
  );
}
