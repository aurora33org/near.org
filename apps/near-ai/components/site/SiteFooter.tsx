import Image from "next/image";
import { SiX } from "react-icons/si";

const NAV_COLS = [
  {
    title: "Products",
    hidden: true,
    links: [
      { label: "Cloud", href: "#" },
      { label: "Agents", href: "#" },
      { label: "IronClaw", href: "#" },
      { label: "Agent Marketplace", href: "#" },
    ],
  },
  {
    title: "Technology",
    hidden: true,
    links: [
      { label: "White Papers", href: "#" },
      { label: "Cloud Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Get API Keys", href: "#" },
    ],
  },
  {
    title: "Company",
    hidden: false,
    links: [
      { label: "Home", href: "/" },
      { label: "About us", href: "/company" },
      { label: "Careers", href: "https://job-boards.eu.greenhouse.io/nearai", target: "_blank" },
    ],
  },
  {
    title: "Terms and Policies",
    hidden: false,
    links: [
      { label: "Privacy Policy", href: "/terms-and-policies/privacy-policy" },
      { label: "NEAR AI Services Terms of Service", href: "/terms-and-policies/terms-of-service" },
      { label: "Agent Market Terms of Service", href: "/terms-and-policies/near-ai-agent-market-terms-of-service" },
      { label: "NEAR AI Cloud Terms of Service", href: "/terms-and-policies/near-ai-cloud-terms-of-service" },
      { label: "Data Processing Agreement", href: "/terms-and-policies/near-ai-data-processing-agreement-for-customers" },
      { label: "Cookie Policy", href: "/terms-and-policies/cookie-policy" },
      { label: "Acceptable Use Policy", href: "/terms-and-policies/acceptable-use-policy" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative bg-[#575757] text-white">
      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-[100px]">

        {/* Mobile logo */}
        <div className="flex lg:hidden pt-16 pb-6">
          <Image src="/near-ai.png" alt="NEAR AI" width={140} height={28} style={{ width: "auto", height: "28px" }} />
        </div>

        {/* Mobile nav grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 lg:hidden">
          {NAV_COLS.filter((col) => !col.hidden).map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <p className="text-pretty text-white/80 text-[0.875rem] font-medium">{col.title}</p>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <a key={link.label} href={link.href} target={"target" in link ? link.target : undefined} rel={"target" in link ? "noopener noreferrer" : undefined} className="text-pretty text-white/50 [font-size:var(--font-size-body)] hover:text-white/80 transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop nav flex */}
        {(() => {
          const visible = NAV_COLS.filter((col) => !col.hidden);
          return (
            <div className="hidden lg:flex min-h-[320px]">
              <div className="w-[22%] shrink-0 flex flex-col items-start justify-center pr-8">
                <Image src="/near-ai.png" alt="NEAR AI" width={140} height={28} style={{ width: "auto", height: "28px" }} />
              </div>
              <div className="w-[50%] flex ml-auto">
              {visible.map((col, i) => (
                <div key={col.title} className={`flex-1 flex flex-col justify-start pt-10 pb-10 px-8 border-l border-white/15 ${i === visible.length - 1 ? "border-r border-white/15" : ""}`}>
                  <div className="flex flex-col gap-4">
                    <p className="text-pretty text-white/80 text-[0.875rem] font-medium">{col.title}</p>
                    <div className="flex flex-col gap-3">
                      {col.links.map((link) => (
                        <a key={link.label} href={link.href} target={"target" in link ? link.target : undefined} rel={"target" in link ? "noopener noreferrer" : undefined} className="text-pretty text-white/50 [font-size:var(--font-size-body)] hover:text-white/80 transition-colors">
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          );
        })()}

        <div className="flex">
          <div className="hidden lg:block w-[22%] shrink-0" />
          <div className="flex-1 border-t border-white/15" />
        </div>

        <div className="flex items-center">
          <div className="flex items-center gap-4 flex-1 border-r border-b border-white/15 py-8 pr-8 lg:pl-[22%]">
            <p className="font-mono [font-size:var(--font-size-body)] uppercase tracking-[0.2em] text-white/80">Join the community</p>
            <p className="[font-size:var(--font-size-body)] text-white/50">Connect with developers and researchers.</p>
            <a href="https://x.com/near_ai" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white hover:scale-110 transition-all duration-150 ml-2"><SiX className="w-4 h-4" /></a>
          </div>
        </div>

        <p className="text-[12px] lg:text-[14px] text-white/35 pt-4 pb-8 lg:py-8">© 2026 Jasnah Inc., DBA as NEAR AI. All Rights Reserved.</p>

      </div>
    </footer>
  );
}
