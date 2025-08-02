import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ToastProvider from "./components/ToastProvider"
import Link from "next/link";
import { SignedOut, SignedIn, SignInButton, UserButton } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tier-Based Event Showcase",
  description: "Tier-Based Event Showcase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <nav className="flex gap-2 border-b border-sky-200/50 p-6 w-full items-center justify-between">
            <h2 className="text-2xl font-bold text-nowrap w-[35%]">Event Showcase</h2>
            <div className="flex w-[65%] items-center justify-between">
              <div className="flex gap-4">
                <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
                <Link href="/events" className="hover:text-sky-500 transition-colors">Events</Link>
                <Link href="/admin" className="hover:text-sky-500 transition-colors">Admin</Link>
              </div>
              <div className="flex gap-3">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </nav>
          {children}
          <ToastProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
