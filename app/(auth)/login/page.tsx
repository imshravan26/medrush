"use client"; // Required for client-side hooks in App Router

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; // Adjust path based on your structure
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Login() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const user = await signInWithPopup(auth, provider);
      // Redirect to mode selection page after successful login
      console.log("Login successful", user);
      router.push("/");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">Login with Google</h1>
      <div className="w-full max-w-md">
        <button
          onClick={handleGoogleLogin}
          className="w-full p-2 bg-blue-500 text-white rounded flex items-center justify-center space-x-2 hover:bg-blue-600"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.24 10.32V14.4h7.49c-.31 2-2.07 3.65-4.49 4.25v3.53h2.82c3.49-3.22 5.42-7.93 5.42-12.78 0-.97-.11-1.91-.31-2.81h-10.93z"
              fill="#4285F4"
            />
            <path
              d="M12 24c3.24 0 5.95-1.07 7.93-2.89l-3.53-2.82c-1.07.72-2.42 1.15-4.4 1.15-3.38 0-6.25-2.29-7.27-5.38H1.07v3.38C3.04 21.47 7.27 24 12 24z"
              fill="#34A853"
            />
            <path
              d="M4.73 14.25c-.25-.72-.4-1.49-.4-2.25s.15-1.53.4-2.25V6.38H1.07C.38 8.09 0 9.98 0 12s.38 3.91 1.07 5.62l3.66-3.37z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.8c1.98 0 3.73.67 5.11 1.98l3.07-3.07C17.95 1.87 15.24.8 12 .8 7.27.8 3.04 3.33 1.07 6.38l3.66 3.37C5.75 6.67 8.62 4.8 12 4.8z"
              fill="#EA4335"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}
