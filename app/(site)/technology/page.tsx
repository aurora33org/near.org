import { Metadata } from "next";
import ThreadsClient from "@/components/site/ThreadsClient";

export const metadata: Metadata = {
  title: "NEAR AI Technology — How Verifiable Private AI Works",
  description:
    "Explore how NEAR AI uses Intel TDX, NVIDIA Confidential Computing, and Trusted Execution Environments to deliver hardware-encrypted, cryptographically verified AI inference.",
  openGraph: {
    title: "NEAR AI Technology — Verifiable Private AI, Explained",
    description:
      "Intel TDX + NVIDIA Confidential Computing + cryptographic attestation. See exactly how NEAR AI keeps your data private at the hardware level — and lets you prove it.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const D = { fontFamily: "var(--font-display)" } as const;
const T = { fontFamily: "var(--font-tech)" } as const;

export default function TechnologyPage() {
  return (
    <div className="bg-white text-black">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-black flex items-center overflow-hidden" style={{ minHeight: "70vh" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
          <ThreadsClient
            color={[0.345, 0.584, 0.847]}
            amplitude={1.0}
            distance={0.8}
            enableMouseInteraction
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} aria-hidden="true" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 mb-8">
            <span style={T} className="text-[#5895d8] text-xs tracking-widest uppercase border border-[#5895d8]/30 rounded-full px-3 py-1">
              Technology
            </span>
          </div>
          <h1 style={D} className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-5">
            Don&apos;t Trust.<br />Verify.
          </h1>
          <p className="text-base lg:text-lg text-white/60 leading-relaxed max-w-2xl mx-auto mb-10">
            NEAR AI is architected to deliver verifiable, secure AI. Every claim we make about
            privacy isn&apos;t a promise — it&apos;s provable with cryptographic evidence.
          </p>
          <a
            href="/contact"
            style={D}
            className="inline-block px-7 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
          >
            Talk to a Solutions Engineer →
          </a>
        </div>
      </section>

      {/* ── OVERVIEW ────────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-6">
              Overview
            </p>
            <h2 style={D} className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight text-black">
              Private AI Inference, from Request to Response
            </h2>
          </div>
          <div className="space-y-5 pt-1">
            <p className="text-black/50 text-base leading-relaxed">
              We enable private AI inference with security you can verify — not just trust. Every
              inference request runs inside a Trusted Execution Environment (TEE), a
              hardware-encrypted area inside Intel and NVIDIA processors where your data and models
              stay encrypted and completely isolated from the cloud provider, the OS, and NEAR AI itself.
            </p>
            <p className="text-black/50 text-base leading-relaxed">
              Each operation is attested in real time, generating cryptographic proof that your
              workloads were protected and unaltered. Think of it as a tamper-proof receipt: you
              can check it yourself to confirm exactly what happened to your data.
            </p>
            <div className="border-l-2 border-[#5895d8] pl-5">
              <p className="text-black text-base font-semibold leading-snug" style={D}>
                We support both open-source and closed-source models through a single API — with the
                privacy guarantees your data demands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONFIDENTIAL COMPUTE ─────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            The foundation
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-black">
            Confidential Compute. From Edge to Inference.
          </h2>
          <p className="text-black/40 text-base mb-12">
            Private. Intelligent. Yours.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-12">
            {/* Intel TDX */}
            <div className="border border-black/8 border-l-4 border-l-[#5895d8] bg-white p-8">
              <div className="flex items-center gap-3 mb-5">
                <span style={T} className="text-[#5895d8] text-xs tracking-widest">01</span>
                <span className="text-black/15 text-xs">—</span>
                <p style={T} className="text-xs tracking-widest uppercase text-black/35">Intel TDX Gateways</p>
              </div>
              <p className="text-black/55 text-sm leading-relaxed">
                Handle incoming requests, encrypting data before it enters the processing pipeline.
                Intel Trust Domain Extensions create hardware-isolated virtual machines that protect
                data in use — at the CPU level.
              </p>
              <a
                href="https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html"
                target="_blank"
                rel="noreferrer"
                style={D}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/40 hover:text-[#5895d8] transition-colors mt-5"
              >
                Intel Trusted Domain Extensions →
              </a>
            </div>

            {/* NVIDIA CC */}
            <div className="border border-black/8 border-l-4 border-l-[#5895d8] bg-white p-8">
              <div className="flex items-center gap-3 mb-5">
                <span style={T} className="text-[#5895d8] text-xs tracking-widest">02</span>
                <span className="text-black/15 text-xs">—</span>
                <p style={T} className="text-xs tracking-widest uppercase text-black/35">NVIDIA Confidential Compute</p>
              </div>
              <p className="text-black/55 text-sm leading-relaxed">
                Run the actual AI inference, keeping your data encrypted even during GPU processing.
                NVIDIA Confidential Computing extends hardware-level isolation to the GPU — where
                the heavy lifting happens.
              </p>
              <a
                href="https://www.nvidia.com/en-us/data-center/solutions/confidential-computing/"
                target="_blank"
                rel="noreferrer"
                style={D}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/40 hover:text-[#5895d8] transition-colors mt-5"
              >
                NVIDIA Confidential Computing →
              </a>
            </div>
          </div>

          {/* Key insight */}
          <div className="bg-white border border-black/8 p-8">
            <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase mb-4">Why it matters</p>
            <p className="text-black/55 text-base leading-relaxed max-w-3xl">
              Inside a TEE, your data is encrypted in memory and completely inaccessible to the host
              system — including the cloud provider&apos;s operating system and any other application on
              the same server. Each operation inside the TEE can be verified through cryptographic
              attestation, creating proof that your workloads were protected and unaltered.
            </p>
            <p className="text-black font-semibold text-base leading-relaxed mt-4 max-w-3xl" style={D}>
              Even if someone gained full access to the server running your request, they couldn&apos;t
              read your data. The hardware won&apos;t allow it.
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            How it works
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-black">
            Follow a Request End to End
          </h2>
          <p className="text-black/40 text-base mb-16">
            From your device to the AI model and back — encrypted and verified at every step.
          </p>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-black/8" />

            {[
              {
                num: "01",
                label: "Client Side",
                title: "Encryption",
                body: "Your data is encrypted on your device before it leaves. It travels via TLS 1.3 to NEAR AI Cloud — no one can intercept it in transit.",
                note: "Encrypted request in transit →",
              },
              {
                num: "02",
                label: "NEAR AI Cloud",
                title: "TEE Processing",
                items: [
                  "Decryption — only inside the sealed hardware vault",
                  "AI Inference — model processes your request in full isolation",
                  "Encryption — response encrypted before leaving the TEE",
                ],
                note: "← Encrypted response in transit",
              },
              {
                num: "03",
                label: "Client Side",
                title: "Response + Proof",
                body: "You receive the AI response and a cryptographic attestation — a tamper-proof certificate signed by Intel and NVIDIA hardware, proving your data was processed privately.",
                badges: ["NVIDIA Hardware Certificate", "Intel Hardware Certificate"],
              },
            ].map((step) => (
              <div key={step.num} className="relative px-8 first:pl-0 last:pr-0">
                <div className="w-12 h-12 rounded-full border border-black/10 bg-white flex items-center justify-center mb-6 relative z-10">
                  <span style={T} className="text-[#5895d8] text-xs font-bold tracking-widest">{step.num}</span>
                </div>
                <p style={T} className="text-black/30 text-xs tracking-widest uppercase mb-1">{step.label}</p>
                <h3 style={D} className="text-base font-semibold mb-3 text-black">{step.title}</h3>
                {"body" in step && (
                  <p className="text-black/45 text-sm leading-relaxed">{step.body}</p>
                )}
                {"items" in step && (
                  <ul className="space-y-2">
                    {step.items!.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-black/45">
                        <span className="text-[#5895d8] shrink-0 mt-0.5">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {"badges" in step && (
                  <div className="mt-4 space-y-2">
                    {step.badges!.map((b) => (
                      <div key={b} style={T} className="flex items-center gap-1.5 text-xs text-black/45">
                        <span className="text-[#5895d8]">✓</span> {b}
                      </div>
                    ))}
                  </div>
                )}
                {step.note && (
                  <p style={T} className="text-black/20 text-xs mt-4 italic">{step.note}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-black/8 flex justify-end">
            <a
              href="https://docs.near.ai/cloud/private-inference/"
              target="_blank"
              rel="noreferrer"
              style={D}
              className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors"
            >
              View Detailed Architecture →
            </a>
          </div>
        </div>
      </section>

      {/* ── 5 FEATURES ──────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Why it matters
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-12 text-black">
            Designed to Make Sensitive Data Usable
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-black/8">
            {[
              {
                num: "01",
                headline: "Go Live in Minutes, Not Months",
                body: "Deploy private AI inference through a cloud-native API. No infrastructure to set up, no compliance reviews to wait for. Get your API key and start building.",
              },
              {
                num: "02",
                headline: "The Right Model for Every Task",
                body: "Access open-source or custom models through one interface. Switch between DeepSeek, GPT OSS, GLM-4.6, or Qwen3 with the same privacy guarantees.",
              },
              {
                num: "03",
                headline: "Security Built Into the Silicon",
                body: "Every inference runs inside hardware-isolated environments. The encryption happens at the processor level — physically impossible for anyone to access your data during processing.",
              },
              {
                num: "04",
                headline: "Proof, Not Promises",
                body: "Each request generates a cryptographic attestation confirming environment integrity in real time. You don't have to trust us — anyone can check the proof.",
              },
              {
                num: "05",
                headline: "Privacy Without the Premium",
                body: "Hardware-level isolation is built in — no additional security tools, encryption layers, or compliance middleware needed. Simplified architecture, lower costs at scale.",
              },
            ].map((f) => (
              <div
                key={f.num}
                className="bg-white p-7 hover:bg-[#5895d8]/[0.02] transition-colors relative overflow-hidden group"
              >
                <span
                  style={{ ...D, lineHeight: 1 }}
                  className="absolute -bottom-2 -right-1 text-[64px] font-black text-black/[0.04] select-none pointer-events-none group-hover:text-[#5895d8]/[0.06] transition-colors"
                  aria-hidden="true"
                >
                  {f.num}
                </span>
                <p style={T} className="text-[#5895d8] text-xs tracking-widest mb-3">{f.num}</p>
                <h3 style={D} className="text-sm font-bold mb-2 text-black">{f.headline}</h3>
                <p className="text-black/40 text-xs leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHITE PAPERS ────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-6">
              Research
            </p>
            <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-5 text-black">
              The Science Behind the Security
            </h2>
            <p className="text-black/50 text-base leading-relaxed">
              Since 2018, the NEAR ecosystem has been a pioneer of technical innovation spanning
              blockchain and user-owned AI. These papers lay out the fundamentals for the technology
              that powers verifiable private inference — from cryptographic attestation protocols to
              TEE architecture design.
            </p>
            <a
              href="https://www.near.org/papers"
              target="_blank"
              rel="noreferrer"
              style={D}
              className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-[#5895d8] transition-colors mt-6"
            >
              Read Our White Papers →
            </a>
          </div>

          {/* Decorative stat block */}
          <div className="grid grid-cols-2 gap-px bg-black/8">
            {[
              { stat: "2018", label: "Founded" },
              { stat: "TEE", label: "CPU + GPU level" },
              { stat: "<30s", label: "Attestation time" },
              { stat: "100%", label: "Encrypted requests" },
            ].map((item) => (
              <div key={item.label} className="bg-white p-8 relative overflow-hidden">
                <p style={D} className="text-4xl font-bold text-black tracking-tight mb-1">{item.stat}</p>
                <p style={T} className="text-black/35 text-xs uppercase tracking-widest">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CTAs ────────────────────────────────────────── */}
      <section className="border-b border-black/8 py-24 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p style={T} className="text-[#5895d8] text-xs tracking-widest uppercase font-medium mb-4">
            Experience it yourself
          </p>
          <h2 style={D} className="text-3xl lg:text-4xl font-bold tracking-tight mb-12 text-black">
            See the Technology in Action
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-black/8 border-l-4 border-l-[#5895d8] bg-white p-8 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <span style={T} className="text-[#5895d8] text-xs tracking-widest">01</span>
                <span className="text-black/15 text-xs">—</span>
                <p style={T} className="text-xs tracking-widest uppercase text-black/35">NEAR AI Cloud</p>
              </div>
              <h3 style={D} className="text-xl font-bold mb-3 text-black">Access Private AI Inference Now</h3>
              <p className="text-black/45 text-sm leading-relaxed flex-1 mb-8">
                One API, multiple models, hardware-encrypted privacy. Deploy in minutes.
              </p>
              <a
                href="/cloud"
                style={D}
                className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors"
              >
                Go to Cloud →
              </a>
            </div>

            <div className="border border-black/8 border-l-4 border-l-[#5895d8] bg-white p-8 flex flex-col hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-5">
                <span style={T} className="text-[#5895d8] text-xs tracking-widest">02</span>
                <span className="text-black/15 text-xs">—</span>
                <p style={T} className="text-xs tracking-widest uppercase text-black/35">NEAR AI Private Chat</p>
              </div>
              <h3 style={D} className="text-xl font-bold mb-3 text-black">Chat Like No One Is Watching</h3>
              <p className="text-black/45 text-sm leading-relaxed flex-1 mb-8">
                Same AI models you trust, running inside hardware-encrypted enclaves. Your conversations stay yours.
              </p>
              <a
                href="/private-chat"
                style={D}
                className="text-sm font-semibold text-black hover:text-[#5895d8] transition-colors"
              >
                Try Private Chat →
              </a>
            </div>
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
            Ready to Build With Verified Private AI?
          </h2>
          <p className="text-white/45 text-base mb-10 max-w-lg mx-auto">
            Talk to our engineering team about your use case, compliance requirements, and
            deployment architecture.
          </p>
          <a
            href="/contact"
            style={D}
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
          >
            Contact Our Team →
          </a>
        </div>
      </section>

    </div>
  );
}
