"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./authContext";
import { db } from "./firebase";

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(
    "Pension Nagar, Bupeshnagar, Nagp..."
  ); // Default
  const { user } = useAuth();

  // Load location from Firestore on mount
  useEffect(() => {
    if (user) {
      const fetchLocation = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().location) {
          setLocation(userDoc.data().location);
        }
      };
      fetchLocation();
    }
  }, [user]);

  // Save location to Firestore and update state
  const saveLocation = async (newLocation) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { location: newLocation }, { merge: true });
    }
    setLocation(newLocation);
  };

  return (
    <LocationContext.Provider value={{ location, saveLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
