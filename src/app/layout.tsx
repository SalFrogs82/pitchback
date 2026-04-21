import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PitchBack — Softball Pitching Rehab & Performance",
    template: "%s | PitchBack",
  },
  description:
    "Track your softball pitching rehab progress, pitching metrics, strength training, and return-to-play journey.",
  keywords: ["softball", "pitching", "rehab", "performance tracking", "interval throwing program", "rapsodo"],
  openGraph: {
    title: "PitchBack — Softball Pitching Rehab & Performance",
    description: "Your comeback starts here. Track rehab, pitching data, strength, and goals.",
    siteName: "PitchBack",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PitchBack",
    description: "Softball pitching rehab & performance tracking",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
