import { Metadata } from "next";
import BeamsClient from "@/components/site/BeamsClient";

export function generateMetadata(): Metadata {
  return {
    title: "NEAR AI — Private, Verifiable AI for Sensitive Data",
    description: "Process sensitive data with AI you can verify. Hardware-encrypted inference for developers, enterprises, and governments. OpenAI-compatible API. Deploy in minutes.",
    openGraph: {
      title: "NEAR AI — The Only AI That Proves Your Data Stays Private",
      description: "Hardware-encrypted AI inference with cryptographic proof of privacy. Build, deploy, and chat with AI — knowing no one can access your data. Not even us.",
      type: "website",
    },
    twitter: { card: "summary_large_image" },
  };
}

const D = { fontFamily: "var(--font-display)" } as const;
const T = { fontFamily: "var(--font-tech)" } as const;

export default function Home() {
  return (
    <div className="bg-white text-black">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <BeamsClient
            beamWidth={3}
            beamHeight={30}
            beamNumber={20}
            lightColor="#ffffff"
            speed={2}
            noiseIntensity={1.75}
            scale={0.2}
            rotation={30}
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-24 text-center">
          <h1
            style={D}
            className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Your AI. Your Data.<br />
            <em className="not-italic text-white/90">Verified Private.</em>
          </h1>
          <p className="text-base lg:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-10">
            Run AI models on your most sensitive data — medical records, financial files, legal
            documents — with hardware-level encryption and cryptographic proof that no one accessed
            it. Not the cloud provider. Not the model provider. Not even us.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="https://cloud.near.ai/dashboard/keys"
              className="px-7 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
              style={D}
            >
              Get API Keys →
            </a>
            <a
              href="https://private-chat.near.ai/welcome"
              className="px-7 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-colors text-sm backdrop-blur-sm"
              style={D}
            >
              Try Private Chat
            </a>
          </div>
          <p style={T} className="text-white/35 text-xs tracking-widest uppercase">
            Powered by Intel TDX &amp; NVIDIA Confidential Computing
          </p>
          <div style={T} className="text-xs text-white/20 mt-3 flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#5895d8] animate-pulse shrink-0" />
            1,247,893 requests processed privately
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ───────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-5 px-8 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            "Intel Technology Partner",
            "NVIDIA Confidential Computing",
            "OpenAI-Compatible API",
            "Open Source",
          ].map((badge, i, arr) => (
            <span key={badge} className="flex items-center gap-10">
              <span style={T} className="text-black/35 text-xs tracking-widest uppercase font-medium">
                {badge}
              </span>
              {i < arr.length - 1 && (
                <span className="text-black/15 hidden sm:inline select-none">·</span>
              )}
            </span>
          ))}
        </div>
      </section>

      {/* ── PROBLEMA → SOLUCIÓN ─────────────────────────────────── */}
      <section className="border-b border-black/8 py-28 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left */}
          <div>
            <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-6">
              The problem with AI today
            </p>
            <h2
              style={D}
              className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-black"
            >
              Every AI Provider Asks You to Trust Them. We Let You Verify.
            </h2>
            <p className="text-black/50 text-base leading-relaxed mt-6">
              When you use ChatGPT, Claude, or any AI tool, your data passes through servers you
              don&apos;t control. You&apos;re trusting the provider won&apos;t read, store, or train on it.
            </p>
            <a
              href="/technology"
              className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors mt-6"
              style={D}
            >
              See How It Works →
            </a>
          </div>

          {/* Right: comparison diagram */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {/* Traditional AI */}
            <div className="rounded-xl bg-black/[0.02] border border-black/8 p-5">
              <p style={T} className="text-xs text-red-400/60 mb-4 uppercase tracking-widest">
                Traditional AI
              </p>
              <div className="space-y-0">
                {[
                  "Data readable by provider",
                  "Trust their privacy policy",
                  "No verifiable proof",
                  "Data may train models",
                  "Server breach = data leak",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 py-2.5 border-b border-black/6 last:border-0"
                  >
                    <span className="text-red-400/40 text-xs mt-0.5 shrink-0">✗</span>
                    <span className="text-black/35 text-xs leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* NEAR AI */}
            <div className="rounded-xl bg-[#5895d8]/[0.04] border border-[#5895d8]/25 p-5">
              <p style={T} className="text-xs text-[#5895d8] mb-4 uppercase tracking-widest">
                NEAR AI
              </p>
              <div className="space-y-0">
                {[
                  "Data encrypted in hardware",
                  "Cryptographic proof of privacy",
                  "Verifiable attestation",
                  "Zero data retention",
                  "Breach-proof hardware vault",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 py-2.5 border-b border-[#5895d8]/10 last:border-0"
                  >
                    <span className="text-[#5895d8] text-xs mt-0.5 shrink-0">✓</span>
                    <span className="text-black/60 text-xs leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DOS PRODUCTOS ───────────────────────────────────────── */}
      <section className="border-b border-black/8 py-28 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Two products. One standard of privacy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">

            {/* Cloud */}
            <div className="group rounded-2xl border border-black/8 border-l-4 border-l-[#5895d8] bg-white p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <span style={T} className="text-[#5895d8] text-xs tracking-widest">01</span>
                <span className="text-black/20 text-xs">—</span>
                <span className="text-black/35 text-xs">Cloud</span>
              </div>
              <h3 style={D} className="text-xl font-bold mb-3 text-black">
                Private AI Infrastructure for Developers &amp; Enterprises
              </h3>
              <p className="text-black/50 text-sm leading-relaxed mb-6">
                Deploy open-source and custom AI models through a single OpenAI-compatible API.
                Every request runs in hardware-isolated environments with real-time attestation.
                Go from prototype to production in minutes — not months.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "One API, multiple models (DeepSeek, GPT OSS, GLM-4.6, Qwen3)",
                  "Hardware-encrypted inference with per-request verification",
                  "Deploy in minutes, scale automatically",
                  "Built for regulated industries: healthcare, finance, legal",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-black/45">
                    <span className="text-[#5895d8] mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <a href="/cloud" style={D} className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors">
                  Explore Cloud →
                </a>
                <a href="https://cloud.near.ai/dashboard/keys" className="text-sm text-black/35 hover:text-black/60 transition-colors">
                  Get API Keys
                </a>
              </div>
            </div>

            {/* Private Chat */}
            <div className="group rounded-2xl border border-black/8 border-l-4 border-l-[#5895d8] bg-white p-8 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <span style={T} className="text-[#5895d8] text-xs tracking-widest">02</span>
                <span className="text-black/20 text-xs">—</span>
                <span className="text-black/35 text-xs">Private Chat</span>
              </div>
              <h3 style={D} className="text-xl font-bold mb-3 text-black">
                AI Chat Where No One Is Watching
              </h3>
              <p className="text-black/50 text-sm leading-relaxed mb-6">
                Talk to AI about anything sensitive — health questions, legal concerns, financial
                planning — with the same models you already know, running inside encrypted hardware.
                Your conversations are never stored, sold, or used for training.
              </p>
              <ul className="space-y-2 mb-8">
                {[
                  "Same AI models you trust (OpenAI, DeepSeek), fully private",
                  "End-to-end encrypted, verified execution",
                  "No data collection, no ads, no model training on your inputs",
                  "Free to try, no account required",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-black/45">
                    <span className="text-[#5895d8] mt-0.5 shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a href="https://private-chat.near.ai/welcome" style={D} className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors">
                Try Private Chat →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ───────────────────────────────────────── */}
      <section className="border-b border-black/8 py-28 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            How it works
          </p>
          <h2 style={D} className="text-4xl lg:text-5xl font-bold tracking-tight mb-16 text-black">
            Private AI in Three Steps
          </h2>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-black/8" />

            {[
              {
                num: "01",
                title: "You Send a Request",
                body: "Your data is encrypted before it leaves your device. It travels through a secure channel that no one — including NEAR AI — can intercept.",
              },
              {
                num: "02",
                title: "Processing Inside a Hardware Vault",
                body: "Your request enters a Trusted Execution Environment — a locked area inside Intel and NVIDIA processors where data stays encrypted even while being processed.",
              },
              {
                num: "03",
                title: "You Get Results + Proof",
                body: "You receive your AI response along with a cryptographic attestation — a tamper-proof certificate proving your data was processed privately.",
              },
            ].map((step) => (
              <div key={step.num} className="relative px-8 first:pl-0 last:pr-0">
                <div className="w-12 h-12 rounded-full border border-black/10 bg-white flex items-center justify-center mb-6 relative z-10">
                  <span style={T} className="text-[#5895d8] text-xs font-bold tracking-widest">{step.num}</span>
                </div>
                <h3 style={D} className="text-base font-semibold mb-3 text-black">{step.title}</h3>
                <p className="text-black/45 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-black/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-black/35 text-sm max-w-lg">
              Every step is verified by Intel and NVIDIA hardware certificates. You don&apos;t have
              to trust us — you can check the proof yourself.
            </p>
            <a
              href="https://docs.near.ai/cloud/private-inference/"
              style={D}
              className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors whitespace-nowrap"
            >
              View Detailed Architecture →
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURES GRID ───────────────────────────────────────── */}
      <section className="border-b border-black/8 py-28 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Why NEAR AI
          </p>
          <h2 style={D} className="text-4xl lg:text-5xl font-bold tracking-tight mb-16 text-black">
            Built for Sensitive Data.<br />Designed for Speed.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/8">
            {[
              { title: "Deploy in Minutes", body: "Cloud-native, OpenAI-compatible. No infrastructure to manage, no DevOps overhead." },
              { title: "Use Any Model", body: "Switch between DeepSeek, GPT OSS, GLM-4.6, Qwen3 — without changing a line of code." },
              { title: "Hardware-Encrypted by Default", body: "Every inference runs inside a hardware vault. Even a server breach can't expose your data." },
              { title: "Verified, Not Just Promised", body: "Each request generates a cryptographic attestation in under 30 seconds." },
              { title: "No Extra Cost for Privacy", body: "Privacy isn't a premium add-on. Built-in hardware isolation needs no extra vendors." },
              { title: "Text, Image, Voice — All Private", body: "Process text, images, and voice in one platform, all inside encrypted TEEs." },
              { title: "Enterprise-Grade Compute", body: "The first TEE-secured GPU marketplace for enterprise and government AI workloads." },
              { title: "Always-On AI Agents", body: "Run persistent agents in encrypted enclaves. Open-source, privacy-guaranteed." },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="bg-white p-8 hover:bg-[#5895d8]/[0.02] transition-colors relative overflow-hidden group"
              >
                {/* Decorative background number */}
                <span
                  style={{ ...D, lineHeight: 1 }}
                  className="absolute -bottom-2 -right-1 text-[72px] font-black text-black/[0.04] select-none pointer-events-none group-hover:text-[#5895d8]/[0.06] transition-colors"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={T} className="text-[#5895d8] text-xs tracking-widest mb-4">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 style={D} className="text-sm font-semibold mb-2 text-black">{feature.title}</h3>
                <p className="text-black/40 text-sm leading-relaxed">{feature.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODELOS ─────────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-28 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Models
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <h2 style={D} className="text-4xl lg:text-5xl font-bold tracking-tight text-black">
              Choose Your Model.<br />We Handle the Privacy.
            </h2>
            <p className="text-black/35 text-sm max-w-xs sm:text-right">
              All models run inside hardware-encrypted environments. Same API, same privacy guarantees.
            </p>
          </div>

          {/* Header row */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-3 border-b border-black/8">
            {["Model", "Specs", "Best for", "Pricing", "Privacy"].map((h) => (
              <p key={h} style={T} className="text-black/30 text-xs uppercase tracking-widest">{h}</p>
            ))}
          </div>

          <div className="space-y-px bg-black/8">
            {[
              { name: "GLM-4.6 FP8", provider: "Zhipu AI", params: "358B parameters", ctx: "200K context", best: "Complex reasoning, long-document analysis", input: "$0.75", output: "$2" },
              { name: "GPT OSS 120B", provider: "OpenAI", params: "117B MoE parameters", ctx: "131K context", best: "General-purpose, agentic tasks, high-speed reasoning", input: "$0.2", output: "$0.6" },
              { name: "DeepSeek V3.1", provider: "DeepSeek", params: "Hybrid thinking mode", ctx: "128K context", best: "Deep reasoning, research, complex analysis", input: "$1", output: "$2.5" },
              { name: "Qwen3 30B A3B", provider: "Alibaba Qwen", params: "30.5B total, 3.3B active", ctx: "262K context", best: "Cost-efficient tasks, high-volume processing", input: "$0.15", output: "$0.45" },
            ].map((model) => (
              <div
                key={model.name}
                className="bg-white grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr_1fr_1fr] gap-4 px-6 py-5 hover:bg-gray-50 transition-colors items-center group"
              >
                <div>
                  <p style={D} className="font-semibold text-sm text-black">{model.name}</p>
                  <p style={T} className="text-black/35 text-xs mt-0.5">by {model.provider}</p>
                </div>
                <div>
                  <p style={T} className="text-black/45 text-xs">{model.params}</p>
                  <p style={T} className="text-black/45 text-xs">{model.ctx}</p>
                </div>
                <p className="text-black/35 text-xs leading-relaxed">{model.best}</p>
                <div>
                  <p style={T} className="text-[#5895d8] text-sm font-semibold">
                    {model.input}<span className="text-black/25 font-normal text-xs">/M in</span>
                  </p>
                  <p style={T} className="text-[#5895d8] text-sm font-semibold">
                    {model.output}<span className="text-black/25 font-normal text-xs">/M out</span>
                  </p>
                </div>
                {/* Privacy bar */}
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex-1 bg-black/8 rounded-full h-1">
                      <div className="bg-[#5895d8] h-1 rounded-full w-full group-hover:opacity-80 transition-opacity" />
                    </div>
                    <span style={T} className="text-[#5895d8] text-xs">100%</span>
                  </div>
                  <p className="text-black/25 text-xs">Encrypted</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-black/8">
            <p className="text-black/35 text-sm">
              <strong className="text-black/60">IronClaw</strong> and{" "}
              <strong className="text-black/60">OpenClaw</strong> are also available on NEAR AI Cloud.
            </p>
            <a href="/openclaw" style={D} className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors whitespace-nowrap">
              Learn About OpenClaw →
            </a>
          </div>
        </div>
      </section>

      {/* ── MÉTRICAS ────────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-28 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Performance
          </p>
          <h2 style={D} className="text-4xl lg:text-5xl font-bold tracking-tight mb-20 text-black">
            Fast. Private. Always On.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/8">
            {[
              {
                label: "Speed",
                stat: "<100ms",
                items: [
                  "95% of requests complete in <100ms",
                  "1,000+ requests/second per node",
                  "200K token context with <5% latency",
                  "Scale up in <3 min (small models)",
                ],
              },
              {
                label: "Security",
                stat: "<30s",
                items: [
                  "Attestation verification in <30 seconds",
                  "100% TLS 1.3 encryption in transit",
                  "AES-256 encryption at rest",
                  "HSM-backed key rotation every 90 days",
                ],
              },
              {
                label: "Reliability",
                stat: "99.5%",
                items: [
                  "Monthly uptime for confidential enclaves",
                  "Real-time monitoring with immutable logs",
                  "Full audit trail for every request",
                ],
              },
            ].map((col) => (
              <div key={col.label} className="bg-white px-8 py-10 relative overflow-hidden">
                {/* Watermark stat */}
                <span
                  style={{ ...D, lineHeight: 1 }}
                  className="absolute -bottom-4 -right-2 text-[100px] font-black text-black/[0.03] select-none pointer-events-none whitespace-nowrap"
                  aria-hidden="true"
                >
                  {col.stat}
                </span>
                <p style={T} className="text-black/35 text-xs tracking-widest uppercase mb-3">{col.label}</p>
                <p style={D} className="text-5xl lg:text-6xl font-bold text-black tracking-tight mb-8">
                  {col.stat}
                </p>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-black/40">
                      <span className="text-[#5895d8] shrink-0 mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AUDIENCIAS ──────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-28 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Who it&apos;s for
          </p>
          <h2 style={D} className="text-4xl lg:text-5xl font-bold tracking-tight mb-16 text-black">
            Built for Teams That Can&apos;t Afford<br className="hidden lg:block" /> to Compromise on Privacy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "For Developers",
                num: "01",
                body: "Build AI apps with privacy built in — not bolted on. One API, instant deployment, and cryptographic proof that user data stays private. Your users don't have to trust you. They can verify.",
                cta: "Start Building →",
                href: "https://cloud.near.ai/dashboard/keys",
              },
              {
                label: "For Enterprises",
                num: "02",
                body: "Process patient records, financial data, proprietary research, and classified information with AI — and pass any audit. Hardware-isolated inference, immutable logs, and attestation reports your compliance team will love.",
                cta: "Schedule a Demo →",
                href: "/contact",
              },
              {
                label: "For Government",
                num: "03",
                body: "Run AI workloads with sovereign control over sensitive and classified data — even outside your borders. TEE-based isolation and real-time verification deliver compliance at global scale.",
                cta: "Talk to Our Team →",
                href: "/contact",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="border border-black/8 border-l-4 border-l-[#5895d8] bg-white p-8 flex flex-col hover:shadow-md hover:border-l-[#5895d8] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span style={T} className="text-[#5895d8] text-xs tracking-widest">{card.num}</span>
                  <span className="text-black/15 text-xs">—</span>
                  <p style={T} className="text-xs tracking-widest uppercase text-black/35 font-medium">{card.label}</p>
                </div>
                <p className="text-black/50 text-sm leading-relaxed flex-1 mb-8">{card.body}</p>
                <a href={card.href} style={D} className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors">
                  {card.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────── */}
      <section className="py-28 px-8 bg-black relative overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #5895d8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2
            style={D}
            className="text-4xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6 text-white"
          >
            Ready to Use AI Without<br />Giving Up Your Data?
          </h2>
          <p className="text-white/45 text-base lg:text-lg mb-12 max-w-xl mx-auto">
            Whether you&apos;re building an app, running an enterprise, or just want to chat
            privately — NEAR AI gives you AI with proof of privacy.
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
              href="https://private-chat.near.ai/welcome"
              style={D}
              className="px-7 py-3.5 bg-white/10 text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-colors text-sm"
            >
              Try Private Chat
            </a>
            <a
              href="/contact"
              style={D}
              className="px-7 py-3.5 text-white/50 font-semibold rounded-full border border-white/10 hover:border-white/30 hover:text-white transition-colors text-sm"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
