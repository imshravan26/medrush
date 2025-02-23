"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/authContext";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { cartItems, setCartItems } = useCart();
  const { user, role } = useAuth();
  const paymentId = searchParams.get("paymentId");
  const orderId = searchParams.get("orderId");
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (!user || role !== "customer" || !paymentId || !orderId) {
      router.push("/");
    } else {
      setCartItems([]);
    }
  }, [user, role, paymentId, orderId, router, setCartItems]);

  if (!user || role !== "customer") return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-gray-700 mb-2">Thank you for your purchase.</p>
        <p className="text-gray-700 mb-2">
          <strong>Payment ID:</strong> {paymentId}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Order ID:</strong> {orderId}
        </p>
        <p className="text-gray-700 mb-6">
          <strong>Total Amount:</strong> ₹{totalAmount}
        </p>
        <p className="text-gray-500 mb-6">
          Your medicines will be delivered to your address shortly.
        </p>
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={() => router.push("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
