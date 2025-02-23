"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface DeliveryCardProps {
  order: {
    id: string;
    userId: string;
    items: { id: string; name: string; price: number; quantity: number }[];
    totalAmount: number;
    deliveryAddress: string;
    status: string;
    createdAt: string;
  };
  onAccept: (orderId: string) => void;
}

export default function DeliveryCard({ order, onAccept }: DeliveryCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Order #{order.id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            <strong>Customer ID:</strong> {order.userId}
          </p>
          <div>
            <strong>Items:</strong>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} - ₹{item.price} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-gray-700">
            <strong>Total:</strong> ₹{order.totalAmount}
          </p>
          <p className="text-sm text-gray-700 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <strong>Delivery Location:</strong> {order.deliveryAddress}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Status:</strong> {order.status}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Order Placed:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
      {order.status === "Pending" && (
        <div className="p-4">
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => onAccept(order.id)}
          >
            Accept Order
          </Button>
        </div>
      )}
    </Card>
  );
}
