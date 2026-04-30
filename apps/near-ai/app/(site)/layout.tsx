import Link from "next/link";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="text-purple-600">NEAR</span>
            <span className="text-gray-900">AI</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/blog" className="hover:text-purple-600 transition-colors">Blog</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} NEAR AI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-purple-600 transition-colors">Blog</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
