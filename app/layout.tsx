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
  openGraph: {
    type: "website",
    siteName: "NEAR Protocol",
    title: "NEAR Protocol - The Blockchain Operating System",
    description: "NEAR is a blockchain operating system for the open web",
    url: "https://near.org",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEAR Protocol - The Blockchain Operating System",
    description: "NEAR is a blockchain operating system for the open web",
  },
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
