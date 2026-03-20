import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEAR Protocol - The Blockchain Operating System",
  description: "NEAR is a blockchain operating system for the open web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}
