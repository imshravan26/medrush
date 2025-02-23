"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};
        setUser(currentUser);
        setRole(userData.role || "customer"); // Default to "customer" if no role
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const switchRole = async (newRole) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { role: newRole }, { merge: true });
      setRole(newRole);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, switchRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}