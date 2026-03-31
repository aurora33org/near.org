import type { Metadata } from "next";
import PillNavClient from "@/components/site/PillNavClient";

export const metadata: Metadata = {
  alternates: {
    types: {
      "application/rss+xml": "https://near.org/feed.xml",
    },
  },
};

const NAV_ITEMS = [
  { label: "Cloud", href: "/cloud" },
  { label: "Private Chat", href: "/private-chat" },
  { label: "Technology", href: "/technology" },
  { label: "Blog", href: "/blog" },
  {
    label: "Try NEAR AI",
    href: "#",
    dropdown: [
      { label: "Cloud", href: "https://cloud.near.ai/" },
      { label: "Private Chat", href: "https://private-chat.near.ai/welcome" },
      { label: "Contact Sales", href: "/contact" },
    ],
  },
];

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Floating nav */}
      <div className="fixed top-4 inset-x-0 z-[1000] flex justify-center pointer-events-none px-4">
        <div className="pointer-events-auto">
          <PillNavClient
            logo="/icon.svg"
            logoAlt="NEAR AI"
            items={NAV_ITEMS}
            baseColor="#000000"
            pillColor="#ffffff"
            pillTextColor="#000000"
            hoveredPillTextColor="#ffffff"
            logoBackground="#ffffff"
            initialLoadAnimation
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-black/8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

            <div>
              <h3 className="text-black text-xs font-semibold uppercase tracking-widest mb-5">Products</h3>
              <ul className="space-y-3 text-sm text-black/40">
                <li><a href="/private-chat" className="hover:text-black transition-colors">Private Chat</a></li>
                <li><a href="/cloud" className="hover:text-black transition-colors">Cloud</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-black text-xs font-semibold uppercase tracking-widest mb-5">Technology</h3>
              <ul className="space-y-3 text-sm text-black/40">
                <li><a href="https://www.near.org/papers" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">White Papers</a></li>
                <li><a href="https://nearai.github.io/docs/" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Cloud Docs</a></li>
                <li><a href="https://cloud-api.near.ai/docs" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">API Reference</a></li>
                <li><a href="https://cloud.near.ai/signin" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Get API Keys</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-black text-xs font-semibold uppercase tracking-widest mb-5">Company</h3>
              <ul className="space-y-3 text-sm text-black/40">
                <li><a href="/company" className="hover:text-black transition-colors">Who We Are</a></li>
                <li><a href="https://job-boards.eu.greenhouse.io/nearai" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">Careers</a></li>
                <li><a href="/blog" className="hover:text-black transition-colors">Blog</a></li>
                <li><a href="/contact" className="hover:text-black transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-black text-xs font-semibold uppercase tracking-widest mb-5">Legal</h3>
              <ul className="space-y-3 text-sm text-black/40">
                <li><a href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</a></li>
                <li><a href="/near-ai-cloud-terms-of-service" className="hover:text-black transition-colors">Cloud Terms</a></li>
                <li><a href="/terms-of-service" className="hover:text-black transition-colors">Chat Terms</a></li>
                <li><a href="/acceptable-use-policy" className="hover:text-black transition-colors">Acceptable Use</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-black/8 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-black/30 text-xs">
              © 2026 Jasnah Inc., DBA as NEAR AI. All Rights Reserved.
            </p>
            <a
              href="https://x.com/near_ai"
              target="_blank"
              rel="noreferrer"
              className="text-black/30 hover:text-black transition-colors text-xs"
            >
              X (Twitter) →
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
