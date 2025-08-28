import type { Metadata } from "next";
import { Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Podcastr",
  description: "Generate your podcast using AI",
  icons : {
      icon: "/icons/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ConvexClerkProvider>
          <html lang="en">
              <AudioProvider>
                  <body className={`${manrope.variable} ${geistMono.variable} antialiased`}>
                    {children}
                  </body>
              </AudioProvider>
          </html>
      </ConvexClerkProvider>
  );
}
