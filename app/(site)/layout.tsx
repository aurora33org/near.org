import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": "https://near.org/feed.xml",
    },
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            NEAR
          </Link>
          <div className="flex gap-8">
            <Link href="/about" className="text-sm hover:text-gray-600">
              About
            </Link>
            <Link href="/founders" className="text-sm hover:text-gray-600">
              For Founders
            </Link>
            <Link href="/developers" className="text-sm hover:text-gray-600">
              For Developers
            </Link>
            <Link href="/tech" className="text-sm hover:text-gray-600">
              Tech Stack
            </Link>
            <Link href="/community" className="text-sm hover:text-gray-600">
              Community
            </Link>
            <Link href="/ecosystem" className="text-sm hover:text-gray-600">
              Ecosystem
            </Link>
            <Link href="/blog" className="text-sm hover:text-gray-600">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">NEAR</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/about/team">Team</Link>
                </li>
                <li>
                  <Link href="/about/vision">Vision</Link>
                </li>
                <li>
                  <Link href="/ecosystem">Ecosystem</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Developers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/developers">Get Started</Link>
                </li>
                <li>
                  <Link href="/developers/docs">Docs</Link>
                </li>
                <li>
                  <Link href="/developers/tools">Tools</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Founders</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/founders">Overview</Link>
                </li>
                <li>
                  <Link href="/founders/funding">Funding</Link>
                </li>
                <li>
                  <Link href="/founders/accelerator">Accelerator</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/community">Community Hub</Link>
                </li>
                <li>
                  <a href="https://discord.gg/near" target="_blank" rel="noreferrer">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/nearprotocol" target="_blank" rel="noreferrer">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-sm text-gray-600 flex justify-between">
            <p>&copy; 2024 NEAR Protocol. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
