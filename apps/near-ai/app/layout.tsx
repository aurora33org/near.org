import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEAR AI",
  description: "NEAR AI — The open source AI platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
