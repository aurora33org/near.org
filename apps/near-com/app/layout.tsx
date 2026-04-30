import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEAR",
  description: "NEAR — The blockchain for everyone",
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
