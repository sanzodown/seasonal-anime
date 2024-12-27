import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pewpewlazer's Seasonal Anime",
  description: "Discover anime releases by season with a modern and intuitive interface. Browse series by season, year and access essential information for each anime.",
  keywords: ["anime", "seasonal", "viewer", "streaming", "nextjs", "react"],
  authors: [{ name: "Pierre Bellenger" }],
  openGraph: {
    title: "Pewpewlazer's Seasonal Anime",
    description: "Discover anime releases by season with a modern and intuitive interface",
    images: [
      {
        url: "/logo.svg",
        width: 48,
        height: 48,
        alt: "Pewpewlazer's Seasonal Anime Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Pewpewlazer's Seasonal Anime",
    description: "Discover anime releases by season with a modern and intuitive interface",
    images: ["/logo.svg"]
  },
  icons: {
    icon: { url: "/logo.svg", type: "image/svg+xml" },
    shortcut: { url: "/logo.svg", type: "image/svg+xml" },
    apple: { url: "/logo.svg", type: "image/svg+xml" }
  }
}

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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
