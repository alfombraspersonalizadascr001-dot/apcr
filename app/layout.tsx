import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const googleSans = Plus_Jakarta_Sans({
  variable: "--font-google-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "APCR | Dualidad Físico & Virtual — Alfombras Personalizadas & Software Costa Rica",
  description: "Alfombras personalizadas tipo spaghetti de alto tránsito y soluciones de software: Apps iOS/Android, CRM empresarial y websites.",
  icons: {
    icon: '/favicon.svg',
  },
};

import { Suspense } from "react";
import AnalyticsTracker from "./components/AnalyticsTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <body
        className={`${googleSans.variable} ${jetbrainsMono.variable} antialiased bg-[#f8fafc] text-slate-800 font-sans`}
      >
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
