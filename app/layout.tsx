import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sander.tf",
  description: "This is my personal website! Explore my projects, blogs, and more.",
  keywords: ["blog", "projects"],

  openGraph: {
    title: "sander.tf",
    description: "This is my personal website! Explore my projects, blogs, and more.",
    url: "https://sander.tf/",
    siteName: "sander.tf",
    images: [{ url: "https://sander.tf/sander-tf.png" }],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "sander.tf",
    description: "This is my personal website! Explore my projects, blogs, and more.",
    images: ["https://sander.tf/sander-tf.png"]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
