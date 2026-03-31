import { Metadata } from "next";
import ThreadsClient from "@/components/site/ThreadsClient";

export const metadata: Metadata = {
  title: "NEAR AI Cloud — Private AI Inference for Developers & Enterprises",
  description:
    "Deploy AI models with hardware-encrypted privacy. One OpenAI-compatible API, multiple models, cryptographic proof of data isolation. Start in minutes.",
  openGraph: {
    title: "NEAR AI Cloud — Deploy Private AI in Minutes",
    description:
      "One API, multiple AI models, hardware-level encryption. Process sensitive data with cryptographic proof of privacy. OpenAI-compatible. Scale instantly.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const D = { fontFamily: "var(--font-display)" } as const;
const T = { fontFamily: "var(--font-tech)" } as const;

export default function CloudPage() {
  return (
    <div className="bg-white text-black">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-black flex items-center overflow-hidden" style={{ minHeight: '70vh' }}>
        {/* Threads WebGL background */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <ThreadsClient
            color={[0.345, 0.584, 0.847]}
            amplitude={1.5}
            distance={0.3}
            enableMouseInteraction
          />
        </div>
        {/* Overlay to keep text readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} aria-hidden="true" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-20 text-center">
          {/* Product badge */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span style={T} className="text-[#5895d8] text-xs tracking-widest uppercase border border-[#5895d8]/30 rounded-full px-3 py-1">
              NEAR AI Cloud
            </span>
          </div>

          <h1
            style={D}
            className="text-5xl lg:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5"
          >
            Private AI Inference.<br />Production-Ready.
          </h1>
          <p className="text-base lg:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-10">
            Deploy leading AI models through one OpenAI-compatible API — with every request
            encrypted and verified at the hardware level. From prototype to production in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cloud.near.ai/dashboard/keys"
              style={D}
              className="px-7 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
            >
              Get API Keys →
            </a>
            <a
              href="https://nearai.github.io/docs/"
              target="_blank"
              rel="noreferrer"
              style={D}
              className="px-7 py-3.5 bg-white/8 text-white font-semibold rounded-full border border-white/15 hover:bg-white/15 transition-colors text-sm"
            >
              Read Documentation
            </a>
          </div>
        </div>
      </section>

      {/* ── VALUE PROP ──────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div>
            <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-6">
              The platform
            </p>
            <h2 style={D} className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-black">
              One API. Multiple Models. Zero Data Exposure.
            </h2>
            <p className="text-black/50 text-base leading-relaxed mt-6">
              Access leading open-source models — DeepSeek, GPT OSS, GLM-4.6, Qwen3 — through a
              single OpenAI-compatible endpoint. Switch models without changing your code.
            </p>
            <p className="text-black/50 text-base leading-relaxed mt-4">
              Every request runs inside hardware-enforced Trusted Execution Environments, generating
              cryptographic proof that your models, prompts, and data stayed fully private.
            </p>
          </div>

          <div className="pt-1 space-y-3">
            {[
              {
                label: "Read Documentation →",
                href: "https://nearai.github.io/docs/",
                external: true,
              },
              {
                label: "Get API Keys →",
                href: "https://cloud.near.ai/dashboard/keys",
                external: true,
              },
              {
                label: "View API Reference →",
                href: "https://cloud-api.near.ai/docs",
                external: true,
              },
            ].map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="flex items-center justify-between px-5 py-4 border border-black/8 hover:border-[#5895d8]/40 hover:bg-[#5895d8]/[0.02] transition-all group"
              >
                <span style={D} className="text-sm font-semibold text-black group-hover:text-[#5895d8] transition-colors">
                  {link.label}
                </span>
                <span style={T} className="text-black/25 text-xs group-hover:text-[#5895d8] transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5 PILLARS ───────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            What NEAR AI Cloud enables
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-12 text-black">
            Everything You Need for Private AI at Scale
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-black/8">
            {[
              {
                num: "01",
                title: "Secure",
                body: "Hardware-level isolation. No one — not NEAR AI, not the cloud provider — can access your data during processing.",
              },
              {
                num: "02",
                title: "Flexible",
                body: "Switch models, scale workloads, and evolve your stack without vendor lock-in. One API, zero code changes.",
              },
              {
                num: "03",
                title: "Isolated",
                body: "Every inference runs in its own hardware-encrypted enclave. Isolation is built into the silicon.",
              },
              {
                num: "04",
                title: "Verifiable",
                body: "Each request generates a cryptographic attestation — a tamper-proof certificate proving exactly where your data was processed.",
              },
              {
                num: "05",
                title: "Agile",
                body: "Go live fast. Deploy private inference in minutes with a cloud-native API that connects directly to your stack.",
              },
            ].map((pillar) => (
              <div
                key={pillar.title}
                className="bg-white p-7 hover:bg-[#5895d8]/[0.02] transition-colors relative overflow-hidden group"
              >
                <span
                  style={{ ...D, lineHeight: 1 }}
                  className="absolute -bottom-2 -right-1 text-[64px] font-black text-black/[0.04] select-none pointer-events-none group-hover:text-[#5895d8]/[0.06] transition-colors"
                  aria-hidden="true"
                >
                  {pillar.num}
                </span>
                <p style={T} className="text-[#5895d8] text-xs tracking-widest mb-3">{pillar.num}</p>
                <h3 style={D} className="text-sm font-bold mb-2 text-black">{pillar.title}</h3>
                <p className="text-black/40 text-xs leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS ───────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Solutions
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-12 text-black">
            Built for Every Team That Handles Sensitive Data
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                num: "01",
                label: "Enterprise",
                title: "Process Regulated Data Without the Risk",
                body: "Work with personal, proprietary, or regulated data in a hardware-encrypted environment that meets global compliance standards.",
                items: ["Patient records & clinical data (HIPAA)", "Financial modeling & algorithms", "Proprietary research & IP", "Customer PII at scale"],
                cta: "Schedule a Demo →",
                href: "/contact",
              },
              {
                num: "02",
                label: "Developers",
                title: "Ship Private AI Apps in Minutes",
                body: "Integrate through one API and go from prototype to production fast. No infrastructure to manage, no compliance headaches.",
                items: ["OpenAI-compatible API", "SDK: Python, JS, Go", "Per-request hardware attestation", "Auto-scaling with predictable latency"],
                cta: "Get API Keys →",
                href: "https://cloud.near.ai/dashboard/keys",
              },
              {
                num: "03",
                label: "Government",
                title: "Sovereign AI. Deployed Anywhere.",
                body: "Run AI workloads in environments that keep sensitive and classified data under your control — even outside your borders.",
                items: ["Data sovereignty with hardware boundaries", "Zero operator access", "Cross-border deployment", "Real-time attestation & audit trails"],
                cta: "Talk to Our Team →",
                href: "/contact",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="border border-black/8 border-l-4 border-l-[#5895d8] bg-white p-8 flex flex-col hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span style={T} className="text-[#5895d8] text-xs tracking-widest">{card.num}</span>
                  <span className="text-black/15 text-xs">—</span>
                  <p style={T} className="text-xs tracking-widest uppercase text-black/35 font-medium">{card.label}</p>
                </div>
                <h3 style={D} className="text-base font-bold mb-3 text-black">{card.title}</h3>
                <p className="text-black/45 text-sm leading-relaxed mb-5">{card.body}</p>
                <ul className="space-y-1.5 mb-8 flex-1">
                  {card.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-black/40">
                      <span className="text-[#5895d8] shrink-0 mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={card.href} style={D} className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors">
                  {card.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODELS + PRICING ────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Models + Pricing
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-black">
            Pick the Right Model for Your Workload
          </h2>
          <p className="text-black/40 text-sm mb-10">
            All models run inside hardware-encrypted environments. Switch between them through one API — no code changes needed.
          </p>

          {/* Header */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-3 border-b border-black/8">
            {["Model", "Specs", "Best for", "Pricing", "Privacy"].map((h) => (
              <p key={h} style={T} className="text-black/25 text-xs uppercase tracking-widest">{h}</p>
            ))}
          </div>

          <div className="space-y-px bg-black/8">
            {[
              { name: "GLM-4.6 FP8", provider: "Zhipu AI", params: "358B params", ctx: "200K context", best: "Complex reasoning, long-doc analysis", input: "$0.75", output: "$2" },
              { name: "GPT OSS 120B", provider: "OpenAI", params: "117B MoE", ctx: "131K context", best: "General-purpose, agentic workflows", input: "$0.2", output: "$0.6" },
              { name: "DeepSeek V3.1", provider: "DeepSeek", params: "Hybrid mode", ctx: "128K context", best: "Deep reasoning, research", input: "$1", output: "$2.5" },
              { name: "Qwen3 30B A3B", provider: "Alibaba Qwen", params: "3.3B active", ctx: "262K context", best: "Cost-efficient, high-volume", input: "$0.15", output: "$0.45" },
            ].map((model) => (
              <div
                key={model.name}
                className="bg-white grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-5 hover:bg-white/80 transition-colors items-center group"
              >
                <div>
                  <p style={D} className="font-semibold text-sm text-black">{model.name}</p>
                  <p style={T} className="text-black/30 text-xs mt-0.5">by {model.provider}</p>
                </div>
                <div>
                  <p style={T} className="text-black/40 text-xs">{model.params}</p>
                  <p style={T} className="text-black/40 text-xs">{model.ctx}</p>
                </div>
                <p className="text-black/30 text-xs leading-relaxed">{model.best}</p>
                <div>
                  <p style={T} className="text-[#5895d8] text-sm font-semibold">
                    {model.input}<span className="text-black/20 font-normal text-xs">/M in</span>
                  </p>
                  <p style={T} className="text-[#5895d8] text-sm font-semibold">
                    {model.output}<span className="text-black/20 font-normal text-xs">/M out</span>
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex-1 bg-black/8 rounded-full h-1">
                      <div className="bg-[#5895d8] h-1 rounded-full w-full" />
                    </div>
                    <span style={T} className="text-[#5895d8] text-xs">100%</span>
                  </div>
                  <p className="text-black/20 text-xs">Encrypted</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-black/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-black/35 text-sm">
              Need a custom model or dedicated deployment? We offer enterprise pricing for private model hosting.
            </p>
            <a href="/contact" style={D} className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors whitespace-nowrap">
              Contact Us for Enterprise Pricing →
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="py-24 px-8 bg-black relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #5895d8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 style={D} className="text-4xl lg:text-5xl font-bold tracking-tight leading-[1.05] mb-5 text-white">
            Ready to Deploy Private AI?
          </h2>
          <p className="text-white/45 text-base mb-10 max-w-lg mx-auto">
            Whether you&apos;re building a prototype or running enterprise workloads, NEAR AI Cloud
            gives you the privacy guarantees your data demands.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://cloud.near.ai/dashboard/keys"
              style={D}
              className="px-7 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
            >
              Get API Keys
            </a>
            <a
              href="https://nearai.github.io/docs/"
              target="_blank"
              rel="noreferrer"
              style={D}
              className="px-7 py-3.5 bg-white/8 text-white font-semibold rounded-full border border-white/15 hover:bg-white/15 transition-colors text-sm"
            >
              Read Documentation
            </a>
            <a
              href="/contact"
              style={D}
              className="px-7 py-3.5 text-white/45 font-semibold rounded-full border border-white/10 hover:border-white/30 hover:text-white transition-colors text-sm"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
