"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "../lib/CartContext";
import { JSX } from "react";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  pharmacyId: string;
}

interface MedicineCardProps {
  medicine: Medicine;
}

export default function MedicineCard({
  medicine,
}: MedicineCardProps): JSX.Element {
  const { addToCart } = useCart();

  const handleAddToCart = (): void => {
    addToCart(medicine);
  };

  return (
    <Card className="w-full max-w-sm shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          {medicine.name}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {medicine.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Price:</span> ₹{medicine.price}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Stock:</span> {medicine.stock}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Pharmacy:</span> {medicine.pharmacyId}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
