import type { Metadata } from "next";
import localFont from "next/font/local";
import LenisProvider from "@/components/site/providers/LenisProvider";
import "./globals.css";

const montreal = localFont({
  src: [
    { path: "../public/fonts/pp-neue-montreal/PPNeueMontreal-Book.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-montreal",
  display: "swap",
});

const montrealMono = localFont({
  src: [
    { path: "../public/fonts/pp-neue-montreal-mono/PPNeueMontrealMono-Book.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-montreal-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://near.ai"),
  title: "NEAR AI — Confidential AI Infrastructure",
  description: "AI agents for the work your team has been afraid to automate. Private by default, verifiable by design.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "NEAR AI — Confidential AI Infrastructure",
    description: "AI agents for the work your team has been afraid to automate. Private by default, verifiable by design.",
    images: [{ url: "/logo-bg.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEAR AI — Confidential AI Infrastructure",
    description: "AI agents for the work your team has been afraid to automate. Private by default, verifiable by design.",
    images: ["/logo-bg.webp"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montreal.variable} ${montrealMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
