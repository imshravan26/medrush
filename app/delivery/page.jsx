"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import SiteHeader from "@/components/site-header";
import DeliveryCard from "@/components/deliveryCard"; // Ensure case matches file name (DeliveryCard.js)

export default function DeliveryDashboard() {
  const { user, role, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Redirect if not a delivery agent or not logged in
  useEffect(() => {
    if (!loading && (!user || role !== "delivery")) {
      router.push("/login");
      return;
    }
  }, [user, role, loading, router]);

  // Memoize the query setup to prevent unnecessary re-creations
  const setupOrdersQuery = useCallback(() => {
    if (!user || role !== "delivery") return null;
    return query(
      collection(db, "orders"),
      where("status", "==", "Pending")
    );
  }, [user, role]);

  // Fetch pending orders in real-time with proper cleanup and debouncing
  useEffect(() => {
    if (loading || !user || role !== "delivery") return;

    let unsubscribe = null;
    let isMounted = true; // Track component mount status

    const q = setupOrdersQuery();
    if (!q) return;

    try {
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!isMounted) return; // Prevent updates after unmount

          const orderData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Use functional update to prevent race conditions and check for actual changes
          setOrders((prevOrders) => {
            const hasChanged = JSON.stringify(prevOrders) !== JSON.stringify(orderData);
            return hasChanged ? orderData : prevOrders;
          });
          
          setError(null);
        },
        (err) => {
          if (!isMounted) return; // Prevent error updates after unmount
          console.error("Firestore error:", err);
          setError("Failed to fetch orders. Please try again.");
        }
      );
    } catch (error) {
      if (!isMounted) return;
      console.error("Error setting up Firestore listener:", error);
      setError("An error occurred while connecting to the database.");
    }

    // Cleanup subscription and state to prevent memory leaks
    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [loading, setupOrdersQuery]);

  // Memoize the accept order handler
  const handleAcceptOrder = useCallback(async (orderId) => {
    if (!user) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        status: "Accepted",
        deliveryAgentId: user.uid,
        acceptedAt: new Date().toISOString(),
      });
      // Removed alert to prevent UI clutter; order will auto-update via onSnapshot
    } catch (error) {
      console.error("Error accepting order:", error);
      alert("Failed to accept order. Please try again.");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SiteHeader />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user || role !== "delivery") return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Delivery Dashboard</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <DeliveryCard
                key={order.id}
                order={order}
                onAccept={handleAcceptOrder}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No pending orders available.
          </p>
        )}
      </div>
    </div>
  );
}