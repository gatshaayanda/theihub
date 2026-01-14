// src/app/layout.tsx
import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loader from "@/components/AdminHubLoader";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ChatWidget from "@/components/ChatWidget";
import ThemeHydrationScript from "@/components/ThemeHydrationScript";

/* Fonts — tech / retail vibe */
const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "iHub — Tech, Gadgets, Phones & Laptops",
  description:
    "Shop phones, laptops, gadgets, clothing and shoes. View prices and order instantly via WhatsApp.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <ThemeHydrationScript />
      </head>

      <body className="min-h-screen flex flex-col antialiased bg-[--background] text-[--foreground] font-sans">
        <AnalyticsProvider>
          {/* ✅ Loader FIRST — unchanged behavior */}
          <Loader />

          {/* Header shell */}
          <div className="sticky top-0 z-50 bg-[--background]/80 backdrop-blur border-b border-white/10">
            <Header />
          </div>

          {/* Page content */}
          <main className="flex-grow">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Instrumentation */}
          <Analytics />
          <ChatWidget />
          <SpeedInsights />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
