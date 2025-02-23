"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/authContext";
import { useLocation } from "../../lib/LocationContext";
import { db } from "../../lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import SiteHeader from "@/components/site-header";

export default function ProfilePage() {
  const { user, role, switchRole } = useAuth();
  const { location } = useLocation();
  const [orders, setOrders] = useState([]);
  const [isDeliveryMode, setIsDeliveryMode] = useState(role === "delivery");
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orderData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderData);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleRoleSwitch = async (checked) => {
    const newRole = checked ? "delivery" : "customer";
    setIsDeliveryMode(checked);
    await switchRole(newRole);
    router.push(newRole === "delivery" ? "/delivery" : "/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">
              <strong>Name:</strong> {user.displayName || "User"}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Delivery Address:</strong> {location}
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <span className="text-sm text-gray-700">Role: Customer</span>
              <Switch
                checked={isDeliveryMode}
                onCheckedChange={handleRoleSwitch}
              />
              <span className="text-sm text-gray-700">Delivery Agent</span>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Past Orders
        </h2>
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Order #{order.id}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Address:</strong> {order.deliveryAddress}
                  </p>
                  <div className="mt-2">
                    <strong>Items:</strong>
                    <ul className="list-disc pl-5 text-sm text-gray-700">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.name} - ₹{item.price} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No past orders found.</p>
        )}
      </div>
    </div>
  );
}
