"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Medicine {
  id: number;
  name: string;
  price: number;
  quantity?: number;
}

interface CartContextType {
  cartItems: Medicine[];
  addToCart: (medicine: Medicine) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<Medicine[]>([]);

  const addToCart = (medicine: Medicine) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === medicine.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === medicine.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prevItems, { ...medicine, quantity: 1 }];
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
