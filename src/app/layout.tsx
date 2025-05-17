import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Toaster } from "sonner";

import { siteConfig } from "@/lib/site";
import { SessionProvider } from "@/containers/SessionProvider";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-black min-h-screen`}
      >
        <SessionProvider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
