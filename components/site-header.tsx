"use client";

import Link from "next/link";
import { Search, User, ShoppingCart, ChevronDown, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../lib/authContext";
import { auth } from "../lib/firebase";

export default function SiteHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown on click
  const { user, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
      setIsDropdownOpen(false); // Close dropdown after logout
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          medRush
        </Link>

        {/* Delivery Location Button */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 hidden sm:block">
            Delivery In 6 Mins
          </span>
          <div>
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
        </div>

        {/* Login/User Info and Cart */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100"
                onClick={toggleDropdown} // Toggle dropdown on click
              >
                Hi,
                <span className="text-sm truncate max-w-[150px]">
                  {user.displayName || "User"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {/* Dropdown Menu - Visible only when isDropdownOpen is true */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full text-left p-2 text-sm hover:bg-gray-100"
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

          <Link href="/cart">
            <Button variant="ghost" className="flex items-center space-x-1">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Modal */}
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
