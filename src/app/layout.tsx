import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Leckerli_One } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const leckerli = Leckerli_One({
  variable: "--font-leckerli",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dictsy",
  description: "Dictation practice app for English learners",
  openGraph: {
    title: "Dictsy",
    description: "Dictation practice app for English learners",
    url: "https://dictsy.vercel.app",
    siteName: "Dictsy",
    images: [
      {
        url: "/ogp-image.png",
        width: 1200,
        height: 630,
        alt: "Dictsy - Dictation practice app",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dictsy",
    description: "Dictation practice app for English learners",
    images: ["/ogp-image.png"],
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
        className={`${geistSans.variable} ${geistMono.variable} ${leckerli.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
