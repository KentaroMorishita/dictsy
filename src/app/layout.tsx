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
  description: "Dictation practice app",
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
