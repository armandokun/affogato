import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { siteConfig } from "@/lib/site";
import AnimatedGradientBackground from "@/components/animated-gradient-background";
import Navbar from "@/components/sections/navbar";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "black",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {process.env.NODE_ENV === "development" && (
        <head>
          <Script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        </head>
      )}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-background min-h-screen`}
      >
        <div className="absolute inset-0">
          <AnimatedGradientBackground />
        </div>
        <div className="max-w-7xl mx-auto min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
