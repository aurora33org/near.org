import type { Metadata } from "next";
import { Open_Sans, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Open_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-tech", display: "swap" });

export const metadata: Metadata = {
  title: "NEAR",
  description: "NEAR — The blockchain for everyone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
