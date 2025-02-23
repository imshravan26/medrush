"use client";

import { useState, useEffect } from "react";
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
import { useCart } from "../lib/CartContext";
import { useLocation } from "../lib/LocationContext";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api";

export default function SiteHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 21.1458, lng: 79.0882 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const { user, role } = useAuth();
  const { cartItems, setCartItems } = useCart();
  const { location, saveLocation } = useLocation();
  const router = useRouter();
  const pathname = usePathname();

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
    setIsDropdownOpen(false);
  };

  const handleCheckout = async () => {
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Generate a mock order ID (since no Razorpay)
    const orderId = `order_${Date.now()}`;

    // Save order to Firestore
    const orderData = {
      userId: user.uid,
      orderId: orderId,
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: totalAmount,
      deliveryAddress: location,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, "orders", orderId), orderData);
      setCartItems([]); // Clear cart
      router.push("/profile"); // Redirect to profile to see the order
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Failed to create order");
    }
  };

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        setTempLocation(place.formatted_address);
      }
    }
  };

  const onMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setMapCenter({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setTempLocation(results[0].formatted_address);
      }
    });
  };

  const handleSaveLocation = () => {
    if (tempLocation) {
      saveLocation(tempLocation);
    }
    setIsModalOpen(false);
    setTempLocation("");
    setMarkerPosition(null);
  };

  useEffect(() => {
    if (isModalOpen) {
      setTempLocation("");
      setMarkerPosition(null);
      setMapCenter({ lat: 21.1458, lng: 79.0882 });
    }
  }, [isModalOpen]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={role === "delivery" ? "/delivery" : "/"} className="text-2xl font-bold text-blue-600">
          medRush
        </Link>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 hidden sm:block">Delivery In 6 Mins</span>
          {role === "customer" && (
            <Button
              variant="outline"
              className="flex items-center space-x-1 text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
              onClick={toggleModal}
            >
              <span className="text-sm flex flex-row gap-2 items-center truncate max-w-[200px]">
                <MapPin />
                <span>{location}</span>
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          )}
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
          {user && (
            <Link href="/profile" className="hover:underline">
              Profile
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
                  <img src={user.photoURL} alt="User Avatar" className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="text-sm truncate max-w-[150px]">{user.displayName || "User"}</span>
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
          {role === "customer" && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:inline">Cart ({cartItems.length})</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                  )}
                </div>
                {cartItems.length > 0 && (
                  <SheetFooter>
                    <Button
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      onClick={handleCheckout}
                    >
                      Checkout (₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)})
                    </Button>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
      {isModalOpen && role === "customer" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Select Delivery Location</h2>
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
              libraries={["places"]}
            >
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <Input
                  placeholder="Search for your address..."
                  className="mb-4 w-full"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                />
              </Autocomplete>
              <div className="h-64 w-full mb-4">
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={mapCenter}
                  zoom={15}
                  onClick={onMapClick}
                >
                  {markerPosition && <Marker position={markerPosition} />}
                </GoogleMap>
              </div>
            </LoadScript>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={toggleModal}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white" onClick={handleSaveLocation}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}