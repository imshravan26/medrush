import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/authContext";
import { CartProvider } from "@/lib/CartContext";
import { LocationProvider } from "@/lib/LocationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "medRush",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased hydrationwarningsuppress `}
      >
        <AuthProvider>
          <CartProvider>
            <LocationProvider>
              <main className="flex-grow">{children}</main>
            </LocationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
