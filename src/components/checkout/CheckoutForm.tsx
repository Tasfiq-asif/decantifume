"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useOrders } from "@/lib/hooks/useOrders";
import { toast } from "sonner";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutFormProps {
  clientSecret: string;
  orderId: string;
  onSuccess: (paymentIntentId?: string) => void;
  onError: (error: string) => void;
}

function CheckoutFormContent({
  onSuccess,
  onError,
}: Pick<CheckoutFormProps, "onSuccess" | "onError">) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { confirmOrderPayment, paymentLoading } = useOrders();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        onError(error.message || "Payment failed");
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent?.status === "succeeded") {
        try {
          // Confirm payment on our backend
          console.log("Confirming payment with intent ID:", paymentIntent.id);
          const confirmResult = await confirmOrderPayment(paymentIntent.id);
          console.log("Payment confirmation result:", confirmResult);
          onSuccess(paymentIntent.id);
          toast.success("Payment successful!");
        } catch (confirmError) {
          console.error("Payment confirmation failed:", confirmError);
          // Payment succeeded on Stripe but backend confirmation failed
          toast.error(
            "Payment successful but order confirmation failed. Please contact support."
          );
          onError("Backend confirmation failed");
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Payment failed";
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing || paymentLoading}
        className="w-full mt-6"
        size="lg"
      >
        {isProcessing || paymentLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Complete Payment"
        )}
      </Button>
    </form>
  );
}

export function CheckoutForm(props: CheckoutFormProps) {
  const options = {
    clientSecret: props.clientSecret,
    appearance: {
      theme: "stripe" as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutFormContent {...props} />
    </Elements>
  );
}
