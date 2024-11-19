import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Seasonal Anime Viewer",
  description: "Discover anime releases by season with a modern and intuitive interface. Browse series by season, year and access essential information for each anime.",
  keywords: ["anime", "seasonal", "viewer", "streaming", "nextjs", "react"],
  authors: [{ name: "Pierre Bellenger" }],
  openGraph: {
    title: "Seasonal Anime Viewer",
    description: "Discover anime releases by season with a modern and intuitive interface",
    images: [
      {
        url: "/screenshot.png",
        width: 1200,
        height: 630,
        alt: "Seasonal Anime Viewer Screenshot"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Seasonal Anime Viewer",
    description: "Discover anime releases by season with a modern and intuitive interface",
    images: ["/screenshot.png"]
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
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
      </body>
    </html>
  );
}
