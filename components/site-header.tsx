"use client";

import { useState } from "react";
import Link from "next/link";
import { User, ShoppingCart, ChevronDown, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../lib/authContext";
import { useCart } from "../lib/CartContext"; // Import CartContext
import { auth } from "../lib/firebase";

export default function SiteHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const { user, role } = useAuth();
  const { cartItems } = useCart(); // Use cart context
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          medRush
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 hidden sm:block">
            Delivery In 6 Mins
          </span>
          <Button
            variant="outline"
            className="flex items-center space-x-1 text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
            onClick={toggleModal}
          >
            <span className="text-sm flex flex-row gap-2 items-center truncate max-w-[200px]">
              <MapPin />
              <span>Pension Nagar, Bupeshnagar, Nagp...</span>
            </span>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          {user && role === "customer" && (
            <Link href="/" className="hover:underline">
              Home
            </Link>
          )}
          {user && role === "delivery" && (
            <Link href="/delivery" className="hover:underline">
              Delivery Dashboard
            </Link>
          )}
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100"
                onClick={toggleDropdown}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="text-sm truncate max-w-[150px]">
                  {user.displayName || "User"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <button
                    className="w-full text-left p-2 text-sm hover:bg-gray-100"
                    onClick={() => router.push("/profile")}
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Login
            </Button>
          )}
          {/* Cart Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-1">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">
                  Cart ({cartItems.length})
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          ₹{item.price} x {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    Your cart is empty.
                  </p>
                )}
              </div>
              {cartItems.length > 0 && (
                <SheetFooter>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Checkout (₹
                    {cartItems.reduce(
                      (sum, item) => sum + item.price * item.quantity,
                      0
                    )}
                    )
                  </Button>
                </SheetFooter>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Select Location</h2>
            <Input placeholder="Enter your location..." className="mb-4" />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={toggleModal}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white" onClick={toggleModal}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
