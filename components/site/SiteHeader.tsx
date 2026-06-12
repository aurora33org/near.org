import Image from "next/image";

export default function SiteHeader() {
  return (
    <header className="flex items-center justify-between py-8 text-[0.75rem] lg:text-[0.875rem] uppercase tracking-[0.2em] text-white/80">
      <a href="/">
        <Image src="/near-ai.png" alt="NEAR AI" width={120} height={24} style={{ width: "auto", height: "24px" }} />
      </a>
      <div className="flex items-center gap-8">
        <a href="/blog" className="text-pretty hover:text-white transition-colors">BLOG</a>
        <a href="/company" className="text-pretty hover:text-white transition-colors">OUR COMPANY</a>
      </div>
    </header>
  );
}
